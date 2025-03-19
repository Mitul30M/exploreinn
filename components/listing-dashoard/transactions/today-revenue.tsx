import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import React from "react";

const ListingTodayRevenue = ({
  revenue,
  className = "rounded-md border-border/90 border-[1px] shadow-none w-full h-max space-y-2 !p-0",
}: {
  revenue: number;
  className?: string;
}) => {
  return (
    <Card className={className}>
      <CardHeader className="p-4 m-0">
        <CardTitle>Today&apos;s Revenue</CardTitle>
        <CardDescription>{format(new Date(), "dd MMMM yyyy")}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 text-3xl font-semibold text-primary m-0">
        {new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(revenue)}
      </CardContent>
    </Card>
  );
};

export default ListingTodayRevenue;
