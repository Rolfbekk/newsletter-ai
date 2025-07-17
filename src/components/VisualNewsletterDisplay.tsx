"use client";

import ReactMarkdown from 'react-markdown';

interface NewsletterSection {
  title: string;
  content: string;
  type: 'summary' | 'analysis' | 'trends' | 'insights' | 'discussions';
}

interface AIGeneratedNewsletter {
  title: string;
  introduction: string;
  sections: NewsletterSection[];
  keyTakeaways: string[];
  conclusion: string;
  tone: 'professional' | 'casual' | 'enthusiastic';
}

interface VisualNewsletterDisplayProps {
  aiNewsletter: AIGeneratedNewsletter;
  topic: string;
  timeFilter: 'week' | 'month';
}

export default function VisualNewsletterDisplay({ aiNewsletter, topic, timeFilter }: VisualNewsletterDisplayProps) {
  const getSectionColor = (type: string) => {
    switch (type) {
      case 'summary': return 'from-blue-500 to-cyan-500';
      case 'analysis': return 'from-purple-500 to-pink-500';
      case 'trends': return 'from-green-500 to-emerald-500';
      case 'insights': return 'from-yellow-500 to-orange-500';
      case 'discussions': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'summary': return '📋';
      case 'analysis': return '🔍';
      case 'trends': return '📈';
      case 'insights': return '💡';
      case 'discussions': return '💬';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-8">
      {/* Visual Newsletter Header */}
      <div className="relative overflow-hidden glass border-subtle rounded-xl p-8 shadow-2xl bg-black/60">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        
        <div className="relative">
          <div className="flex items-center space-x-4 mb-6">
            <div className="text-4xl">🎨</div>
            <div>
              <h2 className="text-2xl font-bold text-white">Visual Newsletter</h2>
              <p className="text-gray-300">Enhanced formatting for easy scanning</p>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 text-white drop-shadow-lg tracking-tight">
            {aiNewsletter.title}
          </h1>
          
          <div className="flex items-center space-x-4 text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>{timeFilter === 'week' ? 'Weekly' : 'Monthly'} Edition</span>
            </div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span>{topic}</span>
          </div>
        </div>
      </div>

      {/* Introduction with visual elements */}
      {aiNewsletter.introduction && (
        <div className="glass border-subtle rounded-xl p-6 shadow-xl bg-black/60">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
              📋
            </div>
            <h3 className="text-xl font-bold text-white">Overview</h3>
          </div>
          
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
            <div className="pl-6">
              <div className="text-gray-200 leading-relaxed text-lg">
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-blue-400 hover:text-white underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >
                  {aiNewsletter.introduction}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Takeaways with visual progress */}
      {aiNewsletter.keyTakeaways.length > 0 && (
        <div className="glass border-subtle rounded-xl p-6 shadow-xl bg-black/60">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
              🎯
            </div>
            <h3 className="text-xl font-bold text-white">Key Takeaways</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiNewsletter.keyTakeaways.map((takeaway, index) => (
              <div key={index} className="relative p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                    {index + 1}
                  </div>
                  <p className="text-gray-200 font-medium">{takeaway}</p>
                </div>
                {/* Progress indicator */}
                <div className="mt-3">
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${((index + 1) / aiNewsletter.keyTakeaways.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter Sections with visual cards */}
      {aiNewsletter.sections.map((section, index) => (
        <div key={index} className="glass border-subtle rounded-xl p-6 shadow-2xl bg-black/60">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-10 h-10 bg-gradient-to-r ${getSectionColor(section.type)} rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
              {getSectionIcon(section.type)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{section.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 bg-gradient-to-r ${getSectionColor(section.type)} rounded-full`}></div>
                <span className="text-sm text-gray-400 capitalize">{section.type}</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getSectionColor(section.type)} rounded-full`}></div>
            <div className="pl-6">
              <div className="text-gray-200 leading-relaxed">
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-blue-400 hover:text-white underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >
                  {section.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Conclusion with highlight box */}
      {aiNewsletter.conclusion && (
        <div className="glass border-subtle rounded-xl p-6 shadow-xl bg-black/60">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
              🏁
            </div>
            <h3 className="text-xl font-bold text-white">Conclusion</h3>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
            <div className="text-gray-200 leading-relaxed text-lg">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-blue-400 hover:text-white underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              >
                {aiNewsletter.conclusion}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Visual Footer */}
      <div className="glass border-subtle rounded-xl p-6 text-center bg-black/60">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            🎨
          </div>
          <span className="text-sm text-gray-400 font-medium">Visual AI Analysis</span>
        </div>
        
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>Enhanced Formatting</span>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <span>Visual Elements</span>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
} 