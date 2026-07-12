import React from "react";
import { Layers, Box, Package, Server, Smartphone, Laptop } from "lucide-react";

export function SignupHero() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-8 lg:p-12">
      {/* Illustration Area */}
      <div className="flex-1 w-full max-h-[400px] flex items-center justify-center relative mb-8">
        <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
          {/* Abstract background shapes for illustration */}
          <div className="absolute inset-0 bg-slate-100 rounded-full blur-3xl opacity-50 translate-x-10 translate-y-10" />
          <div className="absolute inset-8 bg-blue-50/50 rounded-full border border-blue-100/50 backdrop-blur-sm" />
          
          {/* Central graphic */}
          <div className="relative z-10 w-48 h-48 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center -rotate-6 transition-transform hover:rotate-0 duration-500">
            <div className="grid grid-cols-2 gap-4 p-6 w-full h-full">
               <div className="bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                  <Laptop className="w-6 h-6" />
               </div>
               <div className="bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                  <Package className="w-6 h-6" />
               </div>
               <div className="bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
                  <Server className="w-6 h-6" />
               </div>
               <div className="bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                  <Smartphone className="w-6 h-6" />
               </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-10 right-10 w-16 h-16 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center rotate-12 z-20 hover:-translate-y-2 transition-transform duration-300">
             <Layers className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="absolute bottom-10 left-10 w-12 h-12 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center -rotate-12 z-20 hover:-translate-y-2 transition-transform duration-300">
             <Box className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center space-y-4 max-w-md mx-auto relative z-10 mt-auto pb-4">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
          Manage Assets Smarter
        </h2>
        <p className="text-slate-500 leading-relaxed text-base">
          Track, allocate and manage organizational assets from one centralized platform.
        </p>
      </div>
    </div>
  );
}
