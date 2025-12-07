import React from "react";
import { Question } from "@/types/survey";
import { QuestionCard } from "./question-card";

interface CanvasProps {
  questions: Question[];
  onUpdate: (id: string, updates: Partial<Question>) => void;
  onDelete: (id: string) => void;
}

export function Canvas({ questions, onUpdate, onDelete }: CanvasProps) {
  if (questions.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-lg font-medium">Drag items here from the toolbox</p>
        <p className="text-sm">Start building your survey</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {questions.map((question) => (
        <QuestionCard 
          key={question.id} 
          question={question} 
          onUpdate={onUpdate} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}
