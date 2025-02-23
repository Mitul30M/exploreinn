"use client";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  pushLegalDocs,
  setStep,
} from "@/lib/redux-store/slices/register-listing-slice";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropzoneOptions } from "react-dropzone";
import {
  Form,
  FormField,
  FormItem,
} from "@/components/ui/form";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import {
  FileUp,
  HardDriveUpload,
  Hourglass,
  Paperclip,
} from "lucide-react";
import { HoverCard } from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getSignedURLForLegalDocs } from "@/lib/actions/s3-buckets/s3-bucket";
import { computeSHA256 } from "@/lib/utils/seed/sha256";
const FileUploadForm = z.object({
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      })
    )
    .min(5, {
      message: "Please upload at least 5 files",
    }).nullable(),
});

type FormType = z.infer<typeof FileUploadForm>;
const RenderStep7 = () => {
  const { listingName, amenities, legalDocs } = useAppSelector(
    (state: RootState) => state.registerListing
  );
  const dispatch: AppDispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number[]>([]);
  useEffect(() => {
    if (!amenities.length || amenities.length < 6) {
      toast({
        title: `*Select at least 6 Amenities`,
        description: `Please select ${listingName}'s amenities before proceeding.`,
        action: (
          <ToastAction className="text-primary text-nowrap" altText="Step 4">
            Step 6
          </ToastAction>
        ),
      });
      dispatch(setStep(6));
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
      "application/*": [".pdf", ".docx"],
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
          const signedURLResult = await getSignedURLForLegalDocs({
            prefix: "listing",
            fileSize: file.size,
            fileType: file.type,
            checksum: await computeSHA256(file),
          });
          if (signedURLResult.error !== undefined) {
            // console.error("Error: ", signedURLResult.error);
            toast({
              title: `*Error while Uploading Documents`,
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
            dispatch(pushLegalDocs(url));
            successCount++;
          }
        })
      );
      if (successCount === files.length) {
        toast({
          title: `${files.length} Files Uploaded Successfully`,
          description: "All documents uploaded successfully to the server.",
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
    <div className="space-y-14 w-full">
      <div className=" flex flex-col gap-4">
        <h1 className="text-xl font-semibold  flex flex-col gap-4">
          <Badge className="rounded-full w-max">Step 7</Badge>
          {listingName}'s Legal Documentation
        </h1>
        <p className="text-sm text-accent-foreground">
          Please upload legal documentation for {listingName}. We won't share
          these documents with anyone else & are required just for verification
          purposes. These may include your Tax Identification Number (TIN),
          VAT/GST certificate, business registration documents, proof of
          property ownership (e.g., property deed, lease agreement, or NOC), or
          any region-specific requirements such as an ABN, PAN, or CRN. Ensure
          the documents are clear and legible and upload them in PDF, JPEG, or
          PNG format
        </p>
      </div>

      {/* Legal Docs Upload */}
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
                        <FileUp className="size-12 text-primary" />
                      )}
                      <div className="space-y-2 text-center">
                        <p className="text-lg font-semibold">
                          {isLoading
                            ? "Uploading Documents"
                            : "Upload Documents"}
                        </p>
                        <p className="text-sm font-medium leading-none text-accent-foreground/80">
                          Upload the aforementioned legal docs, each with size
                          less than 4MB.
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
                            <Paperclip className="h-4 w-4 stroke-current text-primary" />
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
            disabled={isLoading || legalDocs.length > 8}
          >
            {isLoading ? <Hourglass /> : <HardDriveUpload />}
            {isLoading ? "Uploading" : "Upload"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RenderStep7;
