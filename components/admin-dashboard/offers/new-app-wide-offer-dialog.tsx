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
import { zodResolver } from "@hookform/resolvers/zod";
import { offerType } from "@prisma/client";
import { CalendarIcon, Save, Tag } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addMonths, formatDate } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  createAppWideOffer,
} from "@/lib/actions/offers/offers";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(["Percentage_Discount", "Flat_Discount", "Extra_Perks"]),
  couponCode: z.string(),
  redeemForPoints: z.number(),
  flatDiscount: z.number(),
  percentageDiscount: z.number(),
  minimumBookingAmount: z.number(),
  maxDiscountAmount: z.number(),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});
type FormSchema = z.infer<typeof formSchema>;

export const NewAppWideOfferDialog = () => {
  const [offerType, setOfferType] = useState<offerType>("Percentage_Discount");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: offerType,
      couponCode: "",
      redeemForPoints: 0,
      flatDiscount: 0,
      percentageDiscount: 0,
      minimumBookingAmount: 0,
      maxDiscountAmount: 0,
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
    },
  });

  useEffect(() => {
    if (offerType === "Percentage_Discount") {
      form.setValue("flatDiscount", 0);
    } else if (offerType === "Flat_Discount") {
      form.setValue("percentageDiscount", 0);
      form.setValue("maxDiscountAmount", 0);
    } else if (offerType === "Extra_Perks") {
      form.setValue("flatDiscount", 0);
      form.setValue("percentageDiscount", 0);
      form.setValue("maxDiscountAmount", 0);
    }
  }, [offerType, form]);

  const onSubmit = async (formData: FormSchema): Promise<void> => {
    console.log(formData);
    setIsLoading(true);
    startTransition(async () => {
      const isOfferCreated = await createAppWideOffer({
        name: formData.name,
        description: formData.description,
        type: formData.type,
        couponCode: formData.couponCode.toUpperCase(),
        startDate: new Date(formData.dateRange.from.toISOString()),
        endDate: new Date(formData.dateRange.to.toISOString()),
        flatDiscount: formData.flatDiscount,
        percentageDiscount: formData.percentageDiscount,
        maxDiscountAmount: formData.maxDiscountAmount,
        minimumBookingAmount: formData.minimumBookingAmount,
        redeemForPoints: formData.redeemForPoints,
      });
      if (isOfferCreated) {
        toast({
          title: `*Offer Created Successfully!`,
          description: `${formData.name} offer created successfully!`,
          action: (
            <ToastAction
              className="text-primary text-nowrap flex items-center gap-1 justify-center"
              altText="success"
            >
              <Save className="size-4 text-primary" /> Ok
            </ToastAction>
          ),
        });
      } else {
        toast({
          title: `*Error while creating offer!`,
          description: "Something went wrong! Please Try Again.",
          action: (
            <ToastAction
              className="text-primary text-nowrap flex items-center gap-1 justify-center"
              altText="error"
            >
              <Save className="size-4 text-primary" /> Try Again
            </ToastAction>
          ),
        });
      }
    });
    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={"sm"}
          className="flex items-center gap-2"
        >
          <Tag className="text-primary" />
          New App Wide Offer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <ScrollArea className="h-[650px] pe-3">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 mb-2">
              <Tag className="text-primary" />
              Create New Exploreinn Offer
            </DialogTitle>
            <DialogDescription>
              Create a new offer for all users. This offers will be available
              for all users on all listings on Exploreinn for booking purposes.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
            >
              {/* name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offer Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Summer Sale"
                        className="max-w-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Give your offer a name. This will be visible to your
                      guests.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offer Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize h-max max-w-[500px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe your offer. Include T&Cs to avoid any confusion.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* start and end date */}
              <FormField
                control={form.control}
                name={`dateRange`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Range</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "max-w-[300px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {formatDate(field.value.from, "PPP")} -{" "}
                                  {formatDate(field.value.to, "PPP")}
                                </>
                              ) : (
                                formatDate(field.value.from, "PPP")
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date > addMonths(new Date(), 3)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* coupon code */}
              <FormField
                control={form.control}
                name="couponCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offer Coupon Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="HOTSUMMER10"
                        className="max-w-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Give your offer a Code (capitalized).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* redeem for points */}
              <FormField
                control={form.control}
                name="redeemForPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redeem For Points</FormLabel>
                    <FormControl>
                      <Input
                        className="max-w-[270px]"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        type="number"
                      />
                    </FormControl>
                    <FormDescription>
                      Set the &apos;exploreinn-reward-points&apos; required for
                      the offer to be redeemed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* select offer type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select Offer Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          setOfferType(value as offerType);
                        }}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Percentage_Discount" />
                          </FormControl>
                          <FormLabel className="font-medium">
                            Percentage Discount on Booking Amount
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Flat_Discount" />
                          </FormControl>
                          <FormLabel className="font-medium">
                            Flat Amount Discount on Booking Amount
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Extra_Perks" />
                          </FormControl>
                          <FormLabel className="font-medium">
                            Extra Perks with Booking
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* percentage discount & max discount */}
              {offerType === "Percentage_Discount" && (
                <>
                  <FormField
                    control={form.control}
                    name="percentageDiscount"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel className="max-w-[250px]">
                            Set Percentage Discount on the booking fee.(%)
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="max-w-[250px]"
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxDiscountAmount"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel className="max-w-[250px]">
                            Set Max Discount Amount on the booking fee when
                            using this offer.($)
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="max-w-[250px]"
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {/* flat discount */}
              {offerType === "Flat_Discount" && (
                <>
                  <FormField
                    control={form.control}
                    name="flatDiscount"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel className="max-w-[250px]">
                            Set a Fixed Discount Amount on the booking fee.($)
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="max-w-[250px]"
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {/* minimum booking amount */}
              <FormField
                control={form.control}
                name="minimumBookingAmount"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel className="max-w-[250px]">
                        Set Min Booking Amount to use this offer.($)
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="max-w-[250px]"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="sm"
                className={" self-end w-max"}
                disabled={form.formState.isSubmitting}
              >
                <Save
                  className={
                    form.formState.isSubmitting || isLoading
                      ? "animate-spin"
                      : ""
                  }
                />
                {isLoading ? "Creating..." : "Create Offer"}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
