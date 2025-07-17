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

interface BriefNewsletterDisplayProps {
  aiNewsletter: AIGeneratedNewsletter;
  topic: string;
  timeFilter: 'week' | 'month';
}

export default function BriefNewsletterDisplay({ aiNewsletter, topic, timeFilter }: BriefNewsletterDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Brief Newsletter Header */}
      <div className="glass border-subtle rounded-xl p-6 shadow-xl bg-black/60">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-2xl">⚡</div>
          <div>
            <h2 className="text-xl font-bold text-white">Brief Newsletter</h2>
            <p className="text-gray-300 text-sm">Quick insights for busy professionals</p>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-white">{aiNewsletter.title}</h1>
        <p className="text-gray-400">
          {timeFilter === 'week' ? 'Weekly' : 'Monthly'} summary • {topic}
        </p>
      </div>

      {/* Executive Summary */}
      {aiNewsletter.introduction && (
        <div className="glass border-subtle rounded-xl p-5 shadow-lg bg-black/60">
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-lg">📋</div>
            <h3 className="text-lg font-semibold text-white">Executive Summary</h3>
          </div>
          <div className="text-gray-200 leading-relaxed">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    className="text-blue-400 hover:text-white underline"
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
      )}

      {/* Key Takeaways - Highlighted */}
      {aiNewsletter.keyTakeaways.length > 0 && (
        <div className="glass border-subtle rounded-xl p-5 shadow-lg bg-black/60">
          <div className="flex items-center space-x-2 mb-4">
            <div className="text-lg">🎯</div>
            <h3 className="text-lg font-semibold text-white">Key Takeaways</h3>
          </div>
          <div className="space-y-3">
            {aiNewsletter.keyTakeaways.slice(0, 7).map((takeaway, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-200 font-medium text-sm">{takeaway}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 3 Insights from Sections */}
      <div className="glass border-subtle rounded-xl p-5 shadow-lg bg-black/60">
        <div className="flex items-center space-x-2 mb-4">
          <div className="text-lg">💡</div>
          <h3 className="text-lg font-semibold text-white">Top Insights</h3>
        </div>
        <div className="space-y-3">
          {aiNewsletter.sections.slice(0, 3).map((section, index) => (
            <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-semibold text-white text-sm mb-2">{section.title}</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {section.content.length > 200 
                  ? `${section.content.substring(0, 200)}...` 
                  : section.content
                }
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Conclusion */}
      {aiNewsletter.conclusion && (
        <div className="glass border-subtle rounded-xl p-5 shadow-lg bg-black/60">
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-lg">🏁</div>
            <h3 className="text-lg font-semibold text-white">Bottom Line</h3>
          </div>
          <div className="text-gray-200 text-sm leading-relaxed">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    className="text-blue-400 hover:text-white underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            >
              {aiNewsletter.conclusion.length > 300 
                ? `${aiNewsletter.conclusion.substring(0, 300)}...` 
                : aiNewsletter.conclusion
              }
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Brief Footer */}
      <div className="glass border-subtle rounded-xl p-4 text-center bg-black/60">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="text-lg">⚡</div>
          <span className="text-sm text-gray-400">Brief AI Analysis</span>
        </div>
        <p className="text-xs text-gray-500">
          Condensed insights from Reddit discussions • {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
} 