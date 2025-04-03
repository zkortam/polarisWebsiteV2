"use client";

import React from "react";
import {
  Treemap,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TreemapChartProps {
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

const TreemapChart: React.FC<TreemapChartProps> = ({ data }) => {
  // Transform data for the treemap
  const chartData = Object.entries(data)
    .filter(([key]) => key !== "value" && key !== "Items")
    .map(([key, value]) => ({
      name: key,
      size: parseFloat(value.toString().replace(/[^0-9.-]+/g, "")),
    }))
    .sort((a, b) => b.size - a.size);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={chartData}
        dataKey="size"
        ratio={4 / 3}
        stroke="#fff"
        fill="var(--primary)"
        label={{ fill: "var(--foreground)", fontSize: 12 }}
        content={<CustomizedContent />}
      >
        <Tooltip
          formatter={(value: number) => `$${value.toLocaleString()}`}
          labelStyle={{ fontSize: 12 }}
        />
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
}

const CustomizedContent: React.FC<CustomizedContentProps> = ({
  root,
  depth,
  x,
  y,
  width,
  height,
  index,
  payload,
  rank,
  name,
}) => {
  const background = COLORS[Math.floor((index || 0) % COLORS.length)];
  const isLeaf = depth === 1;

  if (isLeaf) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={background}
          stroke="#fff"
        />
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
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
        stroke="#fff"
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        fill="#fff"
        fontSize={12}
      >
        {name}
      </text>
    </g>
  );
};

export default TreemapChart; 