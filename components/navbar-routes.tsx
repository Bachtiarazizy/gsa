"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { Home, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { isAdmin } from "@/lib/admin";

export const NavbarRoutes = ({ onModeToggle }: { onModeToggle: (mode: "admin" | "student") => void }) => {
  const pathname = usePathname();
  const { user } = useUser();

  const isUserAdmin = isAdmin(user?.id);
  const isAdminPage = pathname?.startsWith("/dashboard/admin");
  const isStudentPage = pathname?.startsWith("/dashboard/student");

  const renderDashboardToggle = () => {
    if (isUserAdmin) {
      if (isAdminPage) {
        return (
          <Button size="sm" variant="ghost" onClick={() => onModeToggle("student")}>
            <Home className="h-4 w-4 mr-2" />
            Student Mode
          </Button>
        );
      }

      if (isStudentPage) {
        return (
          <Button size="sm" variant="ghost" onClick={() => onModeToggle("admin")}>
            <Users className="h-4 w-4 mr-2" />
            Teacher Mode
          </Button>
        );
      }
    }

    return null;
  };

  return (
    <div className="p-4 border-b h-full flex items-center bg-white">
      <div className="ml-auto flex items-center gap-x-2">
        {renderDashboardToggle()}
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};
