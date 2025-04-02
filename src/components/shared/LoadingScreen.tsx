"use client";

import React from "react";
import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative">
        {/* Animated background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full animate-pulse-slow" />
          <div className="absolute inset-0 bg-primary/10 blur-3xl scale-75 rounded-full animate-glow-pulse" />
        </div>

        {/* Logo */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="relative w-20 h-20 mb-6">
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0 scale-75 rounded-full bg-primary/50"
              animate={{ scale: [0.75, 0.85, 0.75] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.div
              className="absolute inset-0 scale-50 rounded-full bg-primary"
              animate={{
                scale: [0.5, 0.6, 0.5],
                rotate: [0, 180, 360]
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 },
                rotate: { duration: 8, repeat: Infinity, ease: "linear" }
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-3xl font-bold text-gradient tracking-wider">POLARIS</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-8 flex items-center space-x-2"
          >
            <div className="h-1 w-1 bg-primary rounded-full animate-pulse" />
            <div className="h-1 w-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
            <div className="h-1 w-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: "600ms" }} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoadingScreen;
