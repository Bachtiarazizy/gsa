"use client";

import useAccordion from "@/hooks/use-accordion";
import React from "react";

const Faqs = () => {
  const [activeIndexTwo, handleAccordionTwo] = useAccordion() as [number, (index: number) => void];

  return (
    <section id="faqs-section">
      <div className="bg-gradient-to-b from-slate-50 to-white px-6 py-20 sm:px-8 lg:px-24 xl:py-32">
        {/* Section Header */}
        <div className="mx-auto mb-16 text-center md:mb-20 lg:max-w-3xl">
          <h2 className="font-heading mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Got Questions?
            <span className="relative mx-2 block">
              <span className="relative z-10 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">We&apos;re Here to Help</span>
              <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-green-200" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-lg text-gray-600 lg:text-xl">Common questions about Global Skills Academy&apos;s learning platform and programs for Indonesian students</p>
        </div>

        {/* Accordion List */}
        <ul className="mx-auto max-w-4xl space-y-4">
          {/* FAQ Item 1 */}
          <li className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${activeIndexTwo === 0 ? "ring-2 ring-green-500" : ""}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <button onClick={() => handleAccordionTwo(0)} className="flex w-full items-center justify-between text-left">
                <h3 className="font-heading text-xl font-semibold text-gray-900 lg:text-2xl">What makes Global Skills Academy different from other online learning platforms?</h3>
                <span className={`ml-4 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 transition-transform duration-300 ${activeIndexTwo === 0 ? "rotate-45 bg-green-500 border-green-500" : ""}`}>
                  <svg className={`h-5 w-5 ${activeIndexTwo === 0 ? "text-white" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
              </button>
              <div className={`mt-4 ${activeIndexTwo === 0 ? "block" : "hidden"}`}>
                <p className="text-gray-600">
                  Global Skills Academy is specially designed for Indonesian students, offering courses in both Bahasa Indonesia and English. We provide locally relevant content, support from Indonesian mentors, and focus on skills that are
                  in high demand in the Indonesian job market. Our platform also features flexible learning schedules, interactive live sessions with industry experts, and recognized certifications that are valued by Indonesian employers.
                </p>
              </div>
            </div>
          </li>

          {/* FAQ Item 2 */}
          <li className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${activeIndexTwo === 1 ? "ring-2 ring-green-500" : ""}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <button onClick={() => handleAccordionTwo(1)} className="flex w-full items-center justify-between text-left">
                <h3 className="font-heading text-xl font-semibold text-gray-900 lg:text-2xl">How do I access the courses and what are the technical requirements?</h3>
                <span className={`ml-4 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 transition-transform duration-300 ${activeIndexTwo === 1 ? "rotate-45 bg-green-500 border-green-500" : ""}`}>
                  <svg className={`h-5 w-5 ${activeIndexTwo === 1 ? "text-white" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
              </button>
              <div className={`mt-4 ${activeIndexTwo === 1 ? "block" : "hidden"}`}>
                <p className="text-gray-600">
                  You can access our courses through any device with internet connection - computer, tablet, or smartphone. Our platform works best with modern browsers like Chrome, Firefox, or Safari. For the best learning experience, we
                  recommend a stable internet connection of at least 1 Mbps. All course materials are available 24/7, and can be downloaded for offline viewing through our mobile app.
                </p>
              </div>
            </div>
          </li>

          {/* FAQ Item 3 */}
          <li className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${activeIndexTwo === 2 ? "ring-2 ring-green-500" : ""}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <button onClick={() => handleAccordionTwo(2)} className="flex w-full items-center justify-between text-left">
                <h3 className="font-heading text-xl font-semibold text-gray-900 lg:text-2xl">What payment methods are available and are there any scholarships?</h3>
                <span className={`ml-4 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 transition-transform duration-300 ${activeIndexTwo === 2 ? "rotate-45 bg-green-500 border-green-500" : ""}`}>
                  <svg className={`h-5 w-5 ${activeIndexTwo === 2 ? "text-white" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
              </button>
              <div className={`mt-4 ${activeIndexTwo === 2 ? "block" : "hidden"}`}>
                <p className="text-gray-600">
                  We accept various payment methods including bank transfer, credit cards, and popular Indonesian e-wallets like GoPay and OVO. We offer flexible payment plans with installment options. Additionally, we provide scholarship
                  opportunities for outstanding students and those from underprivileged backgrounds. Special group discounts are available for organizations and educational institutions.
                </p>
              </div>
            </div>
          </li>

          {/* FAQ Item 4 */}
          <li className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${activeIndexTwo === 3 ? "ring-2 ring-green-500" : ""}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <button onClick={() => handleAccordionTwo(3)} className="flex w-full items-center justify-between text-left">
                <h3 className="font-heading text-xl font-semibold text-gray-900 lg:text-2xl">What kind of support do students receive during their learning journey?</h3>
                <span className={`ml-4 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 transition-transform duration-300 ${activeIndexTwo === 3 ? "rotate-45 bg-green-500 border-green-500" : ""}`}>
                  <svg className={`h-5 w-5 ${activeIndexTwo === 3 ? "text-white" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
              </button>
              <div className={`mt-4 ${activeIndexTwo === 3 ? "block" : "hidden"}`}>
                <p className="text-gray-600">
                  Students receive comprehensive support including personal mentoring, 24/7 technical assistance, and access to our active learning community. Our Indonesian-speaking support team is available via chat, email, and phone. We
                  also provide regular study group sessions, career counseling, and job placement assistance through our network of partner companies in Indonesia.
                </p>
              </div>
            </div>
          </li>

          {/* FAQ Item 5 */}
          <li className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${activeIndexTwo === 4 ? "ring-2 ring-green-500" : ""}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <button onClick={() => handleAccordionTwo(4)} className="flex w-full items-center justify-between text-left">
                <h3 className="font-heading text-xl font-semibold text-gray-900 lg:text-2xl">Are the certificates recognized by Indonesian employers?</h3>
                <span className={`ml-4 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 transition-transform duration-300 ${activeIndexTwo === 4 ? "rotate-45 bg-green-500 border-green-500" : ""}`}>
                  <svg className={`h-5 w-5 ${activeIndexTwo === 4 ? "text-white" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
              </button>
              <div className={`mt-4 ${activeIndexTwo === 4 ? "block" : "hidden"}`}>
                <p className="text-gray-600">
                  Yes, our certificates are widely recognized in Indonesia. We partner with leading Indonesian companies and educational institutions to ensure our certifications meet industry standards. Our courses are aligned with KKNI
                  (Indonesian National Qualifications Framework) requirements, and many of our programs offer dual certification with international professional bodies.
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Faqs;
