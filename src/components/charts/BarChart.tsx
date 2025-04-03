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
  data: Record<string, string>;
  onItemClick?: (name: string) => void;
}

const BarChart: React.FC<BarChartProps> = ({ data, onItemClick }) => {
  // Transform data for the chart
  const chartData = Object.entries(data)
    .filter(([key]) => key !== "value" && key !== "Items")
    .map(([key, value]) => ({
      name: key,
      abbrev: value.abbrev || key,
      value: parseFloat(value.toString().replace(/[^0-9.-]+/g, "")),
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg p-4 shadow-lg">
          <p className="text-primary font-medium">{label}</p>
          <p className="text-foreground">${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="abbrev"
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          tick={{ fontSize: 12, fill: "var(--foreground)" }}
        />
        <YAxis
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          tick={{ fontSize: 12, fill: "var(--foreground)" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="value"
          fill="var(--primary)"
          radius={[4, 4, 0, 0]}
          onClick={(data) => onItemClick?.(data.name)}
          cursor="pointer"
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart; 