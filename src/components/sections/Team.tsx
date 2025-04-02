"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Team data
const teamMembers = [
  {
    name: "Dylan Archer",
    position: "President",
    description: "Passionate about creating a more accessible and engaging campus environment for all students.",
    quote: "I believe in the power of student governance to create real change on campus.",
    imageSrc: "", // Use fallback avatar
    initials: "DA",
    color: "bg-blue-500",
    strengths: ["Leadership", "Innovation", "Communication"],
    experience: [
      "Student Body President (High School)",
      "UCSD Student Ambassador",
      "Residence Hall Council Member"
    ]
  },
  {
    name: "Zakaria Kortam",
    position: "Executive Vice President",
    description: "Committed to ensuring fiscal responsibility and transparency in all Associated Students operations.",
    quote: "Transparent and responsible governance is the foundation of effective student leadership.",
    imageSrc: "", // Use fallback avatar
    initials: "ZK",
    color: "bg-emerald-500",
    strengths: ["Organization", "Financial Planning", "Team Building"],
    experience: [
      "AS Committee Member",
      "Finance Club President",
      "Campus Policy Research Assistant"
    ]
  },
  {
    name: "Alex Sun",
    position: "Vice President of External Affairs",
    description: "Focused on strengthening UCSD's relationships with external organizations and amplifying student voices.",
    quote: "Our connections beyond campus are as important as those within it.",
    imageSrc: "", // Use fallback avatar
    initials: "AS",
    color: "bg-purple-500",
    strengths: ["Networking", "Advocacy", "Public Speaking"],
    experience: [
      "Student Ambassador to Local Businesses",
      "External Affairs Committee Member",
      "Community Outreach Coordinator"
    ]
  }
];

export function Team() {
  // Animation for staggered reveal of team cards
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const [containerRef, containerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 relative overflow-hidden" id="team">
      <div className="hero-glow opacity-50" />
      <div className="grid-pattern absolute inset-0 opacity-10" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-3 bg-primary/20 text-primary hover:bg-primary/30">Meet Our Team</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">Your Polaris Candidates</h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            We're a dedicated team of students committed to making UCSD a better place for everyone.
            Get to know the individuals behind the Polaris vision.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10"
          variants={containerVariants}
          initial="hidden"
          animate={containerInView ? "visible" : "hidden"}
          ref={containerRef}
        >
          {teamMembers.map((member, index) => (
            <motion.div key={member.name} variants={cardVariants}>
              <Card className="glassmorphism border-primary/10 h-full overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative">
                    {/* Top colored gradient */}
                    <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/30 to-transparent`} />

                    <div className="pt-12 pb-8 px-6 flex flex-col items-center text-center">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="relative cursor-pointer">
                            <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                              <AvatarImage src={member.imageSrc} alt={member.name} />
                              <AvatarFallback className={`text-xl font-semibold ${member.color} text-white`}>
                                {member.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 h-8 w-8 bg-primary rounded-full border-4 border-background flex items-center justify-center animate-glow-pulse">
                              <span className="sr-only">Verified candidate</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-background" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 glassmorphism border-primary/10">
                          <div className="flex flex-col space-y-4">
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">{member.position} Candidate</h4>
                              <p className="text-sm text-foreground/70 italic">"{member.quote}"</p>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium mb-2">Experience</h5>
                              <ul className="text-sm text-foreground/70 space-y-1">
                                {member.experience.map((exp, idx) => (
                                  <li key={`exp-${idx}`} className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    <span>{exp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>

                      <h3 className="text-xl font-bold mt-4">{member.name}</h3>
                      <p className="text-sm text-primary font-medium mt-1">{member.position}</p>
                      <p className="text-sm text-foreground/80 mt-4">{member.description}</p>

                      <div className="flex flex-wrap gap-2 justify-center mt-6">
                        {member.strengths.map((strength, idx) => (
                          <Badge key={`strength-${idx}`} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-16">
          <motion.div
            className="text-center max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-3 text-gradient">Together, We're Polaris</h3>
            <p className="text-foreground/80">
              We bring diverse backgrounds, perspectives, and skills together with a unified goal:
              to guide UCSD toward a brighter future where every student has the resources and support they need to thrive.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Team;
