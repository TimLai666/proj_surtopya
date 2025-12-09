import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SurveyCard } from "@/components/survey-card";
import { Search, Filter, ArrowUpDown } from "lucide-react";

// Mock Data
const MOCK_SURVEYS = [
  {
    id: "1",
    title: "Consumer Preferences for Sustainable Packaging in 2024",
    description: "Help us understand how eco-friendly packaging influences your purchasing decisions. Your feedback will shape future product lines.",
    points: 50,
    duration: 5,
    responses: 1240,
    rating: 4.8,
    author: { name: "EcoLife Research", image: "" },
    tags: ["Market Research", "Sustainability"],
    isHot: true,
  },
  {
    id: "2",
    title: "Remote Work & Mental Health Survey",
    description: "A comprehensive study on the impact of long-term remote work on employee well-being and productivity.",
    points: 100,
    duration: 12,
    responses: 856,
    rating: 4.5,
    author: { name: "Dr. Sarah Chen", image: "" },
    tags: ["Academic", "Psychology"],
    isHot: false,
  },
  {
    id: "3",
    title: "Global Travel Trends Post-Pandemic",
    description: "Where are you planning to travel next? Share your travel habits and preferences for the upcoming holiday season.",
    points: 30,
    duration: 3,
    responses: 3420,
    rating: 4.2,
    author: { name: "TravelWeekly", image: "" },
    tags: ["Lifestyle", "Travel"],
    isHot: true,
  },
  {
    id: "4",
    title: "UX Usability Testing: New Mobile Banking App",
    description: "We are looking for testers to evaluate the navigation flow of our new banking application prototype.",
    points: 150,
    duration: 15,
    responses: 120,
    rating: 4.9,
    author: { name: "FinTech UX Lab", image: "" },
    tags: ["UX Research", "Technology"],
    isHot: false,
  },
  {
    id: "5",
    title: "Coffee Consumption Habits",
    description: "Quick poll about your daily coffee intake and brand preferences.",
    points: 20,
    duration: 2,
    responses: 5600,
    rating: 4.0,
    author: { name: "BeanStats", image: "" },
    tags: ["Food & Beverage"],
    isHot: false,
  },
  {
    id: "6",
    title: "AI Tools in Education: Student Perspectives",
    description: "How are you using ChatGPT and other AI tools in your studies? An anonymous survey for university students.",
    points: 80,
    duration: 8,
    responses: 450,
    rating: 4.6,
    author: { name: "EdTech Watch", image: "" },
    tags: ["Education", "AI"],
    isHot: false,
  },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <div className="container px-4 py-12 md:px-6 md:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Surveys</span>
            </h1>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Discover paid surveys, contribute to research, and earn rewards. 
              Join thousands of participants shaping the future.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800">
        <div className="container px-4 py-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search surveys, topics, or keywords..." 
                className="pl-10 bg-gray-50 border-gray-200 focus-visible:ring-purple-500 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px] bg-white dark:bg-gray-900">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-gray-500" />
                    <SelectValue placeholder="Category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="market">Market Research</SelectItem>
                  <SelectItem value="ux">UX Research</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="recommended">
                <SelectTrigger className="w-[160px] bg-white dark:bg-gray-900">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="points-high">Highest Points</SelectItem>
                  <SelectItem value="duration-short">Shortest Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="container px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MOCK_SURVEYS.map((survey) => (
            <SurveyCard key={survey.id} {...survey} />
          ))}
        </div>
        
        {/* Empty State / Loading State could go here */}
        <div className="mt-12 flex justify-center">
          <Button variant="outline" size="lg" className="min-w-[200px]">
            Load More Surveys
          </Button>
        </div>
      </div>
    </div>
  );
}
