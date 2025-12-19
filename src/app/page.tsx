'use client';

import type { NextPage } from 'next';
import { Fragment } from 'react';

const LogoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8 text-amber-400"
  >
    <path d="M12 2L1 9.07V14.93L12 22L23 14.93V9.07L12 2ZM12 4.44L19.53 9.75L12 15L4.47 9.75L12 4.44Z" />
  </svg>
);

/**
 * SVG icon for Telegram.
 */
const TelegramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M22 2L2 8.66L8.4 11.23L11.23 20.14L22 2Z" />
  </svg>
);

/**
 * SVG icon for Discord.
 */
const DiscordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M20.32 3.38C18.88 2.63 17.28 2 15.5 2C15.5 2 15.5 2 15.48 2C13.54 2 11.7 2.62 10.24 3.66C7.26 5.6 5.95 8.64 5.95 8.64C5.95 8.64 4.06 12.38 3.5 13.68C2.26 16.74 3.75 18.23 3.75 18.23C4.69 19.34 6.2 19.66 6.2 19.66L7.26 21.6C7.26 21.6 8.3 22 9.24 22C11.58 22 13.48 20.45 13.48 20.45C13.48 20.45 12.54 19.78 12 19.24C14.05 19.8 16.22 20 18.26 20C18.26 20 20.48 19.8 21.5 18.2C21.5 18.2 22.44 16.48 22.5 14.2C22.5 14.2 22.92 8.78 20.32 3.38ZM10.5 15.5C9.4 15.5 8.5 14.6 8.5 13.5C8.5 12.4 9.4 11.5 10.5 11.5C11.6 11.5 12.5 12.4 12.5 13.5C12.5 14.6 11.6 15.5 10.5 15.5ZM15.5 15.5C14.4 15.5 13.5 14.6 13.5 13.5C13.5 12.4 14.4 11.5 15.5 11.5C16.6 11.5 17.5 12.4 17.5 13.5C17.5 14.6 16.6 15.5 15.5 15.5Z" />
  </svg>
);

/**
 * SVG icon for Twitter (now X).
 */
const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// --- Main Page Component ---

const ComingSoonPage: NextPage = () => {
  return (
    // Main container
    // Uses flexbox to create a full-screen layout with a professional black background.
    // `justify-between` pushes the main content and footer to the vertical ends.
    <div className="bg-black text-gray-100 min-h-screen flex flex-col items-center justify-between font-sans p-6 sm:p-8">
      
      {/* This empty div acts as a spacer to help vertically center the main content, 
          balancing the space taken by the footer. */}
      <div />

      {/* Hero Section */}
      {/* This section contains the core messaging. */}
      {/* `items-center` and `text-center` ensure all content is horizontally centered. */}
      <main className="flex flex-col items-center text-center space-y-6 md:space-y-8 w-full max-w-4xl">
        
        {/* Logo Placeholder */}
        {/* <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center border-2 border-gray-800 mb-4">
          <LogoIcon />
        </div> */}

        {/* Headline */}
        {/* The main heading with a larger font size, bold weight, and responsive text sizes. */}
        {/* A specific word is highlighted with the new gold brand color for emphasis. */}
        {/* <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          The Future of  <span className="text-amber-400">Finance</span>.
        </h1> */}

        {/* Tagline */}
        {/* A short, catchy phrase supporting the headline, with a softer text color. */}
        {/* <p className="text-lg sm:text-xl text-gray-400 max-w-2xl">
          Seamlessly bridging traditional and decentralized finance.
        </p> */}

        {/* Short Description */}
        {/* Provides more context about the brand and the upcoming launch. */}
        {/* <p className="max-w-lg text-gray-300">
          Velovs is building a new generation of financial tools designed for speed, security, and accessibility. Join our waitlist to be the first to know when we launch.
        </p> */}

        {/* Email Subscription Form */}
        {/* A simple form to capture user interest, styled with the new theme. */}
        {/* <form className="w-full max-w-md mt-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="your.email@example.com"
              aria-label="Email address"
              className="flex-grow w-full px-4 py-3 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
              required
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-md transition-colors duration-300 whitespace-nowrap"
            >
              Notify Me
            </button>
          </div>
        </form> */}
      </main>

      {/* Footer Section */}
      {/* Contains social media links and copyright information, styled for the new theme. */}
      <footer className="w-full text-center text-gray-500">
        {/* <div className="flex items-center justify-center space-x-6">
          <a href="#" aria-label="Telegram" className="hover:text-amber-400 transition-colors duration-300">
            <TelegramIcon />
          </a>
          <a href="#" aria-label="Discord" className="hover:text-amber-400 transition-colors duration-300">
            <DiscordIcon />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-amber-400 transition-colors duration-300">
            <TwitterIcon />
          </a>
        </div> */}
        <p className="mt-4 text-sm">
          &copy; {new Date().getFullYear()} Velovs. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default ComingSoonPage;

