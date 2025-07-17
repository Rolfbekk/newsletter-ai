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

interface AINewsletterDisplayProps {
  aiNewsletter: AIGeneratedNewsletter;
  topic: string;
  timeFilter: 'week' | 'month';
}

export default function AINewsletterDisplay({ aiNewsletter, topic, timeFilter }: AINewsletterDisplayProps) {
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

  const getSectionColor = (type: string) => {
    switch (type) {
      case 'summary': return 'bg-blue-50 border-blue-200';
      case 'analysis': return 'bg-purple-50 border-purple-200';
      case 'trends': return 'bg-green-50 border-green-200';
      case 'insights': return 'bg-yellow-50 border-yellow-200';
      case 'discussions': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* AI Newsletter Header */}
      <div className="glass border-subtle rounded-xl p-8 shadow-2xl bg-black/60 animate-fade-in">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-3xl">🤖</div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI-Generated Newsletter</h2>
            <p className="text-gray-300">Intelligent analysis and insights</p>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-white drop-shadow-lg tracking-tight">{aiNewsletter.title}</h1>
        <p className="text-gray-400 text-lg">
          {timeFilter === 'week' ? 'Weekly' : 'Monthly'} AI-curated insights about {topic}
        </p>
      </div>

      {/* Introduction */}
      {aiNewsletter.introduction && (
        <div className="glass border-subtle rounded-xl p-6 shadow-lg bg-black/60 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="prose max-w-none">
            <div className="text-lg text-gray-200 leading-relaxed">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-blue-400 hover:text-white underline hover-scale-sm transition-all"
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
      )}

      {/* Newsletter Sections */}
      {aiNewsletter.sections.map((section, index) => (
        <div key={index} className="glass border-subtle rounded-xl p-6 shadow-2xl bg-black/60 mt-4 animate-fade-in" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">{getSectionIcon(section.type)}</div>
            <h3 className="text-xl font-bold text-white">{section.title}</h3>
          </div>
          <div className="prose max-w-none">
            <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-blue-400 hover:text-white underline hover-scale-sm transition-all"
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
      ))}

      {/* Key Takeaways */}
      {aiNewsletter.keyTakeaways.length > 0 && (
        <div className="glass border-subtle rounded-xl p-6 shadow-xl bg-black/60 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">🎯</div>
            <h3 className="text-xl font-bold text-white">Key Takeaways</h3>
          </div>
          <div className="space-y-3">
            {aiNewsletter.keyTakeaways.map((takeaway, index) => (
              <div key={index} className="flex items-start space-x-3 transition-all">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  {index + 1}
                </div>
                <p className="text-gray-200 font-medium">{takeaway}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conclusion */}
      {aiNewsletter.conclusion && (
        <div className="glass border-subtle rounded-xl p-6 shadow-lg bg-black/60 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">🏁</div>
            <h3 className="text-xl font-bold text-white">Conclusion</h3>
          </div>
          <div className="prose max-w-none">
            <div className="text-gray-200 leading-relaxed text-lg">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-blue-400 hover:text-white underline hover-scale-sm transition-all"
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

      {/* Newsletter Footer */}
      <div className="glass border-subtle rounded-xl p-6 text-center mt-4 bg-black/60 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="text-xl">🤖</div>
          <span className="text-sm text-gray-400">AI-Powered Analysis</span>
        </div>
        <p className="text-xs text-gray-500">
          This newsletter was intelligently generated by analyzing Reddit discussions and extracting key insights.
          The content is based on community discussions and may not represent professional advice.
        </p>
      </div>
    </div>
  );
} 