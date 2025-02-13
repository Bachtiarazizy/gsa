"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed w-full top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
        ${scrolled ? "bg-primary-foreground backdrop-blur-sm border-b shadow-sm" : "bg-transparent"}`}
    >
      <div className="w-full flex justify-between items-center px-6 py-4 lg:py-7 sm:px-8 lg:px-24">
        <Link href="/" className="flex items-center gap-3 group">
          <div className={`p-2.5 rounded-xl transition-all duration-300 ${scrolled ? "bg-primary text-white shadow-md" : "bg-white/10 backdrop-blur-md text-white shadow-lg"}`}>
            <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="flex flex-col">
            <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight transition-colors duration-300 ${scrolled ? "text-primary" : "text-primary-foreground"}`}>Global Skills</h1>
            <p className={`text-sm font-medium tracking-wider uppercase transition-colors duration-300 ${scrolled ? "text-primary/70" : "text-primary-foreground/90"}`}>Academy</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant={scrolled ? "outline" : "secondary"}
                className={`transition-all duration-300 font-medium px-6 
                  ${!scrolled ? "bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white shadow-lg" : ""}
                `}
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/student/dashboard">
              <Button
                variant={scrolled ? "default" : "secondary"}
                className={`transition-all duration-300 font-medium px-6
                  ${!scrolled ? "bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white shadow-lg" : ""}
                `}
              >
                Dashboard
              </Button>
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
    </div>
  );
}
