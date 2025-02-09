"use client";
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface InteractiveQuestionProps {
  question: {
    id: string;
    question: string;
    options: string[];
  };
  questionIndex: number;
  selectedAnswer: string;
  onAnswerChange: (questionId: string, value: string) => void;
}

const InteractiveQuestion = ({ question, questionIndex, selectedAnswer, onAnswerChange }: InteractiveQuestionProps) => (
  <div className="rounded-lg border p-4 hover:border-primary/50 transition">
    <p className="font-medium mb-4">
      <span className="text-muted-foreground mr-2">{questionIndex + 1}.</span>
      {question.question}
    </p>
    <RadioGroup value={selectedAnswer} className="space-y-3" onValueChange={(value) => onAnswerChange(question.id, value)}>
      {question.options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 transition cursor-pointer">
          <RadioGroupItem value={option} id={`${question.id}-${index}`} />
          <Label htmlFor={`${question.id}-${index}`} className="flex-grow cursor-pointer">
            {option}
          </Label>
        </div>
      ))}
    </RadioGroup>
  </div>
);

export default InteractiveQuestion;
