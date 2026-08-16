"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-beige-dark/10 relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square rounded-full border border-foreground/5 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-foreground/60 mb-4 block">Still have questions?</span>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.1] tracking-tight mb-8">
            Connect via <span className="italic text-foreground/80">WhatsApp</span>
          </h2>
          
          <p className="text-sm md:text-base text-foreground/70 font-light max-w-lg mb-10">
            Whether you want to discuss your specific physical goals, or just want to say hi, feel free to drop a message directly.
          </p>
          
          <a
            href="https://wa.me/917304112069"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between bg-foreground text-background px-6 md:px-8 py-4 rounded-full min-w-[240px] md:min-w-[280px] hover:bg-foreground/90 hover:scale-105 transition-all duration-300 shadow-xl shadow-foreground/10"
          >
            <div className="flex items-center gap-3">
              {/* WhatsApp Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg>
              <span className="text-xs md:text-sm uppercase tracking-widest font-medium">Message Neha</span>
            </div>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
