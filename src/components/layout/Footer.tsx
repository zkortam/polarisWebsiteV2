"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const footerLinks = [
  {
    title: "About",
    links: [
      { label: "Our Vision", href: "#about" },
      { label: "Team", href: "#team" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Campus Improvements", href: "#platform" },
      { label: "Student Spirit", href: "#platform" },
      { label: "Financial Initiatives", href: "#platform" },
      { label: "Innovation & Careers", href: "#platform" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Voting Information", href: "#" },
      { label: "Campaign Events", href: "#" },
      { label: "AS UCSD", href: "https://as.ucsd.edu/", target: "_blank" },
      { label: "AS Budget", href: "https://as.ucsd.edu/about/budget.html", target: "_blank" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-primary/10 overflow-hidden">
      <div className="hero-glow opacity-20" />
      <div className="grid-pattern absolute inset-0 opacity-5" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="absolute w-5 h-5 bg-primary rounded-full opacity-80" />
                <div className="absolute w-5 h-5 bg-primary rounded-full animate-pulse-slow" />
              </div>
              <span className="text-xl font-bold text-gradient">POLARIS</span>
            </Link>

            <p className="mt-4 text-sm text-foreground/70 max-w-md">
              Guiding UCSD into a brighter future with innovative solutions, responsible governance, and a commitment to enhancing the student experience.
            </p>

            <div className="mt-6 flex items-center space-x-4">
              <motion.a
                href="https://www.instagram.com/polaris.ucsd/"
                className="text-foreground/80 hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <span className="sr-only">Instagram</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </motion.a>
              <motion.a
                href="#"
                className="text-foreground/80 hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </motion.a>
              <motion.a
                href="https://www.instagram.com/polaris.ucsd/"
                className="text-foreground/80 hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <span className="sr-only">Facebook</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </motion.a>
              <motion.a
                href="https://www.tiktok.com/@polaris.ucsd"
                className="text-foreground/80 hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <span className="sr-only">TikTok</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                  <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                  <path d="M15 8v8a4 4 0 0 1-4 4" />
                  <line x1="15" y1="4" x2="15" y2="16" />
                </svg>
              </motion.a>
            </div>
          </div>

          {/* Footer links */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="font-semibold mb-3 text-primary">{group.title}</h3>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={link.target}
                        className="text-sm text-foreground/70 hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-foreground/60">
            &copy; {new Date().getFullYear()} Polaris for UCSD AS. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <Link href="#" className="text-xs text-foreground/60 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="text-foreground/30">|</span>
            <Link href="#" className="text-xs text-foreground/60 hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span className="text-foreground/30">|</span>
            <Link href="#" className="text-xs text-foreground/60 hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
