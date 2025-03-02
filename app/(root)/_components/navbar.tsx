"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 ${isScrolled || isMobileMenuOpen ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"}`}>
      <nav className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        {/* Main navbar container */}
        <div className="relative flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-10">
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">GlobalSkills</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            <NavLinks />
            <div className="flex items-center gap-4">
              <SignedOut>
                <div className="flex items-center gap-4">
                  <SignInButton mode="modal">
                    <button className="rounded-full bg-gradient-to-r from-green-600 to-blue-600 px-6 py-2.5 text-white shadow-lg transition-all duration-300 hover:shadow-xl">Get Started</button>
                  </SignInButton>
                </div>
              </SignedOut>

              <SignedIn>
                <Link href="/student/dashboard" className="rounded-full bg-gradient-to-r from-green-600 to-blue-600 px-6 py-2.5 text-white shadow-lg transition-all duration-300 hover:shadow-xl">
                  Dashboard
                </Link>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="relative z-10 rounded-md p-2 lg:hidden hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`fixed inset-x-0 top-[72px] z-50 h-screen transform overflow-y-auto bg-white px-6 py-4 transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <MobileNavLinks />
            </div>
            <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 text-center text-white shadow-lg transition-all duration-300 hover:shadow-xl" onClick={() => setIsMobileMenuOpen(false)}>
                    Get Started
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center justify-between">
                  <Link
                    href="/student/dashboard"
                    className="rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 text-center text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

const NavLinks = () => (
  <div className="flex items-center gap-8">
    <Link href="/courses" className="text-gray-600 hover:text-gray-900 transition-colors">
      Courses
    </Link>
    <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
      About
    </Link>

    <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
      Contact
    </Link>
  </div>
);

const MobileNavLinks = () => (
  <>
    <Link href="/courses" className="w-full text-lg font-medium text-gray-600 hover:text-gray-900 transition-colors">
      Courses
    </Link>
    <Link href="/about" className="w-full text-lg font-medium text-gray-600 hover:text-gray-900 transition-colors">
      About
    </Link>

    <Link href="/contact" className="w-full text-lg font-medium text-gray-600 hover:text-gray-900 transition-colors">
      Contact
    </Link>
  </>
);

export default Navbar;
