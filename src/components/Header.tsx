import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
const Header = () => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity focus:outline-none">
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
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
                      <Link href="/help" className="text-gray-300 hover:text-white transition-colors focus:outline-none">Help</Link>
                      <Link href="/contact" className="text-gray-300 hover:text-white transition-colors focus:outline-none">Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
