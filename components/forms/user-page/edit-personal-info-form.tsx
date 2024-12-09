"use client";
import { updatePersonalInfo } from "@/lib/actions/user/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useFormStatus } from "react-dom";
import { FileCheck, HardDriveUpload, Loader, ServerCrash } from "lucide-react";
import { useActionState, useRef, startTransition, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { countries } from "@/lib/utils/country/countries";

const updatePersonalInfoFormSchema = z.object({
 
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select your gender.",
  }),
  country: z.string({
    required_error: "Please select your country.",
  }),
});

const EditPersonalInfoForm = () => {
  const [state, formAction] = useActionState(updatePersonalInfo, {
    message: "",
    type: undefined,
  });

  const form = useForm<z.infer<typeof updatePersonalInfoFormSchema>>({
    // mode:"onBlur",
    resolver: zodResolver(updatePersonalInfoFormSchema),
    defaultValues: {
      ...(state?.fields ?? {}),
    },
  });
  const formRef = useRef<HTMLFormElement>(null);

  // Use useEffect to handle toast side effects
  useEffect(() => {
    console.log(state);
    if (state.type === "success") {
      toast({
        title: state.message,
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-background border border-dashed p-4">
            <code className="text-foreground font-medium">
              {state.fields && JSON.stringify(state.fields, null, 2)}
            </code>
          </pre>
        ),
      });
    } else if (state.type === "error") {
      console.log(state);
      toast({
        title: state.message,
        description: (
          <div className="mt-2 w-[340px] dark:bg-accent rounded-md bg-background border border-dashed p-4">
            <div className="text-foreground font-medium">
              {state.issues?.length &&
                state.issues.map((issue) => (
                  <p key={issue} className="mb-2 last:mb-0 text-primary">
                    {issue}
                  </p>
                ))}
            </div>
          </div>
        ),
      });
    }
  }, [state]);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(() => {
            // Wrap in startTransition to fix the error
            startTransition(() => {
              const formData = new FormData(formRef.current!);
              // Convert date to ISO string before appending
              const dobField = form.getValues("dob");
              if (dobField instanceof Date) {
                formData.set("dob", dobField.toISOString());
              }
              const data = form.getValues();
              formAction(data);
            });
          })(evt);
        }}
        className="flex flex-col items-start space-y-6"
      >

        {/* date of birth */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] pl-3 text-left font-normal rounded-lg"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    captionLayout="dropdown-buttons"
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    fromYear={1960}
                    toYear={2024}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-[280px] text-left font-normal rounded-lg">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Your gender helps us provide a personalized experience.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* country */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Legal Citizen of</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-[280px] text-left font-normal rounded-lg">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your Country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <ScrollArea className="h-72">
                    {countries.map((country) => (
                      <SelectItem key={country.iso3} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              <FormDescription>
                Select your country of residence.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="self-end flex gap-4 items-center">
          {state?.message !== "" && state.type && (
            <Badge
              variant={"outline"}
              className={
                "font-medium border-none !w-full !h-max py-2 px-3 flex items-center gap-2 " +
                (state.type === "success"
                  ? "bg-emerald-100/50 border-none text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100"
                  : "") +
                (state.type === "error"
                  ? "bg-red-100/50 border-none text-red-950 dark:bg-red-900/50 dark:text-red-100 "
                  : "")
              }
            >
              {state.type === "success" && <FileCheck size={16} />}
              {state.type === "error" && <ServerCrash size={16} />}
              {state.message}
            </Badge>
          )}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="self-end rounded-full"
          >
            {form.formState.isSubmitting ? (
              <Loader className="animate-spin" />
            ) : (
              <HardDriveUpload />
            )}
            {form.formState.isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditPersonalInfoForm;
