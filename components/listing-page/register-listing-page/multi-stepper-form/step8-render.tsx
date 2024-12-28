"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  removeRoomImage,
  setRoom,
  setRoomCoverImage,
  setStep,
} from "@/lib/redux-store/slices/register-listing-slice";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  HardDriveUpload,
  Hourglass,
  Image,
  ImageUp,
  Minus,
  NotebookTabs,
  Plus,
  Trash2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DropzoneOptions } from "react-dropzone";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { HoverCard } from "@radix-ui/react-hover-card";
import { Progress } from "@/components/ui/progress";
import { deleteFile, getSignedURL } from "@/lib/actions/s3-buckets/s3-bucket";
import { computeSHA256 } from "@/lib/utils/seed/sha256";
import NextImage from "next/image";

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
type FormType = z.infer<typeof FormSchema>;

const RenderStep8 = () => {
  const { listingName, legalDocs, room } = useAppSelector(
    (state: RootState) => state.registerListing
  );
  const dispatch: AppDispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number[]>([]);

  useEffect(() => {
    if (legalDocs.length < 5) {
      toast({
        title: "*Legal Documents are Required",
        description: `Please upload ${listingName}'s necessary legal documents before moving ahead.`,
        action: (
          <ToastAction className="text-primary text-nowrap" altText="Step 3">
            Step 7
          </ToastAction>
        ),
      });
      dispatch(setStep(7));
    }
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: room.name ? room.name : "",
      tag: room.tag ? room.tag : "",
      basePrice: room.basePrice ? room.basePrice : 1000,
      totalRoomsAllocated: room.totalRoomsAllocated ? room.totalRoomsAllocated : 1,
      maxOccupancy: room.maxOccupancy ? room.maxOccupancy : 1,
      area: room.area ? room.area : 10,
      beds: {
        type: room.beds.type ? room.beds.type : "",
        count: room.beds.count ? room.beds.count : 1,
      },
      isWifiAvailable: room.isWifiAvailable ? room.isWifiAvailable : false,
      isAirConditioned: room.isAirConditioned ? room.isAirConditioned : false,
      hasCityView: room.hasCityView ? room.hasCityView : false,
      hasSeaView: room.hasSeaView ? room.hasSeaView : false,
      perks: room.perks ? room.perks.join(",\n") : "",
      extras: room.extras.length > 1 ? room.extras : [{ name: "No Extras", cost: 0 }],
      files: null,
    }
  });

  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    multiple: true,
    maxFiles: 6,
    maxSize: 4 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const onSubmit = async (data: FormType) => {
    const { files } = data;
    if (!files) return;
    setIsLoading(true);
    try {
      let successCount = 0;
      const images: string[] = [];
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
        dispatch(
          setRoom({
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
          })
        );
        console.log(room);
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
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold flex flex-col gap-4">
          <Badge className="rounded-full w-max">Step 8</Badge>
          Let's get started by adding first room type to your listing.
        </h1>

        <p className="text-[14px] text-accent-foreground">
          Set details about your listing's room. You can edit, add, or remove
          rooms later as well.
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
                    Room's Area (sq.ft.)
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
                        <FormLabel className="font-normal !m-0">Yes</FormLabel>
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
                        <FormLabel className="font-normal !m-0">Yes</FormLabel>
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
                        <FormLabel className="font-normal !m-0">Yes</FormLabel>
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
                        <FormLabel className="font-normal !m-0">Yes</FormLabel>
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
            className="rounded w-max mb-1"
            disabled={isLoading || room.images.length >= 6}
          >
            {isLoading ? <Hourglass /> : <NotebookTabs />}
            {isLoading ? "Saving" : "Save"}
          </Button>
        </form>
      </Form>

      {/* Uploaded Images */}
      {room.images.length ? (
        <div className=" border-[1px] border-border/90 columns-3 md:columns-5 p-2 gap-2 [&>div:not(:first-child)]:mt-2">
          {room.images.map((image, i) => (
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
                  if (image === room.coverImage) {
                    dispatch(setRoomCoverImage(room.images[1]));
                  }
                  await deleteFile(image);
                  dispatch(removeRoomImage(image));
                }}
              >
                <Trash2 className="text-primary" />
              </Button>
              <Button
                size={"icon"}
                disabled={room.coverImage === image}
                variant={"ghost"}
                className="absolute top-10 right-2 "
                onClick={() => {
                  dispatch(setRoomCoverImage(image));
                }}
              >
                <Image
                  className={
                    room.coverImage === image
                      ? "text-primary"
                      : "text-foreground"
                  }
                />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default RenderStep8;
