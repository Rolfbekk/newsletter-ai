"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const subjectDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  const SUBJECT_OPTIONS = [
    {
      category: "General",
      options: [
        { value: "General Inquiry", label: "General Inquiry", description: "General questions about NewsletterAI" },
        { value: "Feedback", label: "Feedback", description: "Share your thoughts and suggestions" }
      ]
    },
    {
      category: "Support",
      options: [
        { value: "Technical Support", label: "Technical Support", description: "Help with technical issues" },
        { value: "Bug Report", label: "Bug Report", description: "Report a bug or problem" }
      ]
    },
    {
      category: "Features",
      options: [
        { value: "Feature Request", label: "Feature Request", description: "Suggest new features" },
        { value: "Partnership", label: "Partnership", description: "Business partnership opportunities" }
      ]
    },
    {
      category: "Other",
      options: [
        { value: "Other", label: "Other", description: "Any other inquiries" }
      ]
    }
  ];

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        subjectDropdownRef.current && 
        !subjectDropdownRef.current.contains(event.target as Node) &&
        dropdownButtonRef.current && 
        !dropdownButtonRef.current.contains(event.target as Node)
      ) {
        setShowSubjectDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectSelect = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subject
    }));
    setShowSubjectDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
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
              <div className="text-center space-y-10 max-w-2xl mx-auto">
                <div className="glass border-subtle rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">Message Sent!</h1>
                  <p className="text-gray-300 mb-6">
                    Thank you for contacting us. We&apos;ll get back to you as soon as possible.
                  </p>
                  <Link 
                    href="/" 
                    className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
                <p className="text-xl text-gray-300">
                  Have questions or feedback? We&apos;d love to hear from you.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-gray-400"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-gray-400"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                        Subject *
                      </label>
                      <div className="relative">
                        <div className="flex">
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            readOnly
                            placeholder="Select a subject"
                            className="flex-1 px-4 py-3 bg-black/60 border border-white/20 rounded-l-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-gray-400 transition-all focus-ring hover:border-white/30 cursor-pointer"
                            onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                          />
                          <button
                            ref={dropdownButtonRef}
                            type="button"
                            onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                            className="px-3 py-3 bg-black/60 border border-l-0 border-white/20 hover:bg-black/80 hover:border-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-r-lg"
                          >
                            <svg 
                              className={`w-5 h-5 text-white transition-transform duration-200 ${showSubjectDropdown ? 'rotate-180' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Subject Dropdown */}
                        {showSubjectDropdown && (
                          <div ref={subjectDropdownRef} className="absolute top-full left-0 right-0 glass border-subtle shadow-2xl z-10 mt-1 max-h-80 overflow-y-auto animate-fade-in">
                            <div className="p-2">
                              {SUBJECT_OPTIONS.map((category) => (
                                <div key={category.category} className="mb-3">
                                  <div className="text-xs text-gray-400 font-medium px-2 mb-1">{category.category}</div>
                                  {category.options.map((option) => (
                                    <button
                                      key={option.value}
                                      onClick={() => handleSubjectSelect(option.value)}
                                      className="w-full text-left px-2 py-2 hover:bg-white/10 rounded text-sm text-white hover:text-white transition-colors"
                                    >
                                      <div className="font-medium">{option.label}</div>
                                      <div className="text-xs text-gray-400">{option.description}</div>
                                    </button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-gray-400 resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    {error && (
                      <div className="bg-red-900/80 border border-red-400 rounded-lg p-3 text-red-100">
                        <p className="text-sm">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                </div>

                {/* Contact Information */}
                <div className="space-y-8">
                  <div className="glass border-subtle rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Get in touch</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                          <p className="text-gray-300">rolf@juvosolutions.co</p>
                          <p className="text-sm text-gray-400">We typically respond within 24 hours</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">Response Time</h3>
                          <p className="text-gray-300">Within 24 hours</p>
                          <p className="text-sm text-gray-400">Monday - Friday, 9 AM - 6 PM EST</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">FAQ</h3>
                          <p className="text-gray-300">Check our help center first</p>
                          <Link href="/help" className="text-sm text-blue-400 hover:text-white transition-colors">
                            Visit Help Center →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass border-subtle rounded-xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4">What we can help with</h3>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Technical support and troubleshooting</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Feature requests and suggestions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Bug reports and issues</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>General questions about NewsletterAI</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Partnership and collaboration opportunities</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Back to Home */}
              <div className="mt-8 text-center">
                <Link 
                  href="/" 
                  className="inline-flex items-center text-blue-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 