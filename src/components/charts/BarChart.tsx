"use client";

import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  data: any;
  type: "revenue" | "expenses";
}

export function BarChart({ data, type }: BarChartProps) {
  // Transform data for the chart
  const chartData = React.useMemo(() => {
    if (type === "revenue") {
      return [
        {
          name: "AS Revenue",
          amount: data.as_revenue.amount,
        },
        {
          name: "Auxiliary Revenue",
          amount: data.auxiliary_revenue.amount,
        },
        {
          name: "SPACES Revenue",
          amount: data.spaces_revenue.amount,
        },
      ];
    } else {
      return [
        {
          name: "General Operations",
          amount: data.general_operations.amount,
        },
        {
          name: "Programs",
          amount: data.programs.amount,
        },
        {
          name: "Personnel",
          amount: data.personnel.amount,
        },
      ];
    }
  }, [data, type]);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value)
            }
          />
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value)
            }
          />
          <Bar
            dataKey="amount"
            fill="var(--primary)"
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
} 