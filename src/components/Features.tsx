import React from 'react';
import { Camera, Navigation2, CloudRain, Users, BatteryCharging, Trophy } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Navigation2 className="w-6 h-6 text-[var(--color-primary)]" />,
      title: 'Dynamic Routing',
      description: 'Choose between scenic, fastest, or the most curvy roads. Our engine recalculates in milliseconds.'
    },
    {
      icon: <CloudRain className="w-6 h-6 text-[var(--color-primary)]" />,
      title: 'Doppler Radar',
      description: 'Live precipitation overlay directly on your route so you can ride around the rain.'
    },
    {
      icon: <Camera className="w-6 h-6 text-[var(--color-primary)]" />,
      title: 'Action Cam Sync',
      description: 'Automatically triggers your GoPro during the best sections of the ride using GPS and lean data.'
    },
    {
      icon: <Users className="w-6 h-6 text-[var(--color-primary)]" />,
      title: 'Pack Tracker',
      description: 'See your riding buddies on the map in real-time. No more losing the group at the lights.'
    },
    {
      icon: <BatteryCharging className="w-6 h-6 text-[var(--color-primary)]" />,
      title: 'EV Ready',
      description: 'Built-in support for electric motorcycles with intelligent charging stop integration.'
    },
    {
      icon: <Trophy className="w-6 h-6 text-[var(--color-primary)]" />,
      title: 'Ride Telemetry',
      description: 'Review your lean angles, acceleration, and braking zones after a track day or canyon run.'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-secondary)] mb-6">
            Everything You Need. <br />
            Nothing You Don't.
          </h2>
          <p className="text-lg text-gray-600">
            A comprehensive suite of tools designed specifically for the two-wheeled traveler.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-2xl bg-[var(--color-background)] border border-gray-100 hover:border-[var(--color-primary)]/40 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center mb-5 group-hover:bg-[var(--color-primary)]/10 transition-colors">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-[var(--color-secondary)] mb-2">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
