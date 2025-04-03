"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// Star component for background
const Star = ({ delay = 0, size = 1, x = 0, y = 0 }) => {
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: size,
        height: size,
        x,
        y,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
      }}
    />
  );
};

// Shooting star component
const ShootingStar = ({ delay = 0, x = 0, y = 0 }) => {
  return (
    <motion.div
      className="absolute w-20 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
      style={{
        x,
        y,
        rotate: 45,
      }}
      initial={{ opacity: 0, x: -100, y: -100 }}
      animate={{
        opacity: [0, 1, 0],
        x: [x - 100, x + 200],
        y: [y - 100, y + 200],
      }}
      transition={{
        duration: 1.5,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 5 + 5,
      }}
    />
  );
};

// Sparkle component
const Sparkle = ({ delay = 0, x = 0, y = 0 }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-yellow-300 rounded-full"
      style={{
        x,
        y,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 1,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
      }}
    />
  );
};

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Parallax effect for the hero glow
  const glowY = useTransform(scrollY, [0, 500], [0, 200]);
  const glowOpacity = useTransform(scrollY, [0, 500], [0.5, 0.2]);
  
  // Spring animation for mouse movement
  const springConfig = { damping: 25, stiffness: 200 };
  const springX = useSpring(useMotionValue(0), springConfig);
  const springY = useSpring(useMotionValue(0), springConfig);

  // Generate random stars
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 2,
  }));

  // Generate random shooting stars
  const shootingStars = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    delay: Math.random() * 5,
  }));

  // Generate random sparkles
  const sparkles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    delay: Math.random() * 2,
  }));

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

  // Handle mouse movement for interactive effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
    springX.set(x);
    springY.set(y);
  };

  // Update star positions when window resizes
  useEffect(() => {
    const updateStarPositions = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Update stars
      stars.forEach(star => {
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      });
      
      // Update shooting stars
      shootingStars.forEach(star => {
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      });
      
      // Update sparkles
      sparkles.forEach(sparkle => {
        sparkle.x = Math.random() * width;
        sparkle.y = Math.random() * height;
      });
    };
    
    window.addEventListener('resize', updateStarPositions);
    updateStarPositions(); // Initial positioning
    
    return () => {
      window.removeEventListener('resize', updateStarPositions);
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive glow that follows mouse */}
      <motion.div 
        className="absolute w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px] pointer-events-none"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Parallax hero glow */}
      <motion.div 
        className="hero-glow absolute inset-0 pointer-events-none"
        style={{ y: glowY, opacity: glowOpacity }}
      />
      
      {/* Grid pattern with parallax */}
      <motion.div 
        className="grid-pattern absolute inset-0 opacity-10"
        style={{ y: useTransform(scrollY, [0, 500], [0, 100]) }}
      />
      
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <Star 
            key={star.id} 
            x={star.x} 
            y={star.y} 
            size={star.size} 
            delay={star.delay} 
          />
        ))}
        
        {shootingStars.map((star) => (
          <ShootingStar 
            key={star.id} 
            x={star.x} 
            y={star.y} 
            delay={star.delay} 
          />
        ))}
        
        {sparkles.map((sparkle) => (
          <Sparkle 
            key={sparkle.id} 
            x={sparkle.x} 
            y={sparkle.y} 
            delay={sparkle.delay} 
          />
        ))}
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.div
            className="relative w-24 h-24 mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.3 }
            }}
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
            
            {/* Logo glow effect on hover */}
            <motion.div
              className="absolute inset-0 bg-white rounded-full blur-xl opacity-0"
              initial={{ opacity: 0 }}
              whileHover={{ 
                opacity: 0.7,
                scale: 1.2,
                transition: { duration: 0.3 }
              }}
            />
            
            {/* Logo sparkles */}
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-300 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5,
              }}
            />
          </motion.div>

          <motion.h1
            ref={titleRef}
            className="text-4xl md:text-6xl font-bold text-gradient mb-6 leading-tight"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
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
                className="bg-primary text-primary-foreground hover:bg-primary/80 glow-hover text-base py-6 px-8 w-full sm:w-auto relative overflow-hidden group"
              >
                <span className="relative z-10">Our Platform</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-primary/20 text-foreground hover:bg-primary/10 glow-hover text-base py-6 px-8 w-full sm:w-auto relative overflow-hidden group"
              onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="relative z-10">Meet the Team</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8 }}
              />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
