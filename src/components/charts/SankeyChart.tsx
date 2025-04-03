"use client";

import React from "react";
import {
  Sankey,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface SankeyChartProps {
  data: any;
  onNodeClick?: (name: string) => void;
}

const SankeyChart: React.FC<SankeyChartProps> = ({ data, onNodeClick }) => {
  // Safely parse numeric values with error handling
  const parseValue = (value: string): number => {
    const parsed = parseFloat(value.toString().replace(/[^0-9.-]+/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Transform data for the Sankey diagram
  const nodes = [
    { name: "Total Revenue", type: "revenue" },
    { name: "Total Expenses", type: "expense" },
    { name: "Referendums", type: "revenue" },
    { name: "Career Employees", type: "expense" },
    { name: "Office Operations", type: "expense" },
    { name: "General Operations", type: "expense" },
    { name: "Senate Operations", type: "expense" },
    { name: "Student-Employee Payroll", type: "expense" },
    { name: "Remaining Funds", type: "revenue" },
  ];

  // Calculate total revenue and expenses
  const totalRevenue = parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["Total Revenue"]) || 0;
  const totalExpenses = Math.abs(parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["Total Expenses"]) || 0);

  // Transform data for the Sankey diagram with proper revenue/expense handling
  const links = [
    // Revenue flows
    {
      source: 0,
      target: 2,
      value: parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["Referendums, Return to Aid, and Locked in Fees"]),
      type: "revenue",
    },
    {
      source: 0,
      target: 8,
      value: parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["2024–2025 Remaining Funds (AS Revenue – (Referendums, Return to Aid, Employees, Expendable Funds))"]),
      type: "revenue",
    },
    // Expense flows
    {
      source: 1,
      target: 3,
      value: Math.abs(parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["Career Employees"])),
      type: "expense",
    },
    {
      source: 1,
      target: 4,
      value: Math.abs(parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["Office Operations (Expendable Funds)"])),
      type: "expense",
    },
    {
      source: 1,
      target: 5,
      value: Math.abs(parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["General Operations (Expendable Funds)"])),
      type: "expense",
    },
    {
      source: 1,
      target: 6,
      value: Math.abs(parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["Senate Operations (Expendable Funds)"])),
      type: "expense",
    },
    {
      source: 1,
      target: 7,
      value: Math.abs(parseValue(data["BUDGET SUMMARY"]?.General?.Items?.["Student-Employee Payroll & Stipends (Expendable Funds)"])),
      type: "expense",
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
          <p className={cn(
            "font-medium",
            data.type === "revenue" ? "text-green-500" : "text-red-500"
          )}>
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
    if (data && data.name && onNodeClick) {
      onNodeClick(data.name);
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Sankey
        data={chartData}
        node={{
          fill: (node: any) => {
            if (node.type === "revenue") return "hsl(142.1 76.2% 36.3%)"; // Green for revenue
            return "hsl(346.8 77.2% 49.8%)"; // Red for expenses
          },
          stroke: "hsl(var(--border))",
          strokeWidth: 1,
        }}
        link={{
          fill: (link: any) => {
            if (link.type === "revenue") return "hsl(142.1 76.2% 36.3%)"; // Green for revenue
            return "hsl(346.8 77.2% 49.8%)"; // Red for expenses
          },
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