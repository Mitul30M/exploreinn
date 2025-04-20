import { BadgeDollarSign, HandCoins } from "lucide-react";
import { isAdmin } from "@/lib/actions/user/admin/admin";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";

import { Badge } from "@/components/ui/badge";

import {
  paymentStatus,
  PaymentStatusConfig,
} from "@/lib/utils/types/status/payement-status";

import {
  getAllTransactions,
  getAppMonthlyRevenueComparison,
  getAppPaymentStatusOverview,
  getAppRevenueByTimePeriod,
} from "@/lib/actions/transactions/transactions";
import { ListingYearlyRevenueCompare } from "@/components/listing-dashoard/transactions/year-revenue-compare-graph";
import ListingTodayRevenue from "@/components/listing-dashoard/transactions/today-revenue";
import ListingWeeklyRevenue from "@/components/listing-dashoard/transactions/weekly-revenue";
import ListingMonthlyRevenue from "@/components/listing-dashoard/transactions/monthl-revenue";
import ListingYearlyRevenue from "@/components/listing-dashoard/transactions/yearly-revenue";
import { adminDashboardTransactionsColumns } from "@/components/admin-dashboard/transactions/admin-transactions-table-columns";
import { AdminTransactionsDataTable } from "@/components/admin-dashboard/transactions/admin-transactions-table";

const AdminTransactionsPage = async ({}: {
  params: Promise<{ listingId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    return notFound();
  }

  // fetch all transactions
  const transactions = await getAllTransactions();

  // fetch payment status overview
  const overview = await getAppPaymentStatusOverview();
  const revenue = await getAppRevenueByTimePeriod();
  // fetch monthly revenue
  const yearlyRevenueComparison = await getAppMonthlyRevenueComparison();
  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      {/*  Info */}
      <main className="space-y-4">
        <div className="text-md  flex justify-between rounded-none items-center gap-2  w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
          <h1 className="flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight">
            <BadgeDollarSign size={22} className="text-primary" />
            exploreinn&apos;s Transactions
          </h1>

          <p className="font-medium tracking-tight text-sm">
            Net Revenue: {"   "}
            <strong className="text-primary text-lg">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(revenue.overall)}
            </strong>
          </p>
        </div>
        <div className="rounded  !w-full px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/*  revenue bar graph card */}
          <div className=" break-inside-avoid">
            <ListingYearlyRevenueCompare
              chartData={yearlyRevenueComparison}
              className="rounded-md border-border/90 border-[1px] shadow-none w-full h-max"
            />
          </div>

          {/* today's & weekly revenue */}
          <div className="space-y-4">
            {/* today's revenue */}
            <ListingTodayRevenue revenue={revenue.today} />
            {/* weekly revenue */}
            <ListingWeeklyRevenue revenue={revenue.week} />
          </div>
          {/* monthly & yearly revenue */}
          <div className="space-y-4">
            {/* monthly revenue */}
            <ListingMonthlyRevenue revenue={revenue.month} />
            {/* yearly revenue */}
            <ListingYearlyRevenue revenue={revenue.year} />
          </div>

          {/* payment status overview */}
          <div className="rounded-md border-border/90 border-[1px] p-4 space-y-4  !h-max mb-4 break-inside-avoid">
            <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight text-primary">
              <HandCoins size={20} className="text-primary" /> Transactions
              Overview
            </h1>

            <Separator className="border-border/90" />

            {Object.entries(overview).map(([key, value]) => {
              const status: PaymentStatusConfig =
                paymentStatus[key as keyof typeof paymentStatus];
              if (status) {
                return (
                  <div className="flex justify-between items-center" key={key}>
                    <Badge variant="outline" className={status.className}>
                      {status.icon && <status.icon size={16} />} {status.label}
                    </Badge>
                    <Badge variant="outline" className={status.className}>
                      {value}
                    </Badge>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
        <Separator className="border-border/90" />
        {/* transaction table */}
        <AdminTransactionsDataTable
          columns={adminDashboardTransactionsColumns}
          data={transactions}
        />
      </main>
    </section>
  );
};

export default AdminTransactionsPage;
