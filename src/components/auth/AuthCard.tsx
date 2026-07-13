import React from "react";
import Link from "next/link";
import { Map } from "lucide-react";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthCard = ({ children, title, subtitle }: AuthCardProps) => {
  return (
    <div className="w-full max-w-[440px] mx-auto animate-scale-in">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#FF6B00] flex items-center justify-center shadow-md shadow-[#FF6B00]/30 group-hover:scale-105 transition-transform">
            <Map className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-black text-lg text-[#16324F] tracking-tight">
            RideSync <span className="text-[#FF6B00]">AI</span>
          </span>
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_40px_rgba(22,50,79,0.10)] border border-gray-100/80 p-8 md:p-9">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-black text-[#16324F] tracking-tight mb-1.5">{title}</h1>
          <p className="text-sm text-gray-400 leading-relaxed">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthCard;
