"use client";

import React from "react";
import { BudgetAnalysis } from "@/components/budget/BudgetAnalysis";

export default function BudgetPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-4">AS Budget Analysis</h1>
      <p className="text-xl text-muted-foreground mb-8">
        An interactive analysis of the AS budget, highlighting key spending patterns and areas of concern.
      </p>
      <BudgetAnalysis />
    </div>
  );
} 