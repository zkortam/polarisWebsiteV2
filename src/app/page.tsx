"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Platform } from "@/components/sections/Platform";
import { Team } from "@/components/sections/Team";
import { Contact } from "@/components/sections/Contact";
import { LoadingScreen } from "@/components/shared/LoadingScreen";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  // Handle loading state
  useEffect(() => {
    // Simulate initial loading
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Show content with a fade-in effect after loading
    const visibilityTimer = setTimeout(() => {
      setContentVisible(true);
    }, 2300);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(visibilityTimer);
    };
  }, []);

  return (
    <>
      {loading && <LoadingScreen />}

      <main
        className={`flex min-h-screen flex-col ${
          contentVisible ? "opacity-100" : "opacity-0"
        } transition-opacity duration-700`}
      >
        <Navbar />
        <Hero />
        <About />
        <Platform />
        <Team />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
