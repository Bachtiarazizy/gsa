import React from "react";
import { BookOpen, BarChart3, GraduationCap } from "lucide-react";

interface FeatureCardProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, description, color }) => {
  return (
    <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
      {/* Decorative elements */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-green-500/10 blur-2xl" />
      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />

      {/* Icon container with animation */}
      <div
        className={`relative inline-flex items-center justify-center p-4 ${color} rounded-2xl mb-6 
        group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-8 h-8 text-current" />
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-lg text-gray-600 leading-relaxed">{description}</p>

      {/* Hover effect */}
      <div className="mt-6 flex items-center text-sm font-semibold text-green-600 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
        Learn more
        <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

const Promo = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white py-20 lg:py-32">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-green-100/30 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="relative max-w-3xl mx-auto text-center mb-20">
          <h2 className="font-heading text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Transform Your Learning Journey with
            <br />
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Global Skills Academy</span>
              <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-green-200" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h2>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <FeatureCard
            Icon={BookOpen}
            title="Interactive Learning Experience"
            description="Engage with our cutting-edge interactive courses, live sessions, and hands-on projects designed to maximize your learning potential."
            color="bg-green-50 text-green-600"
          />

          <FeatureCard
            Icon={BarChart3}
            title="Progress Tracking & Analytics"
            description="Monitor your learning journey with detailed progress reports, performance analytics, and personalized learning recommendations."
            color="bg-blue-50 text-blue-600"
          />

          <FeatureCard
            Icon={GraduationCap}
            title="Industry-Recognized Certifications"
            description="Earn valuable certifications upon course completion, enhancing your professional credentials and career opportunities."
            color="bg-green-50 text-green-600"
          />
        </div>
      </div>
    </section>
  );
};

export default Promo;
