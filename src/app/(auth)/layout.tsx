import type { Metadata } from "next";
import AuthLeftPanel from "@/components/auth/AuthLeftPanel";

export const metadata: Metadata = {
  title: "RideSync AI | Authentication",
  description: "Sign in or create your RideSync AI account.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Left cinematic panel – hidden on mobile */}
      <AuthLeftPanel />

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-5 py-12 overflow-y-auto">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
