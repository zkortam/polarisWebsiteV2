"use client";

import React from "react";
import { BudgetVisualizer } from "@/components/budget/BudgetVisualizer";

export default function BudgetPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-gradient">AS Budget Visualizer</h1>
      <p className="text-lg mb-8 text-foreground/70">
        Explore the Associated Students budget data in an interactive way. Click on categories to dive deeper into the details.
      </p>
      <BudgetVisualizer />
    </div>
  );
} 