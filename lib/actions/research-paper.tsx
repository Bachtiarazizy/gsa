"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma/db";

export const submitResearchPaper = async (formData: FormData) => {
  const userId = formData.get("userId") as string;
  const courseId = formData.get("courseId") as string;
  const paperId = formData.get("paperId") as string;
  const title = formData.get("title") as string;
  const abstract = formData.get("abstract") as string;
  const content = formData.get("content") as string;
  const fileUrl = formData.get("fileUrl") as string | null;
  const fileOriginalName = formData.get("fileOriginalName") as string | null;

  if (!title || !abstract || !content) {
    return { success: false, error: "All fields are required." };
  }

  try {
    // Get the student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!studentProfile) {
      return { success: false, error: "Student profile not found." };
    }

    // Update the research paper
    await prisma.researchPaper.update({
      where: {
        id: paperId,
      },
      data: {
        title,
        abstract,
        content,
        fileUrl,
        fileOriginalName,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });

    // Create a revision of the paper
    const paperToSave = await prisma.researchPaper.findUnique({
      where: {
        id: paperId,
      },
    });

    if (paperToSave) {
      // Get the current highest version number
      const highestVersion = await prisma.paperRevision.findFirst({
        where: {
          paperId,
        },
        orderBy: {
          versionNumber: "desc",
        },
      });

      const nextVersion = highestVersion ? highestVersion.versionNumber + 1 : 1;

      await prisma.paperRevision.create({
        data: {
          paperId,
          title: paperToSave.title,
          abstract: paperToSave.abstract,
          content: paperToSave.content,
          fileUrl: paperToSave.fileUrl,
          versionNumber: nextVersion,
        },
      });
    }

    // Mark course enrollment as completed
    await prisma.courseEnrollment.updateMany({
      where: {
        userId,
        courseId,
      },
      data: {
        completed: true,
      },
    });

    revalidatePath(`/student/courses/${courseId}/research-paper`);

    return { success: true };
  } catch (error) {
    console.error("[SUBMIT_RESEARCH_PAPER_ERROR]", error);
    return { success: false, error: "Failed to submit research paper." };
  }
};
