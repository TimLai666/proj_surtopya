"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Survey, SurveyTheme } from "@/types/survey";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Eye, 
  Share2, 
  Pencil, 
  BarChart3, 
  Settings, 
  Copy, 
  Check,
  ExternalLink,
  Users,
  MessageSquare,
  TrendingUp,
  Calendar
} from "lucide-react";

// Mock Survey Data
const MOCK_MY_SURVEYS: Record<string, Survey & { 
  responseCount: number; 
  createdAt: string;
  lastResponse: string;
  theme?: SurveyTheme;
}> = {
  "my-1": {
    id: "my-1",
    title: "Customer Satisfaction Survey",
    description: "Gather feedback from our customers about their experience.",
    questions: [
      { id: "1", type: "section", title: "Page 1", required: false, points: 0 },
      { id: "2", type: "single", title: "How satisfied are you?", required: true, points: 10, options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"] },
    ],
    settings: {
      isPublic: true,
      pointsReward: 25,
    },
    responseCount: 156,
    createdAt: "2024-11-15",
    lastResponse: "2 hours ago",
    theme: {
      primaryColor: '#9333ea',
      backgroundColor: '#f9fafb',
      fontFamily: 'inter',
    }
  },
  "my-2": {
    id: "my-2",
    title: "Employee Engagement Survey",
    description: "Annual survey to measure employee engagement and satisfaction.",
    questions: [
      { id: "1", type: "section", title: "Page 1", required: false, points: 0 },
    ],
    settings: {
      isPublic: false,
      pointsReward: 50,
    },
    responseCount: 89,
    createdAt: "2024-10-20",
    lastResponse: "1 day ago",
  },
};

export default function SurveyManagementPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.id as string;
  
  const [survey, setSurvey] = useState<typeof MOCK_MY_SURVEYS[string] | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    const surveyData = MOCK_MY_SURVEYS[surveyId];
    if (surveyData) {
      setSurvey(surveyData);
      setIsPublic(surveyData.settings.isPublic);
    }
    setLoading(false);
  }, [surveyId]);

  const handlePreview = () => {
    if (survey) {
      // Save to sessionStorage for preview
      const surveyData = {
        id: survey.id,
        title: survey.title,
        description: survey.description,
        questions: survey.questions,
        settings: survey.settings,
      };
      sessionStorage.setItem('preview_survey', JSON.stringify(surveyData));
      sessionStorage.setItem('preview_theme', JSON.stringify(survey.theme || {}));
      window.open('/survey/preview', '_blank');
    }
  };

  const handleEdit = () => {
    // In production, this would load the survey into the builder
    router.push(`/create?edit=${surveyId}`);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/survey/${surveyId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Survey Not Found</h1>
          <p className="text-gray-500">The survey you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{survey.title}</h1>
                <p className="text-sm text-gray-500">Created on {survey.createdAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button variant="outline" onClick={handleCopyLink}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </>
                )}
              </Button>
              <Button onClick={handleEdit} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Responses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{survey.responseCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">87%</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Response</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{survey.lastResponse}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Questions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{survey.questions.filter(q => q.type !== 'section').length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="responses" className="w-full">
              <TabsList className="w-full justify-start bg-white dark:bg-gray-900 border-b rounded-none p-0 h-auto">
                <TabsTrigger value="responses" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 px-6 py-3">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Responses
                </TabsTrigger>
                <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 px-6 py-3">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="responses" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Response Summary</CardTitle>
                    <CardDescription>Overview of collected responses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                      <BarChart3 className="h-12 w-12 mb-4 text-gray-300" />
                      <p>Response analytics will appear here once you have responses.</p>
                      <Button variant="outline" className="mt-4" onClick={() => router.push(`/survey/${surveyId}`)}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Survey
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Survey Settings</CardTitle>
                    <CardDescription>Configure your survey options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="public" className="text-base">Public Survey</Label>
                        <p className="text-sm text-gray-500">Allow anyone with the link to respond</p>
                      </div>
                      <Switch 
                        id="public" 
                        checked={isPublic} 
                        onCheckedChange={setIsPublic}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="points">Points Reward</Label>
                      <Input 
                        id="points" 
                        type="number" 
                        defaultValue={survey.settings.pointsReward}
                        className="w-32"
                      />
                      <p className="text-sm text-gray-500">Points awarded to respondents</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Share Link</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input 
                    readOnly 
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/survey/${surveyId}`}
                    className="text-sm"
                  />
                  <Button variant="outline" size="icon" onClick={handleCopyLink}>
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handlePreview}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Survey
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Survey
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push(`/survey/${surveyId}`)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Survey Page
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
