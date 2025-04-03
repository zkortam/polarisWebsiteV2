"use client";

import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
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

interface PieChartProps {
  data: Record<string, string | { abbrev: string }>;
  onItemClick?: (name: string) => void;
}

const COLORS = {
  revenue: [
    "hsl(142.1 76.2% 36.3%)", // Green
    "hsl(142.1 76.2% 46.3%)",
    "hsl(142.1 76.2% 56.3%)",
  ],
  expense: [
    "hsl(346.8 77.2% 49.8%)", // Red
    "hsl(346.8 77.2% 59.8%)",
    "hsl(346.8 77.2% 69.8%)",
  ],
} as const;

const PieChart: React.FC<PieChartProps> = ({ data, onItemClick }) => {
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
        value: Math.abs(numValue),
        type,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Show top 8 items

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);
      const percentage = ((data.value / totalValue) * 100).toFixed(1);
      
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg p-4 shadow-lg">
          <p className={cn(
            "font-medium",
            data.type === "revenue" ? "text-green-500" : "text-red-500"
          )}>
            {data.name}
          </p>
          <p className="text-foreground">
            ${data.value.toLocaleString()}
          </p>
          <p className="text-foreground/60 text-sm">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const handlePieClick = (data: ChartDataItem) => {
    if (data && data.name && onItemClick) {
      onItemClick(data.name);
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          dataKey="value"
          onClick={handlePieClick}
          cursor="pointer"
          animationDuration={1000}
          animationBegin={0}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.type][index % COLORS[entry.type].length]}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart; 