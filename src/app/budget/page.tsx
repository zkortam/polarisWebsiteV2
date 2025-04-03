"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import dynamic from "next/dynamic";

// Dynamically import chart components to avoid SSR issues
const BarChart = dynamic(() => import("@/components/charts/BarChart"), { ssr: false });
const PieChart = dynamic(() => import("@/components/charts/PieChart"), { ssr: false });
const SankeyChart = dynamic(() => import("@/components/charts/SankeyChart"), { ssr: false });
const TreemapChart = dynamic(() => import("@/components/charts/TreemapChart"), { ssr: false });

// Import budget data
import budgetData from "@/data/budget.json";

export default function BudgetPage() {
  const [selectedCategory, setSelectedCategory] = useState("BUDGET SUMMARY");
  const [selectedView, setSelectedView] = useState("overview");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const categories = Object.keys(budgetData);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gradient mb-4">Budget Visualization</h1>
          <p className="text-lg text-foreground/80">
            Explore UCSD Associated Students Budget for 2024-2025
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-foreground/80">Total Revenue</h3>
            <p className="text-2xl font-bold text-primary">
              ${budgetData["BUDGET SUMMARY"].General.Items["2024–2025 AS Revenue"].replace(/[^0-9.-]+/g, "")}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-foreground/80">Remaining Funds</h3>
            <p className="text-2xl font-bold text-primary">
              ${budgetData["BUDGET SUMMARY"].General.Items["2024–2025 Remaining Funds (AS Revenue – (Referendums, Return to Aid, Employees, Expendable Funds))"].replace(/[^0-9.-]+/g, "")}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-foreground/80">Career Employees</h3>
            <p className="text-2xl font-bold text-primary">
              ${budgetData["BUDGET SUMMARY"].General.Items["Career Employees"].replace(/[^0-9.-]+/g, "")}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-foreground/80">Office Operations</h3>
            <p className="text-2xl font-bold text-primary">
              ${budgetData["BUDGET SUMMARY"].General.Items["Office Operations (Expendable Funds)"].replace(/[^0-9.-]+/g, "")}
            </p>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Budget Overview</h2>
              <div className="h-[400px]">
                <SankeyChart data={budgetData} />
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Revenue Distribution</h2>
                <div className="h-[300px]">
                  <PieChart data={budgetData["BUDGET SUMMARY"].General.Items} />
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Major Expense Categories</h2>
                <div className="h-[300px]">
                  <BarChart data={budgetData["BUDGET SUMMARY"].General.Items} />
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Revenue Sources</h2>
              <div className="h-[400px]">
                <TreemapChart data={budgetData["BUDGET SUMMARY"].General.Items} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>
              <div className="h-[400px]">
                <BarChart data={budgetData["BUDGET SUMMARY"].General.Items} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">{selectedCategory}</h2>
              <div className="space-y-4">
                {Object.entries(budgetData[selectedCategory]).map(([section, data]) => (
                  <div key={section} className="border rounded-lg p-4">
                    <Button
                      variant="ghost"
                      className="w-full flex justify-between items-center"
                      onClick={() => toggleSection(section)}
                    >
                      <span className="font-medium">{section}</span>
                      {expandedSections.includes(section) ? (
                        <IconChevronUp className="h-4 w-4" />
                      ) : (
                        <IconChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    {expandedSections.includes(section) && (
                      <div className="mt-4 space-y-2">
                        {Object.entries(data).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm">{key}</span>
                            <span className="text-sm font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 