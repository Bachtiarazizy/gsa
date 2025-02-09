// NextChapterNavigation.tsx
"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface NextChapterNavigationProps {
  courseId: string;
  nextChapterId: string;
}

const NextChapterNavigation = ({ courseId, nextChapterId }: NextChapterNavigationProps) => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push(`/student/courses/${courseId}/chapters/${nextChapterId}`);
  };

  return (
    <Button onClick={handleNavigation} className="flex items-center gap-2">
      Next Chapter
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
};

export default NextChapterNavigation;
