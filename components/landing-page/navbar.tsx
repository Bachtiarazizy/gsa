import { Button } from "@/components/ui/button";
import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full flex justify-between items-center bg-white px-4 py-5 sm:px-6 lg:px-16 border-b shadow-sm sticky top-0 z-20">
      <div>
        <h1 className="text-lg sm:text-xl lg:text-2xl font-medium text-primary">Global Skills</h1>
        <p className="text-sm text-gray-500 text-center mt-0">Academy</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Komponen untuk user yang belum login */}
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline">Sign In</Button>
          </SignInButton>
        </SignedOut>

        {/* Komponen untuk user yang sudah login */}
        <SignedIn>
          <Link href="/dashboard/student">
            <Button>Dashboard</Button>
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
  );
}
