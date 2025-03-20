import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import ResearchPaperForm from "@/components/forms/research-paper-form";
import { submitResearchPaper } from "@/lib/actions/research-paper";
import prisma from "@/lib/prisma/db";

interface ResearchPaperPageProps {
  params: {
    courseId: string;
  };
}

const ResearchPaperPage = async ({ params }: ResearchPaperPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  // Get the student profile ID
  const studentProfile = await prisma.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!studentProfile) {
    return redirect("/student/profile");
  }

  // Fetch course details
  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    select: {
      id: true,
      title: true,
      requiresResearchPaper: true,
    },
  });

  if (!course) {
    return redirect("/student/courses");
  }

  if (!course.requiresResearchPaper) {
    return redirect(`/student/courses/${params.courseId}`);
  }

  // Check if user has a research paper for this course
  const researchPaper = await prisma.researchPaper.findFirst({
    where: {
      userId,
      courseId: params.courseId,
    },
    include: {
      revisions: {
        orderBy: {
          versionNumber: "desc",
        },
        take: 1,
      },
    },
  });

  let currentPaper = researchPaper;

  if (!currentPaper) {
    // Create a new draft paper
    currentPaper = await prisma.researchPaper.create({
      data: {
        userId,
        courseId: params.courseId,
        studentProfileId: studentProfile.id,
        title: `Research Paper for ${course.title}`,
        abstract: "",
        content: "",
        status: "DRAFT",
      },
      include: {
        revisions: {
          orderBy: {
            versionNumber: "desc",
          },
          take: 1,
        },
      },
    });

    // Refresh the page to show the newly created paper
    revalidatePath(`/student/courses/${params.courseId}/research-paper`);
  }

  // Check if paper is already submitted and past draft state
  const isEditable = currentPaper.status === "DRAFT" || currentPaper.status === "NEEDS_REVISION";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Research Paper for {course.title}</h1>

      <ResearchPaperForm
        paperId={currentPaper.id}
        userId={userId}
        courseId={params.courseId}
        initialData={{
          title: currentPaper.title,
          abstract: currentPaper.abstract,
          content: currentPaper.content,
          status: currentPaper.status,
          fileUrl: currentPaper.fileUrl || null,
          fileOriginalName: (currentPaper.fileOriginalName as string | null) || null,
        }}
        isEditable={isEditable}
        submitAction={submitResearchPaper}
      />

      {/* Revision History */}
      {currentPaper.revisions && currentPaper.revisions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Revision History</h2>
          <div className="space-y-4">
            {currentPaper.revisions.map((revision) => (
              <div key={revision.id} className="border p-4 rounded-md">
                <div className="flex justify-between">
                  <p className="font-medium">Version {revision.versionNumber}</p>
                  <p className="text-sm text-muted-foreground">{new Date(revision.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="text-sm truncate">{revision.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchPaperPage;
