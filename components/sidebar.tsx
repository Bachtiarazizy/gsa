import Link from "next/link";
import { SidebarRoutes } from "./sidebar-routes";
import { GraduationCap } from "lucide-react";

export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-background shadow-sm">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className={`p-2.5 rounded-xl transition-all duration-300 bg-primary text-white shadow-m}`}>
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className={`text-base sm:text-lg lg:text-xl font-bold tracking-tight transition-colors duration-300 text-primary}`}>Global Skills</h1>
            <p className={`text-sm font-medium tracking-wider uppercase transition-colors duration-300 text-primary/70}`}>Academy</p>
          </div>
        </Link>
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
