"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const platformPoints = [
  {
    title: "Extended Geisel Library Hours",
    description: "We believe academic resources should always be accessible. Polaris will negotiate with UCSD administration to open floors one and two of Geisel Library 24 hours a day. By staffing these floors with security only during overnight hours, operational costs will remain manageable, potentially subsidized by Associated Students (AS) funding, ensuring safe, quiet, and continuous study environments for students, especially during critical exam periods. We plan to introduce an AI-based security monitoring system to enhance safety efficiently.",
    icon: "📚"
  },
  {
    title: "Boosting Student Spirit",
    description: "UCSD's campus culture thrives on spirit and community engagement. Polaris will elevate student enthusiasm and Triton pride by regularly organizing game watch parties, enhancing event advertising to maximize attendance, and increasing campus decorations during key sporting events and competitions. We'll introduce vibrant pre-game rallies and launch a dedicated UCSD Events mobile app, making event information accessible, promoting greater participation across campus, and providing personalized event recommendations powered by AI.",
    icon: "🎉"
  },
  {
    title: "Launching a Student Investment Fund",
    description: "To nurture innovation and entrepreneurial talent, Polaris will establish a Student Investment Fund with an initial allocation exceeding $100,000. This fund will provide micro-grants of up to $5,000, targeted specifically at student-run startups and entrepreneurial projects. By investing directly in student ideas, Polaris aims to foster creativity, practical learning, and economic empowerment within the UCSD community, leveraging digital platforms for easy application and management of grants.",
    icon: "💡"
  },
  {
    title: "Ensuring Fiscal Responsibility",
    description: "Recognizing the importance of sound financial management, Polaris pledges to balance the AS budget through meticulous planning and spending reduction strategies. We will eliminate inefficient expenditures and implement automated management systems, leveraging AI-driven analytics to streamline operations and redirect savings into initiatives directly benefiting the student body.",
    icon: "💰"
  },
  {
    title: "Expanding and Enhancing Career Fairs",
    description: "Career fairs serve as critical gateways for students' professional futures. Polaris will increase the frequency and diversity of UCSD career fairs, actively recruiting a broader array of employers across varied industries. By introducing targeted opportunities, including bringing in venture capitalists and representatives from emerging sectors, we aim to offer robust support for diverse career paths and entrepreneurship. Technology will be central, including virtual career fair platforms and AI-powered matching to connect students with relevant employers.",
    icon: "🎓"
  },
  {
    title: "Establishing the SPARK Fund",
    description: "To further UCSD's reputation as a hub for innovation and STEM excellence, Polaris will introduce the SPARK Fund. This fund will sponsor and support critical STEM-related initiatives, including hackathons, club projects, competitions, and other STEM events. SPARK funding will enhance educational opportunities and showcase UCSD students' talent in national and global contexts, backed by technological tools to track impact and optimize resources.",
    icon: "⚡"
  },
  {
    title: "Creating a UCSD Events Mobile App",
    description: "Polaris plans to create a dynamic mobile application designed to centralize and streamline student engagement. The app will offer comprehensive information on sporting events, live scores, club activities, AS events, and volunteering opportunities, enabling students to effortlessly stay informed, engaged, and connected to campus life, with AI-driven personalized notifications and event suggestions.",
    icon: "📱"
  },
  {
    title: "Daily Campus Reporting",
    description: "Transparency and effective communication are cornerstones of our approach. Polaris will introduce daily campus reports produced by AS, utilizing contemporary media platforms such as Reels, Shorts, and TikTok. These rapid and engaging reports will provide immediate updates on campus activities, policies, and student concerns, ensuring students remain informed and actively involved. AI-driven analytics will help tailor content to student interests and enhance audience engagement.",
    icon: "📰"
  },
  {
    title: "Improved Parking Contracts",
    description: "Parking accessibility remains a significant concern at UCSD. Polaris is committed to renegotiating the existing MTS parking garage contract to double the availability period for student parking. Additionally, we will implement a smart parking information and tracking system, providing real-time parking availability updates enhanced by AI-driven predictive analytics to reduce daily commuting stress.",
    icon: "🚗"
  },
  {
    title: "Establishing a Parking Task Force",
    description: "Understanding the long-term implications of parking management, Polaris will create a dedicated Parking Task Force. This team will critically evaluate current infrastructure, advocate for policy improvements, and recommend innovative technological solutions, including AI-powered analysis for optimizing parking usage, laying a foundation for sustainable, long-term improvements to UCSD's parking system.",
    icon: "🅿️"
  },
  {
    title: "Increasing Club Funding",
    description: "Clubs are vital to UCSD's vibrant student life. Polaris recognizes the need to significantly boost club financial support from the current $521,000 annually to a targeted range between $750,000 and $1,000,000. This increased investment will enable clubs to expand their programming, reach wider audiences, and foster responsible financial stewardship to maximize benefits for all students.",
    icon: "🎭"
  },
  {
    title: "Transforming AS with Technological Innovation",
    description: "Polaris is determined to make AS at UCSD the most technologically advanced, capable, and resourceful student government in its history. We will integrate artificial intelligence and AI-driven agents across AS operations to enhance efficiency, optimize decision-making processes, automate routine administrative tasks, and provide cutting-edge tools and resources to better serve the student body.",
    icon: "🤖"
  }
];

export default function PlatformPage() {
  const [containerRef, containerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="hero-glow opacity-50" />
        <div className="grid-pattern absolute inset-0 opacity-10" />
        
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30">Our Platform</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Building a Better UCSD
            </h1>
            <p className="text-lg text-foreground/80 mb-8">
              Polaris is committed to enhancing the UC San Diego student experience through practical, innovative, and student-centered initiatives. Recognizing the rigorous academic schedules and diverse needs of UCSD students, our slate aims to address key issues through strategic plans and cutting-edge technological solutions.
            </p>
            <Link href="/#contact">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/80">
                Get Involved
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Platform Points */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={containerInView ? "visible" : "hidden"}
            ref={containerRef}
          >
            {platformPoints.map((point, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="glassmorphism border-primary/10 h-full overflow-hidden group hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{point.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-gradient">{point.title}</h3>
                        <p className="text-foreground/80">{point.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
} 