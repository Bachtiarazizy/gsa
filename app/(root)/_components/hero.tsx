import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background for large screens with clip-path */}
      <div
        className="hidden lg:block absolute inset-0 z-0 bg-primary"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 65%, 0% 100%)",
        }}
      />
      {/* Normal background for smaller screens */}
      <div className="block lg:hidden absolute inset-0 z-0 bg-primary" />

      {/* Content */}
      <div className="relative z-10 px-6 py-32 sm:px-8 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-7xl font-bold tracking-wide text-primary-foreground mb-6">Empowering Indonesia&apos;s Golden Generation 2045</h1>
                <p className="text-primary-foreground text-lg mb-8">
                  An advanced Learning Management System developed by the Indonesian Students Association Worldwide, focusing on essential digital-era skills like digital marketing, export-import, and investment.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <Link href="/courses" className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    Get Started
                  </Link>
                  <Link href="/about" className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors duration-200">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
                <Image src="/img/mobile-hero1.png" alt="xmoze app showcase" width={500} height={600} className="relative z-10 h-auto w-full max-w-md mx-auto lg:max-w-none" priority />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
