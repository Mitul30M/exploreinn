"use client";

import { startTransition, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trash2,
  ImageIcon,
  HardDriveUpload,
  Hourglass,
  ImageUp,
  NotebookTabs,
} from "lucide-react";
import { deleteFile, getSignedURL } from "@/lib/actions/s3-buckets/s3-bucket";
import {
  addRoomImages,
  deleteRoomImg,
  updateRoomCoverImage,
} from "@/lib/actions/rooms/rooms";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { DropzoneOptions } from "react-dropzone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { computeSHA256 } from "@/lib/utils/seed/sha256";
import { useRouter } from "next/navigation";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { HoverCard } from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";

const FormSchema = z.object({
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      })
    )
    .max(6, {
      message: "Maximum 6 files are allowed",
    })
    .nullable(),
});
type FormType = z.infer<typeof FormSchema>;

const dropzone = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", ".webp"],
  },
  multiple: true,
  maxFiles: 6,
  maxSize: 4 * 1024 * 1024,
} satisfies DropzoneOptions;

interface RoomImageDialogContentProps {
  images: string[];
  coverImg: string;
  roomId: string;
}

export default function RoomImageDialogContent({
  images,
  coverImg,
  roomId,
}: RoomImageDialogContentProps) {
  const [roomImages, setRoomImages] = useState(images);
  const [roomCoverImage, setRoomCoverImage] = useState(coverImg);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number[]>([]);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      files: null,
    },
  });

  const onSubmit = async (data: FormType) => {
    const { files } = data;
    if (!files) return;
    setIsLoading(true);
    const newImages: string[] = [];
    try {
      let successCount = 0;
      const promise = await Promise.all(
        files.map(async (file, index) => {
          const signedURLResult = await getSignedURL({
            prefix: "room",
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
            successCount++;
            images.push(url);
            newImages.push(url);
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

        startTransition(async () => {
          const addImages = await addRoomImages(roomId, newImages);
          if (!addImages) {
            toast({
              title: `*Error while Uploading Files!`,
              description:
                "Something went wrong while uploading the files. Please Try Again.",
              action: (
                <ToastAction
                  className="text-primary text-nowrap flex items-center gap-1 justify-center"
                  altText="error"
                >
                  <HardDriveUpload className="size-4 text-primary" /> Try Again
                </ToastAction>
              ),
            });
          }
          toast({
            title: `${addImages.name} Images Uploaded Successfully`,
            description:
              "All images uploaded successfully to the server. Redirecting to the room page.",
            action: (
              <ToastAction
                className="text-primary text-nowrap flex items-center gap-1 justify-center"
                altText="success"
              >
                <HardDriveUpload className="size-4 text-primary" /> Success
              </ToastAction>
            ),
          });
        });
      }
    } catch (error) {
      toast({
        title: `*Error while Uploading Files!`,
        description:
          "Something went wrong while uploading the files. Please Try Again.",
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

  const deleteImg = async (imageUrl: string) => {
    // Implement your delete file logic here
    startTransition(async () => {
      const deleted = await deleteRoomImg(roomId, imageUrl);
      if (!deleted) {
        toast({
          title: "Error deleting image",
          description: "Failed to delete the image. Please try again.",
          action: (
            <ToastAction
              className="text-primary text-nowrap flex items-center gap-1 justify-center"
              altText="error"
            >
              <HardDriveUpload className="size-4 text-primary" /> Try Again
            </ToastAction>
          ),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Image deleted successfully!",
          variant: "default",
          action: (
            <ToastAction
              className="text-primary text-nowrap flex items-center gap-1 justify-center"
              altText="success"
            >
              <HardDriveUpload className="size-4 text-primary" /> Ok
            </ToastAction>
          ),
        });
      }
      await deleteFile(imageUrl);
      console.log(`Deleted file: ${imageUrl}`);
      setRoomImages(roomImages.filter((img) => img !== imageUrl));
    });
  };

  const setCoverImage = async (imageUrl: string) => {
    setRoomCoverImage(imageUrl);
    const updatedCoverImg = await updateRoomCoverImage(roomId, imageUrl);
    if (!updatedCoverImg) {
      toast({
        title: "Error updating cover image",
        description: "Failed to update the room cover image. Please try again.",
        action: (
          <ToastAction
            className="text-primary text-nowrap flex items-center gap-1 justify-center"
            altText="error"
          >
            <HardDriveUpload className="size-4 text-primary" /> Try Again
          </ToastAction>
        ),
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Room cover image updated successfully!",
        variant: "default",
        action: (
          <ToastAction
            className="text-primary text-nowrap flex items-center gap-1 justify-center"
            altText="success"
          >
            <ImageIcon className="size-4 text-primary" /> Ok
          </ToastAction>
        ),
      });
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Update Room Images</DialogTitle>
        <DialogDescription>
          Upload Good quality images of the room so as to attract potential
          worldwide guests.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        {roomImages.length ? (
          <div className="border-[1px] border-border/90 columns-3 md:columns-5 p-2 gap-2 [&>div:not(:first-child)]:mt-2">
            {roomImages.map((image, i) => (
              <div className="relative h-max" key={i}>
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Room image ${i + 1}`}
                  width={350}
                  height={350}
                  className="h-auto max-w-full object-contain rounded border-border/90 border-[1px]"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  disabled={roomCoverImage === image || images.length === 1}
                  onClick={async () => {
                    if (image === roomCoverImage) {
                      // Handle cover image deletion
                      setCoverImage(images[i + 1] || images[i - 1] || "");
                    }
                    await deleteImg(image);
                  }}
                >
                  <Trash2 className="text-primary" />
                </Button>
                <Button
                  size="icon"
                  disabled={roomCoverImage === image}
                  variant="ghost"
                  className="absolute top-10 right-2"
                  onClick={() => setCoverImage(image)}
                >
                  <ImageIcon
                    className={
                      roomCoverImage === image
                        ? "text-primary"
                        : "text-foreground"
                    }
                  />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No images available for this room.
          </div>
        )}
      </div>

      <Separator className="border-border/90 my-2" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-4"
        >
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel
                  htmlFor="room-images"
                  className="text-[15px] text-accent-foreground"
                >
                  Upload Room Images
                </FormLabel>
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  dropzoneOptions={dropzone}
                  reSelect={true}
                >
                  <FileInput className="border-[1px] rounded w-full h-[200px]  border-border/90 hover:bg-accent/50 hover:border-primary">
                    <div className="flex items-center justify-center h-[200px] flex-col p-4  gap-4 ">
                      {isLoading ? (
                        <Hourglass className="!max-w-12 !max-h-12   text-primary animate-spin" />
                      ) : (
                        <ImageUp className="!max-w-12 !max-h-12  text-primary" />
                      )}
                      <div className="space-y-2 text-center">
                        <p className="text-lg font-semibold">
                          {isLoading ? "Uploading Images" : "Upload Images"}
                        </p>
                        <p className="text-sm font-medium leading-none text-accent-foreground/80">
                          Max 6 images, each with size less than 4MB.
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
                            className="p-1 w-[300px] "
                          >
                            <ImageIcon className="h-4 w-4 stroke-current text-primary" />
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

          <Button
            type="submit"
            size="sm"
            className="rounded w-max  self-end"
            disabled={isLoading || images.length === 0}
          >
            {isLoading ? <Hourglass /> : <NotebookTabs />}
            {isLoading ? "Uploading" : "Upload"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
