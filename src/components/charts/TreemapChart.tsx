"use client";

import React from "react";
import {
  Treemap,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TreemapChartProps {
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

const TreemapChart: React.FC<TreemapChartProps> = ({ data, onItemClick }) => {
  // Safely parse numeric values with error handling
  const parseValue = (value: string): number => {
    const parsed = parseFloat(value.toString().replace(/[^0-9.-]+/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Transform data for the treemap
  const chartData = Object.entries(data)
    .filter(([key]) => key !== "value" && key !== "Items")
    .map(([key, value]) => ({
      name: key,
      abbrev: value.abbrev || key,
      size: parseValue(value),
    }))
    .sort((a, b) => b.size - a.size);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const totalValue = chartData.reduce((acc, curr) => acc + curr.size, 0);
      const percentage = ((payload[0].size / totalValue) * 100).toFixed(1);
      
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg p-4 shadow-lg">
          <p className="text-primary font-medium">{payload[0].name}</p>
          <p className="text-foreground">${payload[0].size.toLocaleString()}</p>
          <p className="text-foreground/60 text-sm">{percentage}% of total</p>
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
        fill="hsl(var(--primary))"
        label={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
        content={<CustomizedContent onItemClick={onItemClick} />}
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
  payload?: any;
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
  const background = COLORS[Math.floor((index || 0) % COLORS.length)];
  const isLeaf = depth === 1;

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