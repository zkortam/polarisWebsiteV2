"use client";

import React from "react";
import {
  Treemap,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TreemapChartProps {
  data: any;
}

const COLORS = [
  "var(--primary)",
  "var(--primary-foreground)",
  "var(--secondary)",
  "var(--secondary-foreground)",
  "var(--accent)",
  "var(--accent-foreground)",
];

export function TreemapChart({ data }: TreemapChartProps) {
  // Transform data for the chart
  const chartData = React.useMemo(() => {
    return data.items.map((item: any, index: number) => ({
      name: item.name,
      value: item.amount,
      fill: COLORS[index % COLORS.length],
    }));
  }, [data]);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={chartData}
          dataKey="value"
          nameKey="name"
          fill="#8884d8"
          label={({ name, value }) => (
            <g>
              <text
                x={0}
                y={10}
                fill="#fff"
                fontSize={14}
                textAnchor="start"
              >
                {name}
              </text>
              <text
                x={0}
                y={30}
                fill="#fff"
                fontSize={12}
                textAnchor="start"
              >
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value)}
              </text>
            </g>
          )}
        >
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value)
            }
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
} 