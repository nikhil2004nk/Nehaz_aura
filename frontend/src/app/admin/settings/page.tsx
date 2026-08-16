"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Save, KeyRound, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  // Profile State
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", role: "" });
  const [originalProfile, setOriginalProfile] = useState({ name: "", email: "", phone: "", role: "" });
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Password State
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch Profile on Mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Assuming a global authFetch or similar is configured.
      // We will use standard fetch with credentials since cookies are used.
      const res = await fetch("http://localhost:3001/auth/me", {
        credentials: "include",
      });
      if (res.ok) {
        const { data } = await res.json();
        const userData = {
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "",
        };
        setProfile(userData);
        setOriginalProfile(userData);
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setIsFetchingProfile(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setProfileMessage(null);
  };

  const hasProfileChanged = () => {
    return (
      profile.name !== originalProfile.name ||
      profile.email !== originalProfile.email ||
      profile.phone !== originalProfile.phone
    );
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasProfileChanged()) return;

    setIsUpdatingProfile(true);
    setProfileMessage(null);
    try {
      const res = await fetch("http://localhost:3001/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profile),
      });
      
      const result = await res.json();
      if (res.ok) {
        setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
        setOriginalProfile(profile);
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error: any) {
      setProfileMessage({ type: 'error', text: error.message || "An error occurred" });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordMessage(null);
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordMessage(null);
    try {
      const res = await fetch("http://localhost:3001/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        }),
      });
      
      const result = await res.json();
      if (res.ok) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        throw new Error(result.message || "Failed to change password");
      }
    } catch (error: any) {
      setPasswordMessage({ type: 'error', text: error.message || "An error occurred" });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isFetchingProfile) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-foreground/30" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-foreground tracking-tight mb-1">Settings</h2>
        <p className="text-xs text-foreground/50 uppercase tracking-widest font-medium">Manage your profile and security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Section */}
        <section className="bg-background border border-foreground/5 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-foreground/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
              <User size={16} className="text-foreground/60" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Profile Details</h3>
              <p className="text-xs text-foreground/50">Update your personal information</p>
            </div>
          </div>
          
          <form onSubmit={updateProfile} className="p-6 flex-grow flex flex-col gap-5">
            {profileMessage && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                profileMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
              }`}>
                {profileMessage.type === 'success' ? <CheckCircle2 size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
                <span>{profileMessage.text}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full bg-foreground/[0.02] border border-foreground/10 text-foreground rounded-xl px-4 py-2.5 focus:outline-none focus:border-foreground/30 transition-colors text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full bg-foreground/[0.02] border border-foreground/10 text-foreground rounded-xl px-4 py-2.5 focus:outline-none focus:border-foreground/30 transition-colors text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                className="w-full bg-foreground/[0.02] border border-foreground/10 text-foreground rounded-xl px-4 py-2.5 focus:outline-none focus:border-foreground/30 transition-colors text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Role</label>
              <input
                type="text"
                value={profile.role}
                disabled
                className="w-full bg-foreground/[0.05] border border-foreground/10 text-foreground/50 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
              />
            </div>

            <div className="mt-auto pt-4 flex justify-end">
              <button
                type="submit"
                disabled={!hasProfileChanged() || isUpdatingProfile}
                className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Update Profile
              </button>
            </div>
          </form>
        </section>

        {/* Password Section */}
        <section className="bg-background border border-foreground/5 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-foreground/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
              <Lock size={16} className="text-foreground/60" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Security</h3>
              <p className="text-xs text-foreground/50">Change your password</p>
            </div>
          </div>
          
          <form onSubmit={updatePassword} className="p-6 flex-grow flex flex-col gap-5">
            {passwordMessage && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                passwordMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
              }`}>
                {passwordMessage.type === 'success' ? <CheckCircle2 size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Current Password</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                className="w-full bg-foreground/[0.02] border border-foreground/10 text-foreground rounded-xl px-4 py-2.5 focus:outline-none focus:border-foreground/30 transition-colors text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/50">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full bg-foreground/[0.02] border border-foreground/10 text-foreground rounded-xl px-4 py-2.5 focus:outline-none focus:border-foreground/30 transition-colors text-sm"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full bg-foreground/[0.02] border border-foreground/10 text-foreground rounded-xl px-4 py-2.5 focus:outline-none focus:border-foreground/30 transition-colors text-sm"
                required
                minLength={6}
              />
            </div>

            <div className="mt-auto pt-4 flex justify-end">
              <button
                type="submit"
                disabled={!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || isUpdatingPassword}
                className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingPassword ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
                Change Password
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
