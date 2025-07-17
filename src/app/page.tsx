"use client";

import TopicNewsletterGenerator from "@/components/TopicNewsletterGenerator";

export default function Home() {
  return (
    <div className="flex-grow bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Enhanced static background elements */}
      <div className="absolute top-0 w-full h-full pointer-events-none z-0">
        {/* Static floating orbs */}
        <div className="absolute left-1/4 top-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-fade-in" />
        <div className="absolute right-1/4 bottom-10 w-96 h-96 bg-white/15 rounded-full blur-3xl animate-fade-in" style={{ animationDelay: '0.5s' }} />
        
        {/* Additional static floating elements */}
        <div className="absolute left-1/3 top-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="absolute right-1/3 bottom-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />
        
        {/* More static floating elements */}
        <div className="absolute left-1/6 top-1/4 w-32 h-32 bg-cyan-500/8 rounded-full blur-xl" />
        <div className="absolute right-1/6 bottom-1/4 w-40 h-40 bg-pink-500/8 rounded-full blur-xl" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative">
          {/* Main content - clean and borderless */}
          <div className="relative p-8 sm:p-12 animate-slide-up">
            <div className="text-center space-y-10 max-w-4xl mx-auto">
              {/* Header section with enhanced animations */}
              <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-tight">
                  Personalized Newsletter
                </h1>
                <p className="text-xl sm:text-2xl text-gray-200 max-w-2xl mx-auto font-normal leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  Stay ahead of the curve. Get the most exciting, useful, and technical news from Reddit—curated by AI for tech enthusiasts.
                </p>
              </div>
              {/* Topic-Based Newsletter Generator */}
              <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <TopicNewsletterGenerator />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 