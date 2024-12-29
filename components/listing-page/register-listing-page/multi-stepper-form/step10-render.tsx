"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  setCancellationPolicy,
  setCheckInRulesAndRestrictions,
  setCheckInTime,
  setCheckOutTime,
  setDescription,
  setEmail,
  setGroundRulesAndRestrictions,
  setPhone,
  setStep,
} from "@/lib/redux-store/slices/register-listing-slice";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { isValidPhoneNumber } from "react-phone-number-input";
import { NotebookTabs } from "lucide-react";
import TextEditor from "@/components/ui/text-editor/tip-tap-editor";
import DOMPurify from "dompurify";
import { DatetimePicker } from "@/components/ui/datetime-picker";

const FormSchema = z.object({
  checkInTime: z
    .string()
    .min(1, "Check-in time is required")
    .regex(
      /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/,
      "Check-in time must be in the format HH:MM"
    ),
  checkOutTime: z
    .string()
    .min(1, "Check-out time is required")
    .regex(
      /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/,
      "Check-out time must be in the format HH:MM"
    ),
  checkInRulesAndRestrictions: z
    .string()
    .min(10, "Check-in rules and restrictions are required"),
  groundRulesAndRestrictions: z
    .string()
    .min(10, "Ground rules and restrictions are required"),
  cancellationPolicy: z.string().min(10, "Cancellation policy is required"),
});
const RenderStep10 = () => {
  const {
    listingName,
    taxIN,
    taxRates,
    checkInTime,
    checkOutTime,
    checkInRulesAndRestrictions,
    groundRulesAndRestrictions,
    cancellationPolicy,
  } = useAppSelector((state: RootState) => state.registerListing);
  const dispatch: AppDispatch = useAppDispatch();

  useEffect(() => {
    if (!taxIN.length) {
      toast({
        title: "*TaxIN is Required",
        description: `Please set ${listingName}'s TaxIN before moving ahead.`,
        action: (
          <ToastAction className="text-primary text-nowrap" altText="Step 9">
            Step 9
          </ToastAction>
        ),
      });
      dispatch(setStep(9));
    }
    if (taxRates.length < 1) {
      toast({
        title: "*Tax Rates are Required",
        description: `Please set ${listingName}'s Tax Rates before moving ahead.`,
        action: (
          <ToastAction className="text-primary text-nowrap" altText="Step 9">
            Step 9
          </ToastAction>
        ),
      });
      dispatch(setStep(9));
    }
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      checkInTime: checkInTime ? checkInTime : "",
      checkOutTime: checkOutTime ? checkOutTime : "",
      checkInRulesAndRestrictions: checkInRulesAndRestrictions
        ? checkInRulesAndRestrictions
        : "",
      groundRulesAndRestrictions: groundRulesAndRestrictions
        ? groundRulesAndRestrictions
        : "",
      cancellationPolicy: cancellationPolicy ? cancellationPolicy : "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    dispatch(setCheckInTime(data.checkInTime));
    dispatch(setCheckOutTime(data.checkOutTime));
    dispatch(setCheckInRulesAndRestrictions(data.checkInRulesAndRestrictions));
    dispatch(setGroundRulesAndRestrictions(data.groundRulesAndRestrictions));
    dispatch(setCancellationPolicy(data.cancellationPolicy));
  };

  return (
    <div className="space-y-14 w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold flex flex-col gap-4">
          <Badge className="rounded-full w-max">Step 10</Badge>
          Set Rules & Policies
        </h1>
        <p className="text-[14px] text-accent-foreground">
          Set essential rules, guidelines and policies for your listing. This
          helps guests understand what to expect and ensures a smooth
          experience. Include check-in/out procedures, house rules, permitted
          activities, noise restrictions, and any specific requirements guests
          should know before booking.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-14"
        >
          <div className="grid grid-cols-2 !w-max gap-8">
            {/* checkInTime */}
            <FormField
              control={form.control}
              name="checkInTime"
              render={({ field }) => (
                <FormItem className="flex gap-4 items-center w-max">
                  <FormLabel
                    htmlFor="checkInTime"
                    className="text-[14px] text-accent-foreground"
                  >
                    Check-In Time
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="checkInTime"
                      type="time"
                      className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm max-w-[110px] !mt-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-primary font-semibold" />
                </FormItem>
              )}
            />

            {/* checkOutTime */}
            <FormField
              control={form.control}
              name="checkOutTime"
              render={({ field }) => (
                <FormItem className="flex gap-4  items-center w-max">
                  <FormLabel
                    htmlFor="checkOutTime"
                    className="text-[14px] text-accent-foreground"
                  >
                    Check-Out Time
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="checkOutTime"
                      type="time"
                      className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm max-w-[110px]  !mt-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-primary font-semibold" />
                </FormItem>
              )}
            />
          </div>

          {/* checkInRulesAndRestrictions Field */}
          <FormField
            control={form.control}
            name="checkInRulesAndRestrictions"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel className="text-[14px] text-accent-foreground">
                  Set Check-In Rules, Requirements & Restrictions
                </FormLabel>
                <FormControl>
                  <TextEditor {...field} />
                </FormControl>
                <FormMessage className="text-primary font-semibold" />
              </FormItem>
            )}
          />

          {/* groundRulesAndRestrictions Field */}
          <FormField
            control={form.control}
            name="groundRulesAndRestrictions"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel className="text-[14px] text-accent-foreground">
                  Set Ground Rules & Restrictions which Guests Must Follow
                </FormLabel>
                <FormControl>
                  <TextEditor {...field} />
                </FormControl>
                <FormMessage className="text-primary font-semibold" />
              </FormItem>
            )}
          />

          {/* cancellationPolicy Field */}
          <FormField
            control={form.control}
            name="cancellationPolicy"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel className="text-[14px] text-accent-foreground">
                  Set the Cancellation Policy for the listing
                </FormLabel>
                <FormControl>
                  <TextEditor {...field} />
                </FormControl>
                <FormMessage className="text-primary font-semibold" />
              </FormItem>
            )}
          />

          <Button type="submit" size="sm" className="rounded w-max mb-1">
            <NotebookTabs />
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RenderStep10;
