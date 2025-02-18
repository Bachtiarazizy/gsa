import { Metadata } from "next";
import { ArrowLeft, UserCog } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StudentProfileForm from "@/components/forms/student-data-form";

export const metadata: Metadata = {
  title: "Student Profile Settings",
  description: "Update your student profile information",
};

export default function StudentSettingsPage() {
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
        <div className="rounded-lg border bg-card">
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Profile Details</h2>
              <p className="text-sm text-muted-foreground">Fill in your personal information to complete your student profile</p>
            </div>
            <StudentProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
}
