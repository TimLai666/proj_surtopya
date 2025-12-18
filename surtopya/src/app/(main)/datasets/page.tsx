"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Download, Search, Filter, ArrowUpDown, FileText, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock Datasets
const MOCK_DATASETS = [
  {
    id: "ds-1",
    title: "Global E-commerce Trends 2024",
    description: "De-identified survey data from 50,000+ respondents regarding online shopping habits across 15 countries.",
    sampleSize: "52.4k",
    format: "CSV, JSON",
    lastUpdated: "2 days ago",
    category: "Market Research",
    isPublic: true,
    downloads: "1.2k",
    apiAvailable: true
  },
  {
    id: "ds-2",
    title: "Remote Work & Mental Health Longitudinal Study",
    description: "Multi-year dataset tracking employee well-being in remote vs. hybrid environments. Anonymized textual sentiment included.",
    sampleSize: "12.8k",
    format: "CSV",
    lastUpdated: "1 week ago",
    category: "Social Science",
    isPublic: true,
    downloads: "856",
    apiAvailable: true
  },
  {
    id: "ds-3",
    title: "Gen Z Sustainable Fashion Drivers",
    description: "Detailed analytics on purchasing drivers for sustainable apparel among youth in Asia and North America.",
    sampleSize: "8.2k",
    format: "JSON",
    lastUpdated: "3 weeks ago",
    category: "Consumer Goods",
    isPublic: false,
    downloads: "420",
    apiAvailable: true
  }
];

export default function DatasetsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="bg-black text-white py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Datasets</span> Marketplace
            </h1>
            <p className="text-xl text-gray-400">
              Access high-quality, de-identified survey data for your research, AI training, and business intelligence.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="bg-white text-black hover:bg-gray-200">
                <Database className="mr-2 h-4 w-4" /> Browse All Data
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <FileText className="mr-2 h-4 w-4" /> API Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Find datasets..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Categories</h3>
              <div className="space-y-2">
                {["All Categories", "Market Research", "Social Science", "Technology", "Healthcare", "Finance"].map((cat) => (
                  <Button key={cat} variant="ghost" className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-purple-600">
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800">
              <h4 className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2">
                <Globe className="h-4 w-4" /> Open Data Initiative
              </h4>
              <p className="text-xs text-purple-700 dark:text-purple-400 mt-2 leading-relaxed">
                All datasets are automatically de-identified using our proprietary privacy engine to protect participant identity.
              </p>
            </div>
          </aside>

          {/* Dataset List */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between pb-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-bold text-gray-900 dark:text-gray-100">3</span> datasets
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" /> Sort by: Newest
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {MOCK_DATASETS.map((ds) => (
                <Card key={ds.id} className="group overflow-hidden border-0 shadow-lg ring-1 ring-gray-200 dark:ring-gray-800 hover:ring-purple-500/50 transition-all duration-300">
                  <Link href={`/datasets/${ds.id}`} className="block">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl group-hover:text-purple-600 transition-colors flex items-center gap-2">
                            {ds.title}
                            {!ds.isPublic && <Lock className="h-3.5 w-3.5 text-amber-500" />}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">
                            {ds.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0">
                          {ds.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-500" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">{ds.sampleSize}</span> samples
                        </div>
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4 text-purple-500" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">{ds.downloads}</span> downloads
                        </div>
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-purple-500" />
                          <span>Format: {ds.format}</span>
                        </div>
                        <div className="md:ml-auto">
                          Updated {ds.lastUpdated}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 dark:bg-gray-900/50 py-3 border-t dark:border-gray-800">
                      <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider text-purple-600">
                         <span>View Details</span>
                         {ds.apiAvailable && <span>• API Access Active</span>}
                      </div>
                    </CardFooter>
                  </Link>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center pt-8">
              <Button variant="ghost" className="text-gray-500">
                Load More Datasets
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
