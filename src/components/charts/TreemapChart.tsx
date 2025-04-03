"use client";

import React from "react";
import {
  Treemap,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface TreemapChartProps {
  data: Record<string, any>;
  onItemClick?: (name: string) => void;
}

interface TreemapDataItem {
  name: string;
  value: number;
  children: TreemapDataItem[];
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

const TreemapChart: React.FC<TreemapChartProps> = ({ data, onItemClick }) => {
  // Safely parse numeric values with error handling
  const parseValue = (value: string | string[]): number => {
    if (Array.isArray(value)) {
      return value.reduce((acc, curr) => acc + parseValue(curr), 0);
    }
    const parsed = parseFloat(value.toString().replace(/[^0-9.-]+/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Transform data for the chart
  const chartData: TreemapDataItem[] = Object.entries(data)
    .filter(([key]) => key !== "value" && key !== "Items")
    .map(([key, value]) => {
      let numValue = 0;
      let children: TreemapDataItem[] = [];

      if (typeof value === "object" && value !== null) {
        if ("value" in value) {
          numValue = parseValue(value.value);
        } else if ("Items" in value) {
          // Process subcategories
          children = Object.entries(value.Items).map(([subKey, subValue]) => ({
            name: subKey,
            value: typeof subValue === "string" || Array.isArray(subValue)
              ? parseValue(subValue)
              : 0,
            children: [],
          }));
          // Sum up all items for the parent category
          numValue = children.reduce((acc, child) => acc + child.value, 0);
        }
      } else {
        numValue = parseValue(value);
      }

      return {
        name: key,
        value: Math.abs(numValue),
        children,
      };
    })
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);
      const percentage = ((data.value / totalValue) * 100).toFixed(1);
      
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg p-4 shadow-lg">
          <p className="font-medium text-foreground">
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

  const CustomizedContent = (props: any) => {
    const { x, y, width, height, name, value, root } = props;
    const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);
    const percentage = ((value / totalValue) * 100).toFixed(1);

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={COLORS[props.index % COLORS.length]}
          stroke="hsl(var(--border))"
          strokeWidth={1}
          onClick={() => onItemClick?.(name)}
          style={{ cursor: "pointer" }}
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
        <text
          x={x + width / 2}
          y={y + height / 2 + 16}
          textAnchor="middle"
          fill="hsl(var(--foreground))"
          fontSize={10}
        >
          {percentage}%
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={chartData}
        dataKey="value"
        aspectRatio={1}
        stroke="hsl(var(--border))"
        fill="hsl(var(--primary))"
        content={<CustomizedContent />}
      >
        <Tooltip content={<CustomTooltip />} />
      </Treemap>
    </ResponsiveContainer>
  );
};

export default TreemapChart; 