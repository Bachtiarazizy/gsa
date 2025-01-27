"use client";

import React from "react";
import { NavbarRoutes } from "@/components/navbar-routes";
import Sidebar from "@/components/sidebar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/lib/admin";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useUser();
  const router = useRouter();
  const [currentMode, setCurrentMode] = React.useState<"admin" | "student">(isAdmin(user?.id) ? "admin" : "student");

  const handleModeToggle = (mode: "admin" | "student") => {
    setCurrentMode(mode);
    // Use Next.js router instead of window.location
    if (mode === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/student");
    }
  };

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <NavbarRoutes onModeToggle={handleModeToggle} />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar currentMode={currentMode} />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
