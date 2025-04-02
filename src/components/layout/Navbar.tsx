"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useToast } from "@/components/ui/use-toast";

const navLinks = [
  { href: "#about", label: "About Us" },
  { href: "#platform", label: "Platform" },
  { href: "#team", label: "Our Team" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const handleVoteClick = () => {
    toast({
      title: "Voting Information",
      description: "Voting opens on 4/7/2025",
      duration: 3000,
    });
  };

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      // Update active section based on scroll position
      const sections = document.querySelectorAll("section[id]");

      // Fixed: Using for...of instead of forEach
      for (const section of sections) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (
          window.scrollY >= sectionTop - 100 &&
          window.scrollY < sectionTop + sectionHeight - 100
        ) {
          setActiveSection(`#${section.getAttribute("id")}`);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "py-2 glassmorphism shadow-lg"
          : "py-4 bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            className="relative w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center glow-hover"
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute w-6 h-6 bg-primary rounded-full opacity-80"></div>
            <div className="absolute w-6 h-6 bg-primary rounded-full animate-pulse-slow"></div>
          </motion.div>
          <motion.span
            className="text-xl font-bold text-gradient"
            whileHover={{ scale: 1.05 }}
          >
            POLARIS
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium transition-colors hover:text-primary ${
                activeSection === link.href ? "text-primary" : "text-foreground/80"
              }`}
            >
              <span>{link.label}</span>
              {activeSection === link.href && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeSection"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/80 glow-hover"
            onClick={handleVoteClick}
          >
            Vote Now
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="glow-hover">
              <IconMenu2 className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="glassmorphism border-primary/20">
            <div className="flex flex-col space-y-6 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/80 w-full"
                onClick={handleVoteClick}
              >
                Vote Now
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}

export default Navbar;
