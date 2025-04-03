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

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  // Transform data for the chart
  const chartData = Object.entries(data)
    .filter(([key]) => key !== "value" && key !== "Items")
    .map(([key, value]) => ({
      name: key,
      value: parseFloat(value.toString().replace(/[^0-9.-]+/g, "")),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Show top 8 items

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
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `$${value.toLocaleString()}`}
          labelStyle={{ fontSize: 12 }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart; 