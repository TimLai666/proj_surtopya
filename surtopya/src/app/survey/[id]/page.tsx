"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Survey, Question, LogicRule } from "@/types/survey";

// Mock Survey Data
const MOCK_SURVEY: Survey = {
  id: "1",
  title: "Consumer Preferences 2024",
  description: "Help us understand your shopping habits. This survey takes about 2 minutes.",
  questions: [
    {
      id: "q1",
      type: "single",
      title: "How often do you shop online?",
      required: true,
      options: ["Daily", "Weekly", "Monthly", "Rarely"],
      points: 10,
    },
    {
      id: "q2",
      type: "multi",
      title: "Which platforms do you use? (Select all that apply)",
      required: false,
      options: ["Amazon", "eBay", "Shopify Stores", "Etsy", "AliExpress"],
      points: 10,
    },
    {
      id: "q3",
      type: "text",
      title: "What is your biggest frustration with online shopping?",
      required: true,
      points: 10,
    },
    {
      id: "q4",
      type: "rating",
      title: "Rate your last online shopping experience",
      required: true,
      points: 10,
    },
    {
      id: "sec1",
      type: "section",
      title: "Demographics",
      description: "Tell us a bit about yourself.",
      required: false,
      points: 0,
    },
    {
      id: "q5",
      type: "select",
      title: "What is your age group?",
      required: true,
      options: ["18-24", "25-34", "35-44", "45-54", "55+"],
      points: 10,
    },
    {
      id: "q6",
      type: "date",
      title: "When did you last make an online purchase?",
      required: false,
      points: 10,
    },
  ],
  settings: {
    isPublic: true,
    pointsReward: 50,
  }
};

export default function SurveyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // This now represents the PAGE index
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Group questions into pages
  const pages = MOCK_SURVEY.questions.reduce((acc, question) => {
    if (question.type === 'section') {
      acc.push([question]);
    } else {
      if (acc.length === 0) acc.push([]);
      acc[acc.length - 1].push(question);
    }
    return acc;
  }, [] as Question[][]);

  // Ensure we have at least one page if questions exist
  if (pages.length === 0 && MOCK_SURVEY.questions.length > 0) {
      pages.push(MOCK_SURVEY.questions);
  }

  const totalSteps = pages.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentQuestions = pages[currentStep] || [];
  
  // Find the section title/desc if the first item is a section
  const pageHeader = currentQuestions.length > 0 && currentQuestions[0].type === 'section' 
    ? currentQuestions[0] 
    : null;
    
  // Filter out the section break itself from the renderable questions list if it's just a header
  const renderableQuestions = currentQuestions.filter(q => q.type !== 'section');

  const handleNext = () => {
    // Validate required questions on this page
    const missingRequired = renderableQuestions.filter(q => q.required && !answers[q.id]);
    if (missingRequired.length > 0) {
        // In a real app, show error. For now, just alert or ignore.
        alert("Please answer all required questions.");
        return;
    }

    // Check logic jumps for the LAST question on the page (simplification)
    // Or check all questions? Logic jumps usually happen on specific answers.
    // If a question on this page triggers a jump, we should probably honor it.
    // For simplicity, let's check the last answered question's logic.
    
    let jumpToPage = -1;
    
    for (const q of renderableQuestions) {
        const answer = answers[q.id];
        if (q.logic && q.logic.length > 0) {
             const matchedRule = q.logic.find(rule => rule.triggerOption === answer);
             if (matchedRule) {
                 if (matchedRule.destinationQuestionId === 'end_survey') {
                     router.push("/survey/thank-you");
                     return;
                 }
                 // Find which page the destination question is in
                 const destPageIdx = pages.findIndex(page => page.some(pq => pq.id === matchedRule.destinationQuestionId));
                 if (destPageIdx !== -1) {
                     jumpToPage = destPageIdx;
                     break; // Take the first valid jump
                 }
             }
        }
    }

    if (jumpToPage !== -1) {
        setCurrentStep(jumpToPage);
        return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/survey/thank-you");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 py-10">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress Header */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
            <span>Page {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% completed</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200 dark:bg-gray-800" indicatorClassName="bg-gradient-to-r from-purple-600 to-pink-600" />
        </div>

        {pageHeader && (
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{pageHeader.title}</h2>
                {pageHeader.description && <p className="text-gray-500 mt-2">{pageHeader.description}</p>}
            </div>
        )}

        {renderableQuestions.map((question) => (
            <Card key={question.id} className="border-0 shadow-xl ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-900 mb-6">
            <CardHeader className="space-y-1 pb-6">
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {question.title}
                </h1>
                {question.required && (
                <span className="text-xs font-medium text-red-500 uppercase tracking-wider">Required</span>
                )}
            </CardHeader>
            
            <CardContent className="">
                {question.type === "single" && (
                <RadioGroup 
                    value={answers[question.id]} 
                    onValueChange={(val) => handleAnswer(question.id, val)}
                    className="space-y-3"
                >
                    {question.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 cursor-pointer" onClick={() => handleAnswer(question.id, option)}>
                        <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                        <Label htmlFor={`${question.id}-${option}`} className="flex-1 cursor-pointer font-normal text-base">{option}</Label>
                    </div>
                    ))}
                </RadioGroup>
                )}

                {question.type === "multi" && (
                <div className="space-y-3">
                    {question.options?.map((option) => {
                    const currentAnswers = (answers[question.id] as string[]) || [];
                    const isChecked = currentAnswers.includes(option);
                    return (
                        <div key={option} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 cursor-pointer" 
                        onClick={() => {
                            const newAnswers = isChecked 
                            ? currentAnswers.filter(a => a !== option)
                            : [...currentAnswers, option];
                            handleAnswer(question.id, newAnswers);
                        }}
                        >
                        <Checkbox checked={isChecked} id={`${question.id}-${option}`} />
                        <Label htmlFor={`${question.id}-${option}`} className="flex-1 cursor-pointer font-normal text-base">{option}</Label>
                        </div>
                    );
                    })}
                </div>
                )}

                {question.type === "text" && (
                <Textarea 
                    placeholder="Type your answer here..." 
                    className="min-h-[150px] text-base resize-none bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 dark:bg-gray-800 dark:border-gray-700"
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                />
                )}

                {question.type === "rating" && (
                <div className="flex justify-center gap-2 py-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleAnswer(question.id, star)}
                        className={`p-2 rounded-full transition-all hover:scale-110 ${
                        (answers[question.id] || 0) >= star 
                            ? "text-amber-400" 
                            : "text-gray-200 dark:text-gray-700"
                        }`}
                    >
                        <StarIcon className="h-10 w-10 fill-current" />
                    </button>
                    ))}
                </div>
                )}

                {question.type === "select" && (
                <Select
                    value={answers[question.id]}
                    onValueChange={(value) => handleAnswer(question.id, value)}
                >
                    <SelectTrigger className="w-full h-12 text-base">
                    <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                    {question.options?.map((option) => (
                        <SelectItem key={option} value={option} className="text-base py-3">
                        {option}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                )}

                {question.type === "date" && (
                <Input
                    type="date"
                    className="w-full h-12 text-base block"
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                />
                )}
            </CardContent>
            </Card>
        ))}

        <div className="flex justify-between pt-6">
            <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={currentStep === 0}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button 
                onClick={handleNext}
                className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]"
            >
                {currentStep === totalSteps - 1 ? "Submit" : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
      </div>
    </div>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
