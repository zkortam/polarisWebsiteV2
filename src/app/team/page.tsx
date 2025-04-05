"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Team member data
const teamMembers = [
  {
    name: "John Smith",
    position: "AS President",
    image: "/team/president.jpg",
    bio: "Senior, Political Science major. Committed to amplifying student voices and improving campus life.",
    email: "aspresident@ucsd.edu",
  },
  {
    name: "Sarah Johnson",
    position: "AS Vice President",
    image: "/team/vp.jpg",
    bio: "Junior, Economics major. Focused on financial transparency and student services improvement.",
    email: "asvp@ucsd.edu",
  },
  {
    name: "Michael Chen",
    position: "AS Treasurer",
    image: "/team/treasurer.jpg",
    bio: "Senior, Business Economics major. Ensuring responsible stewardship of student funds.",
    email: "astreasurer@ucsd.edu",
  },
  {
    name: "Emily Rodriguez",
    position: "AS Secretary",
    image: "/team/secretary.jpg",
    bio: "Junior, Communication major. Dedicated to improving communication between AS and students.",
    email: "assecretary@ucsd.edu",
  },
  {
    name: "David Kim",
    position: "AS Programming Director",
    image: "/team/programming.jpg",
    bio: "Senior, Computer Science major. Leading technological initiatives for student services.",
    email: "asprogramming@ucsd.edu",
  },
  {
    name: "Lisa Patel",
    position: "AS Events Director",
    image: "/team/events.jpg",
    bio: "Junior, Sociology major. Creating memorable campus experiences for all students.",
    email: "asevents@ucsd.edu",
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Our Team</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Meet the dedicated student leaders who work tirelessly to serve the UCSD community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative h-64 w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
                <div className="absolute bottom-4 left-4 z-20">
                  <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                  <p className="text-white/80">{member.position}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-foreground/80 mb-4">{member.bio}</p>
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 bg-card rounded-lg p-8 shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Join Our Team</h2>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-foreground/80 mb-6">
              We're always looking for passionate students to join our team. Whether you're interested in leadership,
              event planning, advocacy, or technology, there's a place for you in Associated Students.
            </p>
            <a
              href="/apply"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Apply Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 