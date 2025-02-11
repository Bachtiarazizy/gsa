import { BookOpen } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { GraduationCap } from "lucide-react";

export default function Promo() {
  return (
    <section className="py-20 bg-[#FAFAFB]">
      <div className="w-full px-6 sm:px-8 lg:px-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div>
            <h2 className="font-heading text-4xl font-medium leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">Transform Your Learning Journey with Global Skills Academy</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-block p-4 bg-blue-100 rounded-lg mb-6">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Interactive Learning Experience</h3>
            <p className="text-gray-600">Engage with our cutting-edge interactive courses, live sessions, and hands-on projects designed to maximize your learning potential.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-block p-4 bg-green-100 rounded-lg mb-6">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Progress Tracking & Analytics</h3>
            <p className="text-gray-600">Monitor your learning journey with detailed progress reports, performance analytics, and personalized learning recommendations.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-block p-4 bg-purple-100 rounded-lg mb-6">
              <GraduationCap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Industry-Recognized Certifications</h3>
            <p className="text-gray-600">Earn valuable certifications upon course completion, enhancing your professional credentials and career opportunities.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
