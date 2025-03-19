"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DoorOpen,
  Edit,
  HandCoins,
  MapPinCheckInside,
  MessageSquareText,
  PlusCircle,
  Sparkles,
  Star,
  ThumbsUp,
} from "lucide-react";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Slider } from "../ui/slider";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  content: z.string().min(10),
  stars: z.number().int().min(1).max(5),
  cleanliness: z.number().int().min(1).max(10),
  comfort: z.number().int().min(1).max(10),
  communication: z.number().int().min(1).max(10),
  checkIn: z.number().int().min(1).max(10),
  valueForMoney: z.number().int().min(1).max(10),
  location: z.number().int().min(1).max(10),
  listingId: z.string(),
});
type FormSchema = z.infer<typeof formSchema>;

export const NewReviewDialogForm = ({ listingId }: { listingId: string }) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listingId: listingId,
      content: "",
      stars: 3,
      cleanliness: 3,
      comfort: 3,
      communication: 3,
      checkIn: 3,
      valueForMoney: 3,
      location: 3,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (formData: FormSchema): Promise<void> => {
    console.log(formData);
    // setIsLoading(true);
    // try {
    //   const res = await sendMailfromUser({
    //     intendedReceiver: formData.intendedReceiver,
    //     labels: formData.labels,
    //     subject: formData.subject,
    //     text: formData.text,
    //     type: formData.type,
    //     listingId: formData.listingId,
    //     bookingId: formData.bookingId,
    //     email: formData.email,
    //     attachments: formData.attachments,
    //   });
    //   console.log(res);

    //   if (res.type === "success") {
    //     toast({
    //       title: `Mail Sent Successfully!`,
    //       description: res.message,
    //       action: (
    //         <ToastAction
    //           className="text-primary text-nowrap flex items-center gap-1 justify-center"
    //           altText="success"
    //         >
    //           <Send className="size-4 text-primary" /> OK
    //         </ToastAction>
    //       ),
    //     });
    //   } else {
    //     toast({
    //       title: `Failed to Send Mail!`,
    //       description: res.message,
    //       action: (
    //         <ToastAction
    //           className="text-primary text-nowrap flex items-center gap-1 justify-center"
    //           altText="error"
    //         >
    //           <Send className="size-4 text-primary" /> Try Again
    //         </ToastAction>
    //       ),
    //     });
    //   }
    // } catch (error) {
    //   toast({
    //     title: `Failed to process request`,
    //     description: "An error occurred while processing your request.",
    //     action: (
    //       <ToastAction
    //         className="text-primary text-nowrap flex items-center gap-1 justify-center"
    //         altText="error"
    //       >
    //         <HardDriveUpload className="size-4 text-primary" /> Try Again
    //       </ToastAction>
    //     ),
    //   });
    //   console.log(error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"sm"} className="rounded-md">
          <Edit /> Add Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex w-max items-center gap-2">
            <Edit className="text-primary" />
            Add Review for the listing
          </DialogTitle>
          <DialogDescription>
            Add a review for the listing by sharing your experience and rating
            the listing based on various criteria. This will help other users
            make informed decisions when considering this listing.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* set stars */}
            <div className="space-y-2 my-4">
              <FormField
                control={form.control}
                name="stars"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>
                      Rate the listing:{" "}
                      <span className="font-semibold flex flex-row items-center w-max gap-2">
                        {value} <Star className="text-primary" size={16} />
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        className="w-[250px]"
                        min={1}
                        max={5}
                        step={1}
                        defaultValue={[value]}
                        onValueChange={(v) => onChange(v[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* set comfort */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="comfort"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>
                        Rate the listing's comfort level:{" "}
                        <span className="font-semibold flex flex-row items-center w-max gap-2">
                          {value}{" "}
                          <ThumbsUp className="text-primary" size={16} />
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          className="w-full"
                          min={1}
                          max={10}
                          step={1}
                          defaultValue={[value]}
                          onValueChange={(v) => onChange(v[0])}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* set value for money */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="valueForMoney"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>
                        Rate how much value you got for your money:{" "}
                        <span className="font-semibold flex flex-row items-center w-max gap-2">
                          {value}{" "}
                          <HandCoins className="text-primary" size={16} />
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          className="w-full"
                          min={1}
                          max={10}
                          step={1}
                          defaultValue={[value]}
                          onValueChange={(v) => onChange(v[0])}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* set checkin */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="checkIn"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>
                        Rate the listing's check-in process:{" "}
                        <span className="font-semibold flex flex-row items-center w-max gap-2">
                          {value}{" "}
                          <DoorOpen className="text-primary" size={16} />
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          className="w-full"
                          min={1}
                          max={10}
                          step={1}
                          defaultValue={[value]}
                          onValueChange={(v) => onChange(v[0])}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* set cleanliness */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="cleanliness"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>
                        Rate the listing's cleanliness:{" "}
                        <span className="font-semibold flex flex-row items-center w-max gap-2">
                          {value}{" "}
                          <Sparkles className="text-primary" size={16} />
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          className="w-full"
                          min={1}
                          max={10}
                          step={1}
                          defaultValue={[value]}
                          onValueChange={(v) => onChange(v[0])}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* set communication */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="communication"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>
                        Rate the listing's communication:{" "}
                        <span className="font-semibold flex flex-row items-center w-max gap-2">
                          {value}{" "}
                          <MessageSquareText
                            className="text-primary"
                            size={16}
                          />
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          className="w-full"
                          min={1}
                          max={10}
                          step={1}
                          defaultValue={[value]}
                          onValueChange={(v) => onChange(v[0])}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* set location */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>
                        Rate the listing's location and neighborhood:{" "}
                        <span className="font-semibold flex flex-row items-center w-max gap-2">
                          {value}{" "}
                          <MapPinCheckInside
                            className="text-primary"
                            size={16}
                          />
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          className="w-full"
                          min={1}
                          max={10}
                          step={1}
                          defaultValue={[value]}
                          onValueChange={(v) => onChange(v[0])}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-2 my-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add a review: </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your review here..."
                        className="h-[200px]"
                        rows={15}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* print errors
            {form.formState.errors && (
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
              <PlusCircle />
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
