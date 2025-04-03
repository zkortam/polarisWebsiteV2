"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Particle component with glow effect
const Particle = ({ x, y, size, speed, direction, mousePosition }: { 
  x: number, 
  y: number, 
  size: number, 
  speed: number, 
  direction: { x: number, y: number },
  mousePosition: { x: number, y: number }
}) => {
  const [position, setPosition] = useState({ x, y });
  const [isHovered, setIsHovered] = useState(false);
  const particleRef = useRef<HTMLDivElement>(null);
  
  // Calculate distance from mouse
  const distanceFromMouse = Math.sqrt(
    Math.pow(position.x - mousePosition.x, 2) + 
    Math.pow(position.y - mousePosition.y, 2)
  );
  
  // Calculate repulsion force based on distance
  const repulsionRadius = 150;
  const repulsionStrength = 0.5;
  const repulsionForce = distanceFromMouse < repulsionRadius 
    ? (1 - distanceFromMouse / repulsionRadius) * repulsionStrength 
    : 0;
  
  // Calculate direction away from mouse
  const angleFromMouse = Math.atan2(
    position.y - mousePosition.y,
    position.x - mousePosition.x
  );
  
  // Apply repulsion force
  const repulsionX = Math.cos(angleFromMouse) * repulsionForce * 10;
  const repulsionY = Math.sin(angleFromMouse) * repulsionForce * 10;
  
  // Update position with animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => {
        // Calculate new position with direction and speed
        let newX = prev.x + direction.x * speed + repulsionX;
        let newY = prev.y + direction.y * speed + repulsionY;
        
        // Wrap around screen edges
        if (newX < 0) newX = window.innerWidth;
        if (newX > window.innerWidth) newX = 0;
        if (newY < 0) newY = window.innerHeight;
        if (newY > window.innerHeight) newY = 0;
        
        return { x: newX, y: newY };
      });
    }, 16); // ~60fps
    
    return () => clearInterval(interval);
  }, [direction, speed, repulsionX, repulsionY]);
  
  // Handle hover effect
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  return (
    <motion.div
      ref={particleRef}
      className="absolute rounded-full"
      style={{
        x: position.x,
        y: position.y,
        width: size,
        height: size,
        background: "rgba(255, 255, 255, 0.8)",
        boxShadow: isHovered 
          ? "0 0 20px 5px rgba(255, 255, 255, 0.8)" 
          : "0 0 10px 3px rgba(255, 255, 255, 0.6)",
        filter: "blur(1px)",
        zIndex: 10,
        cursor: "pointer",
        transition: "box-shadow 0.3s ease"
      }}
      whileHover={{ 
        scale: 1.5,
        boxShadow: "0 0 30px 10px rgba(255, 255, 255, 0.9)",
        filter: "blur(0px)"
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

// Shooting star component
const ShootingStar = ({ startX, startY, angle, length, speed }: { 
  startX: number, 
  startY: number, 
  angle: number, 
  length: number,
  speed: number
}) => {
  const [position, setPosition] = useState({ x: startX, y: startY });
  const [opacity, setOpacity] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => {
        const newX = prev.x + Math.cos(angle) * speed;
        const newY = prev.y + Math.sin(angle) * speed;
        
        // Reset when off screen
        if (newX > window.innerWidth + 100 || newY > window.innerHeight + 100) {
          setOpacity(0);
          setTimeout(() => {
            setPosition({ x: -100, y: Math.random() * window.innerHeight });
            setOpacity(1);
          }, 1000);
          return { x: -100, y: Math.random() * window.innerHeight };
        }
        
        return { x: newX, y: newY };
      });
    }, 16);
    
    return () => clearInterval(interval);
  }, [angle, speed]);
  
  return (
    <motion.div
      className="absolute"
      style={{
        x: position.x,
        y: position.y,
        width: length,
        height: 2,
        background: "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)",
        transform: `rotate(${angle}rad)`,
        transformOrigin: "left center",
        opacity,
        zIndex: 5
      }}
    />
  );
};

// Sparkle component
const Sparkle = ({ x, y, size, duration }: { 
  x: number, 
  y: number, 
  size: number, 
  duration: number 
}) => {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        x,
        y,
        width: size,
        height: size,
        background: "rgba(255, 255, 255, 0.9)",
        boxShadow: "0 0 15px 5px rgba(255, 255, 255, 0.7)",
        filter: "blur(1px)",
        zIndex: 15
      }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }}
    />
  );
};

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    direction: { x: number; y: number };
  }>>([]);
  const [shootingStars, setShootingStars] = useState<Array<{
    id: number;
    startX: number;
    startY: number;
    angle: number;
    length: number;
    speed: number;
  }>>([]);
  const [sparkles, setSparkles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
  }>>([]);
  
  // Mouse movement for glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);
  
  // Parallax effect for hero glow
  const scrollY = useMotionValue(0);
  const glowOpacity = useTransform(scrollY, [0, 500], [0.8, 0.2]);
  
  // Initialize particles and effects
  useEffect(() => {
    setMounted(true);
    
    // Generate random particles
    const newParticles = Array.from({ length: 100 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      return {
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.2 + 0.05,
        direction: {
          x: Math.cos(angle),
          y: Math.sin(angle)
        }
      };
    });
    setParticles(newParticles);
    
    // Generate shooting stars
    const newShootingStars = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      startX: -100,
      startY: Math.random() * window.innerHeight,
      angle: Math.PI / 4 + (Math.random() * Math.PI / 8),
      length: Math.random() * 100 + 50,
      speed: Math.random() * 5 + 3
    }));
    setShootingStars(newShootingStars);
    
    // Generate sparkles
    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2
    }));
    setSparkles(newSparkles);
    
    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    // Handle window resize
    const handleResize = () => {
      // Update particle positions on resize
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x > window.innerWidth ? window.innerWidth - 10 : p.x,
          y: p.y > window.innerHeight ? window.innerHeight - 10 : p.y
        }))
      );
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [mouseX, mouseY]);
  
  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);
  
  // Generate new sparkles periodically
  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      setSparkles(prev => {
        // Replace a random sparkle with a new one
        const index = Math.floor(Math.random() * prev.length);
        const newSparkles = [...prev];
        newSparkles[index] = {
          id: prev[index].id,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 3 + 2
        };
        return newSparkles;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [mounted]);
  
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
      
      {/* Particles */}
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          x={particle.x}
          y={particle.y}
          size={particle.size}
          speed={particle.speed}
          direction={particle.direction}
          mousePosition={mousePosition}
        />
      ))}
      
      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <ShootingStar
          key={star.id}
          startX={star.startX}
          startY={star.startY}
          angle={star.angle}
          length={star.length}
          speed={star.speed}
        />
      ))}
      
      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <Sparkle
          key={sparkle.id}
          x={sparkle.x}
          y={sparkle.y}
          size={sparkle.size}
          duration={sparkle.duration}
        />
      ))}
      
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
