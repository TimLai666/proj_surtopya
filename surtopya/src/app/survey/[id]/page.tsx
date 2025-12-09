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
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const totalSteps = MOCK_SURVEY.questions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentQuestion = MOCK_SURVEY.questions[currentStep];

  const handleNext = () => {
    const currentAnswer = answers[currentQuestion.id];
    
    // Check for logic jumps
    if (currentQuestion.logic && currentQuestion.logic.length > 0) {
      const matchedRule = currentQuestion.logic.find(rule => rule.triggerOption === currentAnswer);
      
      if (matchedRule) {
        if (matchedRule.destinationQuestionId === 'end_survey') {
          router.push("/survey/thank-you");
          return;
        }
        
        const destinationIndex = MOCK_SURVEY.questions.findIndex(q => q.id === matchedRule.destinationQuestionId);
        if (destinationIndex !== -1) {
          setCurrentStep(destinationIndex);
          return;
        }
      }
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

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress Header */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
            <span>Question {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% completed</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200 dark:bg-gray-800" indicatorClassName="bg-gradient-to-r from-purple-600 to-pink-600" />
        </div>

        <Card className="border-0 shadow-xl ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="space-y-1 pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {currentQuestion.title}
            </h1>
            {currentQuestion.required && (
              <span className="text-xs font-medium text-red-500 uppercase tracking-wider">Required</span>
            )}
          </CardHeader>
          
          <CardContent className="min-h-[200px]">
            {currentQuestion.type === "single" && (
              <RadioGroup 
                value={answers[currentQuestion.id]} 
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {currentQuestion.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 cursor-pointer" onClick={() => handleAnswer(option)}>
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="flex-1 cursor-pointer font-normal text-base">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === "multi" && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => {
                  const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
                  const isChecked = currentAnswers.includes(option);
                  return (
                    <div key={option} className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 cursor-pointer" 
                      onClick={() => {
                        const newAnswers = isChecked 
                          ? currentAnswers.filter(a => a !== option)
                          : [...currentAnswers, option];
                        handleAnswer(newAnswers);
                      }}
                    >
                      <Checkbox checked={isChecked} id={option} />
                      <Label htmlFor={option} className="flex-1 cursor-pointer font-normal text-base">{option}</Label>
                    </div>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "text" && (
              <Textarea 
                placeholder="Type your answer here..." 
                className="min-h-[150px] text-base resize-none bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 dark:bg-gray-800 dark:border-gray-700"
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
              />
            )}

            {currentQuestion.type === "rating" && (
              <div className="flex justify-center gap-2 py-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleAnswer(star)}
                    className={`p-2 rounded-full transition-all hover:scale-110 ${
                      (answers[currentQuestion.id] || 0) >= star 
                        ? "text-amber-400" 
                        : "text-gray-200 dark:text-gray-700"
                    }`}
                  >
                    <StarIcon className="h-10 w-10 fill-current" />
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === "select" && (
              <Select
                value={answers[currentQuestion.id]}
                onValueChange={(value) => handleAnswer(value)}
              >
                <SelectTrigger className="w-full h-12 text-base">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {currentQuestion.options?.map((option) => (
                    <SelectItem key={option} value={option} className="text-base py-3">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {currentQuestion.type === "date" && (
              <Input
                type="date"
                className="w-full h-12 text-base block"
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
              />
            )}
          </CardContent>

          <CardFooter className="flex justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
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
          </CardFooter>
        </Card>
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
