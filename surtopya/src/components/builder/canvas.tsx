import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Question } from "@/types/survey";
import { QuestionCard } from "./question-card";

interface CanvasProps {
  questions: Question[];
  onUpdate: (id: string, updates: Partial<Question>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function Canvas({ questions, onUpdate, onDelete, onDuplicate }: CanvasProps) {
  const { setNodeRef } = useDroppable({
    id: 'canvas-droppable',
  });

  if (questions.length === 0) {
    return (
      <div ref={setNodeRef} className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 transition-colors hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/20">
        <p className="text-lg font-medium">Drag items here from the toolbox</p>
        <p className="text-sm">Start building your survey</p>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} className="space-y-6 pb-20 min-h-[500px]">
      {questions.map((question) => (
        <QuestionCard 
          key={question.id} 
          question={question} 
          onUpdate={onUpdate} 
          onDelete={onDelete} 
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
}
