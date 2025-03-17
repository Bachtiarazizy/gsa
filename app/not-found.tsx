// not-found.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-4">
      {/* Animated 404 Graphics */}
      <div className="relative w-full max-w-md h-64 mb-8">
        <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <div className="text-9xl font-bold text-center opacity-5">404</div>
        </motion.div>

        <motion.div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" initial={{ y: -20 }} animate={{ y: [-20, 0, -20] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
          <Compass className="h-24 w-24 text-primary" />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div className="text-center space-y-6 max-w-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Page not found</h1>
        <p className="text-xl text-muted-foreground">We&apos;ve searched high and low, but couldn&apos;t find the page you&apos;re looking for.</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link href="/" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white bg-primary hover:bg-primary/90 transition-colors">
            <Home className="h-4 w-4" />
            Go to homepage
          </Link>
          <button onClick={() => window.history.back()} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border hover:bg-accent transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
