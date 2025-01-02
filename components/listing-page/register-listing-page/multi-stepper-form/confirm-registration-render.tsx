"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { enlistListing } from "@/lib/actions/listings/listings";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import { LayoutDashboard, PartyPopper, ScrollText } from "lucide-react";
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
import {
  RegisterListing,
  RegisterListingSchema,
} from "@/lib/redux-store/slices/register-listing-slice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ConfirmNewRegistration = () => {
  const listing = useAppSelector((state: RootState) => state.registerListing);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(enlistListing, {
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
      ...(state?.fields ?? {}),
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    console.log(state);
    if (state.type === "success") {
      toast({
        // title: `${listing.listingName} has been enlisted successfully.`,
        description: (
          <div className="mt-2 w-[340px] rounded-md   space-y-4">
            <div className="flex flex-col gap-4  text-[14px]   rounded-md">
              <p className="flex flex-row gap-2 font-semibold items-center text-primary">
                <PartyPopper />
                Congratulations!
              </p>

              <p className=" font-semibold ">
                {listing.listingName} has been enlisted successfully!
              </p>
              <p className="text-accent-foreground/80">
                Congrats on becoming a member of exploreInn family! Get ready to
                connect with travelers from around the world and start earning
                from your property. You can now manage your bookings, update
                your listing details, and track your bookings through your
                dashboard.
              </p>
            </div>
          </div>
        ),
      });
      router.push('/')
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
          Finally, Enlist {listing.listingName}
        </h1>
        <p className="text-[14px] text-accent-foreground">
          Once registered you will be able to monitor your listing and manage
          it. User's across the globe can view & make bookings on your listing.
          You will be able to manage your listing from your dashboard.
        </p>

        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={(evt) => {
              evt.preventDefault();
              startTransition(async () => {
                await formAction(listing);
              });
            }}
            className="flex flex-col items-start space-y-6 mt-2"
          >
            {/* form fields */}

            <Button type="submit" disabled={isPending} className="">
              {isPending ? <Loader className="animate-spin" /> : <ScrollText />}
              {isPending ? "Enlisting..." : "Enlist"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ConfirmNewRegistration;
