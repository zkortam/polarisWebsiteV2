"use client";

import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { motion } from "framer-motion";

interface BudgetData {
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

interface BudgetBreakdownProps {
  data: BudgetData;
}

const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({ data }) => {
  const chartData = Object.entries(data.office_operations)
    .filter(([key]) => key !== "title" && key !== "abbreviation")
    .map(([key, value]) => ({
      office: value.title,
      amount: Math.abs(value.total),
      abbreviation: value.abbreviation,
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="h-[600px] w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        <ResponsiveBar
          data={chartData}
          keys={["amount"]}
          indexBy="office"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          colors={{ scheme: "nivo" }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "#38bcb2",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "#eed312",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          fill={[
            {
              match: {
                id: "amount",
              },
              id: "dots",
            },
            {
              match: {
                id: "amount",
              },
              id: "lines",
            },
          ]}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: "Office",
            legendPosition: "middle",
            legendOffset: 45,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Amount ($)",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          animate={true}
          tooltip={({ id, value, indexValue }) => (
            <div className="bg-white p-2 border rounded shadow">
              <div className="font-semibold">{indexValue}</div>
              <div className="text-sm text-gray-600">
                ${value.toLocaleString()}
              </div>
            </div>
          )}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
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

export default BudgetBreakdown; 