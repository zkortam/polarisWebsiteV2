"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChevronLeft, ChevronRight, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, calculatePercentage, getColorForIndex } from "@/lib/utils";
import { parseBudgetData } from "@/lib/budgetParser";

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

// Component to display a breadcrumb navigation
const Breadcrumb = ({ path, onNavigate }: { path: string[], onNavigate: (index: number) => void }) => {
  return (
    <div className="flex items-center space-x-2 mb-4 text-sm">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onNavigate(-1)}
        className="text-primary hover:text-primary/80"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Button>
      <span className="text-foreground/50">/</span>
      {path.map((item, index) => (
        <React.Fragment key={index}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigate(index)}
            className="text-foreground/70 hover:text-primary"
          >
            {item}
          </Button>
          {index < path.length - 1 && <span className="text-foreground/50">/</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

// Component to display a pie chart
const BudgetPieChart = ({ data }: { data: { name: string; value: number }[] }) => {
  const COLORS = data.map((_, index) => getColorForIndex(index));
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
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
  );
};

// Component to display a bar chart
const BudgetBarChart = ({ data }: { data: { name: string; value: number }[] }) => {
  const maxValue = Math.max(...data.map(item => Math.abs(item.value)));
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{item.name}</span>
            <span className={item.value < 0 ? "text-red-500" : "text-green-500"}>
              {formatCurrency(item.value)}
            </span>
          </div>
          <Progress 
            value={Math.abs(item.value) / maxValue * 100} 
            className={item.value < 0 ? "bg-red-200" : "bg-green-200"}
          />
        </div>
      ))}
    </div>
  );
};

// Component to display a table of budget items
const BudgetTable = ({ data }: { data: Record<string, BudgetItem> }) => {
  const items = Object.entries(data).filter(([key, value]) => 
    typeof value === 'object' && 'value' in value
  );
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 font-medium">Item</th>
            <th className="text-right py-2 font-medium">Amount</th>
            <th className="text-right py-2 font-medium">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {items.map(([key, item], index) => (
            <tr key={index} className="border-b hover:bg-muted/50">
              <td className="py-2">{key}</td>
              <td className={`text-right py-2 ${item.value < 0 ? "text-red-500" : "text-green-500"}`}>
                {formatCurrency(item.value)}
              </td>
              <td className="text-right py-2">
                {calculatePercentage(item.value, items.reduce((sum, [_, i]) => sum + Math.abs(i.value), 0))}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main component
export function BudgetVisualizer() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [navigationPath, setNavigationPath] = useState<string[]>([]);
  const [currentData, setCurrentData] = useState<any>(null);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loading, setLoading] = useState<boolean>(true);

  // Load budget data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/data.txt');
        const rawData = await response.text();
        const data = parseBudgetData(rawData);
        setBudgetData(data);
        setCurrentData(data);
        setLoading(false);
        
        // Prepare initial chart data
        const topLevelData = Object.entries(data).map(([key, value]) => ({
          name: key,
          value: typeof value === 'object' && 'value' in value ? (value.value as number) : 0
        }));
        setChartData(topLevelData);
      } catch (error) {
        console.error("Error loading budget data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle navigation
  const handleNavigate = (index: number) => {
    if (!budgetData) return;
    
    if (index === -1) {
      // Go back one level
      if (navigationPath.length > 0) {
        const newPath = [...navigationPath];
        newPath.pop();
        setNavigationPath(newPath);
        
        // Update current data based on new path
        let newData = budgetData;
        for (const pathItem of newPath) {
          if (newData && typeof newData === 'object') {
            newData = newData[pathItem];
          }
        }
        setCurrentData(newData);
        
        // Update chart data
        if (newData && typeof newData === 'object' && 'Items' in newData) {
          const itemsData = Object.entries(newData.Items).map(([key, value]) => ({
            name: key,
            value: typeof value === 'object' && value !== null && 'value' in value ? 
              (value.value as number) || 0 : 0
          }));
          setChartData(itemsData);
        } else {
          const topLevelData = Object.entries(budgetData).map(([key, value]) => ({
            name: key,
            value: typeof value === 'object' && 'value' in value ? (value.value as number) : 0
          }));
          setChartData(topLevelData);
        }
      }
    } else {
      // Navigate to specific level
      const newPath = navigationPath.slice(0, index + 1);
      setNavigationPath(newPath);
      
      // Update current data based on new path
      let newData = budgetData;
      for (const pathItem of newPath) {
        if (newData && typeof newData === 'object') {
          newData = newData[pathItem];
        }
      }
      setCurrentData(newData);
      
      // Update chart data
      if (newData && typeof newData === 'object' && 'Items' in newData) {
        const itemsData = Object.entries(newData.Items).map(([key, value]) => ({
          name: key,
          value: typeof value === 'object' && value !== null && 'value' in value ? 
            (value.value as number) || 0 : 0
        }));
        setChartData(itemsData);
      }
    }
  };

  // Handle item click
  const handleItemClick = (itemName: string) => {
    if (currentData && currentData[itemName]) {
      const newPath = [...navigationPath, itemName];
      setNavigationPath(newPath);
      
      const newData = currentData[itemName];
      setCurrentData(newData);
      
      // Update chart data if the item has sub-items
      if (newData.Items) {
        const itemsData = Object.entries(newData.Items).map(([key, value]) => ({
          name: key,
          value: typeof value === 'object' && value !== null && 'value' in value ? 
            (value.value as number) || 0 : 0
        }));
        setChartData(itemsData);
      }
    }
  };

  // Get total value for current view
  const getTotalValue = () => {
    if (!currentData) return 0;
    
    if (currentData.Items) {
      return Object.values(currentData.Items).reduce((sum: number, item: any) => {
        if (typeof item === 'object' && 'value' in item) {
          return sum + item.value;
        }
        return sum;
      }, 0);
    }
    
    if ('value' in currentData) {
      return currentData.value;
    }
    
    return 0;
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

  return (
    <div className="space-y-6">
      <Breadcrumb path={navigationPath} onNavigate={handleNavigate} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {navigationPath.length > 0 
                ? navigationPath[navigationPath.length - 1] 
                : "AS Budget Overview"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">
                  <PieChartIcon className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="details">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Details
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Total: {formatCurrency(getTotalValue())}</h3>
                  <BudgetPieChart data={chartData} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(currentData).map(([key, value], index) => {
                    if (key !== 'Items' && key !== 'abbreviation' && typeof value === 'object') {
                      return (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            className="cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => handleItemClick(key)}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">{key}</h4>
                                <ChevronRight className="h-4 w-4 text-foreground/50" />
                              </div>
                              {typeof value === 'object' && value !== null && 'value' in value && (
                                <p className={`text-sm mt-2 ${(value.value as number) < 0 ? "text-red-500" : "text-green-500"}`}>
                                  {formatCurrency(value.value as number)}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    }
                    return null;
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="details">
                {currentData.Items ? (
                  <BudgetTable data={currentData.Items} />
                ) : (
                  <BudgetBarChart data={chartData} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Total Budget</h3>
                <p className="text-2xl font-bold">{formatCurrency(getTotalValue())}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(currentData).map((key, index) => {
                    if (key !== 'Items' && key !== 'abbreviation' && typeof currentData[key] === 'object') {
                      return (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleItemClick(key)}
                        >
                          {key}
                        </Badge>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
              
              {navigationPath.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Current Path</h3>
                  <p className="text-sm text-foreground/70">
                    {navigationPath.join(' > ')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 