import React from 'react';
import { Route, CloudLightning, ShieldCheck } from 'lucide-react';

const WhyRideSync = () => {
  const reasons = [
    {
      icon: <Route className="w-8 h-8 text-[var(--color-primary)]" />,
      title: 'AI-Optimized Routing',
      description: 'Our advanced algorithms analyze terrain, traffic, and your riding style to curate the perfect route, whether you want scenic curves or the fastest path.'
    },
    {
      icon: <CloudLightning className="w-8 h-8 text-[var(--color-primary)]" />,
      title: 'Hyper-Local Weather',
      description: 'Stay ahead of the storm. RideSync integrates real-time meteorological data to route you around bad weather and keep you riding in the sunshine.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[var(--color-primary)]" />,
      title: 'Ride with Confidence',
      description: 'With offline maps, SOS integration, and group tracking, you can explore the most remote trails with absolute peace of mind.'
    }
  ];

  return (
    <section id="why-ridesync" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[var(--color-primary)] font-semibold tracking-wide uppercase text-sm mb-3">Why RideSync AI</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-[var(--color-secondary)] mb-6">
            Engineered for the Open Road
          </h3>
          <p className="text-lg text-gray-600">
            We combined automotive-grade navigation with advanced AI to create a tool that understands what motorcyclists truly need. Less planning, more riding.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-[var(--color-background)] rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:border-[var(--color-primary)]/30 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {reason.icon}
              </div>
              <h4 className="text-xl font-bold text-[var(--color-secondary)] mb-3">{reason.title}</h4>
              <p className="text-gray-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyRideSync;
