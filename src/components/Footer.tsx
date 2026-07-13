import React from 'react';
import Link from 'next/link';
import { Map, Share2, Globe, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Map className="h-8 w-8 text-[var(--color-primary)]" />
              <span className="font-bold text-xl tracking-tight text-white">
                RideSync <span className="text-[var(--color-primary)]">AI</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6">
              Plan Smarter. Ride Farther. Capture Every Journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                <Share2 className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Route Planning</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Weather Sync</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-white transition-colors">Support Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Community Forum</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Route Library</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} RideSync AI. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Built for riders, by riders.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
