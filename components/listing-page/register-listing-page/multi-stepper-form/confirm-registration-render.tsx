"use client";
import { useAppSelector } from "@/hooks/redux-hooks";
import { enlistListing } from "@/lib/actions/listings/listings";
import { RootState } from "@/lib/redux-store/store";
import { PartyPopper, ScrollText, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

const ConfirmNewRegistration = () => {
  const listing = useAppSelector((state: RootState) => state.registerListing);
  const router = useRouter();
  const user = useUser();
  const userDbID = (user?.user?.publicMetadata as PublicMetadataType)
    ?.userDB_id;
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setIsPending(true);

    console.log(listing)
    const response = await enlistListing(listing);
    setIsPending(false);

    if (response.type === "success") {
      toast({
        description: (
          <div className="mt-2 w-[340px] rounded-md space-y-4">
            <div className="flex flex-col gap-4 text-[14px] rounded-md">
              <p className="flex flex-row gap-2 font-semibold items-center text-primary">
                <PartyPopper /> Congratulations!
              </p>
              <p className="font-semibold">
                {listing.listingName} has been enlisted successfully!
              </p>
              <p className="text-accent-foreground/80">
                Congrats on becoming a member of ExploreInn family! Get ready to
                connect with travelers from around the world and start earning
                from your property. You can now manage your bookings, update
                your listing details, and track your bookings through your
                dashboard.
              </p>
            </div>
          </div>
        ),
      });
      router.push(`/users/${userDbID}/listings`);
    } else {
      toast({
        title: "Error",
        description: (
          <div className="mt-2 w-[340px] dark:bg-accent rounded-md bg-background border border-dashed p-4">
            <div className="text-foreground font-medium">
              {response.message}
            </div>
          </div>
        ),
      });
    }
  };

  return (
    <div className="space-y-14 w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold flex flex-col gap-4">
          <Badge className="rounded-full w-max">Register</Badge>
          Finally, Enlist {listing.listingName}
        </h1>
        <p className="text-[14px] text-accent-foreground">
          Once registered you will be able to monitor your listing and manage
          it. Users across the globe can view & make bookings on your listing.
          You will be able to manage your listing from your dashboard.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start space-y-6 mt-2"
        >
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader className="animate-spin" /> : <ScrollText />}
            {isPending ? "Enlisting..." : "Enlist"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmNewRegistration;
