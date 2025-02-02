"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

interface PublishButtonProps {
  courseId: string;
  isPublished: boolean;
}

const PublishButton: React.FC<PublishButtonProps> = ({ courseId, isPublished }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const togglePublish = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/courses/${courseId}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: !isPublished,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update course status");
      }

      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={togglePublish} disabled={loading} variant={isPublished ? "outline" : "default"} className="w-full">
        {loading ? "Processing..." : isPublished ? "Unpublish Course" : "Publish Course"}
      </Button>
    </div>
  );
};

export default PublishButton;
