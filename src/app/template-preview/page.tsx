"use client";

import { useState } from "react";
import TemplateEditor from "@/components/TemplateEditor";

export default function TemplatePreview() {
  const [topic, setTopic] = useState("React Development");
  const [newsletterFormat, setNewsletterFormat] = useState<'brief' | 'detailed' | 'visual'>('detailed');
  const [isTest, setIsTest] = useState(true);
  const [previewHtml, setPreviewHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample newsletter content for testing
  const sampleNewsletterContent = {
    title: "Weekly React Development Newsletter",
    introduction: "Welcome to this week's React insights! We've curated the most important discussions, updates, and trends from the React community.",
    sections: [
      {
        title: "React 19 Updates",
        content: "React 19 brings exciting new features including automatic batching, concurrent features, and improved performance. The community is buzzing with discussions about the new hooks and APIs.",
        type: "summary"
      },
      {
        title: "State Management Trends",
        content: "Zustand continues to gain popularity as a lightweight alternative to Redux. Many developers are moving away from complex state management solutions in favor of simpler, more focused libraries.",
        type: "analysis"
      },
      {
        title: "Performance Optimization",
        content: "New techniques for optimizing React applications are emerging, including better use of React.memo, useMemo, and useCallback. The community is sharing valuable insights about when and how to use these optimizations effectively.",
        type: "insights"
      }
    ],
    keyTakeaways: [
      "React 19 introduces automatic batching for better performance",
      "Zustand is becoming the preferred state management solution",
      "Performance optimization techniques are evolving rapidly",
      "The React ecosystem continues to grow and mature"
    ],
    conclusion: "The React ecosystem is evolving rapidly with new features and best practices emerging constantly. Stay tuned for more updates next week!"
  };

  const generatePreview = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          newsletterFormat,
          isTest,
          newsletterContent: isTest ? undefined : sampleNewsletterContent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPreviewHtml(data.html);
        setShowPreview(true);
      } else {
        console.error("Failed to generate template:", data.error);
        alert("Failed to generate template: " + data.error);
      }
    } catch (error) {
      console.error("Error generating template:", error);
      alert("Error generating template. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic}-newsletter-template.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveTemplate = (newHtml: string) => {
    setPreviewHtml(newHtml);
    setShowEditor(false);
    // Here you could save the template to a database or file
    console.log('Template saved:', newHtml);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">📧 Email Template Preview</h1>
          <p className="text-gray-300">Preview and test your newsletter templates without sending emails</p>
        </div>

        {/* Template Configuration */}
        <div className="glass border-subtle rounded-xl p-6 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Template Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white"
                placeholder="e.g., React Development"
              />
            </div>

            {/* Newsletter Format */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Format</label>
              <select
                value={newsletterFormat}
                onChange={(e) => setNewsletterFormat(e.target.value as any)}
                className="w-full px-4 py-2 bg-black/60 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white"
              >
                <option value="brief">Brief</option>
                <option value="detailed">Detailed</option>
                <option value="visual">Visual</option>
              </select>
            </div>

            {/* Template Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Template Type</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={isTest}
                    onChange={() => setIsTest(true)}
                    className="mr-2"
                  />
                  <span className="text-white">Test</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!isTest}
                    onChange={() => setIsTest(false)}
                    className="mr-2"
                  />
                  <span className="text-white">Real</span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                onClick={generatePreview}
                disabled={isGenerating}
                className="w-full px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  "Generate Preview"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="space-y-6">
            {/* Preview Controls */}
            <div className="glass border-subtle rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Template Preview</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowEditor(true)}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Edit Template
                  </button>
                  <button
                    onClick={downloadTemplate}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Download HTML
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Hide Preview
                  </button>
                </div>
              </div>
            </div>

            {/* Email Preview */}
            <div className="glass border-subtle rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-white">
                <div 
                  className="max-w-2xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
            </div>

            {/* HTML Code */}
            <div className="glass border-subtle rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">HTML Code</h3>
              <div className="bg-black/60 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm whitespace-pre-wrap">
                  {previewHtml}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Template Editor Modal */}
        {showEditor && (
          <TemplateEditor
            initialHtml={previewHtml}
            onSave={handleSaveTemplate}
            onCancel={() => setShowEditor(false)}
          />
        )}
      </div>
    </div>
  );
} 