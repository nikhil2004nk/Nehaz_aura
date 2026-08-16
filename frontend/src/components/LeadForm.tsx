import { environment } from '../config/environment';
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";
import CustomSelect from "./CustomSelect";

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    time: "",
    state: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setBackendError(null); // Clear error on typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBackendError(null);
    
    try {
      const response = await fetch(`${environment.apiUrl}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message) {
          // If message is an array of class-validator errors, join them
          const msg = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
          throw new Error(msg);
        }
        throw new Error("Failed to submit form");
      }

      setIsSuccess(true);
      setFormData({ name: "", phone: "", age: "", time: "", state: "" });
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setBackendError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-10 md:py-12 bg-background relative border-t border-foreground/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground/50 block mb-2">Get in Touch</span>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground tracking-tight">
            Begin your <span className="italic text-foreground/70">Journey</span>
          </h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-beige-light/40 rounded-2xl p-6 md:p-10 border border-foreground/5 shadow-sm relative"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-[10px] uppercase tracking-widest text-foreground/60 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-background border border-foreground/10 text-foreground text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-foreground/30 transition-colors"
                  placeholder="Jane Doe"
                />
              </div>
              
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-[10px] uppercase tracking-widest text-foreground/60 mb-2">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  pattern="[0-9]{10}"
                  title="Phone number must be exactly 10 digits"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-background border border-foreground/10 text-foreground text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-foreground/30 transition-colors"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-[10px] uppercase tracking-widest text-foreground/60 mb-2">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="16"
                  max="99"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full bg-background border border-foreground/10 text-foreground text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-foreground/30 transition-colors"
                  placeholder="25"
                />
              </div>
              
              {/* State */}
              <div className="relative z-[60]">
                <label htmlFor="state" className="block text-[10px] uppercase tracking-widest text-foreground/60 mb-2">State / Location</label>
                <CustomSelect
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange as any}
                  placeholder="Select a state..."
                  showSearch={true}
                  options={[
                    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
                    { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
                    { value: "Assam", label: "Assam" },
                    { value: "Bihar", label: "Bihar" },
                    { value: "Chhattisgarh", label: "Chhattisgarh" },
                    { value: "Goa", label: "Goa" },
                    { value: "Gujarat", label: "Gujarat" },
                    { value: "Haryana", label: "Haryana" },
                    { value: "Himachal Pradesh", label: "Himachal Pradesh" },
                    { value: "Jharkhand", label: "Jharkhand" },
                    { value: "Karnataka", label: "Karnataka" },
                    { value: "Kerala", label: "Kerala" },
                    { value: "Madhya Pradesh", label: "Madhya Pradesh" },
                    { value: "Maharashtra", label: "Maharashtra" },
                    { value: "Manipur", label: "Manipur" },
                    { value: "Meghalaya", label: "Meghalaya" },
                    { value: "Mizoram", label: "Mizoram" },
                    { value: "Nagaland", label: "Nagaland" },
                    { value: "Odisha", label: "Odisha" },
                    { value: "Punjab", label: "Punjab" },
                    { value: "Rajasthan", label: "Rajasthan" },
                    { value: "Sikkim", label: "Sikkim" },
                    { value: "Tamil Nadu", label: "Tamil Nadu" },
                    { value: "Telangana", label: "Telangana" },
                    { value: "Tripura", label: "Tripura" },
                    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
                    { value: "Uttarakhand", label: "Uttarakhand" },
                    { value: "West Bengal", label: "West Bengal" },
                    { value: "Andaman and Nicobar Islands", label: "Andaman and Nicobar Islands" },
                    { value: "Chandigarh", label: "Chandigarh" },
                    { value: "Dadra and Nagar Haveli and Daman and Diu", label: "Dadra and Nagar Haveli and Daman and Diu" },
                    { value: "Delhi", label: "Delhi" },
                    { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
                    { value: "Ladakh", label: "Ladakh" },
                    { value: "Lakshadweep", label: "Lakshadweep" },
                    { value: "Puducherry", label: "Puducherry" },
                  ]}
                />
              </div>
            </div>
            
            {/* Select Time */}
            <div className="relative z-[50]">
              <label htmlFor="time" className="block text-[10px] uppercase tracking-widest text-foreground/60 mb-2">
                Preferred Practice Time
              </label>
              <CustomSelect
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange as any}
                placeholder="Select a time..."
                options={[
                  { value: "morning", label: "Morning (6AM - 10AM)" },
                  { value: "afternoon", label: "Afternoon (12PM - 4PM)" },
                  { value: "evening", label: "Evening (5PM - 9PM)" },
                ]}
              />
            </div>

            {/* Error Message */}
            {backendError && (
              <div className="flex items-start gap-3 bg-red-50 text-red-600 p-4 rounded-xl text-sm mt-4 border border-red-100">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{backendError}</p>
              </div>
            )}

            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-foreground text-background text-xs font-medium uppercase tracking-[0.1em] hover:bg-foreground/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Requesting..." : "Request Consultation"}
                {!isSubmitting && <ArrowRight size={14} />}
              </button>
            </div>

          </form>
          
          <AnimatePresence>
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-background/95 backdrop-blur-sm z-[100] rounded-2xl flex flex-col items-center justify-center p-8 text-center border border-foreground/10"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 className="text-2xl font-serif text-foreground mb-3">Request Received</h3>
                <p className="text-foreground/60 text-sm max-w-sm mb-8">
                  Thank you for reaching out. Neha will review your details and contact you shortly to schedule your consultation.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2 rounded-full border border-foreground/10 text-xs font-medium uppercase tracking-widest hover:bg-foreground/5 transition-colors"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
