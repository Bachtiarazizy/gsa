import { AssessmentDisplay } from "@/app/components/assesment/assesmet-display";
import prisma from "@/lib/db";

export default async function ChapterPage({ params }: { params: { chapterId: string } }) {
  const chapter = await prisma.chapter.findUnique({
    where: {
      id: params.chapterId,
    },
    include: {
      assessment: {
        include: {
          questions: true,
        },
      },
    },
  });

  if (!chapter) return null;

  const handleAssessmentComplete = async (score: number) => {
    // Save assessment result
    await prisma.assessmentResult.create({
      data: {
        userId: "current_user_id",
        assessmentId: chapter.assessment.id,
        score,
        isPassed: score >= 70, // Atau threshold lain
      },
    });
  };

  return (
    <div>
      {/* Video Player Component */}
      {chapter.assessment && <AssessmentDisplay assessment={chapter.assessment} onComplete={handleAssessmentComplete} />}
    </div>
  );
}
