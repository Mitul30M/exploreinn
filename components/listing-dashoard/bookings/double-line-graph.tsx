"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
const chartConfig = {
  pastYear: {
    label: "Past Year",
    color: "hsl(var(--chart-2))",
  },
  currentYear: {
    label: "Current Year",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function ListingMonthWiseYearlyBookingsGraph({
  chartData = [
    { month: "January", pastYear: 3, currentYear: 5 },
    { month: "February", pastYear: 2, currentYear: 4 },
    { month: "March", pastYear: 4, currentYear: 6 },
    { month: "April", pastYear: 1, currentYear: 3 },
    { month: "May", pastYear: 5, currentYear: 7 },
    { month: "June", pastYear: 2, currentYear: 4 },
    { month: "July", pastYear: 3, currentYear: 5 },
    { month: "August", pastYear: 4, currentYear: 6 },
    { month: "September", pastYear: 2, currentYear: 4 },
    { month: "October", pastYear: 3, currentYear: 5 },
    { month: "November", pastYear: 1, currentYear: 3 },
    { month: "December", pastYear: 5, currentYear: 7 },
  ],
  className,
}: {
  chartData?: {
    month: string;
    pastYear: number;
    currentYear: number;
  }[];
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Monthly Bookings</CardTitle>
        <CardDescription>
          January - December {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="currentYear"
              type="natural"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{
                fill: "hsl(var(--background))",
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="pastYear"
              type="natural"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{
                fill: "hsl(var(--background))",
              }}
              activeDot={{
                r: 6,
              }}
            />{" "}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex flex-col gap-2 font-medium leading-none">
          {new Date().getMonth() === 0 ? (
            <>
              <p>Total Bookings this month: {chartData[0].currentYear}</p>
              <p>
                Total Bookings this year:{" "}
                {chartData.reduce((sum, data) => sum + data.currentYear, 0)}
              </p>
            </>
          ) : (
            <>
              {chartData[chartData.length - 1].currentYear >
              chartData[chartData.length - 2].currentYear ? (
                <div className="flex flex-col gap-2">
                  <p>Total Bookings this month: {chartData[0].currentYear}</p>
                  <p className="flex items-center gap-2">
                    Trending up by{" "}
                    {(
                      ((chartData[chartData.length - 1].currentYear -
                        chartData[chartData.length - 2].currentYear) /
                        chartData[chartData.length - 2].currentYear) *
                      100
                    ).toFixed(1)}
                    % this month{" "}
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </p>
                  <p>
                    Total Bookings this year:{" "}
                    {chartData.reduce((sum, data) => sum + data.currentYear, 0)}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p>
                    Total Bookings this month:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(chartData[new Date().getMonth()].currentYear)}
                  </p>
                  <p className="flex items-center gap-2">
                    Trending down by{" "}
                    {(
                      ((chartData[chartData.length - 2].currentYear -
                        chartData[chartData.length - 1].currentYear) /
                        chartData[chartData.length - 2].currentYear) *
                      100
                    ).toFixed(1)}
                    % this month{" "}
                    <TrendingDown className="h-4 w-4 text-primary" />
                  </p>
                  <p>
                    Total Bookings this year:{" "}
                    {chartData.reduce((sum, data) => sum + data.currentYear, 0)}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
