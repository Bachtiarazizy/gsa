"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle } from "lucide-react";
import { submitAssessment } from "@/lib/actions/chapter";
import { toast } from "sonner";
import { Assessment } from "@/lib/types";
import InteractiveQuestion from "./interactive-question";
import InteractiveButton from "./interactive-button";

interface ChapterAssessmentProps {
  assessment: Assessment;
  chapterId: string;
  userId: string;
  courseId: string;
}

const ChapterAssessment = ({ assessment, chapterId, userId, courseId }: ChapterAssessmentProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = assessment.questions?.length ?? 0;
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  const handleAnswerChange = (questionId: string, value: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleAssessmentSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!assessment.questions) {
        toast.error("No questions found in the assessment");
        return;
      }

      const unansweredQuestions = assessment.questions.filter((question) => !selectedAnswers[question.id]);

      if (unansweredQuestions.length > 0) {
        toast.error(`Please answer all questions (${unansweredQuestions.length} remaining)`, {
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        });
        return;
      }

      console.log("Submitting assessment with data:", {
        userId,
        chapterId,
        assessmentId: assessment.id,
        answerCount: Object.keys(selectedAnswers).length,
        courseId,
      });

      const result = await submitAssessment({
        userId,
        chapterId,
        assessmentId: assessment.id,
        answers: selectedAnswers,
        courseId,
      });

      if (result.success) {
        if (result.isPassed) {
          toast.success(`Congratulations! You passed with a score of ${result.score}%`, {
            icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          toast.error(`You scored ${result.score}%. 70% is required to pass. Please try again.`, {
            icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          });
        }
      } else {
        toast.error("Failed to submit assessment. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!assessment.questions || assessment.questions.length === 0) {
    return (
      <Card className="mt-8">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No questions available for this assessment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold">Chapter Assessment</CardTitle>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>
              {answeredQuestions} of {totalQuestions} questions answered
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {assessment.questions.map((question, questionIndex) => (
            <InteractiveQuestion key={question.id} question={question} questionIndex={questionIndex} selectedAnswer={selectedAnswers[question.id]} onAnswerChange={handleAnswerChange} />
          ))}
          <InteractiveButton isSubmitting={isSubmitting} onSubmit={handleAssessmentSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChapterAssessment;
