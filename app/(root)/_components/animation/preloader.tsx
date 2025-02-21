"use client";

import React, { useEffect, useState } from "react";

const Preloader = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="space-y-6 text-center">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-spin">
            <div className="h-16 w-16 rounded-full border-b-4 border-t-4 border-green-600" />
          </div>

          <div className="absolute inset-0 animate-spin-slow">
            <div className="h-16 w-16 rounded-full border-l-4 border-r-4 border-blue-600" />
          </div>

          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-green-600 to-blue-600" />
        </div>

        <div className="text-xl font-semibold">
          <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
