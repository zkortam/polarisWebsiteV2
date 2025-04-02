"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTwitter,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandTiktok
} from "@tabler/icons-react";

const socialLinks = [
  {
    name: "Instagram",
    icon: <IconBrandInstagram className="h-5 w-5" />,
    href: "#",
    color: "bg-gradient-to-br from-purple-600 to-orange-500"
  },
  {
    name: "Twitter",
    icon: <IconBrandTwitter className="h-5 w-5" />,
    href: "#",
    color: "bg-blue-500"
  },
  {
    name: "Facebook",
    icon: <IconBrandFacebook className="h-5 w-5" />,
    href: "#",
    color: "bg-blue-600"
  },
  {
    name: "TikTok",
    icon: <IconBrandTiktok className="h-5 w-5" />,
    href: "#",
    color: "bg-black"
  }
];

export function Contact() {
  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [socialsRef, socialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="py-20 relative overflow-hidden" id="contact">
      <div className="hero-glow opacity-50" />
      <div className="grid-pattern absolute inset-0 opacity-10" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-3 bg-primary/20 text-primary hover:bg-primary/30">Get In Touch</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">Contact Us</h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Have questions about our platform or want to get involved? Reach out to us directly or connect on social media.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Contact Form */}
          <motion.div
            ref={formRef}
            initial="hidden"
            animate={formInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <Card className="glassmorphism border-primary/10 overflow-hidden">
              <CardContent className="p-6">
                <motion.h3
                  className="text-xl font-semibold mb-6"
                  variants={itemVariants}
                >
                  Send Us a Message
                </motion.h3>

                <motion.form className="space-y-4" variants={containerVariants}>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-background/40 border border-primary/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="john@ucsd.edu"
                      className="w-full px-4 py-3 bg-background/40 border border-primary/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Let us know how we can help..."
                      className="w-full px-4 py-3 bg-background/40 border border-primary/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/80 py-6">
                      Send Message
                    </Button>
                  </motion.div>
                </motion.form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info & Social Links */}
          <motion.div
            ref={socialsRef}
            initial="hidden"
            animate={socialsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="flex flex-col justify-between space-y-6"
          >
            <Card className="glassmorphism border-primary/10 overflow-hidden">
              <CardContent className="p-6">
                <motion.h3
                  className="text-xl font-semibold mb-6"
                  variants={itemVariants}
                >
                  Connect With Us
                </motion.h3>

                <motion.div className="space-y-4" variants={containerVariants}>
                  <motion.div className="flex items-start gap-4" variants={itemVariants}>
                    <div className="bg-primary/20 p-3 rounded-full">
                      <IconMail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium">Email</h4>
                      <p className="text-foreground/70 mt-1">polaris@ucsd.edu</p>
                    </div>
                  </motion.div>

                  <motion.div className="flex items-start gap-4" variants={itemVariants}>
                    <div className="bg-primary/20 p-3 rounded-full">
                      <IconPhone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium">Phone</h4>
                      <p className="text-foreground/70 mt-1">(858) 555-1234</p>
                    </div>
                  </motion.div>

                  <motion.div className="flex items-start gap-4" variants={itemVariants}>
                    <div className="bg-primary/20 p-3 rounded-full">
                      <IconMapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium">Office</h4>
                      <p className="text-foreground/70 mt-1">Price Center East, 3rd Floor<br />UC San Diego, La Jolla, CA</p>
                    </div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>

            <Card className="glassmorphism border-primary/10 overflow-hidden">
              <CardContent className="p-6">
                <motion.h3
                  className="text-xl font-semibold mb-6"
                  variants={itemVariants}
                >
                  Follow Our Campaign
                </motion.h3>

                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                  variants={containerVariants}
                >
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      className="flex flex-col items-center p-4 rounded-lg border border-primary/10 hover:bg-primary/5 transition-colors glow-hover group"
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                    >
                      <div className={`w-10 h-10 rounded-full ${social.color} flex items-center justify-center mb-2 transition-transform group-hover:scale-110`}>
                        {social.icon}
                      </div>
                      <span className="text-sm">{social.name}</span>
                    </motion.a>
                  ))}
                </motion.div>

                <motion.p
                  className="text-sm text-center text-foreground/60 mt-6"
                  variants={itemVariants}
                >
                  Follow us for daily updates and campaign news!
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
