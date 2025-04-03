"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import budgetData from "@/data/budget.json";

// Chart components will be imported here
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { TreemapChart } from "@/components/charts/TreemapChart";
import { SankeyChart } from "@/components/charts/SankeyChart";

interface BudgetItem {
  name: string;
  amount: number;
  children?: BudgetItem[];
  description?: string;
}

export default function BudgetPage() {
  const [activeView, setActiveView] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"amount" | "name">("amount");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total budget
  const totalBudget = budgetData.budget_summary.as_revenue.amount;

  // Filter and sort budget items
  const filteredItems = React.useMemo(() => {
    let items = [...budgetData.locked_in_allocations.items];
    
    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      items = items.filter(item => item.category === selectedCategory);
    }

    return items.sort((a, b) => {
      if (sortBy === "amount") {
        return b.amount - a.amount;
      }
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30">
            Budget Visualization
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
            UCSD Associated Students Budget 2024-2025
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Explore how Associated Students allocates and manages its budget across various programs and initiatives.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" />
              <Input
                placeholder="Search budget items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="programs">Programs</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="personnel">Personnel</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: "amount" | "name") => setSortBy(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(totalBudget)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChart data={budgetData.budget_summary} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Budget Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <SankeyChart data={budgetData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={budgetData.budget_summary} type="revenue" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <TreemapChart data={budgetData.locked_in_allocations} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {filteredItems.map((item) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            {item.description && (
                              <p className="text-sm text-foreground/60">{item.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-medium">{formatCurrency(item.amount)}</span>
                            {item.children && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setExpandedItems(prev =>
                                    prev.includes(item.name)
                                      ? prev.filter(i => i !== item.name)
                                      : [...prev, item.name]
                                  );
                                }}
                              >
                                {expandedItems.includes(item.name) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                        {expandedItems.includes(item.name) && item.children && (
                          <div className="ml-8 space-y-2">
                            {item.children.map((child) => (
                              <div
                                key={child.name}
                                className="flex items-center justify-between p-3 rounded-lg bg-primary/5"
                              >
                                <span>{child.name}</span>
                                <span className="font-medium">{formatCurrency(child.amount)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 