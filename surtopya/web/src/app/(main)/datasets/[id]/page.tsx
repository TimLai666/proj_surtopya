"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Download, Code, FileText, Info, BarChart, Globe, Terminal, Copy, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function DatasetDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Navigation */}
      <div className="container px-4 py-6 md:px-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/datasets">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Marketplace
          </Link>
        </Button>
      </div>

      {/* Hero / Header */}
      <div className="bg-white border-b dark:bg-gray-900 dark:border-gray-800">
        <div className="container px-4 py-8 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">Market Research</Badge>
                <Badge variant="outline">Ver. 2.0.4</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Global E-commerce Trends 2024</h1>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                A comprehensive de-identified dataset capturing consumer behavior, platform preferences, and purchasing power across 15 major economies.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-purple-600" />
                  <span className="font-bold">52,482</span> Samples
                </div>
                <div className="flex items-center gap-2 text-emerald-600">
                  <Globe className="h-4 w-4" />
                  Public Access
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-purple-600" />
                  98% Completion Rate
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">
                <Download className="mr-2 h-4 w-4" /> Download CSV (12.4 MB)
              </Button>
              <Button variant="outline">
                <Terminal className="mr-2 h-4 w-4" /> Query API
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container px-4 py-10 md:px-6">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 h-12">
            <TabsTrigger value="overview" className="px-6 h-10"><Info className="h-4 w-4 mr-2" /> Overview</TabsTrigger>
            <TabsTrigger value="data-preview" className="px-6 h-10"><FileText className="h-4 w-4 mr-2" /> Data Preview</TabsTrigger>
            <TabsTrigger value="api-docs" className="px-6 h-10"><Code className="h-4 w-4 mr-2" /> API Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold">About this Dataset</h3>
                <p>
                  This dataset was generated through the Surtopya Open Data Program. It contains de-identified responses from multiple consumer surveys conducted between January and June 2024. All personally identifiable information (PII) such as names, emails, and precise locations has been removed or aggregated.
                </p>
                <h4 className="text-lg font-bold">Key Columns</h4>
                <ul className="space-y-2">
                  <li><strong>age_group</strong>: Categorical (18-24, 25-34, etc.)</li>
                  <li><strong>primary_platform</strong>: Most used e-commerce platform</li>
                  <li><strong>avg_monthly_spend</strong>: Numerical (USD equivalent)</li>
                  <li><strong>satisfaction_score</strong>: Rating (1-5)</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">License</span>
                    <span className="font-medium">CC BY-NC 4.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">DOI</span>
                    <span className="font-medium text-purple-600">10.5281/surtopya.ecommerce.24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">File Format</span>
                    <span className="font-medium">Tabular (CSV)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api-docs">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Go Dataset API</h3>
                  <p className="text-gray-500">
                    Consume this dataset programmatically via our high-performance Go-powered Gin API.
                  </p>
                </div>

                <Card className="bg-black text-gray-300 border-gray-800">
                  <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900">
                    <span className="text-xs font-mono uppercase text-gray-500">Endpoint: GET /v1/datasets/ds-1/query</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-6 font-mono text-sm overflow-x-auto">
                    <pre>
{`curl -X GET "https://api.surtopya.com/v1/datasets/ds-1/query" \\
     -H "Authorization: Bearer YOUR_API_KEY" \\
     -G \\
     --data-urlencode "limit=10" \\
     --data-urlencode "filter=age_group:18-24"`}
                    </pre>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold">Python Example (SDK coming soon)</h4>
                   <Card className="bg-gray-100 dark:bg-gray-800 border-0">
                    <CardContent className="p-6 font-mono text-sm overflow-x-auto text-purple-600 dark:text-purple-400">
                      <pre>
{`import requests

url = "https://api.surtopya.com/v1/datasets/ds-1/query"
params = {"limit": 100}
response = requests.get(url, params=params)

data = response.json()
print(f"Retrieved {len(data['results'])} records.")`}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <aside className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-xl">
                  <Terminal className="h-8 w-8 mb-4" />
                  <h4 className="font-bold text-lg">Direct Data Stream</h4>
                  <p className="text-sm text-blue-100 mt-2 leading-relaxed">
                    Our Go backend supports streaming large JSON responses directly into your data pipeline. No timeouts for large exports.
                  </p>
                  <Button variant="secondary" className="w-full mt-6 bg-white/20 hover:bg-white/30 text-white border-0">
                    View Go API Source
                  </Button>
                </div>
              </aside>
            </div>
          </TabsContent>

          <TabsContent value="data-preview">
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Respondent_ID</th>
                      <th className="px-6 py-4">Age_Group</th>
                      <th className="px-6 py-4">Country</th>
                      <th className="px-6 py-4">Top_Platform</th>
                      <th className="px-6 py-4">Spend_USD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-800">
                    {[
                      { id: "anon_01a", age: "18-24", country: "US", platform: "Amazon", spend: 450 },
                      { id: "anon_02b", age: "25-34", country: "UK", platform: "eBay", spend: 280 },
                      { id: "anon_03c", age: "18-24", country: "CA", platform: "Shopify", spend: 120 },
                      { id: "anon_04d", age: "45-54", country: "DE", platform: "Amazon", spend: 1200 },
                      { id: "anon_05e", age: "25-34", country: "JP", platform: "Rakuten", spend: 650 },
                    ].map((row, i) => (
                      <tr key={i} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4 font-mono text-xs">{row.id}</td>
                        <td className="px-6 py-4">{row.age}</td>
                        <td className="px-6 py-4">{row.country}</td>
                        <td className="px-6 py-4">{row.platform}</td>
                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-bold">${row.spend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
            <div className="mt-4 text-center text-xs text-gray-500">
              Showing first 5 rows of 52,482 records.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
