import React from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

const FeatureItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="group flex items-start gap-4 rounded-xl p-2 transition-all duration-300 hover:bg-white/5 dark:hover:bg-white/5">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400 transition-transform duration-300 group-hover:scale-110">
      <CheckCircle className="h-6 w-6" />
    </div>
    <span className="text-xl font-medium text-gray-800 dark:text-gray-200 lg:text-2xl">{children}</span>
  </div>
);

const FeatureTwo = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-green-100/30 dark:bg-green-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-blue-100/30 dark:bg-blue-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Content Section */}
          <div className="relative space-y-8">
            {/* Heading with gradient accent - Modified to prevent wrapping issues */}
            <h2 className="font-heading text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-foreground sm:text-5xl lg:text-6xl">
              Empowering Learners in
              <br />
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">Every Industry</span>
                <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-green-200 dark:text-green-800" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg leading-relaxed text-gray-600 dark:text-muted-foreground lg:text-xl">
              Global Skills Academy provides comprehensive learning solutions that cater to professionals, students, and organizations across various industries, helping them master the skills needed for today&apos;s digital world.
            </p>

            {/* Feature List */}
            <div className="space-y-4 pt-8">
              <FeatureItem>Interactive learning with real-time progress tracking</FeatureItem>
              <FeatureItem>Industry-recognized certifications and badges</FeatureItem>
              <FeatureItem>24/7 access to expert-led course content</FeatureItem>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative group lg:order-2">
            <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl dark:shadow-lg/10 hover:dark:shadow-xl/20">
              <div className="relative h-[400px] w-full lg:h-[500px]">
                <Image src="/img/feature-2.jpg" alt="Learning experience illustration" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
                {/* Image overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-green-500/10 dark:bg-green-500/5 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureTwo;
