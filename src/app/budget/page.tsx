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

// Calculate marketing-related expenses
const marketingExpenses = Object.entries(budgetData.officeOperations)
  .reduce((total, [_, value]: [string, any]) => {
    if (value.marketingOutreach) {
      return total + Math.abs(value.marketingOutreach);
    }
    return total;
  }, 0);

// Calculate travel-related expenses
const travelExpenses = Object.entries(budgetData.officeOperations)
  .reduce((total, [_, value]: [string, any]) => {
    if (value.conferenceTravel) {
      return total + Math.abs(value.conferenceTravel);
    }
    if (value.boardVPTravel) {
      return total + Math.abs(value.boardVPTravel);
    }
    if (value.travel) {
      return total + Math.abs(value.travel);
    }
    return total;
  }, 0);

// Calculate questionable expenses
const questionableExpenses = {
  "New York Times Subscription": Math.abs(budgetData.officeOperations.presidentsOffice.newYorkTimes),
  "Conference Travel": Math.abs(budgetData.officeOperations.externalAffairs.conferenceTravel),
  "Board VP Travel": Math.abs(budgetData.officeOperations.externalAffairs.boardVPTravel),
  "ABC Conference": Math.abs(budgetData.officeOperations.externalAffairs.abcConference),
  "Festival Contingency": Math.abs(budgetData.officeOperations.concertsAndEvents.festivalContingency),
  "Marketing Expenses": marketingExpenses,
  "Travel Expenses": travelExpenses,
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
const totalIncome = Math.abs(budgetData.budgetSummary.asRevenue) + 
                    Math.abs(budgetData.reservesAndCarryforwards.totalCarryforward) + 
                    Math.abs(budgetData.reservesAndCarryforwards.asCarryforward);

// Calculate total expenses (sum of all expenses in budgetSummary except asRevenue and remainingFunds)
const totalExpenses = Object.entries(budgetData.budgetSummary)
  .filter(([key]) => key !== "asRevenue" && key !== "remainingFunds")
  .reduce((sum, [_, value]) => sum + Math.abs(value), 0);

// Calculate the deficit
const deficit = Math.abs(budgetData.budgetSummary.remainingFunds);

// Prepare data for income breakdown
const incomeBreakdownData = [
  { name: "AS Revenue", value: Math.abs(budgetData.budgetSummary.asRevenue) },
  { name: "Total Carryforward", value: Math.abs(budgetData.reservesAndCarryforwards.totalCarryforward) },
  { name: "AS Carryforward", value: Math.abs(budgetData.reservesAndCarryforwards.asCarryforward) },
];

// Prepare data for expense breakdown
const expenseBreakdownData = Object.entries(budgetData.budgetSummary)
  .filter(([key]) => key !== "asRevenue" && key !== "remainingFunds")
  .map(([name, value]) => ({
    name: name
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    value: Math.abs(value),
  }));

// Prepare data for monthly trend (simulated data for visualization)
const monthlyTrendData = [
  { month: "Jul", income: totalIncome * 0.1, expenses: totalExpenses * 0.08 },
  { month: "Aug", income: totalIncome * 0.15, expenses: totalExpenses * 0.12 },
  { month: "Sep", income: totalIncome * 0.2, expenses: totalExpenses * 0.18 },
  { month: "Oct", income: totalIncome * 0.25, expenses: totalExpenses * 0.22 },
  { month: "Nov", income: totalIncome * 0.3, expenses: totalExpenses * 0.28 },
  { month: "Dec", income: totalIncome * 0.35, expenses: totalExpenses * 0.32 },
  { month: "Jan", income: totalIncome * 0.4, expenses: totalExpenses * 0.38 },
  { month: "Feb", income: totalIncome * 0.45, expenses: totalExpenses * 0.42 },
  { month: "Mar", income: totalIncome * 0.5, expenses: totalExpenses * 0.48 },
  { month: "Apr", income: totalIncome * 0.6, expenses: totalExpenses * 0.58 },
  { month: "May", income: totalIncome * 0.7, expenses: totalExpenses * 0.68 },
  { month: "Jun", income: totalIncome, expenses: totalExpenses },
];

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
        hasSubcategories: Object.keys(value).filter(key => key !== "amount").length > 0,
        subcategories: Object.entries(value)
          .filter(([key]) => key !== "amount")
          .map(([subName, subValue]) => ({
            name: subName
              .split(/(?=[A-Z])/)
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
            value: Math.abs(subValue as number),
          })),
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
    case "Referendums And Aid":
      return [{ name: "Referendums And Aid", value: Math.abs(budgetData.budgetSummary.referendumsAndAid) }];
    case "Mandated Reserves":
      return [{ name: "Mandated Reserves", value: Math.abs(budgetData.budgetSummary.mandatedReserves) }];
    case "Income":
      return [
        { name: "AS Revenue", value: Math.abs(budgetData.budgetSummary.asRevenue) },
        { name: "Total Carryforward", value: Math.abs(budgetData.reservesAndCarryforwards.totalCarryforward) },
        { name: "AS Carryforward", value: Math.abs(budgetData.reservesAndCarryforwards.asCarryforward) },
      ];
    case "Expenses":
      return Object.entries(budgetData.budgetSummary)
        .filter(([key]) => key !== "asRevenue" && key !== "remainingFunds")
        .map(([name, value]) => ({
          name: name
            .split(/(?=[A-Z])/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          value: Math.abs(value),
        }));
    default:
      return [];
  }
};

