import React from "react";
import { Lightbulb, FlaskConical, GraduationCap, Users, Share2, Globe } from "lucide-react";
import AnimatedScrollWrapper from "./animation/animated-scroll-wrapper";

const OurPrograms = () => {
  const programs = [
    {
      id: 1,
      title: "Research Fellowship",
      description: "Supporting emerging researchers with mentorship and resources",
      icon: <Lightbulb size={48} className="text-blue-600 dark:text-blue-400" />,
    },
    {
      id: 2,
      title: "Innovation Lab",
      description: "Collaborative workspace for developing breakthrough solutions",
      icon: <FlaskConical size={48} className="text-green-600 dark:text-green-400" />,
    },
    {
      id: 3,
      title: "Education Initiative",
      description: "Providing access to quality learning resources and opportunities",
      icon: <GraduationCap size={48} className="text-blue-600 dark:text-blue-400" />,
    },
    {
      id: 4,
      title: "Community Outreach",
      description: "Engaging with communities to understand and address local needs",
      icon: <Users size={48} className="text-green-600 dark:text-green-400" />,
    },
    {
      id: 5,
      title: "Technology Transfer",
      description: "Helping innovations reach market through partnerships",
      icon: <Share2 size={48} className="text-blue-600 dark:text-blue-400" />,
    },
    {
      id: 6,
      title: "Global Symposium",
      description: "Annual gathering of thought leaders and innovators",
      icon: <Globe size={48} className="text-green-600 dark:text-green-400" />,
    },
  ];

  return (
    <AnimatedScrollWrapper animation="slideInLeft" delay={0.3} threshold={0.2} once={false}>
      <section className="relative overflow-hidden bg-secondary py-20 lg:py-32">
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-100/30 dark:bg-blue-900/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-green-100/30 dark:bg-green-900/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header section */}
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 rounded-full bg-blue-50 dark:bg-blue-950/30 opacity-30 blur-3xl" />
            </div>

            <h2 className="font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Discover Our{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-green-400">Impactful Programs</span>
                <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-green-200 dark:text-green-800" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h2>
            <p className="mt-6 text-xl text-muted-foreground">Transforming ideas into action through our specialized initiatives</p>
          </div>

          {/* Programs grid */}
          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <div key={program.id} className="group relative overflow-hidden rounded-xl bg-card p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-8px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/50 dark:to-green-950/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-6 rounded-full bg-blue-100/50 dark:bg-blue-900/30 p-4 transition-colors group-hover:bg-blue-100/70 dark:group-hover:bg-blue-800/40">{program.icon}</div>

                    <h3 className="mb-3 text-2xl font-bold text-foreground">{program.title}</h3>
                    <p className="text-muted-foreground">{program.description}</p>

                    <div className="mt-6 inline-flex items-center justify-center">
                      <span className="font-medium text-blue-600 dark:text-blue-400 transition-colors group-hover:text-green-600 dark:group-hover:text-green-400">Learn more</span>
                      <svg className="ml-2 h-5 w-5 text-blue-600 dark:text-blue-400 transition-colors group-hover:text-green-600 dark:group-hover:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AnimatedScrollWrapper>
  );
};

export default OurPrograms;
