"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Assessment } from "@/lib/types";

interface ChapterAssessmentProps {
  assessment: Assessment;
  chapterId: string;
  courseId: string;
}

const ChapterAssessment = ({ assessment, chapterId, courseId }: ChapterAssessmentProps) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; isPassed: boolean } | null>(null);

  // Guard clause for when questions are undefined
  if (!assessment.questions || assessment.questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assessment Unavailable</CardTitle>
          <CardDescription>This assessment has no questions available.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const totalQuestions = assessment.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Calculate score
      const score = (assessment.questions ?? []).reduce((acc, question) => {
        return acc + (selectedAnswers[question.id] === question.correctAnswer ? 1 : 0);
      }, 0);

      const isPassed = score / totalQuestions >= 0.7;

      const response = await fetch(`/api/courses/${courseId}/chapters/${chapterId}/assessments/${assessment.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score,
          isPassed,
          answers: selectedAnswers,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit assessment");

      setResult({ score, isPassed });
      if (isPassed) {
        router.refresh();
      }
    } catch {
      setError("Failed to submit assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assessment Complete</CardTitle>
          <CardDescription>
            You scored {result.score} out of {totalQuestions} questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant={result.isPassed ? "success" : "destructive"}>
            <div className="flex items-center gap-x-2">
              {result.isPassed ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.isPassed ? "Congratulations!" : "Assessment Not Passed"}</AlertTitle>
            </div>
            <AlertDescription>{result.isPassed ? "You've successfully completed this chapter's assessment." : "You'll need to score at least 70% to proceed. Feel free to try again!"}</AlertDescription>
          </Alert>
          {!result.isPassed && (
            <Button
              onClick={() => {
                setResult(null);
                setSelectedAnswers({});
                setCurrentQuestionIndex(0);
              }}
              className="mt-4"
            >
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chapter Assessment</CardTitle>
        <CardDescription>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="font-medium text-lg">{currentQuestion.question}</div>
          <RadioGroup value={selectedAnswers[currentQuestion.id] || ""} onValueChange={handleAnswerSelect}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="outline">
          Previous
        </Button>
        <div className="flex gap-x-2">
          {!isLastQuestion && (
            <Button onClick={handleNext} disabled={!selectedAnswers[currentQuestion.id]}>
              Next
            </Button>
          )}
          {isLastQuestion && (
            <Button onClick={handleSubmit} disabled={isSubmitting || Object.keys(selectedAnswers).length !== totalQuestions}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChapterAssessment;
