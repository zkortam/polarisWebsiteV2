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
  AreaChart,
  Area,
  StackedBarChart,
  StackedBar,
  Treemap,
  Rectangle,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import budgetData from "@/data/budget.json";

const REVENUE_COLORS = [
  "#2ecc71", // Green
  "#27ae60",
  "#1abc9c",
  "#16a085",
  "#1e8449",
];

const EXPENSE_COLORS = [
  "#e74c3c", // Red
  "#c0392b",
  "#d35400",
  "#e67e22",
  "#f39c12",
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
      description: data.budget_summary.referendums_return_to_aid_locked_fees.description,
      subcategories: [
        {
          name: "Return to Aid",
          value: Math.abs(data.budget_summary.referendums_return_to_aid_locked_fees.amount * 0.7),
        },
        {
          name: "Locked Fees",
          value: Math.abs(data.budget_summary.referendums_return_to_aid_locked_fees.amount * 0.3),
        },
      ],
    },
    {
      name: "Career Employees",
      value: Math.abs(data.budget_summary.career_employees.amount),
      description: data.budget_summary.career_employees.description,
    },
    {
      name: "Office Operations",
      value: Math.abs(data.budget_summary.office_operations.amount),
      description: data.budget_summary.office_operations.description,
    },
    {
      name: "Student Payroll",
      value: Math.abs(data.budget_summary.student_employee_payroll_stipends.amount),
      description: data.budget_summary.student_employee_payroll_stipends.description,
    },
    {
      name: "Other Expenses",
      value: Math.abs(
        data.budget_summary.mandated_reserves_contribution.amount +
        data.budget_summary.general_operations.amount +
        data.budget_summary.senate_operations.amount
      ),
      description: "Combined miscellaneous expenses",
      subcategories: [
        {
          name: "Mandated Reserves",
          value: Math.abs(data.budget_summary.mandated_reserves_contribution.amount),
        },
        {
          name: "General Operations",
          value: Math.abs(data.budget_summary.general_operations.amount),
        },
        {
          name: "Senate Operations",
          value: Math.abs(data.budget_summary.senate_operations.amount),
        },
      ],
    },
  ];

  const treemapData = [
    {
      name: "Revenue",
      children: [
        {
          name: "AS Revenue",
          value: revenue,
          description: data.budget_summary.as_revenue.description,
        },
      ],
    },
    {
      name: "Expenses",
      children: expenses.map(exp => ({
        name: exp.name,
        value: exp.value,
        description: exp.description,
      })),
    },
  ];

  return {
    revenue,
    expenses,
    totalExpenses: expenses.reduce((sum, exp) => sum + exp.value, 0),
    treemapData,
  };
};

const CustomTreemap = ({ data, width, height, color }: any) => {
  return (
    <Treemap
      data={data}
      dataKey="value"
      width={width}
      height={height}
      fill={color}
      label={({ name, value }) => (
        <g>
          <text x={2} y={12} fill="#fff" fontSize={12}>
            {name}
          </text>
          <text x={2} y={24} fill="#fff" fontSize={10}>
            {formatCurrency(value)}
          </text>
        </g>
      )}
    />
  );
};

export default function BudgetPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const processedData = useMemo(() => processBudgetData(budgetData), []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  const renderDrillDown = () => {
    if (!selectedCategory) return null;

    const category = processedData.expenses.find(exp => exp.name === selectedCategory);
    if (!category) return null;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle>{category.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-foreground/80">{category.description}</p>
            {category.subcategories && (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={category.subcategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {category.subcategories.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={formatCurrency} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

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

        {selectedCategory ? (
          renderDrillDown()
        ) : (
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
                    <CardTitle>Revenue vs Expenses</CardTitle>
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
                            <Cell fill={REVENUE_COLORS[0]} />
                            <Cell fill={EXPENSE_COLORS[0]} />
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
                          <Bar dataKey="value" fill={EXPENSE_COLORS[0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Treemap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <CustomTreemap data={processedData.treemapData} />
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
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
                        <Area
                          type="monotone"
                          dataKey="value"
                          fill={REVENUE_COLORS[0]}
                          stroke={REVENUE_COLORS[1]}
                        />
                      </AreaChart>
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
                      <StackedBarChart data={processedData.expenses}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatCurrency} />
                        <Tooltip formatter={formatCurrency} />
                        <StackedBar
                          dataKey="value"
                          fill={EXPENSE_COLORS[0]}
                          onClick={(data) => handleCategoryClick(data.name)}
                        />
                      </StackedBarChart>
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
        )}
      </div>
    </div>
  );
} 