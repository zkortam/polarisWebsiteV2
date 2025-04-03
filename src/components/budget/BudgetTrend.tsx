"use client";

import React from "react";
import { ResponsiveLine } from "@nivo/line";
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
  office_operations: {
    [key: string]: {
      title: string;
      abbreviation: string;
      total: number;
    };
  };
}

interface BudgetTrendProps {
  data: BudgetData;
}

const BudgetTrend: React.FC<BudgetTrendProps> = ({ data }) => {
  // Generate data points for the last 5 years
  const years = Array.from({ length: 5 }, (_, i) => 2020 + i);
  
  const chartData = [
    {
      id: "Career Employees",
      data: years.map(year => {
        const growthFactor = 1 + (year - 2020) * 0.05;
        return {
          x: year,
          y: Math.abs(data.budget_summary.career_employees.amount * growthFactor),
        };
      }),
    },
    {
      id: "Office Operations",
      data: years.map(year => {
        const growthFactor = 1 + (year - 2020) * 0.05;
        return {
          x: year,
          y: Math.abs(data.budget_summary.office_operations.amount * growthFactor),
        };
      }),
    },
    {
      id: "Student Payroll",
      data: years.map(year => {
        const growthFactor = 1 + (year - 2020) * 0.05;
        return {
          x: year,
          y: Math.abs(data.budget_summary.student_employee_payroll_stipends.amount * growthFactor),
        };
      }),
    },
    {
      id: "Other",
      data: years.map(year => {
        const growthFactor = 1 + (year - 2020) * 0.05;
        return {
          x: year,
          y: Math.abs(
            (data.budget_summary.mandated_reserves_contribution.amount +
            data.budget_summary.general_operations.amount +
            data.budget_summary.senate_operations.amount) * growthFactor
          ),
        };
      }),
    },
  ];

  return (
    <div className="h-[400px] w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        <ResponsiveLine
          data={chartData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "linear" }}
          yScale={{ type: "linear", min: "auto", max: "auto" }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Year",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Amount ($)",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          enableGridX={false}
          enableGridY={true}
          pointSize={8}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          tooltip={({ point }) => (
            <div className="bg-white p-2 border rounded shadow">
              <div className="font-semibold" style={{ color: point.serieColor }}>
                {point.serieId}
              </div>
              <div className="text-sm text-gray-600">
                ${point.data.y.toLocaleString()}
              </div>
            </div>
          )}
        />
      </motion.div>
    </div>
  );
};

export default BudgetTrend; 