"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import budgetData from "@/data/budget.json";

// Dynamically import components to avoid SSR issues
const BudgetOverview = dynamic(() => import("@/components/budget/BudgetOverview"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg" />,
});

const BudgetBreakdown = dynamic(() => import("@/components/budget/BudgetBreakdown"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg" />,
});

const BudgetFlow = dynamic(() => import("@/components/budget/BudgetFlow"), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-lg" />,
});

const BudgetTrend = dynamic(() => import("@/components/budget/BudgetTrend"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg" />,
});

interface BudgetAmount {
  amount: number;
  description?: string;
  abbreviation: string;
}

interface BudgetSummary {
  title: string;
  abbreviation: string;
  remaining_funds: {
    description: string;
    abbreviation: string;
  };
  as_revenue: BudgetAmount;
  referendums_return_to_aid_locked_fees: BudgetAmount;
  career_employees: BudgetAmount;
  mandated_reserves_contribution: BudgetAmount;
  general_operations: BudgetAmount;
  office_operations: BudgetAmount;
  senate_operations: BudgetAmount;
  student_employee_payroll_stipends: BudgetAmount;
}

interface OfficeOperationItem {
  title: string;
  amount: number;
  abbreviation: string;
}

interface OfficeOperation {
  title: string;
  abbreviation: string;
  total: number;
  items?: OfficeOperationItem[];
}

interface BudgetData {
  title: string;
  abbreviation: string;
  sponsors: {
    chief_financial_officer: {
      name: string;
      period: string;
      abbreviation: string;
    };
    approval: {
      body: string;
      date: string;
      abbreviation: string;
    };
  };
  budget_summary: BudgetSummary;
  office_operations: Record<string, OfficeOperation | string | number>;
}

const BudgetPage = () => {
  const [selectedView, setSelectedView] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const totalBudget = Math.abs(budgetData.budget_summary.as_revenue.amount);
  const totalExpenses = Object.values(budgetData.budget_summary)
    .filter((item: any) => item.amount < 0)
    .reduce((sum: number, item: any) => sum + Math.abs(item.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Budget Visualization
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Explore UCSD Associated Students budget for 2024-2025
          </motion.p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-sm font-medium text-gray-500">Total Budget</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              ${totalBudget.toLocaleString()}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              ${totalExpenses.toLocaleString()}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-sm font-medium text-gray-500">Remaining Balance</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              ${(totalBudget - totalExpenses).toLocaleString()}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View
            </label>
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="overview">Overview</option>
              <option value="breakdown">Breakdown</option>
              <option value="flow">Flow</option>
              <option value="trend">Trend</option>
            </select>
          </div>
          {selectedView === "breakdown" && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Categories</option>
                <option value="office">Office Operations</option>
                <option value="senate">Senate Operations</option>
                <option value="general">General Operations</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          {selectedView === "overview" && (
            <BudgetOverview data={budgetData} />
          )}
          {selectedView === "breakdown" && (
            <BudgetBreakdown data={budgetData} category={selectedCategory} />
          )}
          {selectedView === "flow" && (
            <BudgetFlow data={budgetData} />
          )}
          {selectedView === "trend" && (
            <BudgetTrend data={budgetData} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BudgetPage; 