"use client";

import React, { useEffect, useState } from "react";
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

      <div
        className={`flex flex-col ${
          contentVisible ? "opacity-100" : "opacity-0"
        } transition-opacity duration-700`}
      >
        <Hero />
        <About />
        <Platform />
        <Team />
        <Contact />
      </div>
    </>
  );
}
