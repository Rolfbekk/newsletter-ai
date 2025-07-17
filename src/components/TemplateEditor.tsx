"use client";

import { useState, useEffect } from "react";

interface TemplateEditorProps {
  initialHtml: string;
  onSave: (html: string) => void;
  onCancel: () => void;
}

export default function TemplateEditor({ initialHtml, onSave, onCancel }: TemplateEditorProps) {
  const [html, setHtml] = useState(initialHtml);
  const [previewHtml, setPreviewHtml] = useState(initialHtml);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    setPreviewHtml(html);
  }, [html]);

  const handleSave = () => {
    onSave(html);
  };

  const insertTemplateVariable = (variable: string) => {
    const textarea = document.getElementById('template-editor') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newHtml = html.substring(0, start) + variable + html.substring(end);
      setHtml(newHtml);
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const commonVariables = [
    '{{topic}}',
    '{{newsletterFormat}}',
    '{{date}}',
    '{{introduction}}',
    '{{sections}}',
    '{{keyTakeaways}}',
    '{{conclusion}}',
    '{{unsubscribeUrl}}'
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Template Editor</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Save Template
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'edit' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Edit Template
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'preview' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex">
          {activeTab === 'edit' ? (
            <div className="flex-1 flex">
              {/* Variables Panel */}
              <div className="w-64 bg-gray-800 p-4 border-r border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Template Variables</h3>
                <div className="space-y-2">
                  {commonVariables.map((variable) => (
                    <button
                      key={variable}
                      onClick={() => insertTemplateVariable(variable)}
                      className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-sm transition-colors"
                    >
                      {variable}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">CSS Classes</h4>
                  <div className="space-y-1 text-xs text-gray-400">
                    <div>.container - Main container</div>
                    <div>.header - Email header</div>
                    <div>.content - Main content area</div>
                    <div>.footer - Email footer</div>
                    <div>.highlight - Highlighted sections</div>
                    <div>.button - Call-to-action buttons</div>
                  </div>
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-2">HTML Template</h3>
                  <p className="text-sm text-gray-400">Edit the HTML template below. Use the variables panel to insert dynamic content.</p>
                </div>
                <textarea
                  id="template-editor"
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="flex-1 p-4 bg-gray-800 text-green-400 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your HTML template here..."
                />
              </div>
            </div>
          ) : (
            /* Preview */
            <div className="flex-1 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
                <div 
                  className="p-4"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 