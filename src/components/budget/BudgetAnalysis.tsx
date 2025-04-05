"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Sankey, Tooltip as SankeyTooltip
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, DollarSign, TrendingDown, Users, Calendar, Plane, ChevronLeft, ChevronRight, Home } from "lucide-react";
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

// Helper function to get items at a specific path
const getItemsAtPath = (data: BudgetData, path: string[]): any[] => {
  if (!data || path.length === 0) return [];
  
  let current = data;
  for (const segment of path) {
    if (!current[segment]) return [];
    current = current[segment];
  }
  
  // If we've reached a leaf node with a value, return it
  if (typeof current === 'object' && 'value' in current) {
    return [{ path, value: current.value }];
  }
  
  // If we've reached an Items object, return its children
  if (current.Items) {
    return Object.entries(current.Items).map(([key, value]) => {
      if (typeof value === 'object' && 'value' in value) {
        return { path: [...path, key], value: value.value };
      }
      return null;
    }).filter(Boolean);
  }
  
  // If we've reached a category, return its subcategories
  return Object.entries(current)
    .filter(([key]) => key !== 'abbreviation' && key !== 'Items')
    .map(([key, value]) => {
      if (typeof value === 'object') {
        return { path: [...path, key], value: calculateTotalForCategory(data, [...path, key].join('.')) };
      }
      return null;
    }).filter(Boolean);
};

// Helper function to calculate total value for a category
const calculateTotalForCategory = (data: BudgetData, categoryPath: string): number => {
  const path = categoryPath.split('.');
  let current: any = data;
  
  for (const segment of path) {
    if (!current[segment]) return 0;
    current = current[segment];
  }
  
  if ('value' in current) {
    return current.value;
  }
  
  if (current.Items) {
    return Object.values(current.Items).reduce((sum: number, item: any) => {
      if (typeof item === 'object' && 'value' in item) {
        return sum + item.value;
      }
      return sum;
    }, 0);
  }
  
  return 0;
};

const COLORS = {
  revenue: "#4CAF50",
  studentFunding: "#2196F3",
  adminCosts: "#F44336",
  events: "#FFC107",
  other: "#9C27B0",
};

const CHART_COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
  "#82CA9D", "#FFC658", "#FF7C43", "#A4DE6C", "#D0ED57"
];

