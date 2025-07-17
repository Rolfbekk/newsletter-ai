"use client";

export type NewsletterFormat = 'brief' | 'detailed' | 'visual';

interface NewsletterFormatSelectorProps {
  selectedFormat: NewsletterFormat;
  onFormatChange: (format: NewsletterFormat) => void;
}

const FORMAT_OPTIONS = [
  {
    id: 'brief' as NewsletterFormat,
    title: 'Brief',
    description: 'Quick overview with key points',
    icon: '⚡',
    features: ['5-7 key takeaways', 'Executive summary', 'Fast reading']
  },
  {
    id: 'detailed' as NewsletterFormat,
    title: 'Detailed',
    description: 'Comprehensive analysis and insights',
    icon: '📊',
    features: ['Full analysis', 'Multiple sections', 'Deep insights']
  },
  {
    id: 'visual' as NewsletterFormat,
    title: 'Visual',
    description: 'Rich formatting with highlights',
    icon: '🎨',
    features: ['Enhanced formatting', 'Visual elements', 'Easy scanning']
  }
];

export default function NewsletterFormatSelector({ selectedFormat, onFormatChange }: NewsletterFormatSelectorProps) {
  return (
    <div className="glass border-subtle rounded-xl p-6 shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Choose Newsletter Format</h3>
        <p className="text-gray-300">Select how you'd like your newsletter to be structured</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FORMAT_OPTIONS.map((format) => (
          <button
            key={format.id}
            onClick={() => onFormatChange(format.id)}
            className={`relative p-6 rounded-xl border transition-all duration-200 text-left group ${
              selectedFormat === format.id
                ? 'border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                : 'border-white/20 bg-black/40 hover:border-white/40 hover:bg-black/60'
            }`}
          >
            {/* Selection indicator */}
            {selectedFormat === format.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {/* Format icon */}
            <div className="text-3xl mb-3">{format.icon}</div>
            
            {/* Format title and description */}
            <h4 className="text-lg font-semibold text-white mb-2">{format.title}</h4>
            <p className="text-sm text-gray-300 mb-4">{format.description}</p>
            
            {/* Features list */}
            <ul className="space-y-1">
              {format.features.map((feature, index) => (
                <li key={index} className="text-xs text-gray-400 flex items-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
} 