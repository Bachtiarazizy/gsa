"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface InteractiveButtonProps {
  isSubmitting: boolean;
  onSubmit: () => void;
}

const InteractiveButton = ({ isSubmitting, onSubmit }: InteractiveButtonProps) => (
  <Button onClick={onSubmit} disabled={isSubmitting} className="w-full" type="button">
    {isSubmitting ? (
      "Submitting..."
    ) : (
      <>
        Submit Assessment
        <ArrowRight className="ml-2 h-4 w-4" />
      </>
    )}
  </Button>
);

export default InteractiveButton;
