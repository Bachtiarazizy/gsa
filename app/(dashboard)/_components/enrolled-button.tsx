"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EnrollButtonProps {
  courseId: string;
  enrollmentStatus: {
    isEnrolled: boolean;
    role?: "STUDENT" | "ADMIN" | null;
    enrolledAt?: Date | null;
  };
}

const EnrollButton = ({ courseId, enrollmentStatus }: EnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (enrollmentStatus.isEnrolled) {
        router.push(`/student/courses/${courseId}/chapters`);
        return;
      }

      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to enroll");
      }

      toast.success("Successfully enrolled in the course!");
      router.refresh();
      router.push(`/student/courses/${courseId}/chapters`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={onClick} disabled={isLoading} size="lg" className="w-full md:w-auto">
      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BookOpen className="w-4 h-4 mr-2" />}
      {enrollmentStatus.isEnrolled ? "Continue Learning" : "Enroll in Course"}
    </Button>
  );
};

export default EnrollButton;
