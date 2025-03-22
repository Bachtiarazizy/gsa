"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Menu, X } from "lucide-react";
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
    <header className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 ${isScrolled || isMobileMenuOpen ? "bg-background/80 backdrop-blur-lg shadow-sm dark:bg-background/90" : "bg-transparent"}`}>
      <nav className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        {/* Main navbar container */}
        <div className="relative flex items-center justify-between">
          {/* Logo */}

          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2.5 rounded-xl transition-all duration-300 bg-primary text-white shadow-sm">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-primary bg-clip-text text-transparent ">GlobalSkills</span>
              <p className="text-sm font-medium tracking-wider uppercase transition-colors duration-300 text-primary/70">Academy</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            <NavLinks />
            <div className="flex items-center gap-4">
              <SignedOut>
                <div className="flex items-center gap-4">
                  <SignInButton mode="modal">
                    <button className="rounded-full bg-gradient-to-r from-green-600 to-primary px-6 py-2.5 text-white shadow-lg transition-all duration-300 hover:shadow-xl ">Get Started</button>
                  </SignInButton>
                </div>
              </SignedOut>

              <SignedIn>
                <Link href="/student/dashboard" className="rounded-full bg-gradient-to-r from-green-600 to-primary px-6 py-2.5 text-white shadow-lg transition-all duration-300 hover:shadow-xl ">
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
          <button className="relative z-10 rounded-md p-2 lg:hidden hover:bg-secondary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6 text-muted-foreground" /> : <Menu className="h-6 w-6 text-muted-foreground" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`fixed inset-x-0 top-[72px] z-50 h-screen transform overflow-y-auto bg-background px-6 py-4 transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <MobileNavLinks />
            </div>
            <div className="flex flex-col gap-4 border-t border-border pt-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-primary px-6 py-3 text-center text-white shadow-lg transition-all duration-300 hover:shadow-xl " onClick={() => setIsMobileMenuOpen(false)}>
                    Get Started
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center justify-between">
                  <Link
                    href="/student/dashboard"
                    className="rounded-2xl bg-gradient-to-r from-green-600 to-primary px-6 py-3 text-center text-white shadow-lg transition-all duration-300 hover:shadow-xl "
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
    <Link href="/about" className="text-muted-foreground hover:text-foreground">
      About
    </Link>
    <Link href="/contact" className="text-muted-foreground hover:text-foreground">
      Contact
    </Link>
  </div>
);

const MobileNavLinks = () => (
  <>
    <Link href="/about" className="w-full text-lg font-medium text-muted-foreground hover:text-foreground">
      About
    </Link>
    <Link href="/contact" className="w-full text-lg font-medium text-muted-foreground hover:text-foreground">
      Contact
    </Link>
  </>
);

export default Navbar;
