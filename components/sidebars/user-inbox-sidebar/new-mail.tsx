"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getUserBookingIDs, sendMailfromUser } from "@/lib/actions/mails/mails";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Edit,
  HardDriveUpload,
  Hourglass,
  Paperclip,
  Send,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import TextEditor from "@/components/ui/text-editor/tip-tap-editor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropzoneOptions } from "react-dropzone";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { Progress } from "@/components/ui/progress";
import { HoverCard } from "@/components/ui/hover-card";
import { getSignedURLForMailAttachment } from "@/lib/actions/s3-buckets/s3-bucket";
import { computeSHA256 } from "@/lib/utils/seed/sha256";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { TagsInput } from "@/components/ui/tags-input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  intendedReceiver: z.union([z.literal("exploreinn"), z.literal("listing")]),
  subject: z.string().min(5, "Subject Cannot be Empty"),
  text: z.string().min(5, "Mail Body Cannot be Empty"),
  type: z.enum(["Inquiry", "Complaint", "Feedback", "Response"]),
  labels: z.array(z.string()),
  email: z.string().email(),
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      })
    )
    .max(10)
    .nullable(),
  attachments: z.array(z.string()),
  bookingId: z.string().optional(),
  listingId: z.string().optional(),
});
type FormSchema = z.infer<typeof formSchema>;
const dropzone = {
  accept: {
    "application/*": [".pdf", ".docx"],
    "image/*": [".jpg", ".jpeg", ".png", ".webp"],
  },
  multiple: true,
  maxFiles: 10,
  maxSize: 4 * 1024 * 1024,
} satisfies DropzoneOptions;

