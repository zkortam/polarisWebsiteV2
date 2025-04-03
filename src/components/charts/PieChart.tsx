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

export function PieChart({ data }: PieChartProps) {
  // Transform data for the chart
  const chartData = React.useMemo(() => {
    return [
      {
        name: "AS Revenue",
        value: data.as_revenue.amount,
      },
      {
        name: "Auxiliary Revenue",
        value: data.auxiliary_revenue.amount,
      },
      {
        name: "SPACES Revenue",
        value: data.spaces_revenue.amount,
      },
      {
        name: "General Operations",
        value: data.general_operations.amount,
      },
      {
        name: "Programs",
        value: data.programs.amount,
      },
      {
        name: "Personnel",
        value: data.personnel.amount,
      },
    ];
  }, [data]);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
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
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
} 