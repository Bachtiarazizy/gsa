// error.tsx
"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-4">
      {/* Animated Error Graphics */}
      <motion.div className="relative mb-8 p-6" initial={{ rotate: 0 }} animate={{ rotate: [0, -5, 5, -5, 0] }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl"></div>
        <div className="relative">
          <AlertTriangle className="h-24 w-24 text-red-500" />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div className="text-center space-y-6 max-w-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Something went wrong</h1>
        <p className="text-xl text-muted-foreground">We apologize for the inconvenience. An unexpected error has occurred.</p>

        {error.digest && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">Error ID: {error.digest}</p>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button onClick={reset} className="flex items-center gap-2 px-6 py-3 rounded-full text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Try again
          </button>
        </div>
      </motion.div>
    </div>
  );
}
