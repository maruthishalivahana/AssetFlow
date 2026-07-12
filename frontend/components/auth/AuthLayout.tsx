import React from "react";
import Link from "next/link";
import { Boxes } from "lucide-react"; // Using Boxes as a placeholder for AssetFlow Logo

interface AuthLayoutProps {
  children: React.ReactNode;
  hero: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, hero, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 selection:bg-slate-200">
      {/* Left Panel (Form) */}
      <div className="flex-1 lg:flex-none lg:w-[45%] flex flex-col">
        {/* Logo Header */}
        <div className="flex items-center gap-2 p-6 md:p-8 lg:p-10 lg:pb-0">
          <div className="bg-slate-900 p-1.5 rounded-lg text-white shadow-sm">
            <Boxes className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-slate-900">
            AssetFlow
          </span>
        </div>

        {/* Content Centered */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-8 sm:py-12 md:px-16 lg:px-20 xl:px-24">
          <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-semibold tracking-tight text-slate-900">
                {title}
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                {description}
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>

      {/* Right Panel (Hero) */}
      <div className="hidden md:flex md:h-[600px] lg:h-auto lg:flex-1 p-6 lg:p-8">
        <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 flex flex-col bg-white">
          {/* Subtle gradient background inside the hero container */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50 opacity-80" />
          {/* Decorative blur elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-slate-100 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col h-full">
            {hero}
          </div>
        </div>
      </div>
    </div>
  );
}
