"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { submitAssessment } from "@/lib/actions/chapter";
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Assessment {
  id: string;
  questions: Question[];
}

interface ChapterAssessmentProps {
  assessment: Assessment;
  chapterId: string;
  userId: string;
}

export const ChapterAssessment = ({ assessment, chapterId, userId }: ChapterAssessmentProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAssessmentSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Check if all questions are answered
      const unansweredQuestions = assessment.questions.filter((question) => !selectedAnswers[question.id]);

      if (unansweredQuestions.length > 0) {
        toast.error("Please answer all questions before submitting");
        return;
      }

      const result = await submitAssessment({
        userId,
        chapterId,
        assessmentId: assessment.id,
        answers: selectedAnswers,
      });

      if (result.success) {
        if (result.isPassed) {
          toast.success(`Congratulations! You passed with a score of ${result.score}%`);
          // Refresh the page after a short delay to show completion status
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          toast.error(`You scored ${result.score}%. 70% is required to pass. Please try again.`);
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

  return (
    <Card className="mt-8 p-4">
      <h3 className="text-xl font-semibold mb-4">Chapter Assessment</h3>
      <div className="space-y-8">
        {assessment.questions.map((question) => (
          <div key={question.id} className="space-y-4">
            <p className="font-medium">{question.question}</p>
            <RadioGroup onValueChange={(value) => setSelectedAnswers((prev) => ({ ...prev, [question.id]: value }))} value={selectedAnswers[question.id]}>
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                  <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
        <Button onClick={handleAssessmentSubmit} disabled={isSubmitting} className="flex items-center gap-2">
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              Submit Assessment
              <CheckCircle className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
