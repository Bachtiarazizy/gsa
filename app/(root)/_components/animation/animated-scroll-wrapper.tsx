// components/animated-scroll-wrapper.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, Variants } from "framer-motion";

// Animation variants
const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const scaleUp: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
    },
  },
};

// Animation presets object
const animations = {
  fadeInUp,
  fadeIn,
  scaleUp,
  slideInLeft,
  slideInRight,
};

type AnimationType = keyof typeof animations;

interface AnimatedScrollWrapperProps {
  children: React.ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  threshold?: number;
  once?: boolean;
  stagger?: boolean;
  staggerDelay?: number;
}

export default function AnimatedScrollWrapper({ children, className = "", animation = "fadeInUp", delay = 0, threshold = 0.1, once = true, stagger = false, staggerDelay = 0.1 }: AnimatedScrollWrapperProps) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const currentRef = ref.current; // Store ref value to avoid closure issues

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        if (entry.isIntersecting) {
          setIsInView(true);
          controls.start("visible");
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsInView(false);
          controls.start("hidden");
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px", // Start animation slightly before element is in view
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [controls, once, threshold]);

  // Handle staggered children
  const childrenArray = React.Children.toArray(children);
  const variant = animations[animation];

  useEffect(() => {
    if (isInView && delay > 0) {
      const timer = setTimeout(() => {
        controls.start("visible");
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, controls, delay]);

  if (stagger && childrenArray.length > 0) {
    return (
      <div ref={ref} className={className}>
        {childrenArray.map((child, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate={controls}
            variants={variant}
            transition={{
              delay: delay + index * staggerDelay,
            }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={variant}
      transition={{
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
