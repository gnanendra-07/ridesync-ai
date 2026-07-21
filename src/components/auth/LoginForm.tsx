"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Globe, Code, AlertCircle, CheckCircle2 } from "lucide-react";
import AuthCard from "./AuthCard";
import { useAuth } from "@/contexts/AuthContext";

/* ─── shared input ─────────────────────────────────────────── */
const Field = ({
  label,
  id,
  type = "text",
  placeholder,
  icon,
  rightSlot,
  autoComplete,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  icon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  autoComplete?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[13px] font-semibold text-[#16324F]/80">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className={`w-full h-12 ${icon ? "pl-10" : "pl-4"} ${rightSlot ? "pr-11" : "pr-4"} rounded-xl border border-gray-200 bg-[#F8FAFC] text-[#16324F] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/12 transition-all`}
      />
      {rightSlot && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {rightSlot}
        </span>
      )}
    </div>
  </div>
);



/* ─── social button ────────────────────────────────────────── */
const SocialBtn = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button
    type="button"
    className="flex-1 h-11 flex items-center justify-center gap-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-sm font-semibold text-[#16324F]/80 transition-all duration-150"
  >
    {icon}
    {label}
  </button>
);

/* ─── divider ──────────────────────────────────────────────── */
const Divider = ({ label = "or" }: { label?: string }) => (
  <div className="flex items-center gap-3 my-5">
    <span className="flex-1 h-px bg-gray-100" />
    <span className="text-xs font-medium text-gray-400">{label}</span>
    <span className="flex-1 h-px bg-gray-100" />
  </div>
);

/* ═══ LOGIN FORM CONTENT ═══════════════════════════════════ */
const LoginFormContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [error, setError] = useState("");
  const infoMessage = searchParams.get("message") || "";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");

    // Validate inputs
    if (!email) {
      setError("Email address is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    login(email, password)
      .then((userCredential) => {
        const u = userCredential.user;
        if (typeof window !== "undefined") {
          const parts = u.email?.split("@") || ["Rider"];
          const derivedName = u.displayName || parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
          localStorage.setItem("fullName", derivedName);
          localStorage.setItem("username", parts[0]);
        }
        router.push("/dashboard");
      })
      .catch((err) => {
        let message = "Invalid email or password. Please try again.";
        if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
          message = "Incorrect email or password.";
        } else if (err.code === "auth/too-many-requests") {
          message = "Too many failed login attempts. Please try again later.";
        }
        setError(message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <AuthCard
      title="Welcome back, Rider"
      subtitle="Sign in to continue your adventure."
    >
      {infoMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-150 text-green-700 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span>{infoMessage}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-150 text-red-600 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <div className="animate-fade-in-up">
          <Field
            label="Email Address"
            id="login-email"
            type="email"
            placeholder="rider@example.com"
            icon={<Mail className="w-4 h-4" />}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="animate-fade-in-up delay-75">
          <Field
            label="Password"
            id="login-password"
            type={showPwd ? "text" : "password"}
            placeholder="Enter your password"
            icon={<Lock className="w-4 h-4" />}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="text-gray-400 hover:text-[#FF6B00] transition-colors"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between animate-fade-in-up delay-150">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="remember-me"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded accent-[#FF6B00] border-gray-300"
            />
            <span className="text-sm text-gray-500 font-medium">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-[#FF6B00] hover:text-[#e66000] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <div className="animate-fade-in-up delay-225">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-12 bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold rounded-xl shadow-md shadow-[#FF6B00]/25 hover:shadow-lg hover:shadow-[#FF6B00]/35 transition-all duration-200 hover:-translate-y-0.5 text-sm tracking-wide flex items-center justify-center gap-2 ${
              isSubmitting ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Signing In..." : "Continue Journey →"}
          </button>
        </div>

        <Divider />

        {/* Social */}
        <div className="flex gap-3 animate-fade-in-up delay-300">
          <SocialBtn
            icon={<Globe className="w-4 h-4 text-[#EA4335]" />}
            label="Google"
          />
          <SocialBtn
            icon={<Code className="w-4 h-4 text-[#16324F]" />}
            label="GitHub"
          />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-2 animate-fade-in-up delay-375">
          No account yet?{" "}
          <Link href="/register" className="font-bold text-[#FF6B00] hover:text-[#e66000] transition-colors">
            Create Account
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

const LoginForm = () => {
  return (
    <Suspense fallback={<div className="text-center py-8 text-[#16324F] font-bold">Loading RideSync...</div>}>
      <LoginFormContent />
    </Suspense>
  );
};

export default LoginForm;
