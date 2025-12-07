"use client";

import React, { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Question, QuestionType } from "@/types/survey";
import { Toolbox } from "./toolbox";
import { Canvas } from "./canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Eye } from "lucide-react";
import { nanoid } from "nanoid";

// Simple ID generator if nanoid causes issues or for simplicity
const generateId = () => Math.random().toString(36).substr(2, 9);

export function SurveyBuilder() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<any>(null); // Track active item data
  const [title, setTitle] = useState("Untitled Survey");
  const [isDirty, setIsDirty] = useState(false);

  // Warn on exit if unsaved
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveItem(event.active.data.current);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    // If dragging a toolbox item over the canvas
    if (active.data.current?.isToolboxItem) {
      const isOverCanvas = over.id === 'canvas-droppable' || questions.some(q => q.id === over.id);
      
      if (isOverCanvas) {
        // Check if we already have a placeholder
        const hasPlaceholder = questions.some(q => q.id === 'placeholder');
        
        if (!hasPlaceholder) {
          const type = active.data.current.type as QuestionType;
          const placeholder: Question = {
            id: 'placeholder',
            type,
            title: "New Question",
            required: false,
            points: 10,
            options: type === 'single' || type === 'multi' ? ['Option 1', 'Option 2'] : undefined,
          };

          setQuestions(items => {
            // Insert at the hover position or end
            const overIndex = items.findIndex(item => item.id === over.id);
            const newItems = [...items];
            
            if (overIndex !== -1) {
              newItems.splice(overIndex, 0, placeholder);
            } else {
              newItems.push(placeholder);
            }
            return newItems;
          });
        } else {
            // Move placeholder if needed
            setQuestions(items => {
                const activeIndex = items.findIndex(i => i.id === 'placeholder');
                const overIndex = items.findIndex(i => i.id === over.id);
                
                if (overIndex !== -1 && activeIndex !== overIndex) {
                    return arrayMove(items, activeIndex, overIndex);
                }
                return items;
            });
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Remove placeholder if it exists (we will replace it with real item or just remove it)
    const cleanQuestions = questions.filter(q => q.id !== 'placeholder');

    if (!over) {
      setActiveId(null);
      setActiveItem(null);
      setQuestions(cleanQuestions);
      return;
    }

    // Dropping a new item from Toolbox
    if (active.data.current?.isToolboxItem) {
      const type = active.data.current.type as QuestionType;
      const newQuestion: Question = {
        id: generateId(),
        type,
        title: "New Question",
        required: false,
        points: 10,
        options: type === 'single' || type === 'multi' ? ['Option 1', 'Option 2'] : undefined,
      };

      // Replace placeholder with real question
      const placeholderIndex = questions.findIndex(q => q.id === 'placeholder');
      if (placeholderIndex !== -1) {
          const newItems = [...questions];
          newItems[placeholderIndex] = newQuestion;
          setQuestions(newItems);
          setIsDirty(true);
      } else {
          // Fallback if no placeholder (e.g. dropped directly on empty canvas without dragover firing enough)
          setQuestions([...cleanQuestions, newQuestion]);
          setIsDirty(true);
      }
    } 
    // Reordering existing items
    else if (active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setIsDirty(true);
    } else {
        // If dropped on self or no change, just ensure placeholder is gone
        setQuestions(cleanQuestions);
    }

    setActiveId(null);
    setActiveItem(null);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
    setIsDirty(true);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    setIsDirty(true);
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="text-lg font-bold border-transparent hover:border-gray-200 focus:border-purple-500 w-[300px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setIsDirty(false)}>
            <Save className="mr-2 h-4 w-4" />
            Save Survey
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragStart={handleDragStart} 
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 overflow-hidden">
          {/* Toolbox Sidebar */}
          <aside className="w-64 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Toolbox</h2>
            <Toolbox />
          </aside>

          {/* Canvas */}
          <main className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-3xl">
              <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                <Canvas 
                  questions={questions} 
                  onUpdate={updateQuestion} 
                  onDelete={deleteQuestion} 
                />
              </SortableContext>
            </div>
          </main>
        </div>
        
        <DragOverlay dropAnimation={null}>
          {activeId ? (
             activeItem?.isToolboxItem ? (
                <div className="w-[600px] opacity-60"> {/* Translucent preview */}
                    {/* Preview of what it looks like */}
                     <div className="bg-white border border-purple-500 shadow-xl rounded-lg p-4">
                        <div className="h-4 w-1/3 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-8 w-full bg-gray-100 rounded border border-gray-200"></div>
                            <div className="h-8 w-full bg-gray-100 rounded border border-gray-200"></div>
                        </div>
                     </div>
                </div>
             ) : (
                 <div className="p-4 bg-white border border-purple-500 shadow-xl rounded-lg opacity-80 cursor-grabbing">
                   Dragging Question...
                 </div>
             )
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