// Add a Breadcrumb component to show the drill-down path
const Breadcrumb: React.FC<{
  history: Array<{level: number, category: string, path: string[]}>,
  onNavigate: (index: number) => void
}> = ({ history, onNavigate }) => {
  if (history.length <= 1) return null;
  
  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      <button 
        onClick={() => onNavigate(0)}
        className="flex items-center hover:text-primary"
      >
        <Home className="h-4 w-4 mr-1" />
        <span>Overview</span>
      </button>
      
      {history.slice(1).map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4" />
          <button 
            onClick={() => onNavigate(index + 1)}
            className="hover:text-primary"
          >
            {item.category}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

const BudgetAnalysis: React.FC = () => {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Drill-down state
  const [drillDownLevel, setDrillDownLevel] = useState<number>(0);
  const [drillDownCategory, setDrillDownCategory] = useState<string>("");
  const [drillDownData, setDrillDownData] = useState<any[]>([]);
  const [drillDownHistory, setDrillDownHistory] = useState<Array<{level: number, category: string, path: string[]}>>([]);
  
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
  
  // Handle drill-down for student vs admin
  const handleStudentVsAdminDrillDown = (entry: any) => {
    if (!budgetData) return;
    
    const category = entry.name;
    const currentPath = drillDownLevel === 0 ? [] : drillDownHistory[drillDownHistory.length - 1].path;
    
    // Update drill-down state
    setDrillDownCategory(category);
    setDrillDownLevel(drillDownLevel + 1);
    setDrillDownHistory([...drillDownHistory, { level: drillDownLevel, category, path: currentPath }]);
    
    let detailedData: any[] = [];
    
    if (drillDownLevel === 0) {
      // First level drill-down
      if (category === "Student-Focused") {
        // Get detailed student funding data
        const studentOrgData = findItemsByKeyword(budgetData, "student organization");
        detailedData = studentOrgData
          .map(item => ({
            name: item.path[item.path.length - 1],
            value: Math.abs(item.value),
            path: item.path
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
      } else if (category === "Administration") {
        // Get detailed admin expenses data
        const adminData = findItemsByKeyword(budgetData, "admin");
        detailedData = adminData
          .map(item => ({
            name: item.path[item.path.length - 1],
            value: Math.abs(item.value),
            path: item.path
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
      }
    } else {
      // Deeper level drill-down
      const path = entry.path || [];
      detailedData = getItemsAtPath(budgetData, path)
        .map(item => ({
          name: item.path[item.path.length - 1],
          value: Math.abs(item.value),
          path: item.path
        }))
        .sort((a, b) => b.value - a.value);
    }
    
    setDrillDownData(detailedData);
  };
  
  // Handle drill-down for spending comparison
  const handleSpendingComparisonDrillDown = (entry: any) => {
    if (!budgetData) return;
    
    const category = entry.name;
    const currentPath = drillDownLevel === 0 ? [] : drillDownHistory[drillDownHistory.length - 1].path;
    
    // Update drill-down state
    setDrillDownCategory(category);
    setDrillDownLevel(drillDownLevel + 1);
    setDrillDownHistory([...drillDownHistory, { level: drillDownLevel, category, path: currentPath }]);
    
    let detailedData: any[] = [];
    
    if (drillDownLevel === 0) {
      // First level drill-down
      if (category === "Marketing") {
        const marketingData = findItemsByKeyword(budgetData, "marketing");
        detailedData = marketingData
          .map(item => ({
            name: item.path[item.path.length - 1],
            value: Math.abs(item.value),
            path: item.path
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
      } else if (category === "Administration") {
        const adminData = findItemsByKeyword(budgetData, "admin");
        detailedData = adminData
          .map(item => ({
            name: item.path[item.path.length - 1],
            value: Math.abs(item.value),
            path: item.path
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
      } else if (category === "One-Day Events") {
        const eventsData = [
          ...findItemsByKeyword(budgetData, "sun god"),
          ...findItemsByKeyword(budgetData, "bear garden"),
          ...findItemsByKeyword(budgetData, "day one"),
          ...findItemsByKeyword(budgetData, "horizon")
        ];
        detailedData = eventsData
          .map(item => ({
            name: item.path[item.path.length - 1],
            value: Math.abs(item.value),
            path: item.path
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
      } else if (category === "Club Funding") {
        const clubData = findItemsByKeyword(budgetData, "student organization");
        detailedData = clubData
          .map(item => ({
            name: item.path[item.path.length - 1],
            value: Math.abs(item.value),
            path: item.path
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
      }
    } else {
      // Deeper level drill-down
      const path = entry.path || [];
      detailedData = getItemsAtPath(budgetData, path)
        .map(item => ({
          name: item.path[item.path.length - 1],
          value: Math.abs(item.value),
          path: item.path
        }))
        .sort((a, b) => b.value - a.value);
    }
    
    setDrillDownData(detailedData);
  };
  
  // Handle drill-down for travel expenses
  const handleTravelDrillDown = (entry: any) => {
    if (!budgetData) return;
    
    const category = entry.name;
    const currentPath = drillDownLevel === 0 ? [] : drillDownHistory[drillDownHistory.length - 1].path;
    
    // Update drill-down state
    setDrillDownCategory(category);
    setDrillDownLevel(drillDownLevel + 1);
    setDrillDownHistory([...drillDownHistory, { level: drillDownLevel, category, path: currentPath }]);
    
    let detailedData: any[] = [];
    
    if (drillDownLevel === 0) {
      // First level drill-down
      const travelData = findItemsByKeyword(budgetData, "travel")
        .filter(item => item.path[item.path.length - 1] === category)
        .map(item => ({
          name: item.path.slice(0, -1).join(" > "),
          value: Math.abs(item.value),
          path: item.path
        }))
        .sort((a, b) => b.value - a.value);
      
      detailedData = travelData;
    } else {
      // Deeper level drill-down
      const path = entry.path || [];
      detailedData = getItemsAtPath(budgetData, path)
        .map(item => ({
          name: item.path[item.path.length - 1],
          value: Math.abs(item.value),
          path: item.path
        }))
        .sort((a, b) => b.value - a.value);
    }
    
    setDrillDownData(detailedData);
  };
  
  // Handle drill-down for questionable expenses
  const handleQuestionableDrillDown = (entry: any) => {
    if (!budgetData) return;
    
    const category = entry.name;
    const currentPath = drillDownLevel === 0 ? [] : drillDownHistory[drillDownHistory.length - 1].path;
    
    // Update drill-down state
    setDrillDownCategory(category);
    setDrillDownLevel(drillDownLevel + 1);
    setDrillDownHistory([...drillDownHistory, { level: drillDownLevel, category, path: currentPath }]);
    
    let detailedData: any[] = [];
    
    if (drillDownLevel === 0) {
      // First level drill-down
      const keyword = category.toLowerCase().replace(/\s+/g, "");
      const questionableData = findItemsByKeyword(budgetData, keyword)
        .map(item => ({
          name: item.path.slice(0, -1).join(" > "),
          value: Math.abs(item.value),
          path: item.path
        }))
        .sort((a, b) => b.value - a.value);
      
      detailedData = questionableData;
    } else {
      // Deeper level drill-down
      const path = entry.path || [];
      detailedData = getItemsAtPath(budgetData, path)
        .map(item => ({
          name: item.path[item.path.length - 1],
          value: Math.abs(item.value),
          path: item.path
        }))
        .sort((a, b) => b.value - a.value);
    }
    
    setDrillDownData(detailedData);
  };
  
  // Update the handleGoBack function to support navigation to any level
  const handleNavigateToLevel = (level: number) => {
    if (level < 0 || level >= drillDownHistory.length) return;
    
    const newHistory = drillDownHistory.slice(0, level + 1);
    const targetLevel = newHistory[newHistory.length - 1];
    
    setDrillDownLevel(targetLevel.level);
    setDrillDownCategory(targetLevel.category);
    setDrillDownHistory(newHistory);
    
    // If going back to top level, reset drill-down data
    if (targetLevel.level === 0) {
      setDrillDownData([]);
    } else {
      // Otherwise, get data for the target level
      const path = targetLevel.path || [];
      const levelData = getItemsAtPath(budgetData!, path)
        .map(item => ({
          name: item.path[item.path.length - 1],
          value: Math.abs(item.value),
          path: item.path
        }))
        .sort((a, b) => b.value - a.value);
      
      setDrillDownData(levelData);
    }
  };
  
  // Keep the original handleGoBack function for backward compatibility
  const handleGoBack = () => {
    if (drillDownHistory.length > 1) {
      handleNavigateToLevel(drillDownHistory.length - 2);
    } else {
      // Reset to top level
      setDrillDownLevel(0);
      setDrillDownCategory("");
      setDrillDownHistory([]);
      setDrillDownData([]);
    }
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
  
  const sankeyData = {
    nodes: [
      { name: "Total Revenue", color: COLORS.revenue },
      { name: "Student Funding", color: COLORS.studentFunding },
      { name: "Administrative Costs", color: COLORS.adminCosts },
      { name: "Events & Activities", color: COLORS.events },
      { name: "Other Expenses", color: COLORS.other },
    ],
    links: [
      {
        source: 0,
        target: 1,
        value: metrics.clubFunding,
      },
      {
        source: 0,
        target: 2,
        value: metrics.adminExpenses,
      },
      {
        source: 0,
        target: 3,
        value: metrics.oneDayEvents,
      },
      {
        source: 0,
        target: 4,
        value: metrics.marketingExpenses,
      },
    ],
  };

  const CustomSankeyTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">
            {data.source.name} → {data.target.name}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {calculatePercentage(data.value, metrics.revenue)}% of total revenue
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-8 p-6">
      {/* Summary Alert */}
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Budget Deficit Alert</AlertTitle>
        <AlertDescription>
          The AS budget shows a significant deficit of {formatCurrency(Math.abs(metrics.deficit))}. 
          This means AS is spending more than it's bringing in, which could lead to future budget cuts.
        </AlertDescription>
      </Alert>
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        history={drillDownHistory} 
        onNavigate={handleNavigateToLevel} 
      />
      
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
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="student-vs-admin">Student vs Admin</TabsTrigger>
          <TabsTrigger value="spending">Spending Comparison</TabsTrigger>
          <TabsTrigger value="travel">Travel Expenses</TabsTrigger>
          <TabsTrigger value="questionable">Questionable Expenses</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenditures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <Sankey
                    data={sankeyData}
                    node={{
                      fill: "#8884d8",
                      opacity: 0.8,
                      className: "text-white",
                    }}
                    link={{
                      fill: "#8884d8",
                      opacity: 0.4,
                    }}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <SankeyTooltip content={<CustomSankeyTooltip />} />
                  </Sankey>
                </ResponsiveContainer>
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
        <TabsContent value="student-vs-admin" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {drillDownLevel === 0 
                    ? "Student-Focused vs Administrative Costs" 
                    : `Details: ${drillDownCategory}`}
                </CardTitle>
                {drillDownLevel > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Click on items to see more details
                  </p>
                )}
              </div>
              {drillDownLevel > 0 && (
                <button 
                  onClick={() => handleNavigateToLevel(drillDownHistory.length - 2)}
                  className="flex items-center text-sm text-blue-500 hover:text-blue-700"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </button>
              )}
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {drillDownLevel === 0 ? (
                  <motion.div
                    key="student-vs-admin-chart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={400} height={400}>
                        <Pie
                          data={chartData?.studentVsAdmin || []}
                          cx={200}
                          cy={200}
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData?.studentVsAdmin?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getColorForIndex(index)} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                ) : (
                  <motion.div
                    key="drill-down-chart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={drillDownData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis tickFormatter={(value) => formatCurrency(value).replace('$', '')} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="value" fill={CHART_COLORS[0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </AnimatePresence>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {drillDownLevel === 0 
                    ? "Spending Comparison" 
                    : `Details: ${drillDownCategory}`}
                </CardTitle>
                {drillDownLevel > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Click on items to see more details
                  </p>
                )}
              </div>
              {drillDownLevel > 0 && (
                <button 
                  onClick={() => handleNavigateToLevel(drillDownHistory.length - 2)}
                  className="flex items-center text-sm text-blue-500 hover:text-blue-700"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </button>
              )}
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {drillDownLevel === 0 ? (
                  <motion.div
                    key="spending-comparison-chart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={600}
                        height={300}
                        data={chartData?.spendingComparison || []}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => formatCurrency(value).replace('$', '')} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          fill={CHART_COLORS[0]} 
                          onClick={handleSpendingComparisonDrillDown}
                          style={{ cursor: 'pointer' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                ) : (
                  <motion.div
                    key="drill-down-chart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={drillDownData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis tickFormatter={(value) => formatCurrency(value).replace('$', '')} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="value" fill={CHART_COLORS[1]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </AnimatePresence>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {drillDownLevel === 0 
                    ? "Travel Expenses" 
                    : `Details: ${drillDownCategory}`}
                </CardTitle>
                {drillDownLevel > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Click on items to see more details
                  </p>
                )}
              </div>
              {drillDownLevel > 0 && (
                <button 
                  onClick={() => handleNavigateToLevel(drillDownHistory.length - 2)}
                  className="flex items-center text-sm text-blue-500 hover:text-blue-700"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </button>
              )}
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {drillDownLevel === 0 ? (
                  <motion.div
                    key="travel-expenses-chart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={600}
                        height={300}
                        data={chartData?.travelData || []}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => formatCurrency(value).replace('$', '')} />
                        <YAxis type="category" dataKey="name" width={90} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          fill={CHART_COLORS[1]} 
                          onClick={handleTravelDrillDown}
                          style={{ cursor: 'pointer' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                ) : (
                  <motion.div
                    key="drill-down-chart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={drillDownData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis tickFormatter={(value) => formatCurrency(value).replace('$', '')} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="value" fill={CHART_COLORS[2]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </AnimatePresence>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {drillDownLevel === 0 
                    ? "Questionable Expenses" 
                    : `Details: ${drillDownCategory}`}
                </CardTitle>
                {drillDownLevel > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Click on items to see more details
                  </p>
                )}
              </div>
              {drillDownLevel > 0 && (
                <button 
                  onClick={() => handleNavigateToLevel(drillDownHistory.length - 2)}
                  className="flex items-center text-sm text-blue-500 hover:text-blue-700"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </button>
              )}
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {drillDownLevel === 0 ? (
                  <motion.div
                    key="questionable-expenses-chart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={600}
                        height={300}
                        data={chartData?.questionableData || []}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => formatCurrency(value).replace('$', '')} />
                        <YAxis type="category" dataKey="name" width={90} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          fill={CHART_COLORS[2]} 
                          onClick={handleQuestionableDrillDown}
                          style={{ cursor: 'pointer' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                ) : (
                  <motion.div
                    key="drill-down-chart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={drillDownData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis tickFormatter={(value) => formatCurrency(value).replace('$', '')} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="value" fill={CHART_COLORS[3]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
          
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Questionable Spending Priorities</AlertTitle>
            <AlertDescription>
              The AS budget includes several questionable expenses that may not align with student priorities. 
              For example, AS spends {formatCurrency(chartData?.questionableData?.[0]?.value || 0)} on 
              {chartData?.questionableData?.[0]?.name?.toLowerCase() || "questionable items"}, 
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
              <strong>Significant Deficit:</strong> AS is spending {formatCurrency(Math.abs(metrics?.deficit || 0))} 
              more than it's bringing in, which could lead to future budget cuts or increased fees.
            </li>
            <li>
              <strong>High Administrative Overhead:</strong> For every dollar spent on student organizations, 
              AS spends {((metrics?.adminExpenses || 0) / (metrics?.clubFunding || 1)).toFixed(2)} dollars on administrative costs.
            </li>
            <li>
              <strong>Event vs. Club Funding Disparity:</strong> AS spends 
              {((metrics?.oneDayEvents || 0) / (metrics?.clubFunding || 1)).toFixed(2)}x more on a few one-day events than 
              it does on supporting hundreds of student clubs for the entire year.
            </li>
            <li>
              <strong>Questionable Expenses:</strong> The budget includes several questionable expenses that 
              may not align with student priorities, such as {chartData?.questionableData?.[0]?.name?.toLowerCase() || "questionable items"}.
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
};

export default BudgetAnalysis; 