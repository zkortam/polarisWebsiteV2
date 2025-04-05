"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import budgetData from "@/data/data.json";

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
};

// Calculate total student-related expenses
const studentExpenses = {
  "Student Services": Math.abs(budgetData.budgetSummary.studentPayrollStipends),
  "Student Organizations": Math.abs(budgetData.officeOperations.studentOrganizations.amount),
  "Academic Programs": Math.abs(budgetData.lockedInAllocations.academicPrograms),
  "Return to Aid": Math.abs(budgetData.lockedInAllocations.returnToAid),
};

// Calculate administrative expenses
const adminExpenses = {
  "Career Employees": Math.abs(budgetData.budgetSummary.careerEmployees),
  "Office Operations": Math.abs(budgetData.budgetSummary.officeOperations),
  "General Operations": Math.abs(budgetData.budgetSummary.generalOperations),
  "Senate Operations": Math.abs(budgetData.budgetSummary.senateOperations),
};

// Calculate questionable expenses
const questionableExpenses = {
  "New York Times Subscription": Math.abs(budgetData.officeOperations.presidentsOffice.newYorkTimes),
  "Conference Travel": Math.abs(budgetData.officeOperations.externalAffairs.conferenceTravel),
  "Board VP Travel": Math.abs(budgetData.officeOperations.externalAffairs.boardVPTravel),
  "ABC Conference": Math.abs(budgetData.officeOperations.externalAffairs.abcConference),
  "Festival Contingency": Math.abs(budgetData.officeOperations.concertsAndEvents.festivalContingency),
};

// Prepare data for income sources
const incomeData = Object.entries(budgetData.budgetSummary)
  .filter(([key]) => key === "asRevenue")
  .map(([name, value]) => ({
    name: "AS Revenue",
    value: Math.abs(value),
  }));

// Prepare data for major expense categories
const expenseData = Object.entries(budgetData.budgetSummary)
  .filter(([key]) => key !== "asRevenue" && key !== "remainingFunds")
  .map(([name, value]) => ({
    name: name
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    value: Math.abs(value),
  }));

// Prepare data for office operations breakdown
const officeOperationsData = Object.entries(budgetData.officeOperations).map(
  ([name, value]: [string, any]) => ({
    name: name
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    value: Math.abs(value.amount),
  })
);

// Prepare data for student vs admin comparison
const studentVsAdminData = [
  {
    name: "Student-Focused",
    value: Object.values(studentExpenses).reduce((a, b) => a + b, 0),
  },
  {
    name: "Administrative",
    value: Object.values(adminExpenses).reduce((a, b) => a + b, 0),
  },
];

// Prepare data for questionable expenses
const questionableExpensesData = Object.entries(questionableExpenses).map(([name, value]) => ({
  name,
  value,
}));

// Colors for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C43",
  "#A4DE6C",
  "#D0ED57",
];

// Calculate total income and expenses
const totalIncome = Math.abs(budgetData.budgetSummary.asRevenue);
const totalExpenses = Object.entries(budgetData.budgetSummary)
  .filter(([key]) => key !== "asRevenue" && key !== "remainingFunds")
  .reduce((sum, [_, value]) => sum + Math.abs(value), 0);

// Calculate the deficit
const deficit = totalExpenses - totalIncome;

// Function to get detailed breakdown for a specific expense category
const getDetailedBreakdown = (category: string) => {
  switch (category) {
    case "Career Employees":
      return Object.entries(budgetData.careerEmployees).map(([name, value]) => ({
        name: name
          .split(/(?=[A-Z])/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        value: Math.abs(value),
      }));
    case "Office Operations":
      return Object.entries(budgetData.officeOperations).map(([name, value]: [string, any]) => ({
        name: name
          .split(/(?=[A-Z])/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        value: Math.abs(value.amount),
      }));
    case "General Operations":
      return Object.entries(budgetData.generalOperations).map(([name, value]) => ({
        name: name
          .split(/(?=[A-Z])/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        value: Math.abs(value),
      }));
    case "Senate Operations":
      return [{ name: "Senate Operations", value: Math.abs(budgetData.budgetSummary.senateOperations) }];
    case "Student Services":
      return [{ name: "Student Payroll & Stipends", value: Math.abs(budgetData.budgetSummary.studentPayrollStipends) }];
    default:
      return [];
  }
};

export default function BudgetPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [detailedData, setDetailedData] = useState<any[]>([]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setDetailedData(getDetailedBreakdown(category));
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setDetailedData([]);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">AS Budget Overview</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Explore how the Associated Students budget is allocated and managed to
            serve the UCSD community.
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Total Reserves</h3>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(budgetData.totalReserves)}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Total Income</h3>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(totalIncome)}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(totalExpenses)}
            </p>
          </motion.div>
        </div>

        {/* Deficit Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-red-100 dark:bg-red-900/30 rounded-lg p-6 shadow-lg mb-12 border-2 border-red-500"
        >
          <h3 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">Budget Deficit</h3>
          <p className="text-3xl font-bold text-red-700 dark:text-red-300">
            {formatCurrency(deficit)}
          </p>
          <p className="text-red-600 dark:text-red-400 mt-2">
            Expenses exceed income by {formatCurrency(deficit)}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {["overview", "income", "expenses", "operations", "analysis"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-card/80"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-card rounded-lg p-6 shadow-lg">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-xl font-semibold mb-4">Income vs Expenses</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Income", value: totalIncome },
                        { name: "Expenses", value: totalExpenses },
                        { name: "Deficit", value: deficit },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        fill="#8884d8" 
                        name="Amount" 
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#ef4444" 
                        name="Deficit" 
                        data={[{ name: "Deficit", value: deficit }]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Student vs Administrative Spending</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={studentVsAdminData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {studentVsAdminData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "income" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-4">Income Breakdown</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {incomeData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeTab === "expenses" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-4">
                {selectedCategory ? `${selectedCategory} Breakdown` : "Expense Breakdown"}
              </h3>
              {selectedCategory && (
                <button
                  onClick={handleBack}
                  className="mb-4 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
                >
                  ← Back to All Expenses
                </button>
              )}
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={selectedCategory ? detailedData : expenseData}
                    onClick={(data) => {
                      if (!selectedCategory && data && data.activePayload && data.activePayload[0]) {
                        const category = data.activePayload[0].payload.name;
                        handleCategoryClick(category);
                      }
                    }}
                    style={{ cursor: selectedCategory ? 'default' : 'pointer' }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Amount" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeTab === "operations" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-4">Office Operations Breakdown</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={officeOperationsData}
                    onClick={(data) => {
                      if (data && data.activePayload && data.activePayload[0]) {
                        const category = data.activePayload[0].payload.name;
                        handleCategoryClick(category);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" name="Amount" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeTab === "analysis" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-xl font-semibold mb-4">Questionable Expenses</h3>
                <p className="text-foreground/70 mb-4">
                  These expenses raise concerns about budget allocation and transparency:
                </p>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={questionableExpensesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="value" fill="#ff8042" name="Amount" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Student-Focused Expenses</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(studentExpenses).map(([name, value]) => ({
                          name,
                          value,
                        }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {Object.keys(studentExpenses).map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Administrative Expenses</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(adminExpenses).map(([name, value]) => ({
                          name,
                          value,
                        }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {Object.keys(adminExpenses).map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 