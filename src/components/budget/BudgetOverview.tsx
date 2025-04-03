"use client";

import React from "react";
import { ResponsivePie } from "@nivo/pie";
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
}

interface BudgetOverviewProps {
  data: BudgetData;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ data }) => {
  const chartData = [
    {
      id: "AS Revenue",
      label: "AS Revenue",
      value: Math.abs(data.budget_summary.as_revenue.amount),
      color: "#2563eb",
    },
    {
      id: "Referendums & Fees",
      label: "Referendums & Fees",
      value: Math.abs(data.budget_summary.referendums_return_to_aid_locked_fees.amount),
      color: "#16a34a",
    },
    {
      id: "Career Employees",
      label: "Career Employees",
      value: Math.abs(data.budget_summary.career_employees.amount),
      color: "#dc2626",
    },
    {
      id: "Office Operations",
      label: "Office Operations",
      value: Math.abs(data.budget_summary.office_operations.amount),
      color: "#9333ea",
    },
    {
      id: "Student Payroll",
      label: "Student Payroll",
      value: Math.abs(data.budget_summary.student_employee_payroll_stipends.amount),
      color: "#ea580c",
    },
    {
      id: "Other",
      label: "Other",
      value: Math.abs(
        data.budget_summary.mandated_reserves_contribution.amount +
        data.budget_summary.general_operations.amount +
        data.budget_summary.senate_operations.amount
      ),
      color: "#64748b",
    },
  ];

  return (
    <div className="h-[500px] w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        <ResponsivePie
          data={chartData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333"
          arcLinkLabelsThickness={1}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 1.4]] }}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              translateY: 56,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#999",
              symbolSize: 18,
              symbolShape: "circle",
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
          tooltip={({ datum }) => (
            <div className="bg-white p-2 border rounded shadow">
              <div className="font-semibold">{datum.label}</div>
              <div className="text-sm text-gray-600">
                ${datum.value.toLocaleString()}
              </div>
            </div>
          )}
        />
      </motion.div>
    </div>
  );
};

export default BudgetOverview; 