import { Hotel } from "lucide-react";
import { isAdmin } from "@/lib/actions/user/admin/admin";
import { notFound } from "next/navigation";
import { getAllListings } from "@/lib/actions/listings/listings";
import { AdminListingsDataTable } from "@/components/admin-dashboard/listings/admin-listings-table";
import { adminDashboardListingsColumns } from "@/components/admin-dashboard/listings/admin-listings-table-columns";

const AdminListingsPage = async ({}: {
  params: Promise<{ listingId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    return notFound();
  }
  const listings = await getAllListings();

  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      <div className="space-y-4">
        <div className="text-md  flex justify-between rounded-none items-center gap-2  w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
          <h1 className="flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight">
            <Hotel size={22} className="text-primary" />
            exploreinn&apos;s Listings
          </h1>

          <p className="font-medium tracking-tight text-sm">
            Total Registered Listings: {"   "}
            <strong className="text-primary text-lg">{listings.length}</strong>
          </p>
        </div>

        {/* listings table */}
        <AdminListingsDataTable
          columns={adminDashboardListingsColumns}
          data={listings}
        />
      </div>
    </section>
  );
};

export default AdminListingsPage;
