// app/(dashboard)/settings/student-profile/[studentProfileId]/edit/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, UserCog } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StudentProfileEditForm from "@/components/forms/edit-student-data-form";
import prisma from "@/lib/prisma/db";
import { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

const EditProfileSkeleton = () => (
  <div className="rounded-lg border bg-card">
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
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

        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  </div>
);

export const metadata: Metadata = {
  title: "Edit Student Profile",
  description: "Update your student profile information",
};

export default async function StudentProfileEditPage({ params }: { params: { studentProfileId: string } }) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

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
            <h1 className="text-2xl font-bold">Edit Student Profile</h1>
          </div>
          <p className="text-sm text-muted-foreground">Update your profile information below. This information will be visible to your instructors.</p>
        </div>
      </div>
      <Suspense fallback={<EditProfileSkeleton />}>
        <ProfileContent userId={userId} studentProfileId={params.studentProfileId} />
      </Suspense>
    </div>
  );
}

const ProfileContent = async ({ userId, studentProfileId }: { userId: string; studentProfileId: string }) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: {
      id: studentProfileId,
      userId: userId,
    },
  });

  if (!studentProfile) {
    return notFound();
  }

  const transformedStudentProfile = {
    id: studentProfile.id,
    firstName: studentProfile.firstName || "",
    lastName: studentProfile.lastName || "",
    email: studentProfile.email || "",
    university: studentProfile.university || "",
    major: studentProfile.major || "",
  };

  return (
    <div className="flex-1">
      <div className="rounded-lg border bg-card">
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Edit Profile Details</h2>
            <p className="text-sm text-muted-foreground">Make changes to your personal information and save to update your student profile</p>
          </div>
          <StudentProfileEditForm studentProfileId={studentProfileId} initialData={transformedStudentProfile} />
        </div>
      </div>
    </div>
  );
};
