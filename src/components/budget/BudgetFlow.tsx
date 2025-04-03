"use client";

import React from "react";
import { ResponsiveSankey } from "@nivo/sankey";
import { motion } from "framer-motion";

interface BudgetData {
  budget_summary: {
    as_revenue: { amount: number };
    referendums_return_to_aid_locked_fees: { amount: number };
    career_employees: { amount: number };
    mandated_reserves_contribution: { amount: number };
    general_operations: { amount: number };
    office_operations: { amount: number };
    senate_operations: { amount: number };
    student_employee_payroll_stipends: { amount: number };
  };
  office_operations: Record<string, {
    title: string;
    abbreviation: string;
    total: number;
    items?: Array<{
      title: string;
      amount: number;
      abbreviation: string;
    }>;
  }>;
}

interface BudgetFlowProps {
  data: BudgetData;
}

interface SankeyNode {
  id: string;
  color: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface SankeyNodeDatum {
  id: string;
  value: number;
}

interface SankeyLinkDatum {
  source: { id: string };
  target: { id: string };
  value: number;
}

const BudgetFlow: React.FC<BudgetFlowProps> = ({ data }) => {
  // Define main budget categories
  const mainCategories = [
    { id: "AS Revenue", color: "#2563eb" },
    { id: "Referendums & Fees", color: "#16a34a" },
    { id: "Career Employees", color: "#dc2626" },
    { id: "Office Operations", color: "#9333ea" },
    { id: "Student Payroll", color: "#ea580c" },
    { id: "Other", color: "#64748b" },
  ];

  // Create nodes for office operations
  const officeOperationNodes = Object.entries(data.office_operations)
    .filter(([key]) => key !== "title" && key !== "abbreviation")
    .map(([key, value]) => ({
      id: value.title,
      color: "#64748b",
    }));

  // Combine all nodes
  const nodes: SankeyNode[] = [...mainCategories, ...officeOperationNodes];

  // Create main budget flow links
  const mainLinks: SankeyLink[] = [
    {
      source: "AS Revenue",
      target: "Referendums & Fees",
      value: Math.abs(data.budget_summary.referendums_return_to_aid_locked_fees.amount),
    },
    {
      source: "AS Revenue",
      target: "Career Employees",
      value: Math.abs(data.budget_summary.career_employees.amount),
    },
    {
      source: "AS Revenue",
      target: "Office Operations",
      value: Math.abs(data.budget_summary.office_operations.amount),
    },
    {
      source: "AS Revenue",
      target: "Student Payroll",
      value: Math.abs(data.budget_summary.student_employee_payroll_stipends.amount),
    },
    {
      source: "AS Revenue",
      target: "Other",
      value: Math.abs(
        data.budget_summary.mandated_reserves_contribution.amount +
        data.budget_summary.general_operations.amount +
        data.budget_summary.senate_operations.amount
      ),
    },
  ];

  // Create office operation links
  const officeOperationLinks: SankeyLink[] = Object.entries(data.office_operations)
    .filter(([key]) => key !== "title" && key !== "abbreviation")
    .map(([key, value]) => ({
      source: "Office Operations",
      target: value.title,
      value: Math.abs(value.total),
    }));

  // Combine all links
  const links: SankeyLink[] = [...mainLinks, ...officeOperationLinks];

  return (
    <div className="h-[600px] w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        <ResponsiveSankey
          data={{ nodes, links }}
          margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
          align="justify"
          colors={{ scheme: "category10" }}
          nodeOpacity={1}
          nodeThickness={18}
          nodeInnerPadding={3}
          nodeSpacing={24}
          nodeBorderWidth={0}
          nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
          nodeBorderRadius={3}
          linkOpacity={0.5}
          linkHoverOthersOpacity={0.1}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={16}
          labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
          label={(d: SankeyNodeDatum) => d.id}
          nodeTooltip={(d: { node: SankeyNodeDatum }) => (
            <div className="bg-white p-2 border rounded shadow">
              <div className="font-semibold">{d.node.id}</div>
              <div className="text-sm text-gray-600">
                ${d.node.value.toLocaleString()}
              </div>
            </div>
          )}
          linkTooltip={(d: { link: SankeyLinkDatum }) => (
            <div className="bg-white p-2 border rounded shadow">
              <div className="font-semibold">
                {d.link.source.id} → {d.link.target.id}
              </div>
              <div className="text-sm text-gray-600">
                ${d.link.value.toLocaleString()}
              </div>
            </div>
          )}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              translateX: 130,
              itemWidth: 100,
              itemHeight: 14,
              itemDirection: "left-to-right",
              itemsSpacing: 2,
              itemTextColor: "#999",
              symbolSize: 14,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000",
                  },
                },
              ],
            },
          ]}
        />
      </motion.div>
    </div>
  );
};

export default BudgetFlow; 