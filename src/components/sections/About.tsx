"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import gsap from "gsap";

const visionPoints = [
  {
    title: "Student-Centered Governance",
    description: "We believe every decision should be made with students' best interests at heart.",
    icon: "🎓"
  },
  {
    title: "Transparency & Accountability",
    description: "We're committed to open communication and responsible management of resources.",
    icon: "⚖️"
  },
  {
    title: "Innovation & Progress",
    description: "We're focused on finding new solutions to improve campus life and academic experience.",
    icon: "💡"
  },
  {
    title: "Inclusivity & Diversity",
    description: "We champion the voices and needs of all students, from all backgrounds and disciplines.",
    icon: "🧑"
  }
];

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Fixed: Using transform directly without interpolate
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0.3, 1, 1, 0.3]);

  // Lines animation
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!linesRef.current) return;

    const lines = Array.from({ length: 8 }).map((_, i) => {
      const line = document.createElement("div");
      line.className = "absolute h-px bg-primary/20";
      line.style.width = `${Math.random() * 30 + 70}%`;
      line.style.left = `${Math.random() * 15}%`;
      line.style.top = `${(i + 1) * 12}%`;
      line.style.opacity = "0";
      line.style.transform = "scaleX(0)";
      line.style.transformOrigin = Math.random() > 0.5 ? "left" : "right";
      return line;
    });

    // Use for...of instead of forEach
    for (const line of lines) {
      linesRef.current?.appendChild(line);
    }

    gsap.to(lines, {
      opacity: 0.5,
      scaleX: 1,
      duration: 1.5,
      stagger: 0.1,
      ease: "power3.out"
    });

    return () => {
      // Use for...of instead of forEach
      for (const line of lines) {
        line.remove();
      }
    };
  }, []);

  // Animation for vision cards
  const [visionRef, visionInView] = useInView({
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="py-20 relative overflow-hidden" id="about" ref={containerRef}>
      <div className="hero-glow opacity-50" />
      <div className="grid-pattern absolute inset-0 opacity-10" />
      <div ref={linesRef} className="absolute inset-0 overflow-hidden" />

      <motion.div
        style={{ y, opacity }}
        className="absolute top-10 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div
        // Fixed: Using a negative transformation with useTransform directly
        style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]), opacity }}
        className="absolute bottom-10 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
      />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-3 bg-primary/20 text-primary hover:bg-primary/30">Our Story</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">About Polaris</h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Named after the North Star that has guided travelers for centuries, Polaris
            is committed to guiding UCSD toward a brighter future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-gradient">Our Mission</h3>
              <p className="text-foreground/80 mb-4 leading-relaxed">
                At Polaris, we believe that effective student governance can transform the university experience.
                We're committed to making UCSD a place where every student has the resources, support, and
                opportunities they need to thrive academically, professionally, and personally.
              </p>
              <p className="text-foreground/80 mb-6 leading-relaxed">
                Our campaign is built on the foundation of transparency, innovation, and inclusivity.
                We're dedicated to addressing the real issues that affect students daily - from academic
                resources and campus facilities to career development and community building.
              </p>

              <div className="flex items-center space-x-6 mt-8">
                <div>
                  <h4 className="font-bold text-3xl text-primary">3</h4>
                  <p className="text-sm text-foreground/70">Dedicated<br/>Candidates</p>
                </div>
                <div className="h-12 w-px bg-primary/20" />
                <div>
                  <h4 className="font-bold text-3xl text-primary">11</h4>
                  <p className="text-sm text-foreground/70">Platform<br/>Initiatives</p>
                </div>
                <div className="h-12 w-px bg-primary/20" />
                <div>
                  <h4 className="font-bold text-3xl text-primary">1</h4>
                  <p className="text-sm text-foreground/70">United<br/>Vision</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg transform rotate-3" />
              <div className="absolute inset-0 bg-background/90 backdrop-blur-sm rounded-lg transform -rotate-3" />
              <motion.div
                className="relative bg-background/70 backdrop-blur-sm p-8 border border-primary/10 rounded-lg glassmorphism"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="mb-4">
                  <div className="flex space-x-2 mb-6">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-20 bg-primary/20 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-foreground/10 rounded-full" />
                      <div className="h-3 w-5/6 bg-foreground/10 rounded-full" />
                      <div className="h-3 w-4/6 bg-foreground/10 rounded-full" />
                    </div>
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-primary/30 mr-3" />
                      <div className="h-3 w-24 bg-foreground/10 rounded-full" />
                    </div>
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-primary/30 mr-3" />
                      <div className="h-3 w-32 bg-foreground/10 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center px-4 py-2 rounded-md bg-primary/20 text-primary text-sm">
                  <span className="mr-2">✨</span>
                  <span className="font-medium">Polaris for UCSD</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gradient">Our Vision</h3>
            <p className="text-foreground/80 max-w-2xl mx-auto mt-3">
              We're guided by these core principles in everything we do:
            </p>
          </div>

          <motion.div
            ref={visionRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={visionInView ? "visible" : "hidden"}
          >
            {visionPoints.map((point, index) => (
              <motion.div key={point.title} variants={cardVariants}>
                <Card className="glassmorphism border-primary/10 h-full overflow-hidden">
                  <CardContent className="p-6">
                    <span className="text-4xl mb-4 block">{point.icon}</span>
                    <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                    <p className="text-sm text-foreground/70">{point.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;
