"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
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
                <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
                <p className="text-xl text-gray-300">
                  How we protect and handle your information
                </p>
              </div>

              {/* Content */}
              <div className="space-y-8 text-left">
                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                  <p className="text-gray-300 mb-4">
                    NewsletterAI is committed to protecting your privacy. We collect minimal information necessary to provide our service:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Email address (for newsletter delivery)</li>
                    <li>Topics of interest (for content curation)</li>
                    <li>Usage data (to improve our service)</li>
                  </ul>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
                  <p className="text-gray-300 mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Deliver personalized newsletters to your email</li>
                    <li>Curate content based on your interests</li>
                    <li>Improve our AI algorithms and service quality</li>
                    <li>Provide customer support when needed</li>
                  </ul>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                  <p className="text-gray-300 mb-4">
                    We implement industry-standard security measures to protect your information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Encrypted data transmission (HTTPS)</li>
                    <li>Secure email delivery through SendGrid</li>
                    <li>No storage of personal browsing history</li>
                    <li>Regular security audits and updates</li>
                  </ul>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
                  <p className="text-gray-300 mb-4">
                    We use trusted third-party services to deliver our newsletter:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li><strong>SendGrid:</strong> For email delivery (privacy policy: <a href="https://sendgrid.com/policies/privacy/" className="text-blue-400 hover:text-white" target="_blank" rel="noopener noreferrer">sendgrid.com/policies/privacy</a>)</li>
                    <li><strong>Reddit API:</strong> For content aggregation (privacy policy: <a href="https://www.redditinc.com/policies/privacy-policy" className="text-blue-400 hover:text-white" target="_blank" rel="noopener noreferrer">redditinc.com/policies/privacy-policy</a>)</li>
                    <li><strong>OpenAI API:</strong> For AI content generation (privacy policy: <a href="https://openai.com/privacy" className="text-blue-400 hover:text-white" target="_blank" rel="noopener noreferrer">openai.com/privacy</a>)</li>
                  </ul>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
                  <p className="text-gray-300 mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Unsubscribe from newsletters at any time</li>
                    <li>Request deletion of your email address</li>
                    <li>Update your preferences or topics of interest</li>
                    <li>Contact us with privacy concerns</li>
                  </ul>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
                  <p className="text-gray-300 mb-4">
                    We use minimal cookies for essential website functionality. We do not use tracking cookies or analytics that identify individual users.
                  </p>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Children&apos;s Privacy</h2>
                  <p className="text-gray-300 mb-4">
                    NewsletterAI is not intended for children under 13. We do not knowingly collect personal information from children under 13.
                  </p>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
                  <p className="text-gray-300 mb-4">
                    We may update this privacy policy from time to time. We will notify users of any material changes via email or through our website.
                  </p>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                  <p className="text-gray-300 mb-4">
                    If you have any questions about this privacy policy or our data practices, please contact us:
                  </p>
                  <div className="space-y-2 text-gray-300">
                    <p>Email: <a href="mailto:rolf@juvosolutions.co" className="text-blue-400 hover:text-white">rolf@juvosolutions.co</a></p>
                    <p>Contact Form: <Link href="/contact" className="text-blue-400 hover:text-white">Contact Us</Link></p>
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