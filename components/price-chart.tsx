"use client";

import { useEffect, useState } from "react";
import { getProductPriceHistory } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/card";
import { ChartConfig, ChartContainer } from "./ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type PriceChartProps = {
  productId: string;
};

type HistoryItem = {
  checked_at: string;
  price: number;
};

const chartConfig = {
  price: {
    label: "Price",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export const PriceChart = ({ productId }: PriceChartProps) => {
  const [productHistory, setProductHistory] = useState<Array<HistoryItem>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function getPriceHistory() {
      try {
        setIsLoading(true);
        const data = await getProductPriceHistory(productId);

        const updated_data = data.map((history) => ({
          checked_at: new Date(history.checked_at).toLocaleDateString(),
          price: parseFloat(history.price),
        }));

        setProductHistory(updated_data);
      } catch (error) {
        toast.error("Failed to get product history!");
      } finally {
        setIsLoading(false);
      }
    }

    getPriceHistory();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-8 text-gray-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading chart...
      </div>
    );
  }

  return (
    <Card className="flex flex-1">
      <CardContent>
        <ChartContainer className="h-50 w-full" config={chartConfig}>
          <LineChart accessibilityLayer data={productHistory}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="checked_at"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              minTickGap={32}
              stroke="#9ca3af"
            />

            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />

            <Line
              dataKey={"price"}
              type="monotone"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
