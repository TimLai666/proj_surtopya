"use client";

import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SurveyCard } from "@/components/survey-card";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// Mock Data
const MOCK_SURVEYS_LIST = [
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
    category: "market",
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
    category: "academic",
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
    category: "market", // Approximate
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
    category: "ux",
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
    category: "market",
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
    category: "academic",
  },
];

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const searchQuery = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'recommended';

  // State update helpers
  const updateSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    router.replace(`/explore?${params.toString()}`);
  };

  const updateCategory = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== 'all') {
      params.set('category', val);
    } else {
      params.delete('category');
    }
    router.push(`/explore?${params.toString()}`); // Push for major filter changes
  };

  const updateSort = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set('sort', val);
    } else {
      params.delete('sort');
    }
    router.push(`/explore?${params.toString()}`);
  };

  // Filter Logic
  const filteredSurveys = MOCK_SURVEYS_LIST.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          survey.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || survey.category === category;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch(sort) {
      case 'newest': return parseInt(b.id) - parseInt(a.id); // Simple ID mock sort
      case 'points-high': return b.points - a.points;
      case 'duration-short': return a.duration - b.duration;
      case 'recommended': 
      default: return 0; // Maintain original order or complex algo
    }
  });

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
      <section className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800" aria-label="Search and Filters">
        <div className="container px-4 py-4 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
             {/* Search */}
            <div className="relative flex-1 max-w-lg w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input 
                type="search"
                placeholder="Search surveys, topics, or keywords..." 
                className="pl-10 bg-gray-50 border-gray-200 focus-visible:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 w-full"
                defaultValue={searchQuery}
                onChange={(e) => updateSearch(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <Select value={category} onValueChange={updateCategory}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-900">
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

              <Select value={sort} onValueChange={updateSort}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-900">
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
      </section>

      {/* Grid Section */}
      <div className="container px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSurveys.map((survey) => (
            <SurveyCard key={survey.id} {...survey} />
          ))}
          {filteredSurveys.length === 0 && (
             <div className="col-span-full py-12 text-center text-gray-500">
               No surveys found matching your criteria.
             </div>
          )}
        </div>
        
        {/* Load More (Visual only for now) */}
        {filteredSurveys.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Load More Surveys
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>}>
      <ExploreContent />
    </Suspense>
  );
}
