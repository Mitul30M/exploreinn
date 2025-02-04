import { DoorOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getListingById } from "@/lib/actions/listings/listings";
import {
  getListingTransactions,
  getMonthlyRevenue,
  getMonthlyRevenueComparison,
  getPaymentStatusOverview,
  getRevenueByTimePeriod,
} from "@/lib/actions/transactions/transactions";
import { HandCoins } from "lucide-react";
import { notFound } from "next/navigation";
import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { format } from "date-fns";
import ListingTodayRevenue from "@/components/listing-dashoard/transactions/today-revenue";
import ListingWeeklyRevenue from "@/components/listing-dashoard/transactions/weekly-revenue";
import ListingMonthlyRevenue from "@/components/listing-dashoard/transactions/monthl-revenue";
import ListingYearlyRevenue from "@/components/listing-dashoard/transactions/yearly-revenue";
import { ListingMonthWiseRevenueGraph } from "@/components/listing-dashoard/overview/revenue-graph";
import { ListingYearlyRevenueCompare } from "@/components/listing-dashoard/transactions/year-revenue-compare-graph";
import { PaymentStatusConfig } from "@/lib/utils/types/status/payement-status";
import { paymentStatus } from "@/lib/utils/types/status/payement-status";
import { Badge } from "@/components/ui/badge";
import { ListingTransactionsDataTable } from "@/components/listing-dashoard/transactions/transactions-dashboard-table";
import {
  dashboardTransactionsTableColumns,
  TDashboardTransactionsColumns,
} from "@/components/listing-dashoard/transactions/transactions-dashboard-table-columns";

const ListingTransactionsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ listingId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const listing = await getListingById((await params).listingId);
  if (!listing) {
    return notFound();
  }

  // fetch all transactions
  const transactions = await getListingTransactions(listing.id);

  // fetch payment status overview
  const overview = await getPaymentStatusOverview(listing.id);
  const revenue = await getRevenueByTimePeriod(listing.id);
  // fetch monthly revenue
  const yearlyRevenueComparison = await getMonthlyRevenueComparison(listing.id);

  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      {/*  Info */}
      <div id="hotel-owner" className="space-y-4">
        <div className="text-md  flex justify-between rounded-none items-center gap-2  w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
          <h1 className="flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight">
            <HandCoins size={22} className="text-primary" />
            {listing.name}'s Transactions
          </h1>

          <p className="font-medium tracking-tight text-sm">
            Net Revenue: {"   "}
            <strong className="text-primary text-lg">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(revenue.overall)}
            </strong>
          </p>
        </div>

        <div className="rounded  !w-full px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* hotel revenue bar graph card */}
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

        {/* transactions table */}
        <ListingTransactionsDataTable
          columns={dashboardTransactionsTableColumns}
          data={transactions as TDashboardTransactionsColumns[]}
        />
      </div>
    </section>
  );
};

export default ListingTransactionsPage;
