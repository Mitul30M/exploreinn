"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  setStep,
  setDistanceFromTouristDestinations,
} from "@/lib/redux-store/slices/register-listing-slice";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Minus, NotebookTabs, Plus } from "lucide-react";

const FormSchema = z.object({
  touristDestinations: z.array(
    z.object({
      name: z.string().min(1),
      distance: z.number(),
    })
  ),
});

const RenderStep12 = () => {
  const { listingName, tags, socialMediaLinks, distanceFrom } = useAppSelector(
    (state: RootState) => state.registerListing
  );
  const dispatch: AppDispatch = useAppDispatch();

  useEffect(() => {
    if (!tags.length || !socialMediaLinks.length) {
      toast({
        title: "*Please Set Tags & Social Media Links",
        description: `Please set ${listingName}'s description tags & social media links.`,
        action: (
          <ToastAction className="text-primary text-nowrap" altText="Step 11">
            Step 11
          </ToastAction>
        ),
      });
      dispatch(setStep(11));
    }
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      touristDestinations: distanceFrom.touristDestinations.length
        ? distanceFrom.touristDestinations
        : [
            {
              name: "",
              distance: 0,
            },
          ],
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    dispatch(setDistanceFromTouristDestinations(data.touristDestinations));
  };

  return (
    <div className="space-y-14 w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold flex flex-col gap-4">
          <Badge className="rounded-full w-max">Step 12</Badge>
          Nearby Tourist Destinations
        </h1>

        <p className="text-[14px] text-accent-foreground">
          Set nearby Tourist Destinations for your listing to help guests find
          perfect places to visit.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-8"
        >
          {/* nearby tourist destinations */}
          <FormField
            control={form.control}
            name="touristDestinations"
            render={({ field: { value, onChange } }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel
                  htmlFor="touristDestinations-name"
                  className="text-[14px] text-accent-foreground"
                >
                  Set Nearby Tourist Destinations & Distance from Listing
                </FormLabel>
                <FormControl className="flex flex-col gap-4">
                  <div>
                    {value.map(
                      (
                        place: {
                          name: string;
                          distance: number;
                        },
                        index
                      ) => (
                        <FormItem key={index} className="flex gap-4">
                          <Input
                            id={`touristDestinations-name-${index}`}
                            placeholder="Name"
                            className="!text-[16px] w-[350px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                            value={place.name}
                            onChange={(e) =>
                              onChange([
                                ...value.slice(0, index),
                                { ...place, name: e.target.value },
                                ...value.slice(index + 1),
                              ])
                            }
                          />
                          <Input
                            id={`touristDestinations-distance-${index}`}
                            placeholder="Km"
                            type="text"
                            pattern="^\d+(\.\d+)?$"
                            className="!text-[16px] w-[100px] !mt-0 font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                            value={place.distance}
                            onChange={(e) =>
                              onChange([
                                ...value.slice(0, index),
                                {
                                  ...place,
                                  distance: e.target.value
                                    ? parseFloat(e.target.value)
                                    : 0,
                                },
                                ...value.slice(index + 1),
                              ])
                            }
                          />
                        </FormItem>
                      )
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={"ghost"}
                        size="sm"
                        className="rounded-full shadow-none w-max text-primary gap-2 flex items-center justify-center"
                        onClick={() =>
                          onChange([...value, { name: "", distance: "" }])
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

export default RenderStep12;
