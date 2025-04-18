import { UserCircle2 } from "lucide-react";

import { getUsers } from "@/lib/actions/user/user";
import { AdminUsersDataTable } from "@/components/admin-dashboard/users/admin-users-table";
import { adminDashboardUsersColumns } from "@/components/admin-dashboard/users/admin-users-table-columns";
import { isAdmin } from "@/lib/actions/user/admin/admin";
import { notFound } from "next/navigation";

const AdminUsersPage = async ({}: {
  params: Promise<{ listingId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    return notFound();
  }
  const users = await getUsers();

  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      {/*  Info */}
      <div id="hotel-owner" className="space-y-4">
        <div className="text-md  flex justify-between rounded-none items-center gap-2  w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
          <h1 className="flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight">
            <UserCircle2 size={22} className="text-primary" />
            exploreinn&apos;s Users
          </h1>

          <p className="font-medium tracking-tight text-sm">
            Total Users: {"   "}
            <strong className="text-primary text-lg">{users.length}</strong>
          </p>
        </div>

        {/* bookings table */}
        <AdminUsersDataTable
          columns={adminDashboardUsersColumns}
          data={users}
        />
      </div>
    </section>
  );
};

export default AdminUsersPage;
