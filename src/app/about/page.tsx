"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">About Associated Students</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Learn about our mission, values, and commitment to serving the UCSD community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-lg p-8 shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-foreground/80 mb-4">
              Associated Students (AS) is the official student government at UC San Diego, representing over 30,000 undergraduate students. Our mission is to enhance the student experience by providing services, programs, and advocacy that enrich campus life and promote student success.
            </p>
            <p className="text-foreground/80">
              We are committed to fostering a vibrant, inclusive campus community where all students can thrive academically, socially, and personally.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card rounded-lg p-8 shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Student-Centered:</strong> We prioritize student needs and interests in all our decisions and actions.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Transparency:</strong> We are committed to open communication and accountability in our operations.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Inclusivity:</strong> We celebrate diversity and work to ensure all voices are heard and valued.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Sustainability:</strong> We promote environmental responsibility in our practices and initiatives.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Innovation:</strong> We embrace creative solutions to address student needs and campus challenges.</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card rounded-lg p-8 shadow-lg mb-16"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Services</h3>
              <p className="text-foreground/70">
                We provide essential services including transportation, food programs, and student organization support.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Advocacy</h3>
              <p className="text-foreground/70">
                We represent student interests to university administration, local government, and state legislators.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Programs</h3>
              <p className="text-foreground/70">
                We organize events, workshops, and initiatives that enhance student life and foster community.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-card rounded-lg p-8 shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Our History</h2>
          <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 z-10"></div>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <p className="text-white text-xl font-bold">UCSD Campus</p>
            </div>
          </div>
          <p className="text-foreground/80 mb-4">
            Associated Students was established in 1965, the same year UC San Diego was founded. Since then, we have grown from a small student organization to a comprehensive student government that serves the entire undergraduate population.
          </p>
          <p className="text-foreground/80">
            Over the decades, we have expanded our services, programs, and advocacy efforts to meet the evolving needs of our diverse student body. Today, we continue to build on this legacy of student leadership and service.
          </p>
        </motion.div>
      </div>
    </div>
  );
} 