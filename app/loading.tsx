// loading.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="relative w-24 h-24">
        {/* Spinner */}
        <motion.div className="absolute inset-0 border-4 border-primary/30 rounded-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} />

        {/* Spinning Arc */}
        <motion.div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 1.2, ease: "linear", repeat: Infinity }} />

        {/* Inner Pulse */}
        <motion.div className="absolute inset-4 bg-primary/10 rounded-full" initial={{ scale: 0.8 }} animate={{ scale: [0.8, 1, 0.8] }} transition={{ duration: 1.5, repeat: Infinity }} />
      </div>

      {/* Loading Text */}
      <motion.div className="mt-8 text-xl font-medium text-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
        <motion.span initial={{ opacity: 0.4 }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
          Loading
        </motion.span>
        <motion.span initial={{ opacity: 0.4 }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}>
          .
        </motion.span>
        <motion.span initial={{ opacity: 0.4 }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}>
          .
        </motion.span>
        <motion.span initial={{ opacity: 0.4 }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, delay: 0.6, repeat: Infinity }}>
          .
        </motion.span>
      </motion.div>
    </div>
  );
}
