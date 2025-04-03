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
  // Safely parse numeric values with error handling
  const parseValue = (value: string): number => {
    const parsed = parseFloat(value.toString().replace(/[^0-9.-]+/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Transform data for the chart
  const chartData = Object.entries(data)
    .filter(([key]) => key !== "value" && key !== "Items")
    .map(([key, value]) => ({
      name: key,
      abbrev: value.abbrev || key,
      value: parseValue(value),
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);
      const percentage = ((payload[0].value / totalValue) * 100).toFixed(1);
      
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg p-4 shadow-lg">
          <p className="text-primary font-medium">{label}</p>
          <p className="text-foreground">${payload[0].value.toLocaleString()}</p>
          <p className="text-foreground/60 text-sm">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: any) => {
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
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="value"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          onClick={handleBarClick}
          cursor="pointer"
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart; 