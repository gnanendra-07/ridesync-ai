import React from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

const AppPreview = () => {
  const highlights = [
    'Dynamic Curvy Route Generator',
    'Real-time Doppler Radar Overlay',
    'Lean Angle & Telemetry Tracking',
    'Group Comms Integration',
    'Gas Stop Anticipation'
  ];

  return (
    <section id="app-preview" className="py-24 bg-[var(--color-secondary)] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="lg:w-1/2">
            <h2 className="text-[var(--color-primary)] font-semibold tracking-wide uppercase text-sm mb-3">
              The Interface
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6">
              A Cockpit in Your Pocket
            </h3>
            <p className="text-lg text-gray-300 mb-8">
              We designed the interface with gloves in mind. High-contrast displays, large touch targets, and voice control mean you keep your eyes on the road and your hands on the bars.
            </p>
            
            <ul className="space-y-4 mb-10">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[var(--color-primary)] flex-shrink-0" />
                  <span className="text-gray-200 text-lg">{item}</span>
                </li>
              ))}
            </ul>
            
            <button className="bg-[var(--color-primary)] hover:bg-[#e66000] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[var(--color-primary)]/20 transition-all hover:-translate-y-1">
              Download the Beta
            </button>
          </div>

          {/* App Mockup */}
          <div className="lg:w-1/2 relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[var(--color-primary)]/20 blur-[100px] rounded-full z-0" />
            
            <div className="relative z-10 mx-auto w-full max-w-[320px] aspect-[9/19] rounded-[3rem] border-[8px] border-gray-900 bg-gray-900 shadow-2xl overflow-hidden shadow-black/50 ring-1 ring-white/10">
              <Image
                src="/premium_app_mockup_1783950123284.png"
                alt="RideSync AI App Interface"
                fill
                className="object-cover"
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default AppPreview;
