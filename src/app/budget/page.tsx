"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import budgetData from "@/data/budget.json";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C43",
  "#FF6B6B",
  "#4ECDC4",
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const processBudgetData = (data: any) => {
  const revenue = data.budget_summary.as_revenue.amount;
  const expenses = [
    {
      name: "Referendums & RTA",
      value: Math.abs(data.budget_summary.referendums_return_to_aid_locked_fees.amount),
    },
    {
      name: "Career Employees",
      value: Math.abs(data.budget_summary.career_employees.amount),
    },
    {
      name: "Office Operations",
      value: Math.abs(data.budget_summary.office_operations.amount),
    },
    {
      name: "Student Payroll",
      value: Math.abs(data.budget_summary.student_employee_payroll_stipends.amount),
    },
    {
      name: "Other Expenses",
      value: Math.abs(
        data.budget_summary.mandated_reserves_contribution.amount +
        data.budget_summary.general_operations.amount +
        data.budget_summary.senate_operations.amount
      ),
    },
  ];

  return {
    revenue,
    expenses,
    totalExpenses: expenses.reduce((sum, exp) => sum + exp.value, 0),
  };
};

export default function BudgetPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const processedData = useMemo(() => processBudgetData(budgetData), []);

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30">
            Budget Visualization
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            UCSD Associated Students Budget 2024-2025
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Explore how AS manages and allocates resources to enhance student life and campus services.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "AS Revenue", value: processedData.revenue },
                            { name: "Total Expenses", value: processedData.totalExpenses },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {processedData.expenses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={formatCurrency} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={processedData.expenses}>
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
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "AS Revenue",
                          value: processedData.revenue,
                          description: budgetData.budget_summary.as_revenue.description,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip
                        formatter={formatCurrency}
                        labelFormatter={(label) => (
                          <div>
                            <div>{label}</div>
                            <div className="text-sm text-foreground/70">
                              {budgetData.budget_summary.as_revenue.description}
                            </div>
                          </div>
                        )}
                      />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processedData.expenses}>
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

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Operating Reserves</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Total Reserves</h3>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(budgetData.operating_reserves.total_reserves.amount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Carryforwards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Total AS Carryforward</h3>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(budgetData.carryforwards.total_as_carryforward.amount)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">AS Carryforward 2024-2025</h3>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(budgetData.carryforwards.as_carryforward_2024_2025.amount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 