"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { ReactNode } from "react";

export default function ScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false, // We handle requestAnimationFrame manually
      duration: 1.2, // Adjusts scrolling speed
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // Custom easing function
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy(); // Cleanup when component unmounts
    };
  }, []);

  return <div>{children}</div>;
}
