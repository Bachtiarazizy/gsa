import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

const NavbarCourses = () => {
  return (
    <div className="p-4 h-full flex items-center border-b bg-white">
      <div className="flex items-center gap-x-4 flex-1">
        <div className="ml-auto flex items-center gap-x-2">
          <Button size="sm" variant="ghost" className="text-slate-700 hover:text-slate-900">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default NavbarCourses;
