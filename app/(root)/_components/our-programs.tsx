import React from "react";
import Image from "next/image";

const OurPrograms = () => {
  const programs = [
    {
      id: 1,
      title: "Research Fellowship",
      description: "Supporting emerging researchers with mentorship and resources",
      icon: "/api/placeholder/80/80",
    },
    {
      id: 2,
      title: "Innovation Lab",
      description: "Collaborative workspace for developing breakthrough solutions",
      icon: "/api/placeholder/80/80",
    },
    {
      id: 3,
      title: "Education Initiative",
      description: "Providing access to quality learning resources and opportunities",
      icon: "/api/placeholder/80/80",
    },
    {
      id: 4,
      title: "Community Outreach",
      description: "Engaging with communities to understand and address local needs",
      icon: "/api/placeholder/80/80",
    },
    {
      id: 5,
      title: "Technology Transfer",
      description: "Helping innovations reach market through partnerships",
      icon: "/api/placeholder/80/80",
    },
    {
      id: 6,
      title: "Global Symposium",
      description: "Annual gathering of thought leaders and innovators",
      icon: "/api/placeholder/80/80",
    },
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
            Discover Our{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Impactful Programs</span>
              <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-blue-200" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="mt-6 text-xl text-gray-600">Transforming ideas into action through our specialized initiatives</p>
        </div>

        {/* Programs grid */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <div key={program.id} className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-8px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-6 rounded-full bg-blue-100/50 p-4">
                    <Image src={program.icon} alt={program.title} width={80} height={80} className="transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <h3 className="mb-3 text-2xl font-bold text-gray-900">{program.title}</h3>
                  <p className="text-gray-600">{program.description}</p>

                  <div className="mt-6 inline-flex items-center justify-center">
                    <span className="font-medium text-blue-600 transition-colors group-hover:text-green-600">Learn more</span>
                    <svg className="ml-2 h-5 w-5 text-blue-600 transition-colors group-hover:text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
  );
};

export default OurPrograms;
