"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconBulb, IconSchool, IconCoin, IconChartBar, IconBriefcase,
  IconRocket, IconDeviceMobile, IconNews, IconParking, IconRoad,
  IconUsers } from "@tabler/icons-react";

// Platform data structured by category
const platformData = [
  {
    id: "campus",
    title: "Campus Improvements",
    icon: <IconSchool className="h-5 w-5" />,
    description: "Enhancing campus facilities and accessibility",
    initiatives: [
      {
        title: "Open Geisel 24 Hours",
        description: "We'll negotiate with the University to keep floors 1 & 2 open overnight with security instead of staff, subsidizing costs with AS funds if needed.",
        icon: <IconSchool className="h-10 w-10 text-primary/80" />,
        points: [
          "Negotiate with the University",
          "Open floors 1 & 2 Overnight",
          "No staff, only security",
          "Subsidize with AS if needed"
        ]
      },
      {
        title: "Better Parking Contracts",
        description: "Renegotiate MTS garage contracts to double parking span and implement smart tracking technology.",
        icon: <IconParking className="h-10 w-10 text-primary/80" />,
        points: [
          "MTS Garage Renegotiation",
          "Double parking span",
          "Parking Info System",
          "Smart Parking Tracking"
        ]
      },
      {
        title: "Parking Taskforce",
        description: "Create a dedicated team to evaluate existing infrastructure and implement technology solutions.",
        icon: <IconRoad className="h-10 w-10 text-primary/80" />,
        points: [
          "Eval. existing Infrastructure",
          "Advocate for better policy",
          "Implement tech solutions",
          "Long-term strategies"
        ]
      }
    ]
  },
  {
    id: "spirit",
    title: "Student Spirit",
    icon: <IconUsers className="h-5 w-5" />,
    description: "Building a stronger, more engaged community",
    initiatives: [
      {
        title: "Increase Student Spirit",
        description: "Organize consistent watch parties, improve game advertising, and create pre-game rallies to boost attendance.",
        icon: <IconUsers className="h-10 w-10 text-primary/80" />,
        points: [
          "Consistent Watch Parties",
          "Better Game Advertising",
          "More campus-decorations",
          "Pre-Game Rallies"
        ]
      },
      {
        title: "UCSD Events Mobile App",
        description: "Develop a comprehensive mobile app for sports matches, live scores, club events, and volunteering opportunities.",
        icon: <IconDeviceMobile className="h-10 w-10 text-primary/80" />,
        points: [
          "Sports Matches",
          "Live Scores",
          "Club Events",
          "AS Events",
          "Volunteering"
        ]
      },
      {
        title: "Daily Campus Reporting",
        description: "Keep students informed with daily reports from AS through social media and on-the-ground coverage.",
        icon: <IconNews className="h-10 w-10 text-primary/80" />,
        points: [
          "Daily Reports from AS",
          "Reels, Shorts, and TikTok",
          "On the ground reporting",
          "Fast Information Delivery"
        ]
      }
    ]
  },
  {
    id: "financial",
    title: "Financial Initiatives",
    icon: <IconCoin className="h-5 w-5" />,
    description: "Responsible spending and investment in students",
    initiatives: [
      {
        title: "Student Investment Fund",
        description: "Allocate $100K+ to provide micro-grants up to $5K for student startups and entrepreneurship.",
        icon: <IconCoin className="h-10 w-10 text-primary/80" />,
        points: [
          "Allocate $100K+",
          "Micro-grants up to $5K",
          "Invest in student startups",
          "Support Entrepreneurship"
        ]
      },
      {
        title: "Fiscal Responsibility",
        description: "Balance the budget by reducing inefficient spending and automating aspects of management.",
        icon: <IconChartBar className="h-10 w-10 text-primary/80" />,
        points: [
          "Balance the Budget",
          "Reduce inefficient spending",
          "Automate aspects of management",
          "More student investment"
        ]
      },
      {
        title: "Club Funding",
        description: "Increase club funding from the current $521K to $750K-$1M per year with accountability measures.",
        icon: <IconUsers className="h-10 w-10 text-primary/80" />,
        points: [
          "Clubs now get 521K per yr",
          "Increase to 750K-1M per yr",
          "Ensure responsible spending"
        ]
      }
    ]
  },
  {
    id: "innovation",
    title: "Innovation & Careers",
    icon: <IconBulb className="h-5 w-5" />,
    description: "Supporting student innovation and career growth",
    initiatives: [
      {
        title: "Career Fairs",
        description: "Organize more frequent career fairs with a wider variety of employers and bring in venture capitalists.",
        icon: <IconBriefcase className="h-10 w-10 text-primary/80" />,
        points: [
          "More frequent fairs",
          "More employers",
          "Support more career paths",
          "Bring Venture Capitalists"
        ]
      },
      {
        title: "SPARK Fund",
        description: "Create a dedicated fund to support STEM events, hackathons, club projects, and competitions.",
        icon: <IconRocket className="h-10 w-10 text-primary/80" />,
        points: [
          "Support STEM events",
          "Sponsor Hackathons",
          "Sponsor Club Projects",
          "Sponsor Competitions"
        ]
      }
    ]
  }
];

export function Platform() {
  const [activeTab, setActiveTab] = useState("campus");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 relative overflow-hidden" id="platform">
      <div className="hero-glow opacity-50" />
      <div className="grid-pattern absolute inset-0 opacity-10" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <Badge className="mb-3 bg-primary/20 text-primary hover:bg-primary/30">Our Vision</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">Our Platform</h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            We've crafted a comprehensive platform focused on improving campus life,
            fostering student spirit, and creating meaningful opportunities.
          </p>
        </div>

        <Tabs defaultValue="campus" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 glassmorphism p-1">
              {platformData.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-2"
                >
                  {category.icon}
                  <span className="hidden sm:inline">{category.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {platformData.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-foreground/70">{category.description}</p>
              </div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === category.id ? "visible" : "hidden"}
              >
                {category.initiatives.map((initiative, index) => (
                  <motion.div key={index} variants={cardVariants}>
                    <Card className="glassmorphism border-primary/10 overflow-hidden h-full">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full" />

                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{initiative.title}</CardTitle>
                            <CardDescription className="mt-2">{initiative.description}</CardDescription>
                          </div>
                          <div className="p-2 bg-background/40 rounded-full flex items-center justify-center">
                            {initiative.icon}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <ul className="space-y-2">
                          {initiative.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start gap-2">
                              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                              </div>
                              <span className="text-sm text-foreground/80">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export default Platform;
