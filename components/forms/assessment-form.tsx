"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface CreateAssessmentFormProps {
  chapterId: string;
  courseId: string;
}

export default function AssessmentForm({ chapterId, courseId }: CreateAssessmentFormProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    options: ["", "", "", ""],
  });
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

  const handleSubmit = async () => {
    if (questions.length === 0) {
      setError("Assessment must have at least one question");
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/chapters/${chapterId}/assessments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions }),
      });

      if (!response.ok) {
        throw new Error("Failed to create assessment");
      }

      router.push(`/courses/${courseId}/chapters/${chapterId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const updateCurrentQuestionOption = (index: number, value: string) => {
    const updatedOptions = [...(currentQuestion.options || [])];
    updatedOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Question</Label>
            <Textarea value={currentQuestion.question || ""} onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })} placeholder="Enter your question" />
          </div>

          <RadioGroup onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })} value={currentQuestion.correctAnswer} className="space-y-2">
            {currentQuestion.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <Input value={option} onChange={(e) => updateCurrentQuestionOption(optionIndex, e.target.value)} placeholder={`Option ${optionIndex + 1}`} className="flex-grow" />
                <RadioGroupItem value={option} id={`option-${optionIndex}`} />
                <Label htmlFor={`option-${optionIndex}`}>Correct Answer</Label>
              </div>
            ))}
          </RadioGroup>

          <Button onClick={addQuestion} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {questions.map((q, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{q.question}</h3>
                  <Button variant="destructive" size="icon" onClick={() => removeQuestion(index)}>
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
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleSubmit} disabled={questions.length === 0} className="w-full">
        Create Assessment
      </Button>
    </div>
  );
}
