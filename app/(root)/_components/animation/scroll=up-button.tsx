/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/ui/scroll-up-button.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ChevronUp, ArrowUp, CornerRightUp } from "lucide-react";

export interface ScrollUpButtonProps {
  scrollThreshold?: number;
  position?: "bottom-right" | "bottom-left" | "bottom-center" | "top-right" | "top-left";
  color?: "blue" | "red" | "green" | "purple" | "black";
  icon?: "chevron" | "arrow" | "corner";
  showLabel?: boolean;
  pulseEffect?: boolean;
  showScrollProgress?: boolean;
}

const ScrollUpButton = ({ scrollThreshold = 300, position = "bottom-right", color = "blue", icon = "chevron", showLabel = false, pulseEffect = false, showScrollProgress = false }: ScrollUpButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Get icon component based on selection
  const getIcon = () => {
    switch (icon) {
      case "arrow":
        return <ArrowUp size={24} />;
      case "corner":
        return <CornerRightUp size={24} />;
      default:
        return <ChevronUp size={24} />;
    }
  };

  // Get position classes based on selection
  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-8 left-8";
      case "bottom-center":
        return "bottom-8 left-1/2 transform -translate-x-1/2";
      case "top-right":
        return "top-8 right-8";
      case "top-left":
        return "top-8 left-8";
      default:
        return "bottom-8 right-8";
    }
  };

  // Get color classes based on selection
  const getColorClasses = () => {
    switch (color) {
      case "red":
        return "bg-red-500 hover:bg-red-600 focus:ring-red-400";
      case "green":
        return "bg-green-500 hover:bg-green-600 focus:ring-green-400";
      case "purple":
        return "bg-purple-500 hover:bg-purple-600 focus:ring-purple-400";
      case "black":
        return "bg-gray-800 hover:bg-gray-900 focus:ring-gray-600";
      default:
        return "bg-blue-500 hover:bg-blue-600 focus:ring-blue-400";
    }
  };

  // Check scroll position and update visibility and progress
  useEffect(() => {
    const toggleVisibility = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentPosition = window.pageYOffset;

      if (currentPosition > scrollThreshold) {
        setIsVisible(true);
        if (showScrollProgress) {
          setScrollProgress((currentPosition / scrollHeight) * 100);
        }
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", toggleVisibility);

    // Initial check
    toggleVisibility();

    // Clean up the event listener
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [scrollThreshold, showScrollProgress]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <div className={`fixed ${getPositionClasses()} z-50`}>
          {showScrollProgress && <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium">{Math.round(scrollProgress)}%</div>}
          <button
            onClick={scrollToTop}
            className={`p-3 rounded-full ${getColorClasses()} text-white shadow-lg focus:outline-none focus:ring-2 transition-all duration-300 opacity-90 hover:opacity-100 
              
            } flex items-center justify-center`}
            aria-label="Scroll to top"
          >
            {getIcon()}
            {showLabel}
          </button>
        </div>
      )}
    </>
  );
};

export default ScrollUpButton;
