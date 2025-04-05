"use client";

import React, { useEffect, useState } from "react";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Platform } from "@/components/sections/Platform";
import { Team } from "@/components/sections/Team";
import { Contact } from "@/components/sections/Contact";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import Image from "next/image";

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
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
          {/* Fixed star background */}
          <div className="fixed inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
            <div className="absolute inset-0 bg-[url('/stars.png')] bg-repeat opacity-50" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-4">
            <div className="mb-8">
              <Image
                src="/Polarislogo.png"
                alt="Polaris Logo"
                width={200}
                height={200}
                className="mx-auto"
                priority
              />
            </div>
            <Hero />
            <About />
            <Platform />
            <Team />
            <Contact />
          </div>
        </div>
      </main>
    </>
  );
}
