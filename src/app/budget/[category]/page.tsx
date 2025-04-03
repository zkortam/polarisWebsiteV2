"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveTreeMap } from "@nivo/treemap";
import { ResponsiveSankey } from "@nivo/sankey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import budgetData from "@/data/budget.json";

interface BudgetItem {
  value: number;
  abbreviation: string;
  description?: string;
  Items?: {
    [key: string]: BudgetItem | BudgetItem[];
  };
  Subitems?: {
    [key: string]: BudgetItem;
  };
}

interface GeneralSection {
  abbreviation: string;
  Items: {
    [key: string]: BudgetItem | string;
  };
}

interface BudgetSection {
  abbreviation: string;
  General?: GeneralSection;
  value?: number;
  [key: string]: BudgetItem | string | GeneralSection | number | undefined;
}

interface BudgetData {
  [key: string]: BudgetSection;
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
  children?: TreeMapNode[];
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

const transformData = {
  bar: (data: BudgetItem): BarData[] => {
    const items: BarData[] = [];
    
    if (data.Items) {
      Object.entries(data.Items).forEach(([key, value]) => {
        if (typeof value === "object" && "value" in value) {
          items.push({
            category: value.abbreviation || key,
            amount: Math.abs(value.value),
          });
        }
      });
    }

    if (data.Subitems) {
      Object.entries(data.Subitems).forEach(([key, value]) => {
        items.push({
          category: value.abbreviation || key,
          amount: Math.abs(value.value),
        });
      });
    }

    return items;
  },
  pie: (data: BudgetItem): PieData[] => {
    const items: PieData[] = [];
    
    if (data.Items) {
      Object.entries(data.Items).forEach(([key, value]) => {
        if (typeof value === "object" && "value" in value) {
          items.push({
            id: value.abbreviation || key,
            label: value.abbreviation || key,
            value: Math.abs(value.value),
          });
        }
      });
    }

    if (data.Subitems) {
      Object.entries(data.Subitems).forEach(([key, value]) => {
        items.push({
          id: value.abbreviation || key,
          label: value.abbreviation || key,
          value: Math.abs(value.value),
        });
      });
    }

    return items;
  },
  treemap: (data: BudgetItem): TreeMapData => {
    const children: TreeMapNode[] = [];
    
    if (data.Items) {
      Object.entries(data.Items).forEach(([key, value]) => {
        if (typeof value === "object" && "value" in value) {
          children.push({
            name: value.abbreviation || key,
            value: Math.abs(value.value),
          });
        }
      });
    }

    if (data.Subitems) {
      Object.entries(data.Subitems).forEach(([key, value]) => {
        children.push({
          name: value.abbreviation || key,
          value: Math.abs(value.value),
        });
      });
    }

    return {
      name: data.abbreviation || "Category",
      children: children,
    };
  },
  sankey: (data: BudgetItem): SankeyData => {
    const nodes: SankeyNode[] = [{ id: data.abbreviation || "Category" }];
    const links: SankeyLink[] = [];
    
    if (data.Items) {
      Object.entries(data.Items).forEach(([key, value]) => {
        if (typeof value === "object" && "value" in value) {
          const nodeId = value.abbreviation || key;
          nodes.push({ id: nodeId });
          links.push({
            source: data.abbreviation || "Category",
            target: nodeId,
            value: Math.abs(value.value),
          });
        }
      });
    }

    if (data.Subitems) {
      Object.entries(data.Subitems).forEach(([key, value]) => {
        const nodeId = value.abbreviation || key;
        nodes.push({ id: nodeId });
        links.push({
          source: data.abbreviation || "Category",
          target: nodeId,
          value: Math.abs(value.value),
        });
      });
    }

    return { nodes, links };
  },
};

export default function CategoryPage({ params }: { params: { category: string } }) {
  const router = useRouter();
  const [selectedView, setSelectedView] = useState<keyof typeof transformData>("bar");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const categoryData = useMemo(() => {
    // Find the category in the budget data
    let category: BudgetItem | undefined;
    
    Object.values(budgetData as unknown as BudgetData).forEach((section) => {
      if (section.General?.Items) {
        Object.entries(section.General.Items).forEach(([key, value]) => {
          if (typeof value === "object" && "value" in value) {
            if (value.abbreviation === params.category || key === params.category) {
              category = value as BudgetItem;
            }
          }
        });
      }
    });

    return category;
  }, [params.category]);

  const chartData = useMemo(() => {
    if (!categoryData) return null;
    return transformData[selectedView](categoryData);
  }, [selectedView, categoryData]);

  if (!categoryData || !chartData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">Category not found</h1>
        <Button onClick={() => router.push("/budget")} className="mt-4">
          Back to Budget Overview
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Button onClick={() => router.push("/budget")} variant="outline">
              Back to Overview
            </Button>
            <h1 className="text-4xl font-bold">{categoryData.abbreviation}</h1>
          </div>
          <p className="text-lg text-gray-600">
            {categoryData.description || "Category details"}
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
                <CardTitle>Category Distribution - Bar Chart</CardTitle>
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
                    onClick={(node) => {
                      if (node.data.category) {
                        setSelectedItem(node.data.category as string);
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pie" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution - Pie Chart</CardTitle>
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
                    onClick={(node) => {
                      if (node.data.id) {
                        setSelectedItem(node.data.id);
                      }
                    }}
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
                <CardTitle>Category Distribution - Treemap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[600px]">
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
                      <div className="bg-white p-2 shadow-lg rounded text-black">
                        <strong>{node.id}</strong>
                        <br />
                        Amount: ${node.value.toLocaleString()}
                      </div>
                    )}
                    label="id"
                    orientLabel={true}
                    enableLabel={true}
                    onClick={(node) => {
                      if (node.id) {
                        setSelectedItem(node.id);
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sankey" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Flow - Sankey Diagram</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[600px]">
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
                      <div className="bg-white p-2 shadow-lg rounded text-black">
                        <strong>{node.id}</strong>
                        <br />
                        Amount: ${node.value?.toLocaleString()}
                      </div>
                    )}
                    onClick={(node) => {
                      if ('id' in node) {
                        setSelectedItem(node.id);
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedItem && (
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <h3 className="text-xl font-semibold">{selectedItem}</h3>
                <Button
                  onClick={() => router.push(`/budget/${selectedItem}`)}
                  className="mt-2"
                >
                  View Details
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
} 