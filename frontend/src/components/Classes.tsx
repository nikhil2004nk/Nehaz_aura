"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const classes = [
  {
    title: "Vinyasa Flow",
    description: "A dynamic practice that links movement with breath to build heat, strength, and flexibility.",
    level: "All Levels",
    duration: "60 mins"
  },
  {
    title: "Yin Yoga",
    description: "A slow-paced, meditative practice targeting deep connective tissues to improve mobility and quiet the mind.",
    level: "Beginner Friendly",
    duration: "45 mins"
  },
  {
    title: "Morning Awakening",
    description: "Start your day with gentle stretching and energizing sequences to set a positive tone for the day.",
    level: "All Levels",
    duration: "30 mins"
  },
  {
    title: "Core & Balance",
    description: "Focus on strengthening your center and finding stability through challenging standing postures.",
    level: "Intermediate",
    duration: "45 mins"
  },
  {
    title: "Restorative Nidra",
    description: "Experience profound relaxation through supported postures followed by guided yogic sleep.",
    level: "All Levels",
    duration: "75 mins"
  },
  {
    title: "Power Yoga",
    description: "A fitness-based approach to vinyasa style yoga, focusing on building strength and endurance.",
    level: "Advanced",
    duration: "60 mins"
  }
];

export default function Classes() {
  return (
    <section id="classes" className="py-10 md:py-12 bg-beige-light/40 relative border-t border-foreground/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
            Online <span className="italic text-foreground/70">Classes</span>
          </h2>
          <p className="text-foreground/60 text-sm max-w-xl mx-auto font-light leading-relaxed">
            Discover practices designed for every body and every schedule. Join live or practice on-demand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {classes.map((cls, idx) => {
            const num = String(idx + 1).padStart(2, '0');
            return (
              <motion.div
                key={cls.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
                className="group relative bg-background rounded-xl p-5 border border-foreground/5 hover:border-foreground/15 transition-all duration-300 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md"
              >
                {/* Subtle background number - Scaled down */}
                <div className="absolute -right-2 -top-4 text-[70px] md:text-[80px] font-serif font-bold text-foreground/[0.03] select-none pointer-events-none group-hover:text-foreground/[0.05] transition-colors duration-500">
                  {num}
                </div>

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg md:text-xl font-serif text-foreground pr-2 leading-tight">{cls.title}</h3>
                    <div className="w-5 h-5 rounded-full bg-foreground/5 flex items-center justify-center shrink-0 text-foreground/40 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                      <ArrowUpRight size={10} />
                    </div>
                  </div>
                  
                  <p className="text-foreground/60 text-[11px] md:text-xs font-light leading-snug mb-4 flex-1">
                    {cls.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-[9px] text-foreground/50 uppercase tracking-[0.2em] font-medium pt-3 border-t border-foreground/5 mt-auto">
                    <span>{cls.level}</span>
                    <span>{cls.duration}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
