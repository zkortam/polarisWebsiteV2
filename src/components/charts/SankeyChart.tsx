"use client";

import React from "react";
import {
  Sankey,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SankeyChartProps {
  data: any;
}

export function SankeyChart({ data }: SankeyChartProps) {
  // Transform data for the chart
  const chartData = React.useMemo(() => {
    const nodes = [
      { name: "AS Revenue" },
      { name: "Auxiliary Revenue" },
      { name: "SPACES Revenue" },
      { name: "General Operations" },
      { name: "Programs" },
      { name: "Personnel" },
    ];

    const links = [
      {
        source: 0,
        target: 3,
        value: data.budget_summary.as_revenue.amount * 0.4,
      },
      {
        source: 0,
        target: 4,
        value: data.budget_summary.as_revenue.amount * 0.3,
      },
      {
        source: 0,
        target: 5,
        value: data.budget_summary.as_revenue.amount * 0.3,
      },
      {
        source: 1,
        target: 3,
        value: data.budget_summary.auxiliary_revenue.amount * 0.5,
      },
      {
        source: 1,
        target: 4,
        value: data.budget_summary.auxiliary_revenue.amount * 0.3,
      },
      {
        source: 1,
        target: 5,
        value: data.budget_summary.auxiliary_revenue.amount * 0.2,
      },
      {
        source: 2,
        target: 3,
        value: data.budget_summary.spaces_revenue.amount * 0.6,
      },
      {
        source: 2,
        target: 4,
        value: data.budget_summary.spaces_revenue.amount * 0.2,
      },
      {
        source: 2,
        target: 5,
        value: data.budget_summary.spaces_revenue.amount * 0.2,
      },
    ];

    return {
      nodes,
      links,
    };
  }, [data]);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={chartData}
          node={{ fill: "var(--primary)" }}
          link={{ fill: "var(--primary-foreground)" }}
          nodePadding={50}
          nodeThickness={10}
          linkCurvature={0.5}
          iterations={32}
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
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
} 