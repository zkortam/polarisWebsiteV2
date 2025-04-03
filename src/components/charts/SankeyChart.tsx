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

  // Safely parse numeric values with error handling
  const parseValue = (value: string): number => {
    const parsed = parseFloat(value.toString().replace(/[^0-9.-]+/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  const links = [
    {
      source: 0,
      target: 1,
      value: parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["Referendums, Return to Aid, and Locked in Fees"]),
    },
    {
      source: 0,
      target: 2,
      value: parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["Career Employees"]),
    },
    {
      source: 0,
      target: 3,
      value: parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["Office Operations (Expendable Funds)"]),
    },
    {
      source: 0,
      target: 4,
      value: parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["General Operations (Expendable Funds)"]),
    },
    {
      source: 0,
      target: 5,
      value: parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["Senate Operations (Expendable Funds)"]),
    },
    {
      source: 0,
      target: 6,
      value: parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["Student-Employee Payroll & Stipends (Expendable Funds)"]),
    },
    {
      source: 0,
      target: 7,
      value: parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["2024–2025 Remaining Funds (AS Revenue – (Referendums, Return to Aid, Employees, Expendable Funds))"]),
    },
  ];

  const chartData = {
    nodes,
    links,
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const totalValue = links.reduce((acc, curr) => acc + curr.value, 0);
      const percentage = ((data.value / totalValue) * 100).toFixed(1);
      
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg p-4 shadow-lg">
          <p className="text-primary font-medium">{data.name}</p>
          <p className="text-foreground">${data.value.toLocaleString()}</p>
          <p className="text-foreground/60 text-sm">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const handleNodeClick = (data: any) => {
    if (data && data.name && onNodeClick) {
      onNodeClick(data.name);
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Sankey
        data={chartData}
        node={{
          fill: "hsl(var(--primary))",
          stroke: "hsl(var(--border))",
          strokeWidth: 1,
        }}
        link={{
          fill: "hsl(var(--primary-foreground))",
          stroke: "hsl(var(--border))",
          strokeWidth: 1,
        }}
        nodePadding={50}
        nodeThickness={10}
        linkCurvature={0.5}
        label={{
          fill: "hsl(var(--foreground))",
          fontSize: 12,
          fontWeight: 500,
        }}
        onClick={handleNodeClick}
        cursor="pointer"
      >
        <Tooltip content={<CustomTooltip />} />
      </Sankey>
    </ResponsiveContainer>
  );
};

export default SankeyChart; 