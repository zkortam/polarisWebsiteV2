"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export function Hero() {
  const { toast } = useToast();
  const backgroundRef = useRef<HTMLDivElement>(null);

  const handleVoteClick = () => {
    toast({
      title: "Voting Information",
      description: "Voting opens on 4/7/2025",
      duration: 3000,
    });
  };

  // GSAP animation for the background dots
  useEffect(() => {
    if (!backgroundRef.current) return;

    // Create dots
    const dotsContainer = backgroundRef.current;
    const dotsCount = 15;

    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement("div");
      dot.className = "tech-dots";

      // Random position, size, and color
      const size = Math.random() * 80 + 60;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;

      // Different shades of blue for the dots
      const hue = 210 + Math.random() * 30;
      const sat = 70 + Math.random() * 30;
      const light = 40 + Math.random() * 20;
      dot.style.setProperty("--dot-color", `hsla(${hue}, ${sat}%, ${light}%, 0.2)`);
      dot.style.setProperty("--dot-blur", `${15 + Math.random() * 15}px`);
      dot.style.setProperty("--dot-opacity", `${0.2 + Math.random() * 0.3}`);

      // Position
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;

      // Add to container
      dotsContainer.appendChild(dot);

      // Animate with GSAP
      gsap.to(dot, {
        x: Math.random() * 80 - 40,
        y: Math.random() * 80 - 40,
        duration: 10 + Math.random() * 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    return () => {
      // Clean up animations
      gsap.killTweensOf(dotsContainer.childNodes);
      while (dotsContainer.firstChild) {
        dotsContainer.removeChild(dotsContainer.firstChild);
      }
    };
  }, []);

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.4,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10" id="home">
      {/* Animated background */}
      <div className="hero-glow"></div>
      <div className="grid-pattern absolute inset-0 opacity-30"></div>
      <div ref={backgroundRef} className="absolute inset-0 overflow-hidden"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tight text-gradient mb-4"
            initial="hidden"
            animate="visible"
            variants={titleVariants}
          >
            POLARIS
          </motion.h1>

          <motion.h2
            className="text-xl md:text-2xl font-medium text-foreground/90 mb-6"
            initial="hidden"
            animate="visible"
            variants={subtitleVariants}
          >
            Guiding UCSD into a brighter future
          </motion.h2>

          <motion.p
            className="text-base md:text-lg text-foreground/80 max-w-2xl mb-8"
            initial="hidden"
            animate="visible"
            variants={subtitleVariants}
          >
            We&apos;re a dedicated trio of students running for Associated Students with a vision to transform campus life, enhance resources, and build a stronger UCSD community.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
          >
            <Link href="/platform">
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/80 glow-hover text-base py-6 px-8"
              >
                Our Platform
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-primary/20 text-foreground hover:bg-primary/10 glow-hover text-base py-6 px-8"
              onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Meet the Team
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-20 md:h-32 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full"
          fill="rgba(15, 23, 42, 0.3)"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
    </section>
  );
}

export default Hero;
