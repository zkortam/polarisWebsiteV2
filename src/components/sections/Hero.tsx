"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
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
      delay: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const text = title.textContent || "";
    title.textContent = "";

    text.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.animationDelay = `${i * 0.05}s`;
      title.appendChild(span);
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      <div className="hero-glow opacity-50" />
      <div className="grid-pattern absolute inset-0 opacity-10" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.div
            className="relative w-24 h-24 mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/PolarisLogo.png"
              alt="Polaris Logo"
              fill
              sizes="96px"
              className="object-contain"
              priority
              quality={100}
            />
          </motion.div>

          <motion.h1
            ref={titleRef}
            className="text-4xl md:text-6xl font-bold text-gradient mb-6 leading-tight"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            POLARIS
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            Guiding UCSD into a brighter future with innovative solutions, responsible governance, and a commitment to enhancing the student experience.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
          >
            <Link href="/platform">
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/80 glow-hover text-base py-6 px-8 w-full sm:w-auto"
              >
                Our Platform
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-primary/20 text-foreground hover:bg-primary/10 glow-hover text-base py-6 px-8 w-full sm:w-auto"
              onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Meet the Team
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
