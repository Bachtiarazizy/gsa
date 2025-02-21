"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentChild, setCurrentChild] = useState(children);

  useEffect(() => {
    setIsTransitioning(true);

    const timeoutId = setTimeout(() => {
      setIsTransitioning(false);
      setCurrentChild(children);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [pathname, children]);

  return (
    <>
      <main className={`transition-opacity duration-500 ease-in-out ${isTransitioning ? "opacity-0" : "opacity-100"}`}>{currentChild}</main>

      <div className={`fixed inset-0 z-50 bg-gradient-to-r from-green-600 to-blue-600 transition-transform duration-700 ease-in-out ${isTransitioning ? "translate-x-0" : "-translate-x-full"}`} />
    </>
  );
};

export default PageTransition;
