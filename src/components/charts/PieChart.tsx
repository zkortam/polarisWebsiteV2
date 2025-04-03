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
  "hsl(var(--primary))",
  "hsl(var(--primary-foreground))",
  "hsl(var(--secondary))",
  "hsl(var(--secondary-foreground))",
  "hsl(var(--accent))",
  "hsl(var(--accent-foreground))",
  "hsl(var(--destructive))",
  "hsl(var(--destructive-foreground))",
];

const PieChart: React.FC<PieChartProps> = ({ data, onItemClick }) => {
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
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Show top 8 items

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);
      const percentage = ((payload[0].value / totalValue) * 100).toFixed(1);
      
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg p-4 shadow-lg">
          <p className="text-primary font-medium">{payload[0].name}</p>
          <p className="text-foreground">${payload[0].value.toLocaleString()}</p>
          <p className="text-foreground/60 text-sm">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const handlePieClick = (data: any) => {
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
          fill="hsl(var(--primary))"
          dataKey="value"
          onClick={handlePieClick}
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