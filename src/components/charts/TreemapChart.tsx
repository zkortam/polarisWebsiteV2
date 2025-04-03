"use client";

import React from "react";
import {
  Treemap,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface ChartDataItem {
  name: string;
  abbrev: string;
  size: number;
  type: "revenue" | "expense";
}

interface TreemapChartProps {
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

const TreemapChart: React.FC<TreemapChartProps> = ({ data, onItemClick }) => {
  // Safely parse numeric values with error handling
  const parseValue = (value: string): number => {
    const parsed = parseFloat(value.toString().replace(/[^0-9.-]+/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Transform data for the treemap
  const chartData: ChartDataItem[] = Object.entries(data)
    .filter(([key]) => key !== "value" && key !== "Items")
    .map(([key, value]) => {
      const numValue = parseValue(value.toString());
      const type: "revenue" | "expense" = numValue >= 0 ? "revenue" : "expense";
      return {
        name: key,
        abbrev: typeof value === "object" && "abbrev" in value ? value.abbrev : key,
        size: Math.abs(numValue),
        type,
      };
    })
    .sort((a, b) => b.size - a.size);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const totalValue = chartData.reduce((acc, curr) => acc + curr.size, 0);
      const percentage = ((data.size / totalValue) * 100).toFixed(1);
      
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg p-4 shadow-lg">
          <p className={cn(
            "font-medium",
            data.type === "revenue" ? "text-green-500" : "text-red-500"
          )}>
            {data.name}
          </p>
          <p className="text-foreground">
            ${data.size.toLocaleString()}
          </p>
          <p className="text-foreground/60 text-sm">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={chartData}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke="hsl(var(--border))"
        content={<CustomizedContent onItemClick={onItemClick} />}
        animationDuration={1000}
        animationBegin={0}
      >
        <Tooltip content={<CustomTooltip />} />
      </Treemap>
    </ResponsiveContainer>
  );
};

interface CustomizedContentProps {
  root?: any;
  depth?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  payload?: ChartDataItem;
  rank?: number;
  name?: string;
  onItemClick?: (name: string) => void;
}

const CustomizedContent: React.FC<CustomizedContentProps> = ({
  root,
  depth,
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  index,
  payload,
  rank,
  name,
  onItemClick,
}) => {
  const isLeaf = depth === 1;
  const type = payload?.type || "revenue";
  const background = COLORS[type][Math.floor((index || 0) % COLORS[type].length)];

  const handleClick = () => {
    if (name && onItemClick) {
      onItemClick(name);
    }
  };

  if (isLeaf) {
    return (
      <g onClick={handleClick} style={{ cursor: "pointer" }}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={background}
          stroke="hsl(var(--border))"
        />
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="hsl(var(--foreground))"
          fontSize={12}
        >
          {name}
        </text>
      </g>
    );
  }

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={background}
        stroke="hsl(var(--border))"
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        fontSize={12}
      >
        {name}
      </text>
    </g>
  );
};

export default TreemapChart; 