"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Star component for twinkling effect
const Star = ({ x, y }: { x: number; y: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-white rounded-full"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      opacity: [0.2, 1, 0.2],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Shooting star component
const ShootingStar = ({ x, y }: { x: number; y: number }) => (
  <motion.div
    className="absolute w-2 h-2 bg-white rounded-full"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      x: ["0%", "100%"],
      opacity: [1, 0],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

// Sparkle component
const Sparkle = ({ x, y }: { x: number; y: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-white rounded-full"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);

  // Generate random stars
  const stars = Array.from({ length: 50 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  // Generate random shooting stars
  const shootingStars = Array.from({ length: 5 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  // Generate random sparkles
  const sparkles = Array.from({ length: 30 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.body.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mounted, mouseX, mouseY]);

  if (!mounted) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <Image
              src="/PolarisLogo.png"
              alt="Polaris Logo"
              fill
              sizes="96px"
              className="object-contain"
              priority
              quality={100}
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            POLARIS
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Guiding UCSD into a brighter future with innovative solutions and responsible governance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Vote Now
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background stars and effects */}
      {stars.map((star, i) => (
        <Star key={`star-${i}`} x={star.x} y={star.y} />
      ))}
      {shootingStars.map((star, i) => (
        <ShootingStar key={`shooting-${i}`} x={star.x} y={star.y} />
      ))}
      {sparkles.map((sparkle, i) => (
        <Sparkle key={`sparkle-${i}`} x={sparkle.x} y={sparkle.y} />
      ))}

      {/* Interactive glow effect */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl pointer-events-none"
        style={{
          x,
          y,
          rotateX,
          rotateY,
        }}
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          className="relative w-24 h-24 mx-auto mb-8"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full blur-xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          POLARIS
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Guiding UCSD into a brighter future with innovative solutions and responsible governance.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 relative overflow-hidden group"
          >
            <span className="relative z-10">Vote Now</span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 relative overflow-hidden group"
          >
            <span className="relative z-10">Learn More</span>
            <motion.div
              className="absolute inset-0 bg-primary/10"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
