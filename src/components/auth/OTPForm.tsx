"use client";

import React, { useState, useRef, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import AuthCard from "./AuthCard";

const OTP_LENGTH = 6;
const RESEND_DELAY = 60;

const OTPFormContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(RESEND_DELAY);
  const urlMessage = searchParams.get("message") || "";
  const [customMessage, setCustomMessage] = useState("");
  const infoMessage = customMessage || urlMessage;
  const canResend = countdown <= 0;
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* countdown timer */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleResend = useCallback(() => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setCountdown(RESEND_DELAY);
    setError("");
    setCustomMessage("A new verification code has been sent.");
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 50);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError("");
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp]; next[index] = ""; setOtp(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!digits) return;
    const next = [...otp];
    digits.split("").forEach((d, i) => { next[i] = d; });
    setOtp(next);
    setError("");
    const focusIdx = Math.min(digits.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    // For demo purposes, any 6-digit code is accepted
    router.push("/reset-password");
  };

  const filled = otp.every(Boolean);
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <AuthCard
      title="Verify Your Email"
      subtitle="Enter the 6-digit code we sent to your email."
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

      <form className="flex flex-col gap-6" onSubmit={handleVerify}>
        {/* OTP Boxes */}
        <div className="flex gap-2.5 justify-center animate-fade-in-up" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`OTP digit ${i + 1}`}
              className={`w-12 h-14 text-center text-xl font-black rounded-xl border-2 bg-[#F8FAFC] text-[#16324F] transition-all duration-150 outline-none
                ${digit
                  ? "border-[#FF6B00] bg-[#FF6B00]/5 shadow-md shadow-[#FF6B00]/15"
                  : "border-gray-200 hover:border-gray-300 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/12"
                }`}
            />
          ))}
        </div>

        {/* Countdown */}
        <div className="text-center animate-fade-in-up delay-75">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#FF6B00] hover:text-[#e66000] transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Resend Code
            </button>
          ) : (
            <p className="text-sm text-gray-400">
              Resend code in{" "}
              <span className="font-bold text-[#16324F] tabular-nums">{fmt(countdown)}</span>
            </p>
          )}
        </div>

        {/* Verify button */}
        <button
          type="submit"
          disabled={!filled}
          className={`w-full h-12 font-bold rounded-xl text-sm tracking-wide transition-all duration-200 animate-fade-in-up delay-150
            ${filled
              ? "bg-[#FF6B00] hover:bg-[#e66000] text-white shadow-md shadow-[#FF6B00]/25 hover:shadow-lg hover:shadow-[#FF6B00]/35 hover:-translate-y-0.5"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          Verify & Continue →
        </button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#16324F] transition-colors animate-fade-in-up delay-225"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </form>
    </AuthCard>
  );
};

const OTPForm = () => {
  return (
    <Suspense fallback={<div className="text-center py-8 text-[#16324F] font-bold">Loading...</div>}>
      <OTPFormContent />
    </Suspense>
  );
};

export default OTPForm;
