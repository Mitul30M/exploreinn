"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

export function ListingYearlyRevenueCompare({
  chartData = [
    { month: "January", pastYear: 2500, currentYear: 3200 },
    { month: "February", pastYear: 3100, currentYear: 3800 },
    { month: "March", pastYear: 2800, currentYear: 3500 },
    { month: "April", pastYear: 3300, currentYear: 4100 },
    { month: "May", pastYear: 3600, currentYear: 4300 },
    { month: "June", pastYear: 3200, currentYear: 3900 },
    { month: "July", pastYear: 3400, currentYear: 4200 },
    { month: "August", pastYear: 3800, currentYear: 4600 },
    { month: "September", pastYear: 3500, currentYear: 4400 },
    { month: "October", pastYear: 3900, currentYear: 4800 },
    { month: "November", pastYear: 3700, currentYear: 4500 },
    { month: "December", pastYear: 4000, currentYear: 4900 },
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
        <CardTitle>Monthly Revenue</CardTitle>
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
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex flex-col gap-2 font-medium leading-none">
          {new Date().getMonth() === 0 ? (
            <>
              <p>
                Revenue this month:{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(chartData[0].currentYear)}
              </p>
              <p>
                Total Revenue this year:{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(
                  chartData.reduce((sum, data) => sum + data.currentYear, 0)
                )}
              </p>
            </>
          ) : (
            <>
              {chartData[new Date().getMonth()].currentYear >
              chartData[new Date().getMonth() - 1].currentYear ? (
                <div className="flex flex-col gap-2">
                  <p>
                    Revenue this month:{" "}
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(chartData[new Date().getMonth()].currentYear)}
                  </p>
                  <p className="flex items-center gap-2 ">
                    <TrendingUp className="h-4 w-4 text-green-500" /> up by{" "}
                    {(
                      ((chartData[new Date().getMonth()].currentYear -
                        chartData[new Date().getMonth() - 1].currentYear) /
                        chartData[new Date().getMonth() - 1].currentYear) *
                      100
                    ).toFixed(1)}
                    % this month
                  </p>
                  <p>
                    Avg Revenue this year:{" "}
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(
                      chartData.reduce(
                        (sum, data) => sum + data.currentYear,
                        0
                      ) / 12
                    )}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p>
                    Revenue this month:{" "}
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(chartData[new Date().getMonth()].currentYear)}
                  </p>
                  <p className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-primary inline" />{" "}
                    down by{" "}
                    {(
                      ((chartData[new Date().getMonth() - 1].currentYear -
                        chartData[new Date().getMonth()].currentYear) /
                        chartData[new Date().getMonth() - 1].currentYear) *
                      100
                    ).toFixed(1)}
                    % this month
                  </p>
                  <p>
                    Avg Revenue this year:{" "}
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(
                      chartData.reduce(
                        (sum, data) => sum + data.currentYear,
                        0
                      ) / 12
                    )}
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
