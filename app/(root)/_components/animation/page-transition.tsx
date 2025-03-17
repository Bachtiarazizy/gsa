// components/page-transition.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [key, setKey] = useState("");

  // Update key when route changes
  useEffect(() => {
    const url = pathname + searchParams.toString();
    setKey(url);
    setIsNavigating(true);

    // Reset navigation state after animation completes
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-h-screen"
      >
        {children}

        {/* Progress indicator */}
        {isNavigating && <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary/80 z-50" initial={{ scaleX: 0, transformOrigin: "0%" }} animate={{ scaleX: 1, transformOrigin: "0%" }} transition={{ duration: 0.5 }} />}
      </motion.div>
    </AnimatePresence>
  );
}
