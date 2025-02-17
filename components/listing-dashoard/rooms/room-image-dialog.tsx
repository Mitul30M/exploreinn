"use client";

import { startTransition, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, ImageIcon, HardDriveUpload } from "lucide-react";
import { deleteFile } from "@/lib/actions/s3-buckets/s3-bucket";
import { deleteRoomImg, updateRoomCoverImage } from "@/lib/actions/rooms/rooms";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

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
        <DialogTitle>Room Images</DialogTitle>
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
    </DialogContent>
  );
}
