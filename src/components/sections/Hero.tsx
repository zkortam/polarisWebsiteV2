"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Canvas-based star background component
const StarBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const particlesRef = useRef<any[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const particleCount = 200; // Reduced from 800 to 200 for fewer stars

  // Particle class
  class Particle {
    x: number;
    y: number;
    size: number = 0;
    speedX: number = 0;
    speedY: number = 0;
    brightness: number = 0;
    pulseSpeed: number = 0;
    pulseOffset: number = 0;

    constructor(canvas: HTMLCanvasElement) {
      this.reset();
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.size = Math.random() * 1.5 + 0.5; // Smaller stars
      this.speedX = (Math.random() - 0.5) * 0.2; // Slower movement
      this.speedY = (Math.random() - 0.5) * 0.2;
      this.brightness = Math.random() * 0.3 + 0.2; // More faded stars
      this.pulseSpeed = Math.random() * 0.01 + 0.005; // Slower pulsing
      this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update(canvas: HTMLCanvasElement) {
      // Subtle pulsing effect
      this.brightness = 0.2 + Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 0.1;
      
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Wrap around screen edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialize particles
  const initParticles = (canvas: HTMLCanvasElement) => {
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle(canvas));
    }
  };

  // Animation function
  const animateParticles = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particlesRef.current.forEach(p => {
      const relativeY = p.y / canvas.height;
      const densityFactor = Math.max(0, 1 - (scrollPercent + relativeY) * 0.5);
      p.update(canvas);
      ctx.globalAlpha = p.brightness * densityFactor;
      p.draw(ctx);
    });
    
    ctx.globalAlpha = 1;
    
    animationFrameRef.current = requestAnimationFrame(() => animateParticles(canvas, ctx));
  };

  // Setup canvas and event listeners
  useEffect(() => {
    setMounted(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Initialize particles
    initParticles(canvas);
    
    // Start animation
    animateParticles(canvas, ctx);
    
    // Handle window resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles(canvas);
      }
    };
    
    // Handle scroll
    const handleScroll = () => {
      if (canvas) {
        canvas.style.top = window.scrollY + 'px';
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="stars-canvas"
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Fixed star background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
        <div className="absolute inset-0 bg-[url('/stars.png')] bg-repeat opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Image
            src="/Polarislogo.png"
            alt="Polaris Logo"
            width={200}
            height={200}
            className="mx-auto"
            priority
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6"
        >
          Welcome to Polaris
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-8"
        >
          Your Gateway to Student Government
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#about"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
          >
            Learn More
          </a>
          <a
            href="#contact"
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg transition-colors"
          >
            Get Involved
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
