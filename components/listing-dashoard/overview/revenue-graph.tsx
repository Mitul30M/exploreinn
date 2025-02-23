"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
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
import { ScrollArea } from "@/components/ui/scroll-area";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function ListingMonthWiseRevenueGraph({
  chartData = [
    { month: "January", revenue: 1250.5 },
    { month: "February", revenue: 980.75 },
    { month: "March", revenue: 1575.25 },
    { month: "April", revenue: 2100.0 },
    { month: "May", revenue: 1890.5 },
    { month: "June", revenue: 2450.75 },
    { month: "July", revenue: 3100.25 },
    { month: "August", revenue: 2875.5 },
    { month: "September", revenue: 2200.0 },
    { month: "October", revenue: 1950.75 },
    { month: "November", revenue: 1725.25 },
    { month: "December", revenue: 2950.5 },
  ],
  className,
}: {
  chartData?: {
    month: string;
    revenue: number;
  }[];
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>
          January - December {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <ScrollArea>
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
                dataKey="revenue"
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
            </LineChart>
          </ChartContainer>
        </CardContent>
      </ScrollArea>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {new Date().getMonth() === 0 ? (
            <>
              Total Revenue this month:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(chartData[0].revenue)}
            </>
          ) : (
            <>
              {chartData[new Date().getMonth()].revenue >
              chartData[new Date().getMonth() - 1].revenue ? (
                <div className="flex flex-col gap-2">
                  <p>
                    Total Revenue this month:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(chartData[new Date().getMonth()].revenue)}
                  </p>
                  <p className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" /> by
                    {(
                      ((chartData[new Date().getMonth()].revenue -
                        chartData[new Date().getMonth() - 1].revenue) /
                        chartData[new Date().getMonth() - 1].revenue) *
                      100
                    ).toFixed(1)}
                    % this month
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p>
                    Total Revenue this month:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(chartData[new Date().getMonth()].revenue)}
                  </p>
                  <p className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500" /> by{" "}
                    {(
                      ((chartData[new Date().getMonth() - 1].revenue -
                        chartData[new Date().getMonth()].revenue) /
                        chartData[new Date().getMonth() - 1].revenue) *
                      100
                    ).toFixed(1)}
                    % this month
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
