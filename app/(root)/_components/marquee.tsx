import React from "react";

const Marquee = () => {
  return (
    <div id="text-slide-section" className="relative overflow-hidden">
      {/* Gradient overlays for smooth edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

      {/* Main marquee content */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-6">
        <div className="flex animate-marquee whitespace-nowrap">
          {/* First set of items */}
          <div className="flex items-center gap-8 px-4">
            <span className="text-2xl font-medium text-white opacity-90">#OnlineLearning</span>
            <span className="text-2xl font-medium text-white opacity-90">#SkillDevelopment</span>
            <span className="text-2xl font-medium text-white opacity-90">#ProfessionalGrowth</span>
            <span className="text-2xl font-medium text-white opacity-90">#DigitalSkills</span>
            <span className="text-2xl font-medium text-white opacity-90">#CareerAdvancement</span>
          </div>

          {/* Duplicate for seamless loop */}
          <div className="flex items-center gap-8 px-4">
            <span className="text-2xl font-medium text-white opacity-90">#OnlineLearning</span>
            <span className="text-2xl font-medium text-white opacity-90">#SkillDevelopment</span>
            <span className="text-2xl font-medium text-white opacity-90">#ProfessionalGrowth</span>
            <span className="text-2xl font-medium text-white opacity-90">#DigitalSkills</span>
            <span className="text-2xl font-medium text-white opacity-90">#CareerAdvancement</span>
          </div>

          {/* Third set for extra smoothness */}
          <div className="flex items-center gap-8 px-4">
            <span className="text-2xl font-medium text-white opacity-90">#OnlineLearning</span>
            <span className="text-2xl font-medium text-white opacity-90">#SkillDevelopment</span>
            <span className="text-2xl font-medium text-white opacity-90">#ProfessionalGrowth</span>
            <span className="text-2xl font-medium text-white opacity-90">#DigitalSkills</span>
            <span className="text-2xl font-medium text-white opacity-90">#CareerAdvancement</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marquee;
