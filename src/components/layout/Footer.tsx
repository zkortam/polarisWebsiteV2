"use client";

import React from "react";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";

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
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gradient">POLARIS</h3>
            <p className="text-foreground/70">
              Empowering students at UC San Diego through innovative leadership and sustainable initiatives.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/#about" className="text-foreground/70 hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/platform" className="text-foreground/70 hover:text-primary transition-colors">
                Platform
              </Link>
              <Link href="/#team" className="text-foreground/70 hover:text-primary transition-colors">
                Our Team
              </Link>
              <Link href="/budget" className="text-foreground/70 hover:text-primary transition-colors">
                Budget
              </Link>
            </nav>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/polaris.ucsd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-primary transition-colors"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://www.facebook.com/polaris.ucsd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-primary transition-colors"
                aria-label="Follow us on Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://www.tiktok.com/@polaris.ucsd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-primary transition-colors"
                aria-label="Follow us on TikTok"
              >
                <FaTiktok size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center text-foreground/50">
          <p>&copy; {new Date().getFullYear()} Polaris UCSD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
