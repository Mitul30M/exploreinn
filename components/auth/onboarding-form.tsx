"use client";
import { onboardUser } from "@/lib/actions/user/user";
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
import { Loader } from "lucide-react";
import { useActionState, useRef, startTransition, useEffect } from "react";
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
import { UserOnboardingFormSchema } from "@/lib/schemas/zod-schema";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { ToastAction } from "../ui/toast";
import Image from "next/image";

const UserOnboardingForm = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(onboardUser, {
    message: "",
    type: undefined,
  });

  const form = useForm<z.infer<typeof UserOnboardingFormSchema>>({
    // mode:"onBlur",
    resolver: zodResolver(UserOnboardingFormSchema),
    defaultValues: {
      city: "",
      landmark: "",
      province: "",
      postalCode: "",
      residence: "",
      street: "",
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
        action: (
          <ToastAction
            // variant="outline"
            altText="Proceed"
            className="w-full sm:w-auto text-primary py-3"
            onClick={() => {
              router.push("/");
            }}
          >
            {/* <Heart size={16} className="text-primary" /> */}
            <Image
              src="/logos/logo-rose.svg"
              alt="Exploreinn"
              height={26}
              width={26}
            />
            Proceed
          </ToastAction>
        ),
      });
      router.push("/");
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
        // action={formAction}
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

        {/* residence */}
        <FormField
          control={form.control}
          name="residence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flat No., Floor No., Building Name</FormLabel>
              <FormControl>
                <Input
                  className="rounded-lg w-[280px]"
                  placeholder="101, 1st Floor, Dream Apartments"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* street */}
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Name</FormLabel>
              <FormControl>
                <Input
                  className="rounded-lg w-[280px]"
                  placeholder="Saint Merry's Rd."
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* landmark */}
        <FormField
          control={form.control}
          name="landmark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Landmarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Opposite XYZ Bank, near XYZ Mall"
                  className="resize-none rounded-lg w-[280px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Landmark field is optional.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* city */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  className="rounded-lg w-[280px]"
                  placeholder="Manhattan"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* province */}
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State/Province</FormLabel>
              <FormControl>
                <Input
                  className="rounded-lg w-[280px]"
                  placeholder="New York"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* postal code */}
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code/ZIP Code</FormLabel>
              <FormControl>
                <Input
                  className="rounded-lg w-[280px]"
                  placeholder="331231"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center w-full">
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-full w-full"
          >
            {isPending && <Loader className="animate-spin" />}
            {isPending ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserOnboardingForm;
