"use client";

import React from "react";
import {
  Sankey,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface SankeyChartProps {
  data: Record<string, any>;
  onItemClick?: (name: string) => void;
}

const SankeyChart: React.FC<SankeyChartProps> = ({ data, onItemClick }) => {
  // Safely parse numeric values with error handling
  const parseValue = (value: string | string[]): number => {
    if (Array.isArray(value)) {
      return value.reduce((acc, curr) => acc + parseValue(curr), 0);
    }
    const parsed = parseFloat(value.toString().replace(/[^0-9.-]+/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Transform data for the chart
  const nodes: { name: string }[] = [];
  const links: { source: number; target: number; value: number }[] = [];

  // Add root node
  nodes.push({ name: "Budget" });

  // Process each category
  Object.entries(data).forEach(([category, value], categoryIndex) => {
    if (category === "value" || category === "Items") return;

    nodes.push({ name: category });
    const categoryValue = typeof value === "object" && value !== null
      ? "value" in value
        ? parseValue(value.value)
        : "Items" in value
          ? Object.entries(value.Items).reduce((acc, [_, itemValue]) => {
              if (typeof itemValue === "string" || Array.isArray(itemValue)) {
                return acc + parseValue(itemValue);
              }
              return acc;
            }, 0)
          : 0
      : parseValue(value);

    links.push({
      source: 0,
      target: categoryIndex + 1,
      value: Math.abs(categoryValue),
    });

    // Process subcategories if they exist
    if (typeof value === "object" && value !== null && "Items" in value) {
      Object.entries(value.Items).forEach(([subcategory, subValue], subIndex) => {
        nodes.push({ name: subcategory });
        const subValueNum = typeof subValue === "string" || Array.isArray(subValue)
          ? parseValue(subValue)
          : 0;

        links.push({
          source: categoryIndex + 1,
          target: nodes.length - 1,
          value: Math.abs(subValueNum),
        });
      });
    }
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const totalValue = links.reduce((acc, link) => acc + link.value, 0);
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

  const handleNodeClick = (data: any) => {
    if (data && data.name && onItemClick) {
      onItemClick(data.name);
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Sankey
        data={{ nodes, links }}
        node={{
          fill: "hsl(var(--primary))",
          stroke: "hsl(var(--border))",
          strokeWidth: 1,
          onClick: handleNodeClick,
          cursor: "pointer",
        }}
        link={{
          fill: "hsl(var(--primary-foreground))",
          stroke: "hsl(var(--border))",
          strokeWidth: 1,
        }}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        nodePadding={50}
        linkCurvature={0.5}
      >
        <Tooltip content={<CustomTooltip />} />
      </Sankey>
    </ResponsiveContainer>
  );
};

export default SankeyChart; 