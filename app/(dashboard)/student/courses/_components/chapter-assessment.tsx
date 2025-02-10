"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Assessment } from "@/lib/types";
import InteractiveQuestion from "./interactive-question";
import InteractiveButton from "./interactive-button";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ChapterAssessmentProps {
  assessment: Assessment;
  chapterId: string;
  userId: string;
  courseId: string;
}

const ChapterAssessment = ({ assessment, chapterId, userId, courseId }: ChapterAssessmentProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  const totalQuestions = assessment.questions?.length ?? 0;
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  const handleAnswerChange = (questionId: string, value: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const resetAssessment = () => {
    setSelectedAnswers({});
    setHasAttempted(false);
  };

  const handleAssessmentSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!assessment.questions) {
        toast({
          title: "Error",
          description: "No questions found in the assessment",
          variant: "destructive",
        });
        return;
      }

      const unansweredQuestions = assessment.questions.filter((question) => !selectedAnswers[question.id]);

      if (unansweredQuestions.length > 0) {
        toast({
          title: "Incomplete Assessment",
          description: `Please answer all questions (${unansweredQuestions.length} remaining)`,
          variant: "destructive",
        });
        return;
      }

      const response = await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/assessments/${assessment.id}`, { answers: selectedAnswers });

      const result = response.data;

      if (result.success) {
        if (result.isPassed) {
          toast({
            title: "Success",
            description: result.message,
            variant: "default",
          });
          // Wait for toast to be visible before reloading
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          setHasAttempted(true);
          toast({
            title: "Assessment Not Passed",
            description: result.message,
            variant: "destructive",
          });
          // Clear answers after a short delay
          setTimeout(() => {
            setSelectedAnswers({});
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Assessment submission error:", error);
      const errorMessage = axios.isAxiosError(error) && error.response?.data ? (error.response.data as string) : "Something went wrong. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Chapter Assessment</CardTitle>
          {hasAttempted && (
            <Button onClick={resetAssessment} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
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
          {assessment.questions &&
            assessment.questions.map((question, questionIndex) => (
              <InteractiveQuestion key={question.id} question={question} questionIndex={questionIndex} selectedAnswer={selectedAnswers[question.id]} onAnswerChange={handleAnswerChange} />
            ))}
          <InteractiveButton isSubmitting={isSubmitting} onSubmit={handleAssessmentSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChapterAssessment;
