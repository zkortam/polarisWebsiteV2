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

export function Hero() {
  const [mounted, setMounted] = useState(false);
  
  // Initialize effects
  useEffect(() => {
    setMounted(true);
    
    // Handle scroll for parallax effect
    const handleScroll = () => {
      // Scroll handling if needed
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Static UI for server-side rendering
  if (!mounted) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Image 
                src="/images/logo.png" 
                alt="Polaris Logo" 
                width={120} 
                height={120} 
                className="rounded-full"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              POLARIS
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-foreground/80">
              Guiding UCSD into a brighter future with innovative solutions, responsible governance, and a commitment to enhancing the student experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group">
                Learn More
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                Get Involved
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/80">
      {/* Canvas-based star background */}
      <StarBackground />
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-6"
          >
            <Image 
              src="/images/logo.png" 
              alt="Polaris Logo" 
              width={120} 
              height={120} 
              className="rounded-full"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              POLARIS
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-foreground/80"
          >
            Guiding UCSD into a brighter future with innovative solutions, responsible governance, and a commitment to enhancing the student experience.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="group">
              Learn More
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              Get Involved
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
