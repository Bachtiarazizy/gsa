import { Button } from "@/components/ui/button";
import { Book, Layout, List, Settings } from "lucide-react";

const SidebarCourses = () => {
  const courseCategories = [
    { label: "All Courses", icon: Layout },
    { label: "In Progress", icon: Book },
    { label: "Completed", icon: List },
  ];

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Learning Hub</h1>
      </div>
      <div className="flex flex-col w-full">
        {courseCategories.map((category) => (
          <button key={category.label} className="flex items-center gap-x-2 text-slate-700 text-sm font-medium p-4 hover:bg-slate-100 transition-colors">
            <category.icon className="h-4 w-4" />
            {category.label}
          </button>
        ))}
      </div>

      <div className="mt-auto p-4 border-t">
        <div className="flex items-center ">
          <Button size="sm" variant="ghost" className="text-slate-700 hover:text-slate-900">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarCourses;
