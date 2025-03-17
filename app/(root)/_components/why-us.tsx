"use client";

import React, { useEffect, useRef, useState } from "react";
import useAccordion from "@/hooks/use-accordion";
import { ChevronDown, GraduationCap, Target, TrendingUp } from "lucide-react";
import CountUp from "react-countup";

const WhyUs = () => {
  const [activeIndex, handleAccordion] = useAccordion() as [number, (index: number) => void];
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentStatsRef = statsRef.current;
    if (currentStatsRef) {
      observer.observe(currentStatsRef);
    }

    return () => {
      if (currentStatsRef) {
        observer.unobserve(currentStatsRef);
      }
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-secondary py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Accordion Section */}
          <div className="space-y-6">
            {/* Accordion items */}
            <div
              className={`group relative cursor-pointer rounded-2xl bg-white dark:bg-gray-900/50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:shadow-lg/10 hover:dark:shadow-xl/20 overflow-hidden ${
                activeIndex === 0 ? "ring-2 ring-green-500/20 dark:ring-green-500/30" : ""
              }`}
              onClick={() => handleAccordion(0)}
            >
              {/* Hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/50 dark:to-green-950/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Personalized Learning Path</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${activeIndex === 0 ? "rotate-180" : ""}`} />
              </div>
              <div className={`relative z-10 mt-4 overflow-hidden transition-all duration-300 ${activeIndex === 0 ? "max-h-40" : "max-h-0"}`}>
                <p className="text-gray-600 dark:text-gray-300">Our AI-powered platform creates customized learning paths based on your goals, experience, and learning style, ensuring the most effective educational journey.</p>
              </div>
            </div>

            <div
              className={`group relative cursor-pointer rounded-2xl bg-white dark:bg-gray-900/50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:shadow-lg/10 hover:dark:shadow-xl/20 overflow-hidden ${
                activeIndex === 1 ? "ring-2 ring-green-500/20 dark:ring-green-500/30" : ""
              }`}
              onClick={() => handleAccordion(1)}
            >
              {/* Hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/50 dark:to-green-950/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Industry-Aligned Content</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${activeIndex === 1 ? "rotate-180" : ""}`} />
              </div>
              <div className={`relative z-10 mt-4 overflow-hidden transition-all duration-300 ${activeIndex === 1 ? "max-h-40" : "max-h-0"}`}>
                <p className="text-gray-600 dark:text-gray-300">Our courses are developed in partnership with industry leaders, ensuring you learn the most relevant and in-demand skills for today&apos;s job market.</p>
              </div>
            </div>

            <div
              className={`group relative cursor-pointer rounded-2xl bg-white dark:bg-gray-900/50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:shadow-lg/10 hover:dark:shadow-xl/20 overflow-hidden ${
                activeIndex === 2 ? "ring-2 ring-green-500/20 dark:ring-green-500/30" : ""
              }`}
              onClick={() => handleAccordion(2)}
            >
              {/* Hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/50 dark:to-green-950/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Proven Results</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${activeIndex === 2 ? "rotate-180" : ""}`} />
              </div>
              <div className={`relative z-10 mt-4 overflow-hidden transition-all duration-300 ${activeIndex === 2 ? "max-h-40" : "max-h-0"}`}>
                <p className="text-gray-600 dark:text-gray-300">Our learning methodology has helped thousands of students achieve their career goals with measurable improvements in skills and job placement rates.</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            <div>
              <h2 className="font-heading mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-foreground sm:text-5xl lg:text-6xl">
                Your Path
                <span className="relative mx-2 block">
                  <span className="relative z-10 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">to Excellence.</span>
                  <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-green-200 dark:text-green-800" viewBox="0 0 100 12" preserveAspectRatio="none">
                    <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-muted-foreground lg:text-xl">Our comprehensive learning platform combines cutting-edge technology with expert instruction to deliver unparalleled educational outcomes.</p>
            </div>

            {/* Stats Grid with Animation */}
            <div ref={statsRef} className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 lg:text-5xl">
                  {isVisible && (
                    <CountUp end={95} duration={2.5} suffix="%" enableScrollSpy scrollSpyDelay={200}>
                      {({ countUpRef }) => <span ref={countUpRef} />}
                    </CountUp>
                  )}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Course Completion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 lg:text-5xl">
                  {isVisible && (
                    <CountUp end={80} duration={2.5} suffix="%" enableScrollSpy scrollSpyDelay={400}>
                      {({ countUpRef }) => <span ref={countUpRef} />}
                    </CountUp>
                  )}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Career Advancement</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 lg:text-5xl">
                  {isVisible && (
                    <CountUp end={50} duration={2.5} suffix="k+" enableScrollSpy scrollSpyDelay={600}>
                      {({ countUpRef }) => <span ref={countUpRef} />}
                    </CountUp>
                  )}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Active Learners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
