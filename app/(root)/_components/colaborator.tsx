import React from "react";
import Image from "next/image";

const Collaborators = () => {
  // In a real implementation, you would:
  // 1. Download logo images from official sources
  // 2. Get permission to use them
  // 3. Place them in your public/images/collaborators/ folder
  // 4. Reference them like: "/images/collaborators/google.png"

  const collaborators = [
    { name: "Research Institute Alpha", src: "/api/placeholder/160/80" },
    { name: "University Partners Beta", src: "/api/placeholder/160/80" },
    { name: "Innovation Lab Gamma", src: "/api/placeholder/160/80" },
    { name: "Tech Alliance Delta", src: "/api/placeholder/160/80" },
    { name: "Global Foundation Epsilon", src: "/api/placeholder/160/80" },
    { name: "Scientific Coalition Zeta", src: "/api/placeholder/160/80" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white py-20 lg:py-32">
      {/* Decorative backgrounds */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-green-100/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 rounded-full bg-blue-50 opacity-30 blur-3xl" />
          </div>

          <h2 className="font-heading text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Partnerships with{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Leading Collaborators</span>
              <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-blue-200" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="mt-6 text-xl text-gray-600">Our research and development efforts are strengthened by these amazing partners</p>
        </div>

        {/* Logo marquee section */}
        <div className="relative mt-20">
          {/* Gradient fade effects */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white via-white/80 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white via-white/80 to-transparent" />

          {/* Marquee container */}
          <div className="relative overflow-hidden">
            <div className="flex animate-marquee-logo">
              {/* First set of logos */}
              <div className="flex items-center space-x-16 py-8">
                {collaborators.map((partner, index) => (
                  <div key={`${partner.name}-${index}`} className="group relative flex h-24 w-48 items-center justify-center rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-50 to-green-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Image src={partner.src} alt={partner.name} width={160} height={80} className="relative z-10 object-contain transition-transform duration-300 group-hover:scale-110" />
                    <span className="absolute bottom-2 text-xs font-medium text-gray-500">{partner.name}</span>
                  </div>
                ))}
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex items-center space-x-16 py-8">
                {collaborators.map((partner, index) => (
                  <div key={`${partner.name}-${index}-duplicate`} className="group relative flex h-24 w-48 items-center justify-center rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-50 to-green-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Image src={partner.src} alt={partner.name} width={160} height={80} className="relative z-10 object-contain transition-transform duration-300 group-hover:scale-110" />
                    <span className="absolute bottom-2 text-xs font-medium text-gray-500">{partner.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collaborators;
