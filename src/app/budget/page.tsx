"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveTreeMap } from "@nivo/treemap";
import { ResponsiveSankey } from "@nivo/sankey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import budgetData from "@/data/budget.json";

interface BudgetSummaryItem {
  amount?: number;
  description?: string;
  abbreviation?: string;
}

interface BudgetSummary {
  title: string;
  abbreviation: string;
  [key: string]: BudgetSummaryItem | string;
}

interface BarData {
  category: string;
  amount: number;
  [key: string]: string | number;
}

interface PieData {
  id: string;
  label: string;
  value: number;
}

interface TreeMapNode {
  name: string;
  value: number;
}

interface TreeMapData {
  name: string;
  children: TreeMapNode[];
}

interface SankeyNode {
  id: string;
  value?: number;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

type ChartData = BarData[] | PieData[] | TreeMapData | SankeyData;

const colorScheme = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9B59B6",
  "#3498DB",
  "#E67E22",
  "#2ECC71",
];

const transformData = {
  bar: (data: BudgetSummary): BarData[] => {
    return Object.entries(data)
      .filter(([key, value]) => key !== "title" && key !== "abbreviation" && typeof value === "object" && "amount" in value)
      .map(([key, value]) => ({
        category: (value as BudgetSummaryItem).abbreviation || key.replace(/_/g, " ").toUpperCase(),
        amount: Math.abs((value as BudgetSummaryItem).amount || 0),
      }));
  },
  pie: (data: BudgetSummary): PieData[] => {
    return Object.entries(data)
      .filter(([key, value]) => key !== "title" && key !== "abbreviation" && typeof value === "object" && "amount" in value)
      .map(([key, value]) => ({
        id: (value as BudgetSummaryItem).abbreviation || key.replace(/_/g, " ").toUpperCase(),
        label: (value as BudgetSummaryItem).abbreviation || key.replace(/_/g, " ").toUpperCase(),
        value: Math.abs((value as BudgetSummaryItem).amount || 0),
      }));
  },
  treemap: (data: BudgetSummary): TreeMapData => {
    const children = Object.entries(data)
      .filter(([key, value]) => key !== "title" && key !== "abbreviation" && typeof value === "object" && "amount" in value)
      .map(([key, value]) => ({
        name: (value as BudgetSummaryItem).abbreviation || key.replace(/_/g, " ").toUpperCase(),
        value: Math.abs((value as BudgetSummaryItem).amount || 0),
      }));

    return {
      name: "Budget",
      children: children,
    };
  },
  sankey: (data: BudgetSummary): SankeyData => {
    const nodes = [
      { id: "Total Budget" },
      ...Object.entries(data)
        .filter(([key, value]) => key !== "title" && key !== "abbreviation" && typeof value === "object" && "amount" in value)
        .map(([key, value]) => ({
          id: (value as BudgetSummaryItem).abbreviation || key.replace(/_/g, " ").toUpperCase(),
        })),
    ];

    const links = Object.entries(data)
      .filter(([key, value]) => key !== "title" && key !== "abbreviation" && typeof value === "object" && "amount" in value)
      .map(([key, value]) => ({
        source: "Total Budget",
        target: (value as BudgetSummaryItem).abbreviation || key.replace(/_/g, " ").toUpperCase(),
        value: Math.abs((value as BudgetSummaryItem).amount || 0),
      }));

    return { nodes, links };
  },
};

export default function BudgetPage() {
  const [selectedView, setSelectedView] = useState<keyof typeof transformData>("bar");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const chartData = useMemo(() => {
    return transformData[selectedView](budgetData.budget_summary as BudgetSummary);
  }, [selectedView]);

  const budgetItems = useMemo(() => {
    return Object.entries(budgetData.budget_summary as BudgetSummary)
      .filter(([key, value]) => key !== "title" && key !== "abbreviation" && typeof value === "object" && "amount" in value)
      .map(([key, value]) => ({
        category: (value as BudgetSummaryItem).abbreviation || key.replace(/_/g, " ").toUpperCase(),
        amount: (value as BudgetSummaryItem).amount || 0,
        description: (value as BudgetSummaryItem).description,
      }));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex flex-col space-y-4">
          <h1 className="text-4xl font-bold">Budget Visualization</h1>
          <p className="text-lg text-gray-600">
            Explore the UCSD Associated Students budget for 2024-2025
          </p>
        </div>

        <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as keyof typeof transformData)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
            <TabsTrigger value="treemap">Treemap</TabsTrigger>
            <TabsTrigger value="sankey">Sankey</TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Distribution - Bar Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <ResponsiveBar
                    data={chartData as BarData[]}
                    keys={["amount"]}
                    indexBy="category"
                    margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: "linear" }}
                    colors={{ scheme: "nivo" }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: -45,
                      legend: "Category",
                      legendPosition: "middle",
                      legendOffset: 45,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Amount ($)",
                      legendPosition: "middle",
                      legendOffset: -40,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                    animate={true}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pie" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Distribution - Pie Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <ResponsivePie
                    data={chartData as PieData[]}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={1}
                    arcLinkLabelsColor={{ from: "color" }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: "color", modifiers: [["darker", 1.4]] }}
                    legends={[
                      {
                        anchor: "bottom",
                        direction: "row",
                        translateY: 56,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: "#999",
                        symbolSize: 18,
                        symbolShape: "circle",
                        effects: [
                          {
                            on: "hover",
                            style: {
                              itemTextColor: "#000",
                            },
                          },
                        ],
                      },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treemap" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Distribution - Treemap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <ResponsiveTreeMap
                    data={chartData as TreeMapData}
                    identity="name"
                    value="value"
                    valueFormat=".02s"
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    labelSkipSize={12}
                    labelTextColor={{ from: "color", modifiers: [["darker", 1.2]] }}
                    borderColor={{ from: "color", modifiers: [["darker", 0.3]] }}
                    colors={{ scheme: "nivo" }}
                    animate={true}
                    tooltip={({ node }) => (
                      <div className="bg-white p-2 shadow-lg rounded">
                        <strong>{node.id}</strong>
                        <br />
                        Amount: ${node.value.toLocaleString()}
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sankey" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Flow - Sankey Diagram</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <ResponsiveSankey
                    data={chartData as SankeyData}
                    margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
                    align="justify"
                    colors={{ scheme: "nivo" }}
                    nodeOpacity={1}
                    nodeThickness={18}
                    nodeInnerPadding={3}
                    nodeSpacing={24}
                    nodeBorderWidth={0}
                    nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
                    linkOpacity={0.5}
                    linkHoverOthersOpacity={0.1}
                    enableLinkGradient={true}
                    labelPosition="outside"
                    labelOrientation="horizontal"
                    labelPadding={16}
                    labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
                    animate={true}
                    nodeTooltip={({ node }: { node: SankeyNode }) => (
                      <div className="bg-white p-2 shadow-lg rounded">
                        <strong>{node.id}</strong>
                        <br />
                        Amount: ${node.value?.toLocaleString()}
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Budget Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedCategory || ""} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {budgetItems.map((item) => (
                    <SelectItem key={item.category} value={item.category}>
                      {item.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <h3 className="text-xl font-semibold">
                    {budgetItems.find((item) => item.category === selectedCategory)?.category}
                  </h3>
                  <p className="text-lg">
                    Amount: $
                    {budgetItems
                      .find((item) => item.category === selectedCategory)
                      ?.amount.toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    {budgetItems.find((item) => item.category === selectedCategory)?.description}
                  </p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 