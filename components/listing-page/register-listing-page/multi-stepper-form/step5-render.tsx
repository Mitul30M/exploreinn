"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  pushImage,
  removeImage,
  setAddress,
  setListingName,
  setListingType,
  setStep,
} from "@/lib/redux-store/slices/register-listing-slice";
import { listingTypes } from "@/lib/utils/listing/listing";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DropzoneOptions } from "react-dropzone";
import {
  HardDriveUpload,
  Hourglass,
  Image,
  ImageUp,
  Paperclip,
  Trash2,
} from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormDescription,
  FormLabel,
} from "@/components/ui/form";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import NextImage from "next/image";
import { Progress } from "@/components/ui/progress";
import { deleteFile, getSignedURL } from "@/lib/actions/s3-buckets/s3-bucket";
const FileUploadForm = z.object({
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      })
    )
    .max(10, {
      message: "Maximum 10 files are allowed",
    })
    .nullable(),
});

type FormType = z.infer<typeof FileUploadForm>;

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

const RenderStep5 = () => {
  const { email, phone, description, listingName, images } = useAppSelector(
    (state: RootState) => state.registerListing
  );
  const dispatch: AppDispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number[]>([]);

  useEffect(() => {
    if (!email.length || !phone.length) {
      toast({
        title: `*Email and Phone are required`,
        description: `Please set ${listingName}'s email and phone before moving ahead.`,
        action: (
          <ToastAction className="text-primary text-nowrap" altText="Step 4">
            Step 4
          </ToastAction>
        ),
      });
      dispatch(setStep(4));
      return;
    }
    if (!description.length) {
      toast({
        title: `*Description is required`,
        description: `Please set ${listingName}'s description before moving ahead.`,
        action: (
          <ToastAction className="text-primary text-nowrap" altText="Step 4">
            Step 4
          </ToastAction>
        ),
      });
      dispatch(setStep(4));
      return;
    }
  }, []);

  const form = useForm<FormType>({
    resolver: zodResolver(FileUploadForm),
    defaultValues: {
      files: null,
    },
  });

  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    multiple: true,
    maxFiles: 10,
    maxSize: 4 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const onSubmit = async (data: FormType) => {
    const { files } = data;
    if (!files) return;
    setIsLoading(true);
    try {
      let successCount = 0;
      const promise = await Promise.all(
        files.map(async (file, index) => {
          const signedURLResult = await getSignedURL({
            prefix: "listing",
            fileSize: file.size,
            fileType: file.type,
            checksum: await computeSHA256(file),
          });
          if (signedURLResult.error !== undefined) {
            // console.error("Error: ", signedURLResult.error);
            toast({
              title: `*Error while Uploading Files`,
              description: signedURLResult.error,
              action: (
                <ToastAction
                  className="text-primary text-nowrap flex items-center gap-1 justify-center"
                  altText="error"
                >
                  <HardDriveUpload className="size-4 text-primary" /> Try Again
                </ToastAction>
              ),
            });
            return;
          }
          const { url } = signedURLResult.success;
          console.log({ url });
          const response = await fetch(url, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });
          if (response.ok) {
            console.log("File uploaded successfully", response);
            // the response.url  such tht url is in the format of https://bucketname.s3.amazonaws.com/keyname.extention?xyxw
            // so just insert the part of url before the query starts(before ?)
            const url = response.url.split("?")[0];
            dispatch(pushImage(url));
            successCount++;
          }
        })
      );
      if (successCount === files.length) {
        toast({
          title: `${files.length} Files Uploaded Successfully`,
          description: "All images uploaded successfully to the server.",
          action: (
            <ToastAction
              className="text-primary text-nowrap flex items-center gap-1 justify-center"
              altText="success"
            >
              <HardDriveUpload className="size-4 text-primary" /> Success
            </ToastAction>
          ),
        });
      }
    } catch (error) {
      toast({
        title: `*Error while Uploading Files`,
        description:
          "Something went wrong while uploading files to the s3 bucket.",
        action: (
          <ToastAction
            className="text-primary text-nowrap flex items-center gap-1 justify-center"
            altText="error"
          >
            <HardDriveUpload className="size-4 text-primary" /> Try Again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full pb-10 space-y-4">
      <div className=" flex flex-col gap-4">
        <h1 className="text-xl font-semibold  flex flex-col gap-4">
          <Badge className="rounded-full w-max">Step 5</Badge>
          Upload Images of {listingName}
        </h1>
        <p className="text-sm text-accent-foreground">
          Select good images to make your listing stand out & attract travelers.
          You can add & delete images later as well.
        </p>
      </div>

      {/* Image Upload */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full grid gap-2  "
        >
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  dropzoneOptions={dropzone}
                  reSelect={true}
                >
                  <FileInput className="border-[1px] rounded w-full border-border/90 hover:bg-accent/50 hover:border-primary">
                    <div className="flex items-center justify-center flex-col p-4 !w-full min-h-[300px] gap-4 ">
                      {isLoading ? (
                        <Hourglass className="size-12 text-primary animate-spin" />
                      ) : (
                        <ImageUp className="size-12 text-primary" />
                      )}
                      <div className="space-y-2 text-center">
                        <p className="text-lg font-semibold">
                          {isLoading ? "Uploading Images" : "Upload Images"}
                        </p>
                        <p className="text-sm font-medium leading-none text-accent-foreground/80">
                          Max 10 images, each with size less than 4MB.
                        </p>
                      </div>
                    </div>
                  </FileInput>
                  {field.value && field.value.length > 0 && (
                    <HoverCard>
                      <FileUploaderContent className="p-2 rounded-b-none rounded-t-md flex flex-col gap-2 text-accent-foreground/80 items-center w-max border-[1px] border-border/90 mt-2 mx-auto">
                        {field.value.map((file, i) => (
                          <FileUploaderItem
                            key={i}
                            index={i}
                            aria-roledescription={`file ${i + 1} containing ${
                              file.name
                            }`}
                            className="p-1 min-w-[600px] h-max"
                          >
                            <Image className="h-4 w-4 stroke-current text-primary" />
                            {/* <NextImage
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              width={50}
                              height={50}
                              className="object-contain"
                            /> */}
                            <span>{file.name}</span>
                            {progress[i] > 0 && (
                              <Progress
                                value={progress[i]}
                                className="max-w-[150px] h-[6px]  mx-2"
                              />
                            )}
                          </FileUploaderItem>
                        ))}
                      </FileUploaderContent>
                    </HoverCard>
                  )}
                </FileUploader>
              </FormItem>
            )}
          />
          {form.formState.errors && (
            <div className="text-destructive text-sm">
              {Object.values(form.formState.errors).map((error) => (
                <p key={error.message}>{error.message}</p>
              ))}
            </div>
          )}
          <Button
            type="submit"
            size="sm"
            className=" w-fit"
            disabled={isLoading || images.length === 10}
          >
            {isLoading ? <Hourglass /> : <HardDriveUpload />}
            {isLoading ? "Uploading" : "Upload"}
          </Button>
        </form>
      </Form>

      {/* Uploaded Images */}
      {images.length ? (
        <div className=" border-[1px] border-border/90 columns-3 md:columns-5 p-2 gap-2 [&>div:not(:first-child)]:mt-2">
          {images.map((image, i) => (
            <div className="relative h-max " key={i}>
              <NextImage
                key={i}
                src={image}
                alt={image}
                width={200}
                height={200}
                className="h-auto max-w-full object-contain rounded border-border/90 border-[1px]"
              />
              <Button
                size={"icon"}
                variant={"ghost"}
                className="absolute top-2 right-2 "
                onClick={async () => {
                  await deleteFile(image);
                  dispatch(removeImage(image));
                }}
              >
                <Trash2 className="text-primary" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
export default RenderStep5;
