"use client";

import React from "react";
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

// Prepare data for income sources
const incomeData = [
  { name: "AS Revenue", value: budgetData.Income.asRevenue },
  { name: "AS Carryforward", value: budgetData.Income.asCarryforward },
  { name: "Auxiliary Carryforward", value: budgetData.Income.auxiliaryCarryforward },
  { name: "Spaces Carryforward", value: budgetData.Income.spacesCarryforward },
];

// Prepare data for major expense categories
const expenseData = [
  { name: "Office Operations", value: Math.abs(budgetData.ExpensesSummary.officeOperations) },
  { name: "Referendums & Aid", value: Math.abs(budgetData.ExpensesSummary.referendumsAndAid) },
  { name: "Career Employees", value: Math.abs(budgetData.ExpensesSummary.careerEmployees) },
  { name: "Student Payroll", value: Math.abs(budgetData.ExpensesSummary.studentPayrollStipends) },
  { name: "Mandated Reserves", value: Math.abs(budgetData.ExpensesSummary.mandatedReserves) },
  { name: "General Operations", value: Math.abs(budgetData.ExpensesSummary.generalOperations) },
  { name: "Senate Operations", value: Math.abs(budgetData.ExpensesSummary.senateOperations) },
];

// Prepare data for office operations breakdown
const officeOperationsData = Object.entries(budgetData.officeOperations).map(([name, data]) => ({
  name: name.replace(/([A-Z])/g, " $1").trim(),
  value: Math.abs(data.amount),
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

export default function BudgetPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-center">AS Budget Overview</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Reserves</CardTitle>
              <CardDescription>Current available funds</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(budgetData.totalReserves)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Income</CardTitle>
              <CardDescription>Annual revenue sources</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(
                  Object.values(budgetData.Income).reduce((a, b) => a + b, 0)
                )}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Expenses</CardTitle>
              <CardDescription>Annual expenditures</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(
                  Math.abs(
                    Object.values(budgetData.ExpensesSummary).reduce((a, b) => a + b, 0)
                  )
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>Annual budget comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      {
                        name: "Income",
                        value: Object.values(budgetData.Income).reduce((a, b) => a + b, 0),
                      },
                      {
                        name: "Expenses",
                        value: Math.abs(
                          Object.values(budgetData.ExpensesSummary).reduce((a, b) => a + b, 0)
                        ),
                      },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={formatCurrency} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Income Tab */}
          <TabsContent value="income" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Income Sources</CardTitle>
                <CardDescription>Breakdown of revenue streams</CardDescription>
              </CardHeader>
              <CardContent>
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
                        {incomeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={formatCurrency} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Major Expense Categories</CardTitle>
                <CardDescription>Distribution of expenditures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={formatCurrency} />
                      <Bar dataKey="value" fill="#82ca9d">
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Office Operations Breakdown</CardTitle>
                <CardDescription>Detailed view of office expenditures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={officeOperationsData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={formatCurrency} />
                      <YAxis type="category" dataKey="name" width={150} />
                      <Tooltip formatter={formatCurrency} />
                      <Bar dataKey="value" fill="#8884d8">
                        {officeOperationsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
} 