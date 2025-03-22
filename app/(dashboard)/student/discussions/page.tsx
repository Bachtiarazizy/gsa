"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import ClientDiscussions from "../courses/_components/client-discussion";
import { Discussion } from "@/lib/zod-schema/zodSchema";

const StudentDiscussionsPage = () => {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await fetch("/api/discussions");
        if (!response.ok) throw new Error("Failed to fetch discussions");

        const data = await response.json();
        // Transform the data to match the expected types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedDiscussions: Discussion[] = data.map((discussion: any) => ({
          ...discussion,
          courseId: discussion.courseId || null,
          chapterId: discussion.chapterId || null,
          replies: discussion.replies || [],
          likes: discussion.likes || [],
          userProfile: discussion.userProfile || null,
        }));

        setDiscussions(transformedDiscussions);
      } catch (err) {
        setError("Failed to load discussions. Please try again later.");
        console.error("Error fetching discussions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      fetchDiscussions();
    }
  }, [isLoaded, isSignedIn]);

  // Redirect if not authenticated
  if (isLoaded && !isSignedIn) {
    redirect("/sign-in");
  }

  // Show loading state while Clerk loads
  if (!isLoaded) {
    return (
      <div className="max-w-5xl mx-auto flex-1 space-y-6 p-6">
        <Skeleton className="h-8 w-[200px] mb-6" />
        <Skeleton className="h-32 w-full mb-4" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto flex-1 space-y-6 p-6">
        <h1 className="text-2xl font-bold mb-6">Discussions</h1>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto flex-1 space-y-6 p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex-1 space-y-6 p-6">
      <h1 className="text-2xl font-bold mb-6">Discussions</h1>
      {discussions.length === 0 ? (
        <p className="text-muted-foreground">No discussions yet. Start a new discussion!</p>
      ) : (
        <ClientDiscussions
          initialDiscussions={discussions}
          userId={userId || ""}
          courseId="all" // For general discussions page
          chapterId="all" // For general discussions page
        />
      )}
    </div>
  );
};

export default StudentDiscussionsPage;
