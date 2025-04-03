"use client";

import React from "react";
import {
  Sankey,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SankeyChartProps {
  data: any;
  onNodeClick?: (name: string) => void;
}

const SankeyChart: React.FC<SankeyChartProps> = ({ data, onNodeClick }) => {
  // Transform data for the Sankey diagram
  const nodes = [
    { name: "Total Revenue" },
    { name: "Referendums" },
    { name: "Career Employees" },
    { name: "Office Operations" },
    { name: "General Operations" },
    { name: "Senate Operations" },
    { name: "Student-Employee Payroll" },
    { name: "Remaining Funds" },
  ];

  const links = [
    {
      source: 0,
      target: 1,
      value: parseFloat(data["BUDGET SUMMARY"].General.Items["Referendums, Return to Aid, and Locked in Fees"].replace(/[^0-9.-]+/g, "")),
    },
    {
      source: 0,
      target: 2,
      value: parseFloat(data["BUDGET SUMMARY"].General.Items["Career Employees"].replace(/[^0-9.-]+/g, "")),
    },
    {
      source: 0,
      target: 3,
      value: parseFloat(data["BUDGET SUMMARY"].General.Items["Office Operations (Expendable Funds)"].replace(/[^0-9.-]+/g, "")),
    },
    {
      source: 0,
      target: 4,
      value: parseFloat(data["BUDGET SUMMARY"].General.Items["General Operations (Expendable Funds)"].replace(/[^0-9.-]+/g, "")),
    },
    {
      source: 0,
      target: 5,
      value: parseFloat(data["BUDGET SUMMARY"].General.Items["Senate Operations (Expendable Funds)"].replace(/[^0-9.-]+/g, "")),
    },
    {
      source: 0,
      target: 6,
      value: parseFloat(data["BUDGET SUMMARY"].General.Items["Student-Employee Payroll & Stipends (Expendable Funds)"].replace(/[^0-9.-]+/g, "")),
    },
    {
      source: 0,
      target: 7,
      value: parseFloat(data["BUDGET SUMMARY"].General.Items["2024–2025 Remaining Funds (AS Revenue – (Referendums, Return to Aid, Employees, Expendable Funds))"].replace(/[^0-9.-]+/g, "")),
    },
  ];

  const chartData = {
    nodes,
    links,
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg p-4 shadow-lg">
          <p className="text-primary font-medium">{data.name}</p>
          <p className="text-foreground">${data.value.toLocaleString()}</p>
          <p className="text-foreground/60 text-sm">
            {((data.value / links.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Sankey
        data={chartData}
        node={{
          fill: "var(--primary)",
          stroke: "var(--border)",
          strokeWidth: 1,
        }}
        link={{
          fill: "var(--primary-foreground)",
          stroke: "var(--border)",
          strokeWidth: 1,
        }}
        nodePadding={50}
        nodeThickness={10}
        linkCurvature={0.5}
        label={{
          fill: "var(--foreground)",
          fontSize: 12,
          fontWeight: 500,
        }}
        onClick={(data) => onNodeClick?.(data.name)}
        cursor="pointer"
      >
        <Tooltip content={<CustomTooltip />} />
      </Sankey>
    </ResponsiveContainer>
  );
};

export default SankeyChart; 