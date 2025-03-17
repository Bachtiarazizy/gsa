import React from "react";
import Image from "next/image";
import AnimatedScrollWrapper from "./animation/animated-scroll-wrapper";

const Collaborators = () => {
  // In a real implementation, you would:
  // 1. Download logo images from official sources
  // 2. Get permission to use them
  // 3. Place them in your public/images/collaborators/ folder
  // 4. Reference them like: "/images/collaborators/google.png"

  const collaborators = [
    { name: "Research Institute Alpha", src: "/logo/1.png" },
    { name: "University Partners Beta", src: "/logo/2.png" },
    { name: "Innovation Lab Gamma", src: "/logo/3.png" },
    { name: "Tech Alliance Delta", src: "/logo/1.png" },
    { name: "Global Foundation Epsilon", src: "/logo/2.png" },
    { name: "Scientific Coalition Zeta", src: "/logo/3.png" },
  ];

  return (
    <AnimatedScrollWrapper animation="slideInLeft" delay={0.3} threshold={0.2} once={false}>
      <section className="relative overflow-hidden bg-backgorund py-20 lg:py-32">
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-100/30 dark:bg-blue-800/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-green-100/30 dark:bg-green-800/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header section */}
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 rounded-full bg-blue-50 dark:bg-blue-900/30 opacity-30 blur-3xl" />
            </div>

            <h2 className="font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Partnerships with{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent dark:from-green-400 dark:to-blue-400">Leading Collaborators</span>
                <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-green-200 dark:text-green-800" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h2>
            <p className="mt-6 text-xl text-muted-foreground">Our research and development efforts are strengthened by these amazing partners</p>
          </div>

          {/* Logo marquee section */}
          <div className="relative mt-20">
            {/* Gradient fade effects */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background via-background/80 to-transparent dark:from-background dark:via-background/80" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background via-background/80 to-transparent dark:from-background dark:via-background/80" />

            {/* Marquee container */}
            <div className="relative overflow-hidden">
              <div className="flex animate-marquee-logo">
                {/* First set of logos */}
                <div className="flex items-center space-x-16 py-8">
                  {collaborators.map((partner, index) => (
                    <div
                      key={`${partner.name}-${index}`}
                      className="group relative flex h-24 w-36 items-center justify-center rounded-xl bg-secondary p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-card/80 dark:shadow-lg/10"
                      aria-label={partner.name}
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-50/50 via-green-50/50 to-blue-50/50 dark:from-blue-900/20 dark:via-green-900/20 dark:to-blue-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative z-10 flex h-16 w-full items-center justify-center">
                        <Image src={partner.src} alt={partner.name} width={100} height={50} className="object-contain transition-transform duration-300 group-hover:scale-110" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Duplicate set for seamless loop */}
                <div className="flex items-center space-x-16 py-8">
                  {collaborators.map((partner, index) => (
                    <div
                      key={`${partner.name}-${index}-duplicate`}
                      className="group relative flex h-24 w-36 items-center justify-center rounded-xl bg-secondary p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      aria-label={partner.name}
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-50/50 via-green-50/50 to-blue-50/50 dark:from-blue-900/20 dark:via-green-900/20 dark:to-blue-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative z-10 flex h-16 w-full items-center justify-center">
                        <Image src={partner.src} alt={partner.name} width={100} height={50} className="object-contain transition-transform duration-300 group-hover:scale-110" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedScrollWrapper>
  );
};

export default Collaborators;
