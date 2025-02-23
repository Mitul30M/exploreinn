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
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  setStep,
  setSocialMediaLinks,
  setTags,
} from "@/lib/redux-store/slices/register-listing-slice";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Minus, NotebookTabs, Plus } from "lucide-react";
import { TagsInput } from "@/components/ui/tags-input";

const FormSchema = z.object({
  tags: z.array(z.string()).nonempty("Please add at least one tag"),
  socialMediaLinks: z.array(
    z.object({
      name: z.string().min(1),
      link: z.string().min(1),
    })
  ),
});

const RenderStep11 = () => {
  const {
    listingName,
    tags,
    socialMediaLinks,
    checkInTime,
    checkOutTime,
    checkInRulesAndRestrictions,
    cancellationPolicy,
    groundRulesAndRestrictions,
  } = useAppSelector((state: RootState) => state.registerListing);
  const dispatch: AppDispatch = useAppDispatch();

  useEffect(() => {
    if (!checkInTime.length || !checkOutTime.length) {
      toast({
        title: "*CheckIN and CheckOut Time is Required",
        description: `Please set ${listingName}'s check-in & check-out time.`,
        action: (
          <ToastAction className="text-primary text-nowrap" altText="Step 10">
            Step 10
          </ToastAction>
        ),
      });
      dispatch(setStep(10));
    }
    if (
      checkInRulesAndRestrictions.length < 5 ||
      cancellationPolicy.length < 5 ||
      groundRulesAndRestrictions.length < 5
    ) {
      toast({
        title: "*Please Set Rules & Policies",
        description: `Please set ${listingName}'s rules,policies & restrictions before moving ahead.`,
        action: (
          <ToastAction className="text-primary text-nowrap" altText="Step 10">
            Step 10
          </ToastAction>
        ),
      });
      dispatch(setStep(10));
    }
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tags: tags.length ? tags : [],
      socialMediaLinks: socialMediaLinks.length ? socialMediaLinks : [],
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    dispatch(setTags(data.tags));
    dispatch(setSocialMediaLinks(data.socialMediaLinks));
  };

  return (
    <div className="space-y-14 w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold flex flex-col gap-4">
          <Badge className="rounded-full w-max">Step 11</Badge>
          {listingName}'s Socials
        </h1>

        <p className="text-[14px] text-accent-foreground">
          Set your listing's social media links for guests to find you.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-8"
        >
          {/* tags */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 !max-w-[400px]">
                <FormLabel
                  htmlFor="tags"
                  className="text-[14px] text-accent-foreground"
                >
                  How would you describe your listing?
                </FormLabel>
                <FormControl>
                  <TagsInput
                    className="w-full"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-primary font-semibold" />
              </FormItem>
            )}
          />

          {/* social media links */}
          <FormField
            control={form.control}
            name="socialMediaLinks"
            render={({ field: { value, onChange } }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel
                  htmlFor="extras"
                  className="text-[14px] text-accent-foreground"
                >
                  Add Listing's Social Media Links
                </FormLabel>
                <FormControl className="flex flex-col gap-4">
                  <div>
                    {value.map((link, index) => (
                      <FormItem key={index} className="flex gap-4">
                        <Input
                          id={`link-name-${index}`}
                          placeholder="Link Name"
                          className="!text-[16px] w-[350px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                          value={link.name}
                          onChange={(e) =>
                            onChange([
                              ...value.slice(0, index),
                              { ...link, name: e.target.value },
                              ...value.slice(index + 1),
                            ])
                          }
                        />
                        <Input
                          id={`link-${index}`}
                          type="text"
                          placeholder="URL"
                          className="!text-[16px] w-[350px] !mt-0 font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                          value={link.link}
                          onChange={(e) =>
                            onChange([
                              ...value.slice(0, index),
                              {
                                ...link,
                                link: e.target.value,
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
                          onChange([...value, { name: "", link: "" }])
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

export default RenderStep11;
