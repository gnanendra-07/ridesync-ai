import Image from "next/image";
import { Map, Navigation, Cloud, Sparkles } from "lucide-react";

const FEATURES = [
  { icon: <Navigation className="w-4 h-4" />, label: "AI Trip Planner" },
  { icon: <Cloud className="w-4 h-4" />, label: "Live Weather" },
  { icon: <Sparkles className="w-4 h-4" />, label: "Smart Routes" },
];

const AuthLeftPanel = () => {
  return (
    <div className="hidden lg:flex lg:w-[42%] relative flex-col overflow-hidden flex-shrink-0">
      {/* Photo */}
      <Image
        src="/auth_left_panel.png"
        alt="BMW R1250 GS Trophy Edition rider on Himalayan ghat road at sunrise"
        fill
        priority
        sizes="42vw"
        className="object-cover object-center"
        quality={90}
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(13,27,46,0.55) 0%, rgba(13,27,46,0.30) 50%, rgba(13,27,46,0.70) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FF6B00] flex items-center justify-center shadow-lg shadow-[#FF6B00]/40">
            <Map className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-black text-lg text-white tracking-tight">
            RideSync <span className="text-[#FF6B00]">AI</span>
          </span>
        </div>

        {/* Tagline */}
        <div>
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#FF6B00] mb-4">
            Your AI Riding Companion
          </p>
          <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.08] tracking-tight mb-5">
            Plan Smarter.
            <br />
            <span className="text-[#FF6B00]">Ride Farther.</span>
            <br />
            Capture Every
            <br />
            Journey.
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Join 50,000+ adventure riders who trust RideSync AI to plan every route, track every mile, and capture every memory.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-xs font-semibold"
              >
                <span className="text-[#FF6B00]">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLeftPanel;
