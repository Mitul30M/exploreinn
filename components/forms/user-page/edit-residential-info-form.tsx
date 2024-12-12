"use client";
import { updateResidentialInfo } from "@/lib/actions/user/user";
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
import { FileCheck, HardDriveUpload, Loader, ServerCrash } from "lucide-react";
import { useActionState, useRef, startTransition, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateResidentialInfoFormSchema } from "@/lib/schemas/zod-schema";
import { User } from "@prisma/client";

const EditResidentialInfoForm = ({ user, ...props }: { user: User }) => {
  const [state, formAction] = useActionState(updateResidentialInfo, {
    message: "",
    type: undefined,
  });

  const form = useForm<z.infer<typeof updateResidentialInfoFormSchema>>({
    // mode:"onBlur",
    resolver: zodResolver(updateResidentialInfoFormSchema),
    defaultValues: {
      residence: user.address?.residence,
      street: user.address?.street,
      city: user.address?.city,
      province: user.address?.province,
      landmark: user.address?.landmark,
      postalCode: user.address?.postalCode,
      ...(state?.fields ?? {}),
    },
  });
  const residentialInfoFormRef = useRef<HTMLFormElement>(null);

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
        ref={residentialInfoFormRef}
        action={formAction}
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(() => {
            // Wrap in startTransition to fix the error
            startTransition(() => {
              const data = form.getValues();
              formAction(data);
            });
          })(evt);
        }}
        className="flex flex-col items-start space-y-6"
      >
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

export default EditResidentialInfoForm;
