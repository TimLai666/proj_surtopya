"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Survey, SurveyTheme } from "@/types/survey";
import { SurveyRenderer } from "@/components/survey/survey-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Award, ArrowRight, ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock Survey Data for SEO pages
const MOCK_SURVEYS: Record<string, Survey & { 
  estimatedTime: string; 
  responseCount: number; 
  creator: string;
  theme?: SurveyTheme;
}> = {
  "1": {
    id: "1",
    title: "Consumer Preferences 2024",
    description: "Help us understand your shopping habits. This comprehensive survey covers your online shopping experience, preferred platforms, and purchasing behaviors. Your insights will help shape the future of e-commerce.",
    questions: [
      {
        id: "sec1",
        type: "section",
        title: "Shopping Habits",
        description: "Tell us about your online shopping experience.",
        required: false,
        points: 0,
      },
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
        id: "sec2",
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
    },
    estimatedTime: "2-3 min",
    responseCount: 1247,
    creator: "Market Research Inc.",
  },
  "2": {
    id: "2",
    title: "Tech Adoption Survey",
    description: "Share your technology preferences and habits. We want to understand how people interact with new technologies and what drives adoption decisions.",
    questions: [
      { id: "sec1", type: "section", title: "Technology Usage", required: false, points: 0 },
      { id: "q1", type: "single", title: "What is your primary device?", required: true, options: ["Smartphone", "Laptop", "Desktop", "Tablet"], points: 10 },
    ],
    settings: {
      isPublic: true,
      pointsReward: 75,
    },
    estimatedTime: "5 min",
    responseCount: 892,
    creator: "Tech Insights Lab",
  },
  "preview": {
    id: "preview",
    title: "Preview Survey",
    description: "",
    questions: [],
    settings: { isPublic: true, pointsReward: 0 },
    estimatedTime: "N/A",
    responseCount: 0,
    creator: "You",
  }
};

export default function SurveyPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const surveyId = params.id as string;
  const isPreview = surveyId === 'preview' || searchParams.get('mode') === 'preview';
  
  const [survey, setSurvey] = useState<typeof MOCK_SURVEYS[string] | null>(null);
  const [theme, setTheme] = useState<SurveyTheme | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isTaking, setIsTaking] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    if (isPreview) {
      try {
        const surveyData = sessionStorage.getItem("preview_survey");
        const themeData = sessionStorage.getItem("preview_theme");
        
        if (surveyData) {
          const parsed = JSON.parse(surveyData);
          setSurvey({
            ...parsed,
            estimatedTime: "N/A",
            responseCount: 0,
            creator: "You (Preview)",
          });
          setIsTaking(true);
        }
        if (themeData) {
          setTheme(JSON.parse(themeData));
        }
      } catch (error) {
        console.error("Failed to load preview data:", error);
      }
    } else {
      const surveyData = MOCK_SURVEYS[surveyId];
      if (surveyData) {
        setSurvey(surveyData);
      }
    }
    setLoading(false);
  }, [surveyId, isPreview]);

  const handleStartSurvey = () => {
    setIsTaking(true);
  };

  const handleExitClick = () => {
    if (isPreview) {
      window.close();
    } else {
      setShowExitDialog(true);
    }
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    setIsTaking(false);
  };

  const handleComplete = (answers: Record<string, any>) => {
    if (isPreview) {
      alert("Preview Complete!\n\nIn a real survey, responses would be saved.\n\nResponses:\n" + JSON.stringify(answers, null, 2));
      window.close();
    } else {
      console.log("Survey responses:", answers);
      router.push("/survey/thank-you");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-950 dark:to-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Survey Not Found</h1>
          <p className="text-gray-500">
            {isPreview 
              ? "Please open preview from the survey builder." 
              : "The survey you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={() => router.push(isPreview ? "/create" : "/explore")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isPreview ? "Back to Builder" : "Back to Marketplace"}
          </Button>
        </div>
      </div>
    );
  }

  // Show survey renderer when taking the survey
  if (isTaking) {
    return (
      <div className="relative">
        {/* Exit Button */}
        <div className="fixed top-4 right-4 z-50">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExitClick}
            className="bg-white/90 backdrop-blur shadow-lg hover:bg-white"
          >
            <X className="mr-2 h-4 w-4" />
            {isPreview ? "Exit Preview" : "Exit Survey"}
          </Button>
        </div>

        <SurveyRenderer 
          survey={survey} 
          theme={theme}
          isPreview={isPreview}
          onComplete={handleComplete}
        />

        {/* Exit Confirmation Dialog */}
        <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Exit Survey?</DialogTitle>
              <DialogDescription>
                Your progress will not be saved. Are you sure you want to exit?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExitDialog(false)}>
                Continue Survey
              </Button>
              <Button variant="destructive" onClick={handleConfirmExit}>
                Exit Without Saving
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Show intro page (SEO-friendly landing page)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Full-width hero section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
          <div className="flex items-center gap-2 mb-6">
            <Badge className="bg-white/20 text-white border-0 hover:bg-white/30 text-sm px-3 py-1">
              <Award className="mr-1.5 h-4 w-4" />
              Earn {survey.settings.pointsReward} Points
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{survey.title}</h1>
          <p className="text-xl text-white/80">by {survey.creator}</p>
        </div>
      </div>

      {/* Content section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About this Survey</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {survey.description}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What You'll Be Asked</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
                  <span>Multiple choice questions about your preferences</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
                  <span>Short text responses for detailed feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
                  <span>Rating scales to measure satisfaction</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Privacy & Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your responses are anonymous and will only be used for research purposes. 
                You can exit the survey at any time without saving your progress.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
                <p className="text-white/80 text-sm">Reward</p>
                <p className="text-3xl font-bold text-white">{survey.settings.pointsReward} Points</p>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estimated Time</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{survey.estimatedTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Responses</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{survey.responseCount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleStartSurvey}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg py-6 shadow-lg shadow-purple-500/25"
            >
              Start Survey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button 
              variant="ghost" 
              onClick={() => router.push("/explore")}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
