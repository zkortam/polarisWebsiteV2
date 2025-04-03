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
import { cn } from "@/lib/utils";

interface ChartDataItem {
  name: string;
  abbrev: string;
  value: number;
  type: "revenue" | "expense";
}

interface BarChartProps {
  data: Record<string, string | { abbrev: string }>;
  onItemClick?: (name: string) => void;
}

const BarChart: React.FC<BarChartProps> = ({ data, onItemClick }) => {
  // Safely parse numeric values with error handling
  const parseValue = (value: string): number => {
    const parsed = parseFloat(value.toString().replace(/[^0-9.-]+/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Transform data for the chart
  const chartData: ChartDataItem[] = Object.entries(data)
    .filter(([key]) => key !== "value" && key !== "Items")
    .map(([key, value]) => {
      const numValue = parseValue(value.toString());
      const type: "revenue" | "expense" = numValue >= 0 ? "revenue" : "expense";
      return {
        name: key,
        abbrev: typeof value === "object" && "abbrev" in value ? value.abbrev : key,
        value: numValue,
        type,
      };
    })
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const totalValue = chartData.reduce((acc, curr) => acc + Math.abs(curr.value), 0);
      const percentage = ((Math.abs(data.value) / totalValue) * 100).toFixed(1);
      
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg p-4 shadow-lg">
          <p className={cn(
            "font-medium",
            data.type === "revenue" ? "text-green-500" : "text-red-500"
          )}>
            {label}
          </p>
          <p className="text-foreground">
            ${Math.abs(data.value).toLocaleString()}
          </p>
          <p className="text-foreground/60 text-sm">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: ChartDataItem) => {
    if (data && data.name && onItemClick) {
      onItemClick(data.name);
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="abbrev"
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
        />
        <YAxis
          tickFormatter={(value) => `$${Math.abs(value).toLocaleString()}`}
          tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="value"
          fill="hsl(142.1 76.2% 36.3%)"
          radius={[4, 4, 0, 0]}
          onClick={handleBarClick}
          cursor="pointer"
          animationDuration={1000}
          animationBegin={0}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart; 