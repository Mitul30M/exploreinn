import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { enlistListing } from "@/lib/actions/listings/listings";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import { ScrollText } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
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
import { RegisterListingSchema } from "@/lib/redux-store/slices/register-listing-slice";
import { Button } from "@/components/ui/button";

const ConfirmNewRegistration = () => {
  const listing = useAppSelector((state: RootState) => state.registerListing);

  const [state, formAction] = useActionState(enlistListing, {
    message: "",
    type: undefined,
  });

  const form = useForm<z.infer<typeof RegisterListingSchema>>({
    // mode:"onBlur",
    resolver: zodResolver(RegisterListingSchema),
    defaultValues: {
      ...listing,
      geometry: {
        type: "Point",
        coordinates: [
          listing.geometry!.coordinates[0],
          listing.geometry!.coordinates[1],
        ],
      },
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    console.log(state);
    if (state.type === "success") {
      toast({
        title: state.message,
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-background border border-dashed p-4">
            <code className="text-foreground font-medium">
              1 New Listing Enlisted
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
    <div className="space-y-14 w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold  flex flex-col gap-4">
          <Badge className="rounded-full w-max">Register</Badge>
          Finally, Let's Register {listing.listingName}
        </h1>
        <p className="text-[14px] text-accent-foreground">
          Once registered you will be able to monitor your listing and manage
          it. User's across the globe can view & make bookings on your listing.
          You will be able to manage your listing from your dashboard.
        </p>

        {/* registration form */}

        <form
          ref={formRef}
          onSubmit={(evt) => {
            evt.preventDefault();
            form.handleSubmit(async (data) => {
              try {
                await formAction(data);
                toast({
                  title: "Success",
                  description: "Your listing has been registered successfully.",
                });
              } catch (error: any) {
                toast({
                  title: "Error",
                  description: error.message,
                });
              }
            })(evt);
          }}
          className="flex flex-col items-start space-y-6"
        >
          {/* form fields */}
          
          <div className=" flex gap-4 items-center">
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
              className=""
            >
              {form.formState.isSubmitting ? (
                <Loader className="animate-spin" />
              ) : (
                <ScrollText />
              )}
              {form.formState.isSubmitting ? "Enlisting..." : "Enlist"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmNewRegistration;
