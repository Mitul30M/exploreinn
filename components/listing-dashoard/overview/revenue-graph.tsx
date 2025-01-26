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
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function ListingMonthWiseRevenueGraph({
  chartData,
  className,
}: {
  chartData: {
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
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="revenue" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="revenue"
              layout="vertical"
              fill="hsl(var(--chart-1))"
              radius={4}
              barSize={50}
            >
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label] "
                fontSize={12}
              />
              <LabelList
                dataKey="revenue"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
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
              {chartData[chartData.length - 1].revenue >
              chartData[chartData.length - 2].revenue ? (
                <div className="flex flex-col gap-2">
                  <p>
                    Total Revenue this month:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(chartData[new Date().getMonth()].revenue)}
                  </p>
                  <p className="flex items-center gap-2">
                    Trending up by{" "}
                    {(
                      ((chartData[chartData.length - 1].revenue -
                        chartData[chartData.length - 2].revenue) /
                        chartData[chartData.length - 2].revenue) *
                      100
                    ).toFixed(1)}
                    % this month{" "}
                    <TrendingUp className="h-4 w-4 text-green-500" />
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
                    Trending down by{" "}
                    {(
                      ((chartData[chartData.length - 2].revenue -
                        chartData[chartData.length - 1].revenue) /
                        chartData[chartData.length - 2].revenue) *
                      100
                    ).toFixed(1)}
                    % this month{" "}
                    <TrendingDown className="h-4 w-4 text-primary" />
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
