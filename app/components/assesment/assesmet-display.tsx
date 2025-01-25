import { Assessment } from "@/lib";
import { useState } from "react";

interface AssessmentDisplayProps {
  assessment: Assessment;
  onComplete: (score: number) => void;
}

export function AssessmentDisplay({ assessment, onComplete }: AssessmentDisplayProps) {
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    let correctCount = 0;
    assessment.questions.forEach((question) => {
      if (currentAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = (correctCount / assessment.questions.length) * 100;
    setSubmitted(true);
    onComplete(score);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {assessment.questions.map((question, index) => (
        <div key={question.id} className="p-4 border rounded-lg space-y-4">
          <h3 className="text-lg font-medium">
            Question {index + 1}: {question.question}
          </h3>

          <div className="space-y-2">
            {question.options.map((option, optIndex) => (
              <label key={optIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  onChange={(e) =>
                    setCurrentAnswers({
                      ...currentAnswers,
                      [question.id]: e.target.value,
                    })
                  }
                  disabled={submitted}
                  className="h-4 w-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          {submitted && (
            <div className={`text-sm ${currentAnswers[question.id] === question.correctAnswer ? "text-green-600" : "text-red-600"}`}>
              {currentAnswers[question.id] === question.correctAnswer ? "Correct!" : `Incorrect. The correct answer is: ${question.correctAnswer}`}
            </div>
          )}
        </div>
      ))}

      {!submitted && (
        <button onClick={handleSubmit} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Submit Assessment
        </button>
      )}
    </div>
  );
}
