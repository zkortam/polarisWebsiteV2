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

// Define types for our budget data
type BudgetItem = {
  value: number;
  abbreviation?: string;
  [key: string]: any;
};

type BudgetCategory = {
  abbreviation?: string;
  Items?: Record<string, BudgetItem>;
  [key: string]: any;
};

type BudgetData = Record<string, BudgetCategory>;

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

// Helper function to calculate total value for a category
const calculateTotalForCategory = (data: BudgetData, category: string): number => {
  if (!data[category]) return 0;
  
  if ('value' in data[category]) {
    return data[category].value;
  }
  
  if (data[category].Items) {
    return Object.values(data[category].Items).reduce((sum: number, item: any) => {
      if (typeof item === 'object' && 'value' in item) {
        return sum + item.value;
      }
      return sum;
    }, 0);
  }
  
  return 0;
};

// Main component
export function BudgetAnalysis() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Load budget data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/budget.json');
        const data = await response.json();
        setBudgetData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading budget data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate key metrics
  const calculateMetrics = () => {
    if (!budgetData) return null;
    
    // Get revenue and deficit
    const revenue = budgetData["BUDGET SUMMARY"]?.General?.Items?.["2024–2025 AS Revenue"]?.value || 0;
    const deficit = budgetData["BUDGET SUMMARY"]?.General?.Items?.["2024–2025 Remaining Funds (AS Revenue – (Referendums, Return to Aid, Employees, Expendable Funds))"]?.value || 0;
    const reserves = budgetData["OPERATING RESERVES"]?.General?.Items?.["Total Reserves"]?.value || 0;
    
    // Calculate total expenditures
    const totalExpenditures = Math.abs(revenue + deficit);
    
    // Find marketing expenses
    const marketingExpenses = findItemsByKeyword(budgetData, "marketing")
      .reduce((sum, item) => sum + Math.abs(item.value), 0);
    
    // Find administration expenses
    const adminExpenses = findItemsByKeyword(budgetData, "admin")
      .reduce((sum, item) => sum + Math.abs(item.value), 0);
    
    // Find travel expenses
    const travelExpenses = findItemsByKeyword(budgetData, "travel")
      .reduce((sum, item) => sum + Math.abs(item.value), 0);
    
    // Find one-day events
    const oneDayEvents = [
      ...findItemsByKeyword(budgetData, "sun god"),
      ...findItemsByKeyword(budgetData, "bear garden"),
      ...findItemsByKeyword(budgetData, "day one"),
      ...findItemsByKeyword(budgetData, "horizon")
    ].reduce((sum, item) => sum + Math.abs(item.value), 0);
    
    // Find club funding
    const clubFunding = findItemsByKeyword(budgetData, "student organization")
      .reduce((sum, item) => sum + Math.abs(item.value), 0);
    
    // Find questionable expenses
    const questionableExpenses = [
      ...findItemsByKeyword(budgetData, "new york times"),
      ...findItemsByKeyword(budgetData, "fluffy"),
      ...findItemsByKeyword(budgetData, "vending"),
      ...findItemsByKeyword(budgetData, "period project")
    ];
    
    return {
      revenue,
      deficit,
      reserves,
      totalExpenditures,
      marketingExpenses,
      adminExpenses,
      travelExpenses,
      oneDayEvents,
      clubFunding,
      questionableExpenses
    };
  };
  
  // Prepare data for charts
  const prepareChartData = () => {
    if (!budgetData) return null;
    
    const metrics = calculateMetrics();
    if (!metrics) return null;
    
    // Income vs Expenditures
    const incomeVsExpenditures = [
      { name: "Revenue", value: metrics.revenue },
      { name: "Deficit", value: Math.abs(metrics.deficit) }
    ];
    
    // Student vs Administration
    const studentVsAdmin = [
      { name: "Student-Focused", value: metrics.clubFunding },
      { name: "Administration", value: metrics.adminExpenses }
    ];
    
    // Marketing, Admin, Events vs Club Funding
    const spendingComparison = [
      { name: "Marketing", value: metrics.marketingExpenses },
      { name: "Administration", value: metrics.adminExpenses },
      { name: "One-Day Events", value: metrics.oneDayEvents },
      { name: "Club Funding", value: metrics.clubFunding }
    ];
    
    // Travel expenses
    const travelData = findItemsByKeyword(budgetData, "travel")
      .map(item => ({
        name: item.path[item.path.length - 1],
        value: Math.abs(item.value)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
    
    // Questionable expenses
    const questionableData = metrics.questionableExpenses
      .map(item => ({
        name: item.path[item.path.length - 1],
        value: Math.abs(item.value)
      }))
      .sort((a, b) => b.value - a.value);
    
    return {
      incomeVsExpenditures,
      studentVsAdmin,
      spendingComparison,
      travelData,
      questionableData
    };
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!budgetData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Error Loading Budget Data</h2>
        <p className="text-foreground/70">Please try again later.</p>
      </div>
    );
  }
  
  const metrics = calculateMetrics();
  const chartData = prepareChartData();
  
  if (!metrics || !chartData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Error Processing Budget Data</h2>
        <p className="text-foreground/70">Please try again later.</p>
      </div>
    );
  }
  
  // Colors for charts
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", 
    "#82CA9D", "#FFC658", "#FF7C43", "#A4DE6C", "#D0ED57"
  ];
  
  return (
    <div className="space-y-8">
      {/* Summary Alert */}
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Budget Deficit Alert</AlertTitle>
        <AlertDescription>
          The AS budget shows a significant deficit of {formatCurrency(Math.abs(metrics.deficit))}. 
          This means AS is spending more than it's bringing in, which could lead to future budget cuts.
        </AlertDescription>
      </Alert>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.revenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">2024-2025 AS Revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deficit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(Math.abs(metrics.deficit))}</div>
            <p className="text-xs text-muted-foreground mt-1">Money spent over revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Operating Reserves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.reserves)}</div>
            <p className="text-xs text-muted-foreground mt-1">Money in the bank</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different analyses */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="student">Student vs Admin</TabsTrigger>
          <TabsTrigger value="spending">Spending Comparison</TabsTrigger>
          <TabsTrigger value="travel">Travel Expenses</TabsTrigger>
          <TabsTrigger value="questionable">Questionable Expenses</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenditures</CardTitle>
              <CardDescription>
                A comparison of AS revenue versus the deficit (money spent over revenue)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.incomeVsExpenditures}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.incomeVsExpenditures.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Revenue:</span>
                  <span>{formatCurrency(metrics.revenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Deficit:</span>
                  <span className="text-red-500">{formatCurrency(Math.abs(metrics.deficit))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Expenditures:</span>
                  <span>{formatCurrency(metrics.totalExpenditures)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Alert>
            <DollarSign className="h-4 w-4" />
            <AlertTitle>Budget Analysis</AlertTitle>
            <AlertDescription>
              The AS budget shows a significant deficit of {formatCurrency(Math.abs(metrics.deficit))}, 
              meaning AS is spending more than it's bringing in. This could lead to future budget cuts 
              or increased fees for students. The total revenue is {formatCurrency(metrics.revenue)}, 
              but total expenditures are {formatCurrency(metrics.totalExpenditures)}.
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        {/* Student vs Admin Tab */}
        <TabsContent value="student" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student-Focused vs Administrative Costs</CardTitle>
              <CardDescription>
                A comparison of money spent directly on students versus administrative overhead
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.studentVsAdmin}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.studentVsAdmin.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Student-Focused Spending:</span>
                  <span>{formatCurrency(metrics.clubFunding)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Administrative Costs:</span>
                  <span>{formatCurrency(metrics.adminExpenses)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Ratio (Admin:Student):</span>
                  <span>{(metrics.adminExpenses / metrics.clubFunding).toFixed(2)}:1</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Alert>
            <Users className="h-4 w-4" />
            <AlertTitle>Administrative Overhead</AlertTitle>
            <AlertDescription>
              For every {formatCurrency(metrics.clubFunding / 10)} spent on student organizations, 
              AS spends {formatCurrency(metrics.adminExpenses / 10)} on administrative costs. 
              This high administrative overhead ratio of {(metrics.adminExpenses / metrics.clubFunding).toFixed(2)}:1 
              suggests inefficiency in how student fees are being allocated.
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        {/* Spending Comparison Tab */}
        <TabsContent value="spending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending Comparison</CardTitle>
              <CardDescription>
                A comparison of marketing, administration, one-day events, and club funding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.spendingComparison}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value).replace('$', '')} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Marketing Expenses:</span>
                  <span>{formatCurrency(metrics.marketingExpenses)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Administrative Expenses:</span>
                  <span>{formatCurrency(metrics.adminExpenses)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">One-Day Events:</span>
                  <span>{formatCurrency(metrics.oneDayEvents)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Club Funding:</span>
                  <span>{formatCurrency(metrics.clubFunding)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertTitle>Event vs. Club Funding Disparity</AlertTitle>
            <AlertDescription>
              AS spends {formatCurrency(metrics.oneDayEvents)} on one-day events like Sun God Festival, 
              Bear Gardens, and Day One, while only allocating {formatCurrency(metrics.clubFunding)} 
              for student organizations for the entire year. This means AS spends 
              {(metrics.oneDayEvents / metrics.clubFunding).toFixed(2)}x more on a few events than 
              it does on supporting hundreds of student clubs and organizations.
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        {/* Travel Expenses Tab */}
        <TabsContent value="travel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Travel Expenses</CardTitle>
              <CardDescription>
                Top travel-related expenses in the AS budget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.travelData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => formatCurrency(value).replace('$', '')} />
                    <YAxis type="category" dataKey="name" width={90} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Total Travel Expenses: {formatCurrency(metrics.travelExpenses)}</h3>
                <p className="text-sm text-muted-foreground">
                  This represents money spent on travel for AS officials and staff, which could potentially 
                  be reduced to allocate more funds to student programs.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Alert>
            <Plane className="h-4 w-4" />
            <AlertTitle>Travel Expense Concerns</AlertTitle>
            <AlertDescription>
              AS spends {formatCurrency(metrics.travelExpenses)} on travel expenses, which is 
              {(metrics.travelExpenses / metrics.clubFunding * 100).toFixed(1)}% of the total club funding. 
              While some travel is necessary for AS representatives to attend conferences and meetings, 
              the amount spent on travel could be reviewed for potential savings.
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        {/* Questionable Expenses Tab */}
        <TabsContent value="questionable" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Questionable Expenses</CardTitle>
              <CardDescription>
                Expenses that may raise concerns about budget priorities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.questionableData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => formatCurrency(value).replace('$', '')} />
                    <YAxis type="category" dataKey="name" width={90} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="value" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-4">
                {chartData.questionableData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium">{item.name}:</span>
                    <span>{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Questionable Spending Priorities</AlertTitle>
            <AlertDescription>
              The AS budget includes several questionable expenses that may not align with student priorities. 
              For example, AS spends {formatCurrency(chartData.questionableData[0]?.value || 0)} on 
              {chartData.questionableData[0]?.name.toLowerCase() || "questionable items"}, 
              which could be reallocated to support more student programs and services.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
      
      {/* Conclusion */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Budget Mismanagement Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The AS budget analysis reveals several concerning patterns that suggest budget mismanagement:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Significant Deficit:</strong> AS is spending {formatCurrency(Math.abs(metrics.deficit))} 
              more than it's bringing in, which could lead to future budget cuts or increased fees.
            </li>
            <li>
              <strong>High Administrative Overhead:</strong> For every dollar spent on student organizations, 
              AS spends {(metrics.adminExpenses / metrics.clubFunding).toFixed(2)} dollars on administrative costs.
            </li>
            <li>
              <strong>Event vs. Club Funding Disparity:</strong> AS spends 
              {(metrics.oneDayEvents / metrics.clubFunding).toFixed(2)}x more on a few one-day events than 
              it does on supporting hundreds of student clubs for the entire year.
            </li>
            <li>
              <strong>Questionable Expenses:</strong> The budget includes several questionable expenses that 
              may not align with student priorities, such as {chartData.questionableData[0]?.name.toLowerCase() || "questionable items"}.
            </li>
          </ul>
          <p>
            These findings suggest that AS could improve its budget management by reducing administrative overhead, 
            reallocating funds from one-day events to ongoing student programs, and eliminating questionable expenses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 