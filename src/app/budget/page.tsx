"use client";

import React from "react";
import { BudgetAnalysis } from "@/components/budget/BudgetAnalysis";

export default function BudgetPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Budget Analysis</h1>
      <BudgetAnalysis />
    </div>
  );
} 