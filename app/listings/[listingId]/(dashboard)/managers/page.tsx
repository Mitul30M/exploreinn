import { AddManager } from "@/components/listing-dashoard/managers/add-manager";
import { RemoveManagerBtn } from "@/components/listing-dashoard/managers/remove-manager";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getListingById,
  getListingManagers,
  isListingManager,
  isListingOwner,
} from "@/lib/actions/listings/listings";
import { getUser } from "@/lib/actions/user/user";
import { currentUser } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { ConciergeBell, Mail, Phone, UserPlus } from "lucide-react";
import { notFound } from "next/navigation";

const ListingRoomsPage = async ({
  params,
}: {
  params: Params;
  searchParams?: SearchParams;
}) => {
  const listingID = (await params).listingId;
  const listing = await getListingById(listingID);
  if (!listing) {
    return notFound();
  }
  const clerkUser = await currentUser();
  const userDbID = (clerkUser?.publicMetadata as PublicMetadataType).userDB_id;
  const user = await getUser(userDbID);
  if (!user) {
    return notFound();
  }

  const isOwner = await isListingOwner(user.id, listing.id);
  const isManager = await isListingManager(user.id, listing.id);
  if (!(isOwner || isManager)) {
    return notFound();
  }

  const managers = await getListingManagers(listing.id);

  return (
    <section className="w-full space-y-4 border-border/90 border-b-[1px]">
      {/* Personal Info */}
      <div id="hotel-owner" className="space-y-4">
        <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
          <ConciergeBell size={22} className="text-primary" />
          {listing.name}&apos;s Managers
        </h1>
        <div className="w-full px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {/* new room dialog card */}
          <section className="w-full rounded-md border-border/90 border-[1px] p-4   h-max flex flex-col gap-4 justify-center items-center">
            <AddManager listingId={listing.id} />
          </section>

          {/* manager cards */}
          {managers.map((manager) => (
            <div
              key={manager.id}
              className="rounded-md border-border/90 border-[1px] p-4 space-y-4 w-max! h-max mb-4 break-inside-avoid"
            >
              <Badge className="text-md rounded shadow-none px-3 flex items-center gap-1 justify-center w-max  font-semibold tracking-tight">
                <ConciergeBell size={16} strokeWidth={2.5} />
                Manager
              </Badge>

              <Separator className="border-border/90" />

              <div className="flex gap-4 items-center">
                <Avatar className="w-12 h-12 rounded-xl border-border/90">
                  <AvatarImage
                    src={manager.profileImg}
                    alt={manager.firstName}
                  />
                  <AvatarFallback>
                    {manager.firstName[0].toUpperCase()}
                    {manager.lastName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <p className="text-md rounded-2xl">
                  {manager.firstName} {manager.lastName}
                  <br />
                  <small className="text-[12px] font-medium text-accent-foreground/60">
                    DOB:
                    {manager.dob
                      ? format(new Date(manager.dob), "dd MMM yyyy")
                      : "Not provided"}{" "}
                    {manager.gender}
                  </small>
                </p>
              </div>

              <Separator className="border-border/90" />

              <p className="text-sm font-medium text-accent-foreground  flex flex-row items-center gap-1">
                <Phone size={16} /> {manager.phoneNo}
              </p>
              <p className="text-sm font-medium text-accent-foreground line-clamp-1 flex flex-row items-center gap-1">
                <Mail size={16} /> {manager.email}
              </p>

              <Separator className="border-border/90" />
              <RemoveManagerBtn managerId={manager.id} listingId={listing.id} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListingRoomsPage;
