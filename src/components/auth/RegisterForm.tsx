"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Phone, AtSign, AlertCircle } from "lucide-react";
import AuthCard from "./AuthCard";

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
    <label htmlFor={id} className="text-[13px] font-semibold text-[#16324F]/80">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className={`w-full h-12 ${icon ? "pl-10" : "pl-4"} ${rightSlot ? "pr-11" : "pr-4"} rounded-xl border border-gray-200 bg-[#F8FAFC] text-[#16324F] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/12 transition-all`}
      />
      {rightSlot && <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</span>}
    </div>
  </div>
);

const RegisterForm = () => {
  const router = useRouter();
  
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName) {
      setError("Full name is required.");
      return;
    }
    if (!username) {
      setError("Username is required.");
      return;
    }
    if (!email) {
      setError("Email address is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!mobile) {
      setError("Mobile number is required.");
      return;
    }
    // Simple phone verification (accepts optional leading +, then digits/spaces/hyphens)
    const phoneRegex = /^\+?[0-9\s\-]{8,15}$/;
    if (!phoneRegex.test(mobile)) {
      setError("Please enter a valid mobile number.");
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
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    // Success -> Redirect to OTP page
    router.push("/verify-otp");
  };

  return (
    <AuthCard
      title="Create Your Account"
      subtitle="Join 50,000+ adventure riders on RideSync AI."
    >
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-150 text-red-600 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleRegister}>
        {/* Row: Full Name + Username */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in-up">
          <Field 
            label="Full Name" 
            id="reg-name" 
            placeholder="Arjun Mehta" 
            icon={<User className="w-4 h-4" />} 
            autoComplete="name" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Field 
            label="Username" 
            id="reg-username" 
            placeholder="arjun.rides" 
            icon={<AtSign className="w-4 h-4" />} 
            autoComplete="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="animate-fade-in-up delay-75">
          <Field 
            label="Email Address" 
            id="reg-email" 
            type="email" 
            placeholder="rider@example.com" 
            icon={<Mail className="w-4 h-4" />} 
            autoComplete="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="animate-fade-in-up delay-150">
          <Field 
            label="Mobile Number" 
            id="reg-mobile" 
            type="tel" 
            placeholder="+91 98765 43210" 
            icon={<Phone className="w-4 h-4" />} 
            autoComplete="tel" 
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        <div className="animate-fade-in-up delay-225">
          <Field
            label="Password"
            id="reg-password"
            type={showPwd ? "text" : "password"}
            placeholder="Min. 8 characters"
            icon={<Lock className="w-4 h-4" />}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightSlot={
              <button type="button" onClick={() => setShowPwd(v => !v)} className="text-gray-400 hover:text-[#FF6B00] transition-colors" aria-label={showPwd ? "Hide" : "Show"}>
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        <div className="animate-fade-in-up delay-300">
          <Field
            label="Confirm Password"
            id="reg-confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat password"
            icon={<Lock className="w-4 h-4" />}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            rightSlot={
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="text-gray-400 hover:text-[#FF6B00] transition-colors" aria-label={showConfirm ? "Hide" : "Show"}>
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer animate-fade-in-up delay-375">
          <input 
            type="checkbox" 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded accent-[#FF6B00]" 
          />
          <span className="text-xs text-gray-400 leading-relaxed font-medium">
            I agree to the{" "}
            <Link href="#" className="text-[#FF6B00] font-bold hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="#" className="text-[#FF6B00] font-bold hover:underline">Privacy Policy</Link>
          </span>
        </label>

        <button
          type="submit"
          className="w-full h-12 bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold rounded-xl shadow-md shadow-[#FF6B00]/25 hover:shadow-lg hover:shadow-[#FF6B00]/35 transition-all duration-200 hover:-translate-y-0.5 text-sm tracking-wide animate-fade-in-up delay-375"
        >
          Create Adventure Account →
        </button>

        <p className="text-center text-sm text-gray-400 animate-fade-in-up delay-375">
          Already riding with us?{" "}
          <Link href="/login" className="font-bold text-[#FF6B00] hover:text-[#e66000] transition-colors">Sign In</Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default RegisterForm;
