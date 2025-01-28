import Link from "next/link";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-background shadow-sm">
      <div className="p-6">
        <Link href="/" className="flex items-center w-full transition-all  hover:opacity-70 py-1">
          <h1 className="text-xl font-bold text-primary">
            Sekolah<span className="text-red-500">Ekspor</span>
          </h1>
        </Link>
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
