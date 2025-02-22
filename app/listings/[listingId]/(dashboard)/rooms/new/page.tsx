"use client";

import { Button } from "@/components/ui/button";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { HoverCard } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { createListingRoom } from "@/lib/actions/rooms/rooms";
import { getSignedURL } from "@/lib/actions/s3-buckets/s3-bucket";
import { computeSHA256 } from "@/lib/utils/seed/sha256";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastAction } from "@radix-ui/react-toast";
import {
  ChevronLeft,
  HardDriveUpload,
  Hourglass,
  Image,
  ImageUp,
  Minus,
  NotebookTabs,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { DropzoneOptions } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";

const images: string[] = [];

const FormSchema = z.object({
  name: z.string().min(5),
  tag: z.string().min(5),
  basePrice: z.coerce.number().gte(50),
  totalRoomsAllocated: z.coerce.number().gte(1),
  maxOccupancy: z.coerce.number().gte(1),
  area: z.coerce.number().gte(10),
  beds: z.object({
    type: z.string().min(5),
    count: z.coerce.number().gte(1),
  }),
  isWifiAvailable: z.boolean(),
  isAirConditioned: z.boolean(),
  hasCityView: z.boolean(),
  hasSeaView: z.boolean(),
  perks: z.string().min(5),
  extras: z.array(
    z.object({
      name: z.string().min(5),
      cost: z.coerce.number().gte(0),
    })
  ),
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
type NewRoomFormType = z.infer<typeof FormSchema>;

const RoomType = FormSchema.extend({
  perks: z.array(z.string()),
  images: z.array(z.string()),
  coverImage: z.string(),
});

export type RoomType = z.infer<typeof RoomType>;

const dropzone = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", ".webp"],
  },
  multiple: true,
  maxFiles: 6,
  maxSize: 4 * 1024 * 1024,
} satisfies DropzoneOptions;

export default function Page() {
  const listingId = useParams<{ listingId: string }>().listingId;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress] = useState<number[]>([]);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      tag: "",
      basePrice: 1000,
      totalRoomsAllocated: 1,
      maxOccupancy: 1,
      area: 10,
      beds: {
        type: "",
        count: 1,
      },
      isWifiAvailable: true,
      isAirConditioned: true,
      hasCityView: false,
      hasSeaView: false,
      perks: "",
      extras: [{ name: "No Extras", cost: 0 }],
      files: null,
    },
  });

  const onSubmit = async (data: NewRoomFormType) => {
    const { files } = data;
    if (!files) return;
    setIsLoading(true);
    try {
      let successCount = 0;
      await Promise.all(
        files.map(async (file) => {
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
        const room = {
          name: data.name,
          tag: data.tag,
          basePrice: data.basePrice,
          totalRoomsAllocated: data.totalRoomsAllocated,
          maxOccupancy: data.maxOccupancy,
          area: data.area,
          beds: data.beds,
          isWifiAvailable: data.isWifiAvailable,
          isAirConditioned: data.isAirConditioned,
          hasCityView: data.hasCityView,
          hasSeaView: data.hasSeaView,
          perks: data.perks.split(",").map((perk) => perk.trim()),
          extras: data.extras,
          images: images,
          coverImage: images[0],
        };
        console.log(room);

        startTransition(async () => {
          const newRoom = await createListingRoom(listingId, room);
          if (!newRoom) {
            throw new Error("Error while creating new room");
          }
          toast({
            title: `${newRoom.name} Created Successfully`,
            description:
              "Room created successfully. You can now manage the newly listied room from the dashboard.",
            action: (
              <ToastAction
                className="text-primary text-nowrap flex items-center gap-1 justify-center"
                altText="success"
              >
                <HardDriveUpload className="size-4 text-primary" /> Success
              </ToastAction>
            ),
          });
          router.push(`/listings/${listingId}/rooms`);
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: `*Error while Enlisting New Room!`,
        description:
          "Something went wrong while enlisting the room. Please Try Again.",
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
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px] h-max">
      <div className="flex flex-col gap-14 w-full max-w-[800px] mx-auto">
        <div className="space-y-8">
          <Link
            href={`/listings/${listingId}/rooms`}
            className="flex justify-start rounded-none items-center gap-1 text-sm font-medium tracking-tight hover:text-primary hover:underline hover:underline-offset-2"
          >
            <ChevronLeft className="text-primary" size={22} />
            Back
          </Link>
          <h1 className="text-[18px] font-semibold">
            Add New Room to your Listing
          </h1>
          <p className="text-muted-foreground text-sm">
            Set details about your listing`&apos;s room. You can edit, add, or
            remove rooms later as well.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-8"
          >
            <div className="flex flex-row gap-8">
              {/* room-name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 !max-w-[400px]">
                    <FormLabel
                      htmlFor="room-name"
                      className="text-[14px] text-accent-foreground"
                    >
                      Room Name/Type
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="room-name"
                        placeholder="Deluxe Room"
                        className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-primary font-semibold" />
                  </FormItem>
                )}
              />

              {/* room-tag */}
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 !max-w-[400px]">
                    <FormLabel
                      htmlFor="room-tag"
                      className="text-[14px] text-accent-foreground"
                    >
                      A Note for the Room
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="room-tag"
                        placeholder="Best for couples"
                        className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-primary font-semibold" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row gap-8">
              {/* room-base-price */}
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 !max-w-[400px]">
                    <FormLabel
                      htmlFor="room-price"
                      className="text-[14px] text-accent-foreground"
                    >
                      Base Room Price ($)
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="room-price"
                        type="number"
                        min={50}
                        className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-primary font-semibold" />
                  </FormItem>
                )}
              />

              {/* allocated-rooms */}
              <FormField
                control={form.control}
                name="totalRoomsAllocated"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 !max-w-[400px]">
                    <FormLabel
                      htmlFor="rooms-allocated"
                      className="text-[14px] text-accent-foreground"
                    >
                      Total Rooms Allocated
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="rooms-allocated"
                        type="number"
                        min={1}
                        className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-primary font-semibold" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row gap-8">
              {/* room-max-occupancy */}
              <FormField
                control={form.control}
                name="maxOccupancy"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 !max-w-[400px]">
                    <FormLabel
                      htmlFor="max-occupancy"
                      className="text-[14px] text-accent-foreground"
                    >
                      Max Guest Occupancy (per Room)
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="max-occupancy"
                        type="number"
                        min={1}
                        className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-primary font-semibold" />
                  </FormItem>
                )}
              />

              {/* room area */}
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 !max-w-[400px]">
                    <FormLabel
                      htmlFor="room-area"
                      className="text-[14px] text-accent-foreground"
                    >
                      Room`&apos;s Area (sq.ft.)
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="room-area"
                        type="number"
                        min={10}
                        className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-primary font-semibold" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row gap-8">
              {/* room-bed */}
              <FormField
                control={form.control}
                name="beds.type"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 !max-w-[400px]">
                    <FormLabel
                      htmlFor="room-bed"
                      className="text-[14px] text-accent-foreground"
                    >
                      Bed Type
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="King Size Bed"
                        id="room-bed"
                        className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-primary font-semibold" />
                  </FormItem>
                )}
              />

              {/* bed-count */}
              <FormField
                control={form.control}
                name="beds.count"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 !max-w-[400px]">
                    <FormLabel
                      htmlFor="bed-count"
                      className="text-[14px] text-accent-foreground"
                    >
                      Bed Count
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="bed-count"
                        type="number"
                        min={1}
                        className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-primary font-semibold" />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-8">
              {/* wifi */}
              <FormField
                control={form.control}
                name="isWifiAvailable"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 w-full items-center gap-8">
                    <FormLabel
                      htmlFor="wifi"
                      className="text-[14px] text-accent-foreground"
                    >
                      Is WiFi Available?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        id="wifi"
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        defaultValue={field.value ? "true" : "false"}
                        className="flex gap-4 items-center !mt-0"
                      >
                        <FormItem className="flex items-center gap-2 mt-0 ">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal !m-0">
                            Yes
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-2  mt-0">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal !m-0">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-primary font-semibold" />
                  </FormItem>
                )}
              />

              {/* Air Condition */}
              <FormField
                control={form.control}
                name="isAirConditioned"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 w-full items-center gap-8">
                    <FormLabel
                      htmlFor="ac"
                      className="text-[14px] text-accent-foreground"
                    >
                      Is Room Air Conditioned?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        id="ac"
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        defaultValue={field.value ? "true" : "false"}
                        className="flex gap-4 items-center !mt-0"
                      >
                        <FormItem className="flex items-center gap-2 mt-0 ">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal !m-0">
                            Yes
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-2  mt-0">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal !m-0">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-primary font-semibold" />
                  </FormItem>
                )}
              />

              {/* city-view */}
              <FormField
                control={form.control}
                name="hasCityView"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 w-full items-center gap-8">
                    <FormLabel
                      htmlFor="city-view"
                      className="text-[14px] text-accent-foreground"
                    >
                      Does the Room have a City View?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        id="city-view"
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        defaultValue={field.value ? "true" : "false"}
                        className="flex gap-4 items-center !mt-0"
                      >
                        <FormItem className="flex items-center gap-2 mt-0 ">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal !m-0">
                            Yes
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-2  mt-0">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal !m-0">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-primary font-semibold" />
                  </FormItem>
                )}
              />

              {/* sea view */}
              <FormField
                control={form.control}
                name="hasSeaView"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 w-full items-center gap-8">
                    <FormLabel
                      htmlFor="sea-view"
                      className="text-[14px] text-accent-foreground"
                    >
                      Does the Room have a Sea/Beach View?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        id="sea-view"
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        defaultValue={field.value ? "true" : "false"}
                        className="flex gap-4 items-center !mt-0"
                      >
                        <FormItem className="flex items-center gap-2 mt-0 ">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal !m-0">
                            Yes
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-2  mt-0">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal !m-0">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-primary font-semibold" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row gap-8">
              {/* room-perks */}
              <FormField
                control={form.control}
                name="perks"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 ">
                    <FormLabel
                      htmlFor="room-perks"
                      className="text-[14px] text-accent-foreground"
                    >
                      Perks with this Room (separate with comma)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        cols={30}
                        id="room-perks"
                        placeholder="Free Welcome Drink"
                        className="!text-[16px] w-full  font-medium h-32 valid:bg-background rounded-lg px-4 shadow-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-primary font-semibold" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-8">
              <FormField
                control={form.control}
                name="extras"
                render={({ field: { value, onChange } }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel
                      htmlFor="extras"
                      className="text-[14px] text-accent-foreground"
                    >
                      Add Paid Extras (Name-Cost)
                    </FormLabel>
                    <FormControl className="flex flex-col gap-4">
                      <div>
                        {value.map((extra, index) => (
                          <FormItem key={index} className="flex gap-4">
                            <Input
                              id={`extra-name-${index}`}
                              placeholder="Extra Item Name"
                              className="!text-[16px] w-[280px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                              value={extra.name}
                              onChange={(e) =>
                                onChange([
                                  ...value.slice(0, index),
                                  { ...extra, name: e.target.value },
                                  ...value.slice(index + 1),
                                ])
                              }
                            />
                            <Input
                              id={`extra-cost-${index}`}
                              type="number"
                              min={0}
                              className="!text-[16px] w-[280px] !mt-0 font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                              value={extra.cost}
                              onChange={(e) =>
                                onChange([
                                  ...value.slice(0, index),
                                  { ...extra, cost: Number(e.target.value) },
                                  ...value.slice(index + 1),
                                ])
                              }
                            />
                          </FormItem>
                        ))}
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant={"ghost"}
                            size="sm"
                            className="rounded-full shadow-none w-max text-primary gap-2 flex items-center justify-center"
                            onClick={() =>
                              onChange([...value, { name: "", cost: 0 }])
                            }
                            disabled={value.length === 0}
                          >
                            Add
                            <Plus strokeWidth={2.5} />
                          </Button>
                          <Button
                            type="button"
                            variant={"ghost"}
                            size="sm"
                            className="rounded-full shadow-none w-max text-primary gap-2 flex items-center justify-center"
                            onClick={() =>
                              onChange(value.slice(0, value.length - 1))
                            }
                            disabled={value.length <= 1}
                          >
                            Remove
                            <Minus strokeWidth={2.5} />
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel
                    htmlFor="room-images"
                    className="text-[14px] text-accent-foreground"
                  >
                    Upload Room Images
                  </FormLabel>
                  <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    dropzoneOptions={dropzone}
                    reSelect={true}
                  >
                    <FileInput className="border-[1px] rounded w-full  border-border/90 hover:bg-accent/50 hover:border-primary">
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

            <Button
              type="submit"
              size="sm"
              className="rounded w-max mb-1 self-end"
              disabled={isLoading || images.length >= 6}
            >
              {isLoading ? <Hourglass /> : <NotebookTabs />}
              {isLoading ? "Enlisting" : "Enlist"}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
