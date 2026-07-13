"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import AuthCard from "./AuthCard";

const PasswordField = ({
  label,
  id,
  placeholder,
  autoComplete,
  value,
  onChange,
}: {
  label: string;
  id: string;
  placeholder: string;
  autoComplete?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-[#16324F]/80">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          <Lock className="w-4 h-4" />
        </span>
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="w-full h-12 pl-10 pr-11 rounded-xl border border-gray-200 bg-[#F8FAFC] text-[#16324F] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/12 transition-all"
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6B00] transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

/* ─── strength meter ─────────────────────────────────────── */
const StrengthMeter = ({ password }: { password: string }) => {
  const strength = password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password)
    ? 4
    : password.length >= 8 && (/[A-Z]/.test(password) || /\d/.test(password))
    ? 3
    : password.length >= 6
    ? 2
    : password.length > 0
    ? 1
    : 0;

  const colors = ["bg-gray-200", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  if (!password) return null;
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < strength ? colors[strength] : "bg-gray-100"}`} />
        ))}
      </div>
      <p className={`text-[11px] font-bold ${["", "text-red-400", "text-yellow-500", "text-blue-500", "text-green-500"][strength]}`}>
        {labels[strength]}
      </p>
    </div>
  );
};

/* ═══ RESET PASSWORD FORM ══════════════════════════════════ */
const ResetPasswordForm = () => {
  const router = useRouter();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("New password is required.");
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

    // Success -> Redirect to Login page with a success message query param
    router.push("/login?message=Your+password+has+been+successfully+reset.+Please+log+in.");
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Choose a strong new password for your account."
    >
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-150 text-red-600 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
        <div className="animate-fade-in-up">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-password" className="text-[13px] font-semibold text-[#16324F]/80">New Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="w-4 h-4" /></span>
              <input
                id="new-password"
                type="password"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-[#F8FAFC] text-[#16324F] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/12 transition-all"
              />
            </div>
            <StrengthMeter password={password} />
          </div>
        </div>

        <div className="animate-fade-in-up delay-75">
          <PasswordField
            label="Confirm New Password"
            id="confirm-new-password"
            placeholder="Repeat new password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full h-12 bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold rounded-xl shadow-md shadow-[#FF6B00]/25 hover:shadow-lg hover:shadow-[#FF6B00]/35 transition-all duration-200 hover:-translate-y-0.5 text-sm tracking-wide animate-fade-in-up delay-150"
        >
          Set New Password →
        </button>
      </form>
    </AuthCard>
  );
};

export default ResetPasswordForm;
