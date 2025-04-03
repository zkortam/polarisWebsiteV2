"use client";

import React, { useState, useEffect } from "react";
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
  Treemap,
  TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Color palette for charts
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

interface BudgetData {
  metadata: {
    title: string;
    abbr: string;
    sponsored_by: string;
    approved_by: string;
    fiscal_year: string;
    total_revenue: number;
    total_allocations: number;
  };
  funds: Fund[];
}

interface Fund {
  id: string;
  name: string;
  abbr: string;
  type: string;
  amount: number;
  description?: string;
  children?: Fund[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 p-4 rounded-lg shadow-lg border border-primary/20">
        <p className="font-medium">{label}</p>
        <p className="text-sm">
          Amount: ${Math.abs(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function BudgetPage() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("overview");

  useEffect(() => {
    fetch("/budget.json")
      .then((res) => res.json())
      .then((data) => setBudgetData(data))
      .catch((error) => console.error("Error loading budget data:", error));
  }, []);

  if (!budgetData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading budget data...</div>
      </div>
    );
  }

  // Prepare data for different visualizations
  const revenueData = budgetData.funds
    .filter((fund) => fund.type === "income")
    .map((fund) => ({
      name: fund.name,
      amount: fund.amount,
    }));

  const expenditureData = budgetData.funds
    .filter((fund) => fund.type === "expenditure")
    .map((fund) => ({
      name: fund.name,
      amount: Math.abs(fund.amount),
    }));

  const treemapData = budgetData.funds.map((fund) => ({
    name: fund.name,
    size: Math.abs(fund.amount),
    children: fund.children?.map((child) => ({
      name: child.name,
      size: Math.abs(child.amount),
    })),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-4">
          Budget Visualization
        </h1>
        <p className="text-foreground/80">
          Explore how Associated Students allocates resources for the{" "}
          {budgetData.metadata.fiscal_year} fiscal year
        </p>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenditures">Expenditures</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue vs. Expenditures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Revenue",
                          amount: budgetData.metadata.total_revenue,
                        },
                        {
                          name: "Expenditures",
                          amount: Math.abs(budgetData.metadata.total_allocations),
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="amount" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueData}
                        dataKey="amount"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label
                      >
                        {revenueData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenditures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expenditure Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={treemapData}
                    dataKey="size"
                    nameKey="name"
                    fill="#8884d8"
                  >
                    <Tooltip content={<CustomTooltip />} />
                  </Treemap>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetData.funds.map((fund) => (
                  <div key={fund.id} className="border-b border-primary/20 pb-4">
                    <h3 className="text-lg font-semibold mb-2">{fund.name}</h3>
                    <p className="text-foreground/80 mb-2">
                      Amount: ${Math.abs(fund.amount).toLocaleString()}
                    </p>
                    {fund.description && (
                      <p className="text-sm text-foreground/60">
                        {fund.description}
                      </p>
                    )}
                    {fund.children && fund.children.length > 0 && (
                      <div className="mt-2 pl-4">
                        {fund.children.map((child) => (
                          <div key={child.id} className="mb-1">
                            <span className="font-medium">{child.name}:</span>{" "}
                            ${Math.abs(child.amount).toLocaleString()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 