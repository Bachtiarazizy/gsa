import React from "react";
import { BookOpen, BarChart3, GraduationCap } from "lucide-react";

interface FeatureCardProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  color: string;
  darkColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, description, color, darkColor }) => {
  return (
    <div className="group relative bg-card p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:translate-y-[-8px] overflow-hidden">
      {/* Hover gradient background - added this from OurPrograms */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/50 dark:to-green-950/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Decorative elements */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-green-500/10 dark:bg-green-500/5 blur-2xl" />
      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-2xl" />

      {/* Icon container with animation */}
      <div
        className={`relative inline-flex items-center justify-center p-4 ${color} ${darkColor} rounded-2xl mb-6 
        group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-8 h-8 text-current" />
      </div>

      {/* Content */}
      <h3 className="relative z-10 text-2xl font-bold text-foreground mb-4">{title}</h3>
      <p className="relative z-10 text-lg text-muted-foreground leading-relaxed">{description}</p>

      {/* Hover effect */}
      <div className="relative z-10 mt-6 flex items-center text-sm font-semibold text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
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
    <section className="relative overflow-hidden bg-secondary py-20 lg:py-32">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-green-100/30 dark:bg-green-900/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-blue-100/30 dark:bg-blue-900/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="relative max-w-3xl mx-auto text-center mb-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 rounded-full bg-blue-50 dark:bg-blue-950/30 opacity-30 blur-3xl" />
          </div>

          <h2 className="font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-green-400">Global Skills Academy</span>
              <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-green-200 dark:text-green-800" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="mt-6 text-xl text-muted-foreground">Excellence in professional development for the digital age</p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <FeatureCard
            Icon={BookOpen}
            title="Interactive Learning Experience"
            description="Engage with our cutting-edge interactive courses, live sessions, and hands-on projects designed to maximize your learning potential."
            color="bg-green-50 text-green-600"
            darkColor="dark:bg-green-950/40 dark:text-green-400"
          />

          <FeatureCard
            Icon={BarChart3}
            title="Progress Tracking & Analytics"
            description="Monitor your learning journey with detailed progress reports, performance analytics, and personalized learning recommendations."
            color="bg-blue-50 text-blue-600"
            darkColor="dark:bg-blue-950/40 dark:text-blue-400"
          />

          <FeatureCard
            Icon={GraduationCap}
            title="Industry-Recognized Certifications"
            description="Earn valuable certifications upon course completion, enhancing your professional credentials and career opportunities."
            color="bg-green-50 text-green-600"
            darkColor="dark:bg-green-950/40 dark:text-green-400"
          />
        </div>
      </div>
    </section>
  );
};

export default Promo;
