"use client";

import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PieChartProps {
  data: Record<string, string>;
  onItemClick?: (name: string) => void;
}

const COLORS = [
  "var(--primary)",
  "var(--primary-foreground)",
  "var(--secondary)",
  "var(--secondary-foreground)",
  "var(--accent)",
  "var(--accent-foreground)",
  "var(--destructive)",
  "var(--destructive-foreground)",
];

const PieChart: React.FC<PieChartProps> = ({ data, onItemClick }) => {
  // Transform data for the chart
  const chartData = Object.entries(data)
    .filter(([key]) => key !== "value" && key !== "Items")
    .map(([key, value]) => ({
      name: key,
      abbrev: value.abbrev || key,
      value: parseFloat(value.toString().replace(/[^0-9.-]+/g, "")),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Show top 8 items

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg p-4 shadow-lg">
          <p className="text-primary font-medium">{payload[0].name}</p>
          <p className="text-foreground">${payload[0].value.toLocaleString()}</p>
          <p className="text-foreground/60 text-sm">
            {((payload[0].value / chartData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
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
          fill="#8884d8"
          dataKey="value"
          onClick={(data) => onItemClick?.(data.name)}
          cursor="pointer"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart; 