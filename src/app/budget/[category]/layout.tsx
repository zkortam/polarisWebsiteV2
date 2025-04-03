import budgetData from "@/data/budget.json";

interface BudgetData {
  [key: string]: {
    General?: {
      Items?: {
        [key: string]: {
          value: number;
          abbreviation: string;
        };
      };
    };
  };
}

export async function generateStaticParams() {
  const categories: { category: string }[] = [];
  
  Object.values(budgetData as unknown as BudgetData).forEach((section) => {
    if (section.General?.Items) {
      Object.entries(section.General.Items).forEach(([key, value]) => {
        if (typeof value === "object" && "value" in value) {
          categories.push({
            category: value.abbreviation || key,
          });
        }
      });
    }
  });

  return categories;
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 