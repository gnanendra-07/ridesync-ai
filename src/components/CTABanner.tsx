import React from 'react';
import { Download } from 'lucide-react';

const CTABanner = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-[var(--color-secondary)]">
      {/* Background accents */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Ready to Elevate Your Ride?
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Join thousands of riders already using RideSync AI to discover new roads and ride with confidence.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[#e66000] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-[var(--color-primary)]/30 hover:shadow-[var(--color-primary)]/50 transition-all hover:-translate-y-1">
            <Download className="w-5 h-5" />
            Get it on iOS
          </button>
          <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all hover:-translate-y-1">
            <Download className="w-5 h-5" />
            Get it on Android
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
