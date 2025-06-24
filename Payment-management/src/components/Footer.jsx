import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-4 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left: Copyright */}
        <p className="text-sm text-center md:text-left">
          © 2025 UserApp. All rights reserved.
        </p>

        {/* Right: Footer Links */}
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="/privacy" className="hover:underline text-sm">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:underline text-sm">
            Terms of Service
          </a>
          <a href="/contact" className="hover:underline text-sm">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
