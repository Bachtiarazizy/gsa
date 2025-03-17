"use client";

import React, { useState } from "react";
import FsLightbox from "fslightbox-react";
import Image from "next/image";
import { Play } from "lucide-react";

const VideoPromo = () => {
  const [toggler, setToggler] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-background dark:via-secondary dark:to-background py-20 lg:py-32">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-green-100/30 dark:bg-green-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-blue-100/30 dark:bg-blue-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Content Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-foreground sm:text-5xl lg:text-6xl">
            Transform Your Career
            <span className="relative mx-2 block">
              <span className="relative z-10 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">With Expert-Led Training</span>
              <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-green-200 dark:text-green-800" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-muted-foreground lg:text-xl">Join thousands of professionals who have accelerated their careers through our comprehensive learning programs</p>
        </div>

        {/* Video Container */}
        <div className="group relative mt-16 overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl dark:shadow-lg/10 hover:dark:shadow-xl/20">
          <div className="relative aspect-video w-full">
            <Image src="/img/video.jpg" alt="Educational video thumbnail" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/30" />

            {/* Play Button */}
            <button onClick={() => setToggler(!toggler)} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/90 dark:bg-white/80 shadow-lg transition-transform duration-300 group-hover:scale-110 lg:h-24 lg:w-24">
                <Play className="h-8 w-8 text-green-600 dark:text-green-500 lg:h-10 lg:w-10" />
                {/* Ripple effect */}
                <div className="absolute -inset-4 animate-ping rounded-full bg-white/30" />
                <div className="absolute -inset-8 animate-pulse rounded-full bg-white/20" />
              </div>
            </button>
          </div>
        </div>

        {/* Video Lightbox */}
        <FsLightbox toggler={toggler} sources={["https://youtu.be/4hNYl9N_Zcw"]} />
      </div>
    </section>
  );
};

export default VideoPromo;
