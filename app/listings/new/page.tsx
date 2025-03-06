import Navbar from "@/components/discover-page/navbar/home-page-navbar";
import { Button } from "@/components/ui/button";
import { isStripeConnectedAccount } from "@/lib/actions/stripe/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { HotelIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const NewListingPage = async () => {
  const user = await currentUser();
  if (!user || !user.id) {
    redirect("/");
  }
  const isStripeConnected = await isStripeConnectedAccount({
    userId: user.id,
  });
  const userDbId = (user.publicMetadata as PublicMetadataType).userDB_id;
  if (!isStripeConnected) {
    redirect(`/users/${userDbId}/billing`);
  }

  return (
    <main className="!min-h-screen bg-background border-border/90 border-x-[1px] max-w-7xl m-auto">
      <Navbar />

      <div className="flex flex-col space-y-2 items-center w-max h-max mx-auto my-20 ">
        <h1 className="text-center mt-4">
          Grow Your Business by Listing Your Hotel on ExploreInn
        </h1>
        <Link href="/listings/register">
          <Button
            className="rounded text-foreground group hover:text-primary"
            variant={"link"}
          >
            <HotelIcon />
            Register Listing
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default NewListingPage;
