"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Canvas-based star background component
const StarBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const mousePosition = useRef<{ x: number | null, y: number | null }>({ x: null, y: null });
  const particlesRef = useRef<any[]>([]);
  const shootingStarsRef = useRef<any[]>([]);
  const burningAsteroidsRef = useRef<any[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const particleCount = 800; // Increased from 400 to 800 for more stars

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
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.brightness = Math.random() * 0.5 + 0.5;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update(canvas: HTMLCanvasElement) {
      // Pulsing effect
      this.brightness = 0.5 + Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 0.2;
      
      // Mouse interaction with increased sensitivity
      if (mousePosition.current.x !== null && mousePosition.current.y !== null) {
        let dx = mousePosition.current.x - this.x;
        let dy = mousePosition.current.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 150) { // Increased threshold
          let force = (150 - distance) / 150;
          this.x -= dx * force * 0.1; // Increased multiplier
          this.y -= dy * force * 0.1;
        }
      }
      
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

  // Shooting star class
  class ShootingStar {
    x: number = 0;
    y: number = 0;
    length: number = 0;
    speed: number = 0;
    angle: number = 0;
    opacity: number = 0;
    fadeSpeed: number = 0;
    active: boolean = false;
    trail: any[] = [];
    color: string = '#ffffff';

    constructor(canvas: HTMLCanvasElement) {
      this.reset(canvas);
    }

    reset(canvas: HTMLCanvasElement) {
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.length = Math.random() * 80 + 100;
      this.speed = Math.random() * 15 + 10;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
      this.opacity = 0;
      this.fadeSpeed = 0.05;
      this.active = false;
      this.trail = [];
      this.color = Math.random() < 0.3 ? '#63b3ed' : '#ffffff';
    }

    update(canvas: HTMLCanvasElement) {
      if (!this.active) {
        if (Math.random() < 0.005) {
          this.active = true;
          this.opacity = 1;
        }
        return;
      }
      
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      
      // Update trail with sparkle effect
      this.trail.unshift({ 
        x: this.x, 
        y: this.y, 
        opacity: this.opacity,
        sparkle: Math.random() > 0.7
      });
      
      if (this.trail.length > 20) this.trail.pop();
      
      // Fade out when off screen
      if (this.x > canvas.width || this.y > canvas.height) {
        this.opacity -= this.fadeSpeed;
        if (this.opacity <= 0) {
          this.reset(canvas);
        }
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      if (!this.active) return;
      
      this.trail.forEach((point, index) => {
        const gradientOpacity = point.opacity * (1 - index / this.trail.length);
        ctx.strokeStyle = `rgba(255, 255, 255, ${gradientOpacity})`;
        ctx.lineWidth = point.sparkle ? 3 : 2;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        if (index < this.trail.length - 1) {
          ctx.lineTo(this.trail[index + 1].x, this.trail[index + 1].y);
        }
        ctx.stroke();
        
        if (point.sparkle) {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }
  }

  // Burning asteroid class
  class BurningAsteroid {
    x: number = 0;
    y: number = 0;
    size: number = 0;
    speed: number = 0;
    particles: any[] = [];
    active: boolean = true;

    constructor(canvas: HTMLCanvasElement) {
      this.reset(canvas);
      this.active = true; // Always active from the beginning
    }

    reset(canvas: HTMLCanvasElement) {
      this.x = Math.random() * canvas.width;
      this.y = -50;
      this.size = Math.random() * 5 + 10; // Start off larger
      this.speed = Math.random() * 2 + 1;
      this.particles = [];
    }

    update(canvas: HTMLCanvasElement) {
      this.y += this.speed;
      this.size *= 0.995; // Gradually shrink
      
      if (Math.random() < 0.3) {
        this.particles.push({
          x: this.x,
          y: this.y,
          size: Math.random() * 2,
          speedX: (Math.random() - 0.5) * 2,
          speedY: -Math.random() * 2,
          life: 1,
          color: Math.random() < 0.7 ? '#ff4500' : '#ffd700'
        });
      }
      
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.life -= 0.02;
        if (p.life <= 0) this.particles.splice(i, 1);
      }
      
      if (this.y > canvas.height + 50 || this.size < 2) {
        this.reset(canvas);
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = '#808080';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      this.particles.forEach(p => {
        ctx.fillStyle = `rgba(${p.color === '#ff4500' ? '255,69,0' : '255,215,0'},${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  // Initialize particles
  const initParticles = (canvas: HTMLCanvasElement) => {
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle(canvas));
    }
    
    // Reduce shooting stars and asteroids by 50%
    shootingStarsRef.current = Array(3).fill(null).map(() => new ShootingStar(canvas));
    burningAsteroidsRef.current = Array(3).fill(null).map(() => new BurningAsteroid(canvas));
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
    
    shootingStarsRef.current.forEach(star => {
      star.update(canvas);
      star.draw(ctx);
    });
    
    burningAsteroidsRef.current.forEach(asteroid => {
      asteroid.update(canvas);
      asteroid.draw(ctx);
    });
    
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
    
    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    
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
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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
  
  // Mouse movement for glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);
  
  // Parallax effect for hero glow
  const scrollY = useMotionValue(0);
  const glowOpacity = useTransform(scrollY, [0, 500], [0.8, 0.2]);
  
  // Initialize effects
  useEffect(() => {
    setMounted(true);
    
    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    // Handle scroll for parallax effect
    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mouseX, mouseY, scrollY]);
  
  // Static UI for server-side rendering
  if (!mounted) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
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
      
      {/* Background glow that follows mouse */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px] pointer-events-none"
        style={{
          x: glowX,
          y: glowY,
          opacity: glowOpacity,
          transform: "translate(-50%, -50%)",
        }}
      />
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl mx-auto text-center">
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
