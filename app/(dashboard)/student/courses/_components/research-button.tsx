"use client";

import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResearchButtonProps {
  courseId: string;
  hasCompletedAllChapters: boolean;
}

const ResearchButton: FC<ResearchButtonProps> = ({ courseId, hasCompletedAllChapters }) => {
  const { toast } = useToast();

  const handleResearchClick = (e: React.MouseEvent) => {
    if (!hasCompletedAllChapters) {
      e.preventDefault();
      toast({
        title: "Action required",
        description: "You need to complete all chapters first before accessing the research page.",
        variant: "destructive",
      });
    }
  };

  return (
    <Link href={hasCompletedAllChapters ? `/student/courses/${courseId}/research-page` : "#"} onClick={handleResearchClick} className={!hasCompletedAllChapters ? "pointer-events-auto" : ""}>
      <Button variant="outline" className={`w-full flex items-center gap-x-2 ${!hasCompletedAllChapters ? "opacity-70" : ""}`}>
        <FlaskConical size={16} />
        <span>Go to Research Page</span>
      </Button>
    </Link>
  );
};

export default ResearchButton;
