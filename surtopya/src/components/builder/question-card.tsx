import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Question } from "@/types/survey";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // Need to install switch
import { GripVertical, Trash2, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuestionCardProps {
  question: Question;
  onUpdate: (id: string, updates: Partial<Question>) => void;
  onDelete: (id: string) => void;
}

export function QuestionCard({ question, onUpdate, onDelete }: QuestionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!question.options) return;
    const newOptions = [...question.options];
    newOptions[index] = value;
    onUpdate(question.id, { options: newOptions });
  };

  const addOption = () => {
    if (!question.options) return;
    onUpdate(question.id, { options: [...question.options, `Option ${question.options.length + 1}`] });
  };

  const removeOption = (index: number) => {
    if (!question.options) return;
    const newOptions = question.options.filter((_, i) => i !== index);
    onUpdate(question.id, { options: newOptions });
  };

  return (
    <Card ref={setNodeRef} style={style} className="group border-l-4 border-l-transparent hover:border-l-purple-500 transition-all duration-200">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
        <div {...attributes} {...listeners} className="mt-2 cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing">
          <GripVertical className="h-5 w-5" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <Input 
              value={question.title} 
              onChange={(e) => onUpdate(question.id, { title: e.target.value })}
              className="font-semibold text-lg border-transparent hover:border-gray-200 focus:border-purple-500 bg-transparent px-2 h-auto py-1"
              placeholder="Question Title"
            />
            <Badge variant="outline" className="capitalize text-xs text-gray-500">
              {question.type}
            </Badge>
          </div>

          {/* Question Body based on Type */}
          <div className="pl-2">
            {(question.type === 'single' || question.type === 'multi') && (
              <div className="space-y-2">
                {question.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border border-gray-300 ${question.type === 'multi' ? 'rounded-sm' : ''}`} />
                    <Input 
                      value={option} 
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="h-8 text-sm"
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => removeOption(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={addOption} className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                  <Plus className="mr-2 h-3 w-3" /> Add Option
                </Button>
              </div>
            )}

            {question.type === 'text' && (
              <Input disabled placeholder="Long answer text..." className="bg-gray-50 border-dashed" />
            )}

            {question.type === 'rating' && (
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className="h-6 w-6 text-gray-300" />
                ))}
              </div>
            )}
          </div>
        </div>

        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500 hover:bg-red-50" onClick={() => onDelete(question.id)}>
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      <div className="border-t border-gray-100 bg-gray-50/50 p-2 px-4 flex justify-end gap-4 items-center text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span>Required</span>
          <Switch 
            checked={question.required} 
            onCheckedChange={(checked) => onUpdate(question.id, { required: checked })} 
          />
        </div>
        <div className="flex items-center gap-2">
          <span>Points</span>
          <Input 
            type="number" 
            value={question.points} 
            onChange={(e) => onUpdate(question.id, { points: parseInt(e.target.value) || 0 })}
            className="w-16 h-6 text-xs"
          />
        </div>
      </div>
    </Card>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
