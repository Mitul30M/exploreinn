"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  setIsBookNowPayLater,
  setStep,
  setTaxIN,
  setTaxRates,
} from "@/lib/redux-store/slices/register-listing-slice";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Minus, NotebookTabs, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const RenderStep9 = () => {
  const { listingName, taxIN, taxRates, room, isBookNowPayLaterAllowed } =
    useAppSelector((state: RootState) => state.registerListing);
  const dispatch: AppDispatch = useAppDispatch();

  useEffect(() => {
    if (
      !room ||
      !room.name ||
      !room.tag ||
      !room.basePrice ||
      !room.totalRoomsAllocated ||
      !room.maxOccupancy ||
      !room.area ||
      !room.images.length ||
      !room.extras.length ||
      !room.coverImage
    ) {
      toast({
        title: "*Room Details are required",
        description: `Please set ${listingName}'s room details`,
        action: (
          <ToastAction className="text-primary text-nowrap" altText="Step 8">
            Step 8
          </ToastAction>
        ),
      });
      dispatch(setStep(8));
    }
  }, []);

  const FormSchema = z.object({
    isBookNowPayLater: z.boolean(),
    taxIN: z.string().min(10, "TaxIN is required").max(20, "TaxIN is required"),
    taxRates: z.array(
      z.object({
        name: z.string().min(1),
        rate: z.coerce.number().gte(0),
      })
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      isBookNowPayLater: isBookNowPayLaterAllowed,
      taxIN: taxIN ? taxIN : "",
      taxRates: taxRates ? taxRates : [{ name: "", rate: 0 }],
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    dispatch(setTaxIN(data.taxIN));
    dispatch(setTaxRates(data.taxRates));
    dispatch(setIsBookNowPayLater(data.isBookNowPayLater));
    console.log(data);
  };

  return (
    <div className="space-y-14 w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold flex flex-col gap-4">
          <Badge className="rounded-full w-max">Step 9</Badge>
          Set Tax Rates
        </h1>

        <p className="text-[14px] text-accent-foreground">
          Set appropriate tax rates for your listing during the booking process.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-8"
        >
          {/* Book Now Pay Later */}
          <FormField
            control={form.control}
            name="isBookNowPayLater"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border-primary border-2 p-4 max-w-[700px] shadow-sm">
                <div className="space-y-1">
                  <FormLabel className="text-primary font-semibold">
                    Enable Book-Now-Pay-Later?
                  </FormLabel>
                  <FormDescription>
                    Users can book the room they want & the payment will be
                    handled during the checkIn.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* TIN */}
          <FormField
            control={form.control}
            name="taxIN"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 !max-w-[300px]">
                <FormLabel
                  htmlFor="TIN"
                  className="text-[14px] text-accent-foreground"
                >
                  Tax Identification Number
                </FormLabel>
                <FormControl>
                  <Input
                    id="TIN"
                    placeholder="NWDN2EREQNJKO2"
                    className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-primary font-semibold" />
              </FormItem>
            )}
          />

          {/* Tax Rates */}
          <FormField
            control={form.control}
            name="taxRates"
            render={({ field: { value, onChange } }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel
                  htmlFor="extras"
                  className="text-[14px] text-accent-foreground"
                >
                  Add Applicable Taxes & Fees Rates (Name-%)
                </FormLabel>
                <FormControl className="flex flex-col gap-4">
                  <div>
                    {value.map((tax, index) => (
                      <FormItem key={index} className="flex gap-4">
                        <Input
                          id={`tax-name-${index}`}
                          placeholder="Tax Name"
                          className="!text-[16px] w-[350px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                          value={tax.name}
                          onChange={(e) =>
                            onChange([
                              ...value.slice(0, index),
                              { ...tax, name: e.target.value },
                              ...value.slice(index + 1),
                            ])
                          }
                        />
                        <Input
                          id={`tax-rate-${index}`}
                          type="text"
                          pattern="^\d+(\.\d+)?$"
                          className="!text-[16px] w-[90px] !mt-0 font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                          value={tax.rate}
                          onChange={(e) =>
                            onChange([
                              ...value.slice(0, index),
                              {
                                ...tax,
                                rate: e.target.value
                                  ? parseFloat(e.target.value)
                                  : 0,
                              },
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
                          onChange([...value, { name: "", rate: 0 }])
                        }
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
                        disabled={value.length === 0}
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

          <Button type="submit" size="sm" className="rounded w-max mb-1">
            <NotebookTabs />
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RenderStep9;
