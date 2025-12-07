import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative mx-auto h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-75 dark:bg-green-900/30"></div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Survey Completed!
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Thank you for your feedback. You've earned <span className="font-bold text-purple-600 dark:text-purple-400">50 Points</span>.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link href="/explore">Take Another Survey</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