export const NewUserMailDialogForm = () => {
  const { user } = useUser();
  // Ensure that `user`, `publicMetadata`, and `userDB_id` exist before rendering
  const userDB_id = (user?.publicMetadata as PublicMetadataType)?.userDB_id;
  const params = useParams<{ userId: string }>();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      intendedReceiver: "listing",
      type: "Inquiry",
      subject: "",
      text: "",
      labels: [],
      email: "",
      files: null,
      attachments: [""],
      bookingId: "",
      listingId: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [progress] = useState<number[]>([]);
  const { data: userBookings, isLoading: queryLoading } = useQuery({
    queryKey: ["userBookingIDs", userDB_id ?? params.userId],
    queryFn: async () => await getUserBookingIDs(userDB_id ?? params.userId),
  });

  const onSubmit = async (formData: FormSchema): Promise<void> => {
    console.log(formData);
    setIsLoading(true);
    try {
      if (formData.files && formData.files.length > 0) {
        let successCount = 0;
        const uploadedUrls = await Promise.all(
          formData.files.map(async (file) => {
            const signedURLResult = await getSignedURLForMailAttachment({
              prefix: "attachment",
              fileSize: file.size,
              fileType: file.type,
              checksum: await computeSHA256(file),
            });
            if (signedURLResult.error !== undefined) {
              toast({
                title: `*Error while Uploading Documents`,
                description: signedURLResult.error,
                action: (
                  <ToastAction
                    className="text-primary text-nowrap flex items-center gap-1 justify-center"
                    altText="error"
                  >
                    <HardDriveUpload className="size-4 text-primary" /> Try
                    Again
                  </ToastAction>
                ),
              });
              return null;
            }
            const { url } = signedURLResult.success;
            const response = await fetch(url, {
              method: "PUT",
              body: file,
              headers: {
                "Content-Type": file.type,
              },
            });
            if (response.ok) {
              successCount++;
              return response.url.split("?")[0];
            }
            return null;
          })
        );

        const validUrls = uploadedUrls.filter(
          (url): url is string => url !== null
        );
        formData.attachments = validUrls;

        if (successCount === formData.files.length) {
          toast({
            title: `${formData.files.length} Files Uploaded Successfully`,
            description: "All attachments uploaded to the server.",
            action: (
              <ToastAction
                className="text-primary text-nowrap flex items-center gap-1 justify-center"
                altText="success"
              >
                <HardDriveUpload className="size-4 text-primary" /> Success
              </ToastAction>
            ),
          });
        } else {
          toast({
            title: `Failed to upload some files`,
            description: "Not all attachments uploaded to the server.",
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
      }

      const res = await sendMailfromUser({
        intendedReceiver: formData.intendedReceiver,
        labels: formData.labels,
        subject: formData.subject,
        text: formData.text,
        type: formData.type,
        listingId: formData.listingId,
        bookingId: formData.bookingId,
        email: formData.email,
        attachments: formData.attachments,
      });
      console.log(res);

      if (res.type === "success") {
        toast({
          title: `Mail Sent Successfully!`,
          description: res.message,
          action: (
            <ToastAction
              className="text-primary text-nowrap flex items-center gap-1 justify-center"
              altText="success"
            >
              <Send className="size-4 text-primary" /> OK
            </ToastAction>
          ),
        });
      } else {
        toast({
          title: `Failed to Send Mail!`,
          description: res.message,
          action: (
            <ToastAction
              className="text-primary text-nowrap flex items-center gap-1 justify-center"
              altText="error"
            >
              <Send className="size-4 text-primary" /> Try Again
            </ToastAction>
          ),
        });
      }
    } catch (error) {
      toast({
        title: `Failed to process request`,
        description: "An error occurred while processing your request.",
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"sm"} className="rounded-md">
          <Edit /> New Mail
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[630px]">
        <ScrollArea className="h-[650px] pe-3">
          <DialogHeader>
            <DialogTitle className="flex w-max items-center gap-2">
              <Send className="text-primary" />
              Send a New Mail
            </DialogTitle>
            <DialogDescription>
              Send a new mail to either one of your booked listings or to the
              exploreinn support team.
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* set receiver */}
              <div className="space-y-2 my-4">
                <FormField
                  control={form.control}
                  name="intendedReceiver"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select the Intended Receiver</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            if (value === "exploreinn") {
                              form.setValue(
                                "email",
                                process.env
                                  .NEXT_PUBLIC_EXPLOREINN_SUPPORT_EMAIL ??
                                  "support@exploreinn.com"
                              );
                            }
                            field.onChange(value);
                          }}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="exploreinn" />
                            </FormControl>
                            <FormLabel className="font-medium">
                              exploreinn support team
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="listing" />
                            </FormControl>
                            <FormLabel className="font-medium">
                              listing that I booked in the past/present/future.
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />{" "}
              </div>

              <Separator className="my-4" />

              {/* select listing & booking */}
              <div className=" space-y-4">
                <FormField
                  control={form.control}
                  name="bookingId"
                  render={({ field }) => (
                    <FormItem className="w-max">
                      <FormLabel>
                        Select the booking regarding which you want to send the
                        mail.
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const [listingId, bookingId, listingEmail] =
                            value.split(" ");
                          field.onChange(bookingId);
                          form.setValue("listingId", listingId);

                          if (
                            form.getValues("intendedReceiver") === "listing"
                          ) {
                            form.setValue("email", listingEmail);
                          } else {
                            form.setValue(
                              "email",
                              process.env
                                .NEXT_PUBLIC_EXPLOREINN_SUPPORT_EMAIL ??
                                "support@exploreinn.com"
                            );
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Booking" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userBookings?.map((booking) => (
                            <SelectItem
                              key={booking.id}
                              value={
                                booking.listingId +
                                " " +
                                booking.id +
                                " " +
                                booking.listing.email
                              }
                            >
                              {booking.listing.name} [
                              {format(
                                new Date(booking.checkInDate),
                                "dd MMM yy"
                              )}{" "}
                              to{" "}
                              {format(
                                new Date(booking.checkOutDate),
                                "dd MMM yy"
                              )}
                              ]{", "}
                              <span className="font-semibold text-primary">
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                }).format(booking.totalCost)}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <div className="flex flex-row gap-4 items-center">
                  <FormField
                    control={form.control}
                    name="bookingId"
                    render={({ field }) => (
                      <FormItem className="w-[270px]">
                        <FormLabel>BookingID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="The ID of the booking"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="listingId"
                    render={({ field }) => (
                      <FormItem className="w-[270px]">
                        <FormLabel>ListingID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="The ID of the listing"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-[300px]">
                      <FormLabel>Recipient Email</FormLabel>
                      <FormControl>
                        <Input placeholder="info@account.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/*mail type and text */}
              <div className="space-y-4">
                <div className="flex flex-row gap-4 items-center">
                  {/* mail subject */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="w-[300px]">
                        <FormLabel>Mail Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Subject of the mail" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* mail type */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="w-max">
                        <FormLabel>Mail Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select mail type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Inquiry">Inquiry</SelectItem>
                            <SelectItem value="Complaint">Complaint</SelectItem>
                            <SelectItem value="Feedback">Feedback</SelectItem>
                            <SelectItem value="Response">Response</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* labels */}
                <FormField
                  control={form.control}
                  name="labels"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2 !max-w-[400px]">
                      <FormLabel
                        htmlFor="tags"
                        className="text-[14px] text-accent-foreground"
                      >
                        Add Labels to the mail
                      </FormLabel>
                      <FormControl>
                        <TagsInput
                          className="w-[350px] border-[1px] "
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-primary font-semibold" />
                    </FormItem>
                  )}
                />
                {/* mail text */}
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="text-[14px] text-accent-foreground">
                        Mail Body
                      </FormLabel>
                      <FormControl>
                        {/* <TextEditor {...field} showToolbar={false} /> */}
                        <Textarea
                          placeholder="Write your message here"
                          className="h-[200px]"
                          rows={15}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-primary font-semibold" />
                    </FormItem>
                  )}
                />
                {/* attachments */}
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
                        className="flex flex-col gap-4 items-center! justify-center"
                      >
                        <FileInput className="border-[1px] rounded h-max p-4 w-[400px] border-border/90 hover:bg-accent/50 hover:border-primary mx-auto">
                          <div className="flex items-center justify-center flex-col p-4 max-w-[350px] h-max gap-4 mx-auto">
                            {isLoading || form.formState.isSubmitting ? (
                              <Hourglass className="size-6 text-primary animate-spin" />
                            ) : (
                              <Paperclip className="size-6 text-primary" />
                            )}
                            <div className="space-y-2 text-center">
                              <p className="text-lg font-semibold">
                                {isLoading ? "Uploading" : "Attachments"}
                              </p>
                              <p className="text-sm font-medium leading-none text-accent-foreground/80">
                                Add Attachments to the mail. Max 10 files
                              </p>
                            </div>
                          </div>
                        </FileInput>
                        {field.value && field.value.length > 0 && (
                          <HoverCard>
                            <FileUploaderContent className="p-2 rounded-b-none rounded-t-md flex flex-col gap-2 text-accent-foreground/80  max-w-[400px] border-[1px] border-border/90 mt-2 mx-auto">
                              {field.value.map((file, i) => (
                                <FileUploaderItem
                                  key={i}
                                  index={i}
                                  aria-roledescription={`file ${i + 1} containing ${
                                    file.name
                                  }`}
                                  className="p-1 h-max"
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
              </div>

              {/* {form.formState.errors && (
                <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
              )} */}
              <Button
                type="submit"
                size="sm"
                className={" self-end w-max"}
                disabled={
                  form.formState.isSubmitting || isLoading
                  // isLoading ||
                  // form.formState.isDirty
                }
              >
                <Send />
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
