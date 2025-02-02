"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function ListingWeekWiseBookingsGraph({
  chartData = [
    { day: "Mon", bookings: 5 },
    { day: "Tue", bookings: 3 },
    { day: "Wed", bookings: 7 },
    { day: "Thu", bookings: 4 },
    { day: "Fri", bookings: 8 },
    { day: "Sat", bookings: 2 },
    { day: "Sun", bookings: 1 },
  ],
  className,
}: {
  chartData?: {
    day: string;
    bookings: number;
  }[];
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>This Week's Bookings</CardTitle>
        <CardDescription>
          {new Date().toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}{" "}
          (Mon) to{" "}
          {new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString(
            "en-US",
            { day: "2-digit", month: "short", year: "numeric" }
          )}{" "}
          (Sun)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="day"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="bookings" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="bookings"
              layout="vertical"
              fill="hsl(var(--chart-1))"
              radius={4}
              barSize={40}
            >
              <LabelList
                dataKey="day"
                position="insideLeft"
                offset={8}
                className="fill-background"
                fontSize={12}
              />
              <LabelList
                dataKey="bookings"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>{" "}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {new Date().getDay() === 1 ? ( // Check if today is Monday
            <>Today's Total Bookings: {chartData[0]?.bookings || 0}</>
          ) : (
            (() => {
              const todayIndex = new Date().getDay(); // Get the index for today
              const yesterdayIndex = todayIndex === 0 ? 6 : todayIndex - 1; // Handle Sunday edge case
              const todayBookings = chartData[todayIndex]?.bookings || 0;
              const yesterdayBookings =
                chartData[yesterdayIndex]?.bookings || 0;

              const isTrendingUp = todayBookings > yesterdayBookings;
              const percentageChange = yesterdayBookings
                ? (
                    (Math.abs(todayBookings - yesterdayBookings) /
                      yesterdayBookings) *
                    100
                  ).toFixed(1)
                : "0.0"; // Avoid division by zero

              return isTrendingUp ? (
                <div className="flex flex-col gap-2">
                  <p>Today's bookings: {todayBookings}</p>
                  <p className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" /> by{" "}
                    {percentageChange}% today
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p>Today's bookings: {todayBookings}</p>
                  <p className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-primary" /> by{" "}
                    {percentageChange}% today
                  </p>
                </div>
              );
            })()
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
