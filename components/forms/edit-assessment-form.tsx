"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Question {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Assessment {
  id?: string;
  questions: Question[];
  chapterId: string;
}

interface EditAssessmentFormProps {
  initialData: Assessment;
  chapterId: string;
  courseId: string;
}

export default function EditAssessmentForm({ initialData, chapterId, courseId }: EditAssessmentFormProps) {
  const [questions, setQuestions] = useState<Question[]>(initialData.questions || []);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    options: ["", "", "", ""],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const addQuestion = () => {
    if (!currentQuestion.question || !currentQuestion.options?.every((opt) => opt.trim() !== "") || !currentQuestion.correctAnswer) {
      setError("Please fill in all question fields and select a correct answer");
      return;
    }

    setQuestions([...questions, currentQuestion as Question]);
    setCurrentQuestion({ options: ["", "", "", ""] });
    setError(null);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = async () => {
    if (questions.length === 0) {
      setError("Assessment must have at least one question");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/courses/${courseId}/chapters/${chapterId}/assessments/${initialData.id || ""}`, {
        method: initialData.id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions }),
      });

      if (!response.ok) {
        throw new Error("Failed to update assessment");
      }

      router.push(`/courses/${courseId}/chapters/${chapterId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Form submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrentQuestionOption = (index: number, value: string) => {
    const updatedOptions = [...(currentQuestion.options || [])];
    updatedOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-100">
        <CardContent className="pt-6">
          <p className="text-sm">
            Assessment Status: <span className="font-medium">{initialData.id ? "Existing" : "New"}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Question</Label>
            <Textarea value={currentQuestion.question || ""} onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })} placeholder="Enter your question" disabled={isLoading} />
          </div>

          <RadioGroup onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })} value={currentQuestion.correctAnswer} className="space-y-2">
            {currentQuestion.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <Input value={option} onChange={(e) => updateCurrentQuestionOption(optionIndex, e.target.value)} placeholder={`Option ${optionIndex + 1}`} className="flex-grow" disabled={isLoading} />
                <RadioGroupItem value={option} id={`option-${optionIndex}`} />
                <Label htmlFor={`option-${optionIndex}`}>Correct Answer</Label>
              </div>
            ))}
          </RadioGroup>

          <Button onClick={addQuestion} disabled={isLoading} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Questions ({questions.length})</h2>
            {questions.map((q, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{q.question}</h3>
                  <Button variant="destructive" size="icon" onClick={() => removeQuestion(index)} disabled={isLoading}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <ul className="space-y-1 text-sm">
                  {q.options.map((opt, optIndex) => (
                    <li key={optIndex} className={opt === q.correctAnswer ? "text-green-600 font-bold flex items-center gap-2" : "flex items-center gap-2"}>
                      {opt === q.correctAnswer && <CheckCircle2 className="text-green-600 h-4 w-4" />}
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={updateQuestion} disabled={isLoading || questions.length === 0} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Assessment"
        )}
      </Button>
    </div>
  );
}
