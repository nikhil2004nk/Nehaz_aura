"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, Phone, Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLoginForm() {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // EXTREMELY IMPORTANT for receiving HttpOnly cookies
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // NestJS ValidationPipe returns an array of error messages in data.message
        let errorMessage = "Failed to login";
        if (Array.isArray(data.message) && data.message.length > 0) {
          errorMessage = data.message[0]; // Show the first validation error
        } else if (data.message) {
          errorMessage = data.message;
        }
        throw new Error(errorMessage);
      }

      // Success - Redirect to dashboard
      // Note: We use window.location to force a hard reload so middleware picks up the new cookie
      window.location.href = "/admin";
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto bg-beige-light/40 rounded-2xl p-8 border border-foreground/5 shadow-sm"
    >
      <div className="text-center mb-8">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground/50 block mb-2">Secure Access</span>
        <h2 className="text-2xl font-serif text-foreground tracking-tight">
          Admin <span className="italic text-foreground/70">Login</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="phone" className="block text-[10px] uppercase tracking-widest text-foreground/60 mb-2">Phone Number</label>
          <div className="relative flex items-center">
            <Phone size={14} className="absolute left-4 text-foreground/40" />
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              maxLength={10}
              pattern="[0-9]{10}"
              title="Phone number must be exactly 10 digits"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-background border border-foreground/10 text-foreground text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-foreground/30 transition-colors"
              placeholder="9876543210"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-[10px] uppercase tracking-widest text-foreground/60 mb-2">Password</label>
          <div className="relative flex items-center">
            <Lock size={14} className="absolute left-4 text-foreground/40" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              required
              minLength={6}
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-background border border-foreground/10 text-foreground text-sm rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:border-foreground/30 transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-foreground/40 hover:text-foreground transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex justify-center items-center gap-3 px-8 py-3 rounded-xl bg-foreground text-background text-xs font-medium uppercase tracking-[0.1em] hover:bg-foreground/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Authenticating..." : "Login to Dashboard"}
            {!isSubmitting && <ArrowRight size={14} />}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
