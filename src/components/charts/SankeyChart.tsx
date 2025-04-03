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

const SankeyChart: React.FC<SankeyChartProps> = ({ data }) => {
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Sankey
        data={chartData}
        node={{ fill: "var(--primary)" }}
        link={{ fill: "var(--primary-foreground)" }}
        nodePadding={50}
        nodeThickness={10}
        linkCurvature={0.5}
        label={{ fill: "var(--foreground)", fontSize: 12 }}
      >
        <Tooltip
          formatter={(value: number) => `$${value.toLocaleString()}`}
          labelStyle={{ fontSize: 12 }}
        />
      </Sankey>
    </ResponsiveContainer>
  );
};

export default SankeyChart; 