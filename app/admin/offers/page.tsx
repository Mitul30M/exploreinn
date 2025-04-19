import { Tag } from "lucide-react";
import { isAdmin } from "@/lib/actions/user/admin/admin";
import { notFound } from "next/navigation";
import { getExploreinnOffers } from "@/lib/actions/offers/offers";
import { AdminOffersDataTable } from "@/components/admin-dashboard/offers/admin-offers-table";
import { dashboardOffersTableColumns } from "@/components/listing-dashoard/offers/offers-table-columns";

const AdminUsersPage = async ({}: {
  params: Promise<{ listingId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    return notFound();
  }

  // fetch all offers
  const offers = await getExploreinnOffers();

  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      {/*  Info */}
      <div className="space-y-4">
        <div className="text-md rounded-none items-center gap-2  w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
          <h1 className="flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight">
            <Tag size={22} className="text-primary" />
            exploreinn&apos;s Offers
          </h1>
        </div>

        {/* offers table */}
        <AdminOffersDataTable
          columns={dashboardOffersTableColumns}
          data={offers}
        />
      </div>
    </section>
  );
};

export default AdminUsersPage;
