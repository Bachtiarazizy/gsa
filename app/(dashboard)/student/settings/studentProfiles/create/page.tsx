"use client";

import { ArrowLeft, UserCog } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StudentProfileForm from "@/components/forms/student-data-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

const ProfileSettingsPageSkeleton = () => (
  <div className="rounded-lg border bg-card">
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  </div>
);

export default function StudentSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-5xl mx-auto flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <Link href="/student/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-x-2">
            <UserCog className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Student Profile Settings</h1>
          </div>
          <p className="text-sm text-muted-foreground">Update your profile information below. This information will be visible to your instructors.</p>
        </div>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <ProfileSettingsPageSkeleton />
        ) : (
          <div className="rounded-lg border bg-card">
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Profile Details</h2>
                <p className="text-sm text-muted-foreground">Fill in your personal information to complete your student profile</p>
              </div>
              <StudentProfileForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
