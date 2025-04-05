"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, DollarSign, TrendingDown, Users, Calendar, Plane } from "lucide-react";
import { formatCurrency, calculatePercentage, getColorForIndex } from "@/lib/utils";

interface OfficeOperation {
  amount: number;
  projectsInitiatives?: number;
  marketingOutreach?: number;
  leadershipDevelopment?: number;
  [key: string]: number | undefined;
}

interface BudgetData {
  totalReserves: number;
  income: {
    totalCarryforward: number;
    asCarryforward: number;
    auxiliaryCarryforward: number;
    spacesCarryforward: number;
    asRevenue: number;
  };
  expensesSummary: {
    referendumsAndAid: number;
    careerEmployees: number;
    mandatedReserves: number;
    generalOperations: number;
    officeOperations: number;
    senateOperations: number;
    studentPayrollStipends: number;
    remainingFunds: number;
  };
  officeOperations: Record<string, OfficeOperation>;
  studentSalariesAndStipends: {
    administrativeSalaries: number;
    cabinetStipends: {
      total: number;
      president: number;
      executiveVP: number;
      [key: string]: number;
    };
    senateStipends: {
      total: number;
      [key: string]: number;
    };
    staffStipends: {
      total: number;
      [key: string]: number;
    };
  };
}

// Helper function to find all items with a specific keyword in their path
const findItemsByKeyword = (data: BudgetData, keyword: string): { path: string[], value: number }[] => {
  const results: { path: string[], value: number }[] = [];
  
  const search = (obj: any, path: string[] = []) => {
    if (!obj) return;
    
    // Check if this is a leaf node with a value
    if (typeof obj === 'object' && 'value' in obj) {
      // Check if any part of the path contains the keyword
      if (path.some(p => p.toLowerCase().includes(keyword.toLowerCase()))) {
        results.push({ path, value: obj.value });
      }
      return;
    }
    
    // Recursively search through all properties
    Object.entries(obj).forEach(([key, value]) => {
      if (key !== 'abbreviation' && key !== 'Items' && typeof value === 'object') {
        search(value, [...path, key]);
      }
    });
    
    // Also search through Items if they exist
    if (obj.Items) {
      Object.entries(obj.Items).forEach(([key, value]) => {
        if (typeof value === 'object') {
          search(value, [...path, key]);
        }
      });
    }
  };
  
  search(data);
  return results;
};

// Main component
export function BudgetAnalysis() {
  const [data, setData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch budget data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading budget analysis...</div>;
  }

  if (error || !data) {
    return <div>Error loading budget data: {error}</div>;
  }

  const totalIncome = data.income.asRevenue + data.income.totalCarryforward + 
    data.income.asCarryforward + data.income.auxiliaryCarryforward + 
    data.income.spacesCarryforward;

  const totalExpenses = Object.values(data.expensesSummary).reduce((acc, val) => acc + val, 0);
  
  const deficit = data.expensesSummary.remainingFunds;

  // Prepare data for spending comparison chart
  const spendingComparison = [
    { name: 'Career Employees', amount: Math.abs(data.expensesSummary.careerEmployees) },
    { name: 'Office Operations', amount: Math.abs(data.expensesSummary.officeOperations) },
    { name: 'Student Payroll', amount: Math.abs(data.expensesSummary.studentPayrollStipends) },
    { name: 'General Operations', amount: Math.abs(data.expensesSummary.generalOperations) },
  ];

  // Prepare data for office spending pie chart
  const officeSpending = Object.entries(data.officeOperations)
    .map(([name, details]) => ({
      name: name.replace(/([A-Z])/g, ' $1').trim(), // Add spaces before capital letters
      value: Math.abs(details.amount)
    }))
    .sort((a, b) => b.value - a.value);

  // Prepare data for student vs admin spending
  const studentRelatedSpending = Math.abs(data.studentSalariesAndStipends.administrativeSalaries + 
    data.studentSalariesAndStipends.cabinetStipends.total +
    data.studentSalariesAndStipends.senateStipends.total);
  
  const adminSpending = Math.abs(data.expensesSummary.careerEmployees);

  const spendingComparison2 = [
    { name: 'Student Related', value: studentRelatedSpending },
    { name: 'Administrative', value: adminSpending }
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>AS Revenue and Carryforwards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.income.asRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operating Reserves</CardTitle>
            <CardDescription>Total reserves available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalReserves)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Deficit</CardTitle>
            <CardDescription>Remaining funds after expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(deficit)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for significant deficit */}
      {deficit < -500000 && (
        <Alert variant="destructive">
          <AlertTitle>Significant Budget Deficit Detected</AlertTitle>
          <AlertDescription>
            The current budget shows a deficit of {formatCurrency(deficit)}. This requires immediate attention and potential reallocation of funds.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Analysis Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spending-comparison">Spending Comparison</TabsTrigger>
          <TabsTrigger value="office-breakdown">Office Breakdown</TabsTrigger>
          <TabsTrigger value="student-admin">Student vs Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Total income vs expenses breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Income', value: totalIncome },
                        { name: 'Expenses', value: Math.abs(totalExpenses) }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={160}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#4ade80" />
                      <Cell fill="#f43f5e" />
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spending-comparison">
          <Card>
            <CardHeader>
              <CardTitle>Spending Comparison</CardTitle>
              <CardDescription>Breakdown of major expense categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spendingComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="office-breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Office Spending Breakdown</CardTitle>
              <CardDescription>Detailed view of office operation costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={officeSpending}
                      cx="50%"
                      cy="50%"
                      outerRadius={160}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {officeSpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColorForIndex(index)} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="student-admin">
          <Card>
            <CardHeader>
              <CardTitle>Student vs Administrative Spending</CardTitle>
              <CardDescription>Comparison of student-related and administrative expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spendingComparison2}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {studentRelatedSpending < adminSpending && (
                <Alert className="mt-4">
                  <AlertTitle>Spending Disparity Detected</AlertTitle>
                  <AlertDescription>
                    Administrative spending ({formatCurrency(adminSpending)}) significantly exceeds 
                    student-related spending ({formatCurrency(studentRelatedSpending)}).
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Findings */}
      <Card>
        <CardHeader>
          <CardTitle>Key Findings</CardTitle>
          <CardDescription>Important budget insights and potential issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {deficit < 0 && (
              <div className="flex items-center space-x-2">
                <Badge variant="destructive">Critical</Badge>
                <span>Current budget deficit of {formatCurrency(deficit)}</span>
              </div>
            )}
            {studentRelatedSpending < adminSpending && (
              <div className="flex items-center space-x-2">
                <Badge variant="default">Warning</Badge>
                <span>Administrative spending exceeds student-related spending by {formatCurrency(adminSpending - studentRelatedSpending)}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Badge variant="default">Info</Badge>
              <span>Largest office budget: {formatCurrency(Math.max(...Object.values(data.officeOperations).map(office => Math.abs(office.amount))))}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 