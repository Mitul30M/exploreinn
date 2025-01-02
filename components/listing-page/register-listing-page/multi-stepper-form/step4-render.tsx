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
  setDescription,
  setEmail,
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


const RenderStep4 = () => {
  const { listingName, address, email, phone, description } = useAppSelector(
    (state: RootState) => state.registerListing
  );
  const dispatch: AppDispatch = useAppDispatch();

  useEffect(() => {
    if (
      address.fullAddress === "" ||
      address.city === "" ||
      address.state === "" ||
      address.country === "" ||
      address.zipCode === "" ||
      address.neighborhood === ""
    ) {
      toast({
        title: "*Address is Required",
        description: `Please set ${listingName}'s address before moving ahead.`,
        action: (
          <ToastAction className="text-primary text-nowrap" altText="Step 3">
            Step 3
          </ToastAction>
        ),
      });
      dispatch(setStep(3));
    }
  }, []);

  const FormSchema = z.object({
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    description: z.string().min(10, "Description is required"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: email,
      phone: phone,
      description: description,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    dispatch(setEmail(data.email));
    dispatch(setPhone(data.phone));
    dispatch(setDescription(data.description));
  };

  return (
    <div className="space-y-14 w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold flex flex-col gap-4">
          <Badge className="rounded-full w-max">Step 4</Badge>
          {listingName}'s Contact Details
        </h1>

        <p className="text-[14px] text-accent-foreground">
          Set contact details so exploreInn users can reach out to you.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-8"
        >
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 !max-w-[300px]">
                <FormLabel
                  htmlFor="email"
                  className="text-[14px] text-accent-foreground"
                >
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="listing@support.com"
                    className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-primary font-semibold" />
              </FormItem>
            )}
          />

          {/* Phone Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 !max-w-[300px]">
                <FormLabel className="text-[14px] text-accent-foreground">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <PhoneInput
                    placeholder="+CC XXXX XXXX XXXX"
                    {...field}
                    className="!text-[16px] font-medium valid:bg-background rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-primary font-semibold" />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel className="text-[14px] text-accent-foreground">
                  Describe your listing so users & the recommendation engine can
                  know about your listing. You can update this later as well.
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

export default RenderStep4;

export const RenderHTML = ({ content }: { content: string }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div
      className="description-content"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};


