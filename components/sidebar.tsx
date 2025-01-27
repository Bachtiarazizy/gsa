"use client";

import React from "react";
import Link from "next/link";
import { Home, Book, Users, BarChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";

type RouteItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

interface SidebarProps {
  currentMode: "admin" | "student";
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const isUserAdmin = isAdmin(user?.id);

  const adminRoutes: RouteItem[] = [
    {
      href: "/dashboard/admin",
      label: "Dashboard",
      icon: <BarChart className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/admin/courses",
      label: "Courses",
      icon: <Book className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/admin/users",
      label: "Users",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
  ];

  const studentRoutes: RouteItem[] = [
    {
      href: "/dashboard/student",
      label: "Home",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/student/courses",
      label: "My Courses",
      icon: <Book className="mr-2 h-4 w-4" />,
    },
  ];

  const routes = isUserAdmin && currentMode === "admin" ? adminRoutes : studentRoutes;

  // Use React's useCallback to memoize the navigation handler
  const handleNavigation = React.useCallback(
    (href: string) => {
      router.push(href);
    },
    [router]
  );

  React.useEffect(() => {
    if (!user) return;

    // Debounce the redirect to prevent rapid switches
    const redirectTimeout = setTimeout(() => {
      if (!isUserAdmin && pathname?.startsWith("/dashboard/admin")) {
        handleNavigation("/dashboard/student");
        return;
      }

      if (isUserAdmin) {
        if (currentMode === "admin" && pathname?.startsWith("/dashboard/student")) {
          handleNavigation("/dashboard/admin");
        } else if (currentMode === "student" && pathname?.startsWith("/dashboard/admin")) {
          handleNavigation("/dashboard/student");
        }
      }
    }, 100);

    return () => clearTimeout(redirectTimeout);
  }, [currentMode, pathname, user, isUserAdmin, handleNavigation]);

  if (!user) return null;

  return (
    <nav className="h-full bg-white border-r shadow-md flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">{currentMode === "admin" && isUserAdmin ? "Teacher Dashboard" : "Student Dashboard"}</h2>
      </div>

      <div className="flex-1 py-4 space-y-2">
        {routes.map((route) => (
          <button
            key={route.href}
            onClick={() => handleNavigation(route.href)}
            className={`w-full flex items-center px-4 py-2 rounded-md transition-all hover:bg-gray-100 ${pathname === route.href ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-800"}`}
          >
            {route.icon}
            <span className="ml-2">{route.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full flex items-center justify-center" onClick={() => handleNavigation("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </nav>
  );
};

export default Sidebar;