// Function to get subcategory breakdown
const getSubcategoryBreakdown = (category: string, subcategory: string) => {
  if (category === "Office Operations") {
    // Convert subcategory to camelCase for accessing the object
    const camelCaseSubcategory = subcategory
      .split(' ')
      .map((word, index) => 
        index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');
    
    // Check if the subcategory exists in officeOperations
    if (camelCaseSubcategory in budgetData.officeOperations) {
      const data = budgetData.officeOperations[camelCaseSubcategory as keyof typeof budgetData.officeOperations];
      return Object.entries(data)
        .filter(([key]) => key !== "amount")
        .map(([name, value]) => ({
          name: name
            .split(/(?=[A-Z])/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          value: Math.abs(value as number),
        }));
    }
  }
  return [];
};

export default function BudgetPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [detailedData, setDetailedData] = useState<any[]>([]);
  const [subcategoryData, setSubcategoryData] = useState<any[]>([]);
  const [summaryDrillDown, setSummaryDrillDown] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setDetailedData(getDetailedBreakdown(category));
  };

  const handleSubcategoryClick = (subcategory: string) => {
    if (selectedCategory) {
      setSelectedSubcategory(subcategory);
      setSubcategoryData(getSubcategoryBreakdown(selectedCategory, subcategory));
    }
  };

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
      setSubcategoryData([]);
    } else {
      setSelectedCategory(null);
      setDetailedData([]);
    }
  };

  const handleSummaryDrillDown = (category: string) => {
    setSummaryDrillDown(category);
    setDetailedData(getDetailedBreakdown(category));
  };

  const handleSummaryBack = () => {
    setSummaryDrillDown(null);
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
            <p className="text-sm text-foreground/70 mt-1">
              AS Revenue + Carryforward
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
          className="bg-transparent rounded-lg p-4 shadow-lg mb-8 border-2 border-red-500 w-full"
        >
          <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-1">Budget Deficit</h3>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">
            {formatCurrency(deficit)}
          </p>
        </motion.div>

        {/* Data Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-card/50 rounded-lg p-4 shadow-sm mb-8 w-full text-sm text-foreground/70"
        >
          <p className="italic">
            <strong>Disclaimer:</strong> The budget data presented on this page is for informational purposes only. 
            While we strive for accuracy, some figures may be estimates or subject to change. 
            For the most up-to-date and official budget information, please refer to official AS documentation.
          </p>
        </motion.div>

        {/* Budget Concerns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 shadow-sm mb-8 w-full border border-amber-200 dark:border-amber-800"
        >
          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">Budget Concerns</h3>
          <ul className="list-disc pl-5 space-y-1 text-amber-800/80 dark:text-amber-300/80">
            <li>Over <strong>{formatCurrency(marketingExpenses)}</strong> is allocated to marketing-related expenses</li>
            <li>Significant travel expenses totaling <strong>{formatCurrency(travelExpenses)}</strong></li>
            <li>Large allocation to SunGod Festival: <strong>{formatCurrency(Math.abs(budgetData.officeOperations.concertsAndEvents.sunGodFestival))}</strong></li>
            <li>High administrative costs compared to direct student services</li>
            <li>Multiple conference and travel expenses that may not directly benefit the student body</li>
          </ul>
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
                <h3 className="text-xl font-semibold mb-4">Budget Summary</h3>
                {summaryDrillDown ? (
                  <>
                    <button
                      onClick={handleSummaryBack}
                      className="mb-4 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
                    >
                      ← Back to Summary
                    </button>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={detailedData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={100}
                            interval={0}
                          />
                          <YAxis 
                            tickFormatter={(value) => formatCurrency(value)} 
                            width={120}
                          />
                          <Tooltip formatter={(value) => formatCurrency(value as number)} />
                          <Legend />
                          <Bar 
                            dataKey="value" 
                            fill="#8884d8" 
                            name="Amount" 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                ) : (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Total Income", value: totalIncome },
                          { name: "Total Expenses", value: totalExpenses },
                          { name: "Deficit", value: deficit },
                        ]}
                        onClick={(data) => {
                          if (data && data.activePayload && data.activePayload[0]) {
                            const category = data.activePayload[0].payload.name;
                            if (category === "Total Income") {
                              handleSummaryDrillDown("Income");
                            } else if (category === "Total Expenses") {
                              handleSummaryDrillDown("Expenses");
                            }
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          interval={0}
                        />
                        <YAxis 
                          tickFormatter={(value) => formatCurrency(value)} 
                          width={120}
                        />
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
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Income Breakdown</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={incomeBreakdownData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {incomeBreakdownData.map((_, index) => (
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
                  <h3 className="text-xl font-semibold mb-4">Expense Breakdown</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseBreakdownData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {expenseBreakdownData.map((_, index) => (
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
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Monthly Budget Trend</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="income" 
                        stroke="#8884d8" 
                        name="Income" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#82ca9d" 
                        name="Expenses" 
                        strokeWidth={2}
                      />
                    </LineChart>
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
                      data={incomeBreakdownData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {incomeBreakdownData.map((_, index) => (
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
                {selectedSubcategory 
                  ? `${selectedSubcategory} Breakdown` 
                  : selectedCategory 
                    ? `${selectedCategory} Breakdown` 
                    : "Expense Breakdown"}
              </h3>
              {selectedCategory && (
                <button
                  onClick={handleBack}
                  className="mb-4 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
                >
                  ← Back to {selectedSubcategory ? selectedCategory : "All Expenses"}
                </button>
              )}
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={selectedSubcategory 
                      ? subcategoryData 
                      : selectedCategory 
                        ? detailedData 
                        : expenseData}
                    onClick={(data) => {
                      if (selectedSubcategory) return;
                      
                      if (selectedCategory) {
                        if (data && data.activePayload && data.activePayload[0]) {
                          const item = data.activePayload[0].payload;
                          if (item.hasSubcategories) {
                            handleSubcategoryClick(item.name);
                          }
                        }
                      } else {
                        if (data && data.activePayload && data.activePayload[0]) {
                          const category = data.activePayload[0].payload.name;
                          handleCategoryClick(category);
                        }
                      }
                    }}
                    style={{ cursor: selectedSubcategory ? 'default' : 'pointer' }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      interval={0}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)} 
                      width={120}
                    />
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
              <h3 className="text-xl font-semibold mb-4">
                {selectedSubcategory 
                  ? `${selectedSubcategory} Breakdown` 
                  : "Office Operations Breakdown"}
              </h3>
              {selectedCategory && (
                <button
                  onClick={handleBack}
                  className="mb-4 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
                >
                  ← Back to {selectedSubcategory ? "Office Operations" : "All Operations"}
                </button>
              )}
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={selectedSubcategory 
                      ? subcategoryData 
                      : officeOperationsData}
                    onClick={(data) => {
                      if (selectedSubcategory) return;
                      
                      if (data && data.activePayload && data.activePayload[0]) {
                        const item = data.activePayload[0].payload;
                        if (item.hasSubcategories) {
                          setSelectedCategory("Office Operations");
                          handleSubcategoryClick(item.name);
                        }
                      }
                    }}
                    style={{ cursor: selectedSubcategory ? 'default' : 'pointer' }}
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
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={100}
                        interval={0}
                      />
                      <YAxis 
                        tickFormatter={(value) => formatCurrency(value)} 
                        width={120}
                      />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="value" fill="#ff8042" name="Amount" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Marketing vs. Student Services</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Marketing Expenses", value: marketingExpenses },
                          { name: "Student Services", value: Object.values(studentExpenses).reduce((a, b) => a + b, 0) - marketingExpenses },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        <Cell fill="#ff8042" />
                        <Cell fill="#82ca9d" />
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
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