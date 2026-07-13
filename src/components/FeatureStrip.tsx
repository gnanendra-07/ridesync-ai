import React from "react";
import { Route, Cloud, Fuel, BookOpen, Package, Sparkles } from "lucide-react";

const FEATURES = [
  { icon: <Route className="w-4 h-4" />, label: "AI Route Planning" },
  { icon: <Cloud className="w-4 h-4" />, label: "Live Weather" },
  { icon: <Fuel className="w-4 h-4" />, label: "Fuel Estimation" },
  { icon: <BookOpen className="w-4 h-4" />, label: "Ride Journal" },
  { icon: <Package className="w-4 h-4" />, label: "Smart Packing" },
  { icon: <Sparkles className="w-4 h-4" />, label: "AI Assistant" },
];

const FeatureStrip = () => {
  return (
    <div className="bg-white border-y border-gray-100 py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap justify-center lg:justify-between gap-y-4 gap-x-6">
          {FEATURES.map((f, i) => (
            <React.Fragment key={f.label}>
              <div className="flex items-center gap-2.5 text-[#16324F]/70 hover:text-[#FF6B00] transition-colors duration-200 group cursor-default">
                <span className="text-[#FF6B00] group-hover:scale-110 transition-transform duration-200">
                  {f.icon}
                </span>
                <span className="text-sm font-semibold tracking-wide whitespace-nowrap">
                  {f.label}
                </span>
              </div>
              {i < FEATURES.length - 1 && (
                <span
                  className="hidden lg:block w-px h-5 bg-gray-200 self-center flex-shrink-0"
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureStrip;
