"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, Compass, PlusCircle, Info, CreditCard } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Mock Auth State - Replace with Logto hook later
  const isAuthenticated = true; 

  const navItems = [
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Pricing", href: "/pricing", icon: CreditCard },
    { name: "About", href: "/about", icon: Info },
  ];

  const authItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Create", href: "/create", icon: PlusCircle },
  ];

  const allItems = isAuthenticated ? [...navItems, ...authItems] : navItems;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600"></div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Surtopya
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {allItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600 dark:hover:text-purple-400",
                pathname === item.href
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-300"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4 ml-4">
               <Button asChild variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                 <Link href="/dashboard">Dashboard</Link>
               </Button>
               <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"></div>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-4">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-600 dark:text-gray-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="flex flex-col gap-4">
            {allItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                  pathname === item.href
                    ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-300"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
            <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
               {!isAuthenticated && (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full">Sign In</Button>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
                  </div>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
