import React from 'react';
import Image from 'next/image';
const Header = () => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="NewsletterAI Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">NewsletterAI</h1>
            <p className="text-xs text-gray-400">Personalized Insights</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors focus:text-blue-400 focus:underline underline-offset-4">Features</a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors focus:text-blue-400 focus:underline underline-offset-4">Pricing</a>
          <a href="#about" className="text-gray-300 hover:text-white transition-colors focus:text-blue-400 focus:underline underline-offset-4">About</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
