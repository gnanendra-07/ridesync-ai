"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, SendHorizonal, AlertCircle } from "lucide-react";
import AuthCard from "./AuthCard";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");

    if (!email) {
      setError("Email address is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    resetPassword(email)
      .then(() => {
        router.push("/login?message=Password+reset+email+sent+successfully.");
      })
      .catch((err) => {
        let message = "Failed to send password reset email. Please check your address.";
        if (err.code === "auth/user-not-found") {
          message = "No user found with this email address.";
        }
        setError(message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <AuthCard
      title="Forgot Password?"
      subtitle="Enter your email and we'll send an OTP to verify."
    >
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-150 text-red-600 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form className="flex flex-col gap-5" onSubmit={handleForgotPassword}>
        <div className="animate-fade-in-up">
          <label htmlFor="forgot-email" className="text-[13px] font-semibold text-[#16324F]/80 block mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              id="forgot-email"
              type="email"
              placeholder="rider@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-[#F8FAFC] text-[#16324F] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/12 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full h-12 bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold rounded-xl shadow-md shadow-[#FF6B00]/25 hover:shadow-lg hover:shadow-[#FF6B00]/35 transition-all duration-200 hover:-translate-y-0.5 text-sm tracking-wide flex items-center justify-center gap-2 animate-fade-in-up delay-75 ${
            isSubmitting ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          <SendHorizonal className="w-4 h-4" />
          {isSubmitting ? "Sending Reset Email..." : "Send Reset Email"}
        </button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#16324F] transition-colors animate-fade-in-up delay-150"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </form>
    </AuthCard>
  );
};

export default ForgotPasswordForm;
