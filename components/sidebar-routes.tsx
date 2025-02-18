// SidebarRoutes.tsx
"use client";

import { usePathname } from "next/navigation";
import { BarChart, Book, Home, Users, LucideIcon, Compass, ChartBar, Settings } from "lucide-react";
import { SidebarItem } from "./sidebar-item";

interface RouteType {
  href: string;
  label: string;
  icon: LucideIcon;
}

const adminRoutes: RouteType[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: BarChart,
  },
  {
    href: "/admin/courses",
    label: "Courses",
    icon: Book,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
];

const studentRoutes: RouteType[] = [
  {
    href: "/student/dashboard",
    label: "Home",
    icon: Home,
  },
  {
    href: "/student/courses",
    label: "My Courses",
    icon: Book,
  },
  {
    href: "/student/search",
    label: "Browse",
    icon: Compass,
  },
  {
    href: "/student/discussions",
    label: "Discussions",
    icon: ChartBar,
  },
  {
    href: "/student/settings",
    label: "Settings",
    icon: Settings,
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const isAdminPage = pathname?.includes("/admin");
  const routes = isAdminPage ? adminRoutes : studentRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem key={route.href} icon={route.icon} label={route.label} href={route.href} />
      ))}
    </div>
  );
};
