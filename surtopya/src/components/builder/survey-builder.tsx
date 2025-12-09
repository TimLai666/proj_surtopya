"use client";

import React, { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Question, QuestionType } from "@/types/survey";
import { Toolbox } from "./toolbox";
import { Canvas } from "./canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Eye, Palette, Layout, Split, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { ThemeEditor } from "./theme-editor";
import { LogicEditor } from "./logic-editor";
import { SurveyTheme, LogicRule } from "@/types/survey";
import { QuestionCard } from "./question-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Simple ID generator if nanoid causes issues or for simplicity
const generateId = () => Math.random().toString(36).substr(2, 9);

export function SurveyBuilder() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([
    {
        id: 'page-1',
        type: 'section',
        title: 'Page 1',
        required: false,
        points: 0,
    }
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<any>(null); // Track active item data
  const [title, setTitle] = useState("Untitled Survey");
  const [isDirty, setIsDirty] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<'toolbox' | 'theme'>('toolbox');
  const [theme, setTheme] = useState<SurveyTheme>({
    primaryColor: '#9333ea', // purple-600
    backgroundColor: '#f9fafb', // gray-50
    fontFamily: 'inter',
  });
  const [logicEditorOpen, setLogicEditorOpen] = useState(false);
  const [activeLogicQuestionId, setActiveLogicQuestionId] = useState<string | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
            let overIndex = items.findIndex(item => item.id === over.id);
            
            // Prevent inserting before the first section
            if (overIndex === 0 && items.length > 0 && items[0].type === 'section') {
                overIndex = 1;
            }

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

    // Check if dropped on a valid target (canvas or existing question)
    const isOverCanvas = over.id === 'canvas-droppable' || questions.some(q => q.id === over.id);
    if (!isOverCanvas) {
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
          
          // Enforce: Cannot be before first section
          if (placeholderIndex === 0 && newItems.length > 1 && newItems[1].type === 'section') {
             // Swap if needed, but usually we just want to ensure it's not at 0 if 0 is section
             // Actually, if 0 is section, we can't be at 0 unless we replaced it? No, placeholder is separate.
             // If placeholder is at 0, and we have a section at 1 (previously 0), then we are before it.
          }
          
          // Simpler enforcement: If index 0 is NOT a section, move it.
          // But wait, we have "Page 1" which is a section.
          // So items[0] MUST be a section.
          
          if (newItems.length > 0 && newItems[0].type !== 'section') {
              // We just replaced placeholder at 0 with a non-section.
              // We need to move it to 1.
              const firstItem = newItems[0];
              newItems.splice(0, 1);
              newItems.splice(1, 0, firstItem);
          }

          setQuestions(newItems);
          setIsDirty(true);
      } else {
          // Fallback if no placeholder
          // Append to end is safe.
          // But what if list was empty? (Not possible due to Page 1)
          // What if dropped "before" Page 1 but no placeholder?
          // We'll just append to end to be safe.
          setQuestions([...cleanQuestions, newQuestion]);
          setIsDirty(true);
      }
    } 
    // Reordering existing items
    else if (active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        // If moving a section, move the whole block
        if (items[oldIndex].type === 'section') {
            // 1. Find the block of questions belonging to this section
            let endIndex = oldIndex;
            for (let i = oldIndex + 1; i < items.length; i++) {
                if (items[i].type === 'section') break;
                endIndex = i;
            }
            
            const movingBlock = items.slice(oldIndex, endIndex + 1);
            const remainingItems = items.filter((_, index) => index < oldIndex || index > endIndex);
            
            // 2. Find where to insert in the remaining items
            const overIndexInRemaining = remainingItems.findIndex(item => item.id === over.id);
            if (overIndexInRemaining === -1) return items;

            // Find the section that the 'over' item belongs to
            let targetSectionStart = overIndexInRemaining;
            // Scan backwards to find the section header
            while (targetSectionStart >= 0 && remainingItems[targetSectionStart].type !== 'section') {
                targetSectionStart--;
            }
            
            // If we somehow didn't find a section (e.g. dropped before first section?), default to 0
            if (targetSectionStart < 0) targetSectionStart = 0;

            // Find the end of this target section
            let targetSectionEnd = targetSectionStart;
            while (targetSectionEnd + 1 < remainingItems.length && remainingItems[targetSectionEnd + 1].type !== 'section') {
                targetSectionEnd++;
            }

            // Decide insertion point: Before target section or After target section?
            // Use original indices to determine direction
            let insertIndex = targetSectionStart;
            
            if (oldIndex < newIndex) {
                // Dragging down: Insert after the target section
                insertIndex = targetSectionEnd + 1;
            } else {
                // Dragging up: Insert before the target section
                insertIndex = targetSectionStart;
            }
            
            const newItems = [
                ...remainingItems.slice(0, insertIndex),
                ...movingBlock,
                ...remainingItems.slice(insertIndex)
            ];
            
            return newItems;
        }

        // Normal question reordering
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Enforce: First item must be a section
        if (newItems.length > 0 && newItems[0].type !== 'section') {
            return items;
        }
        
        return newItems;
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
    // Prevent deleting the first page/section
    if (questions.length > 0 && questions[0].id === id && questions[0].type === 'section') {
        return;
    }
    setDeletingQuestionId(id);
  };

  const confirmDelete = () => {
    if (deletingQuestionId) {
        // Check if it's a section
        const questionToDelete = questions.find(q => q.id === deletingQuestionId);
        
        if (questionToDelete?.type === 'section') {
            // Cascade delete: Delete section AND all questions until next section
            const index = questions.findIndex(q => q.id === deletingQuestionId);
            let endIndex = index;
            for (let i = index + 1; i < questions.length; i++) {
                if (questions[i].type === 'section') break;
                endIndex = i;
            }
            
            const newQuestions = questions.filter((_, i) => i < index || i > endIndex);
            setQuestions(newQuestions);
        } else {
            // Normal delete
            setQuestions(questions.filter(q => q.id !== deletingQuestionId));
        }
        
        setIsDirty(true);
        setDeletingQuestionId(null);
    }
  };

  const duplicateQuestion = (id: string) => {
    const questionToDuplicate = questions.find(q => q.id === id);
    if (!questionToDuplicate) return;

    const newQuestion: Question = {
      ...questionToDuplicate,
      id: generateId(),
      title: `${questionToDuplicate.title} (Copy)`,
      logic: [], // Don't copy logic to avoid broken references
    };

    const index = questions.findIndex(q => q.id === id);
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, newQuestion);
    
    setQuestions(newQuestions);
    setIsDirty(true);
  };

  const openLogicEditor = (id: string) => {
    setActiveLogicQuestionId(id);
    setLogicEditorOpen(true);
  };

  const saveLogic = (logic: LogicRule[]) => {
    if (activeLogicQuestionId) {
        updateQuestion(activeLogicQuestionId, { logic });
    }
  };

  const addPage = () => {
    const newSection: Question = {
        id: generateId(),
        type: 'section',
        title: "New Page",
        required: false,
        points: 0,
    };
    setQuestions([...questions, newSection]);
    setIsDirty(true);
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="text-lg font-bold border-transparent hover:border-gray-200 focus:border-purple-500 w-[300px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setActiveSidebar(activeSidebar === 'theme' ? 'toolbox' : 'theme')}>
            <Palette className="mr-2 h-4 w-4" />
            Theme
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" size="sm" onClick={addPage}>
            <Split className="mr-2 h-4 w-4" />
            Add Page
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
          {/* Sidebar */}
          <aside className="w-64 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {activeSidebar === 'toolbox' ? 'Toolbox' : 'Theme'}
                </h2>
                {activeSidebar === 'theme' && (
                    <Button variant="ghost" size="icon" onClick={() => setActiveSidebar('toolbox')} className="h-6 w-6">
                        <Layout className="h-4 w-4" />
                    </Button>
                )}
            </div>
            
            {activeSidebar === 'toolbox' ? (
                <Toolbox />
            ) : (
                <ThemeEditor theme={theme} onUpdate={(updates) => {
                    setTheme({ ...theme, ...updates });
                    setIsDirty(true);
                }} />
            )}
          </aside>

          {/* Canvas */}
          <main 
            className="flex-1 overflow-y-auto p-8 transition-colors duration-200"
            style={{ 
                backgroundColor: theme.backgroundColor,
                fontFamily: theme.fontFamily === 'serif' ? 'serif' : theme.fontFamily === 'mono' ? 'monospace' : theme.fontFamily === 'comic' ? '"Comic Sans MS", cursive, sans-serif' : 'inherit'
            }}
          >
            <div className="mx-auto max-w-3xl" style={{ '--primary': theme.primaryColor } as React.CSSProperties}>
              <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                <Canvas 
                  questions={questions} 
                  onUpdate={updateQuestion} 
                  onDelete={deleteQuestion} 
                  onDuplicate={duplicateQuestion}
                  onOpenLogic={openLogicEditor}
                  activeId={activeId}
                />
              </SortableContext>
            </div>
          </main>
        </div>
        
        {activeLogicQuestionId && questions.find(q => q.id === activeLogicQuestionId) && (
            <LogicEditor 
                question={questions.find(q => q.id === activeLogicQuestionId)!}
                allQuestions={questions}
                open={logicEditorOpen}
                onOpenChange={setLogicEditorOpen}
                onSave={saveLogic}
            />
        )}

        <Dialog open={!!deletingQuestionId} onOpenChange={(open) => !open && setDeletingQuestionId(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Question?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this question? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setDeletingQuestionId(null)}>Cancel</Button>
                    <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
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
                 <div className="w-[800px]"> {/* Fixed width for drag overlay to match canvas */}
                    {activeItem.type === 'section' ? (
                        <div className="flex flex-col">
                            <QuestionCard 
                                question={activeItem} 
                                onUpdate={() => {}} 
                                onDelete={() => {}} 
                                onDuplicate={() => {}} 
                                onOpenLogic={() => {}}
                                isOverlay
                            />
                            {/* Render questions belonging to this section */}
                            {(() => {
                                const index = questions.findIndex(q => q.id === activeItem.id);
                                if (index === -1) return null;
                                const sectionQuestions = [];
                                for (let i = index + 1; i < questions.length; i++) {
                                    if (questions[i].type === 'section') break;
                                    sectionQuestions.push(questions[i]);
                                }
                                return sectionQuestions.map((q, i) => (
                                    <div key={q.id} className="mt-6">
                                        <QuestionCard 
                                            question={q} 
                                            onUpdate={() => {}} 
                                            onDelete={() => {}} 
                                            onDuplicate={() => {}} 
                                            onOpenLogic={() => {}}
                                            isOverlay
                                        />
                                    </div>
                                ));
                            })()}
                        </div>
                    ) : (
                        <QuestionCard 
                            question={activeItem} 
                            onUpdate={() => {}} 
                            onDelete={() => {}} 
                            onDuplicate={() => {}} 
                            onOpenLogic={() => {}}
                            isOverlay
                        />
                    )}
                 </div>
             )
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
