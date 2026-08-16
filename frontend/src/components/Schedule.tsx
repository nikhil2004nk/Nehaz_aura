"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const scheduleData = [
  { day: "Monday", classes: [
    { time: "07:00 AM", name: "Awakening Flow", duration: "45m" },
    { time: "06:00 PM", name: "Vinyasa", duration: "60m" }
  ]},
  { day: "Tuesday", classes: [
    { time: "08:00 AM", name: "Core & Balance", duration: "45m" },
    { time: "07:30 PM", name: "Yin & Nidra", duration: "75m" }
  ]},
  { day: "Wednesday", classes: [
    { time: "07:00 AM", name: "Morning Ritual", duration: "45m" },
    { time: "06:00 PM", name: "Power Vinyasa", duration: "60m" }
  ]},
  { day: "Thursday", classes: [
    { time: "08:00 AM", name: "Gentle Hatha", duration: "60m" }
  ]},
  { day: "Friday", classes: [
    { time: "07:00 AM", name: "Fluid Flow", duration: "45m" },
    { time: "05:00 PM", name: "Wind Down", duration: "60m" }
  ]},
  { day: "Saturday", classes: [
    { time: "09:00 AM", name: "Sweat & Stretch", duration: "75m" }
  ]},
];

export default function Schedule() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  return (
    <section id="schedule" className="py-10 md:py-12 relative overflow-hidden bg-beige-light">
      
      {/* Soft animated background elements for glassmorphism to pop */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f0ebd8] rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8 md:mb-12 flex flex-col items-center text-center">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-foreground/50 block mb-2">Live Classes</span>
        <h2 className="text-3xl md:text-4xl font-serif text-foreground leading-none tracking-tight">
          Weekly <span className="italic text-foreground/60">Schedule</span>
        </h2>
      </div>

      {/* Tiny Glassmorphism Horizontal Slider */}
      <div className="relative z-10 pl-4 sm:pl-6 lg:pl-8 xl:pl-[calc((100vw-1280px)/2+2rem)] pr-4">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-12 pt-4 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {scheduleData.map((dayPlan, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="snap-center shrink-0 w-[240px] sm:w-[260px] h-[300px] bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-5 flex flex-col relative group shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Day Header */}
              <div className="border-b border-foreground/10 pb-3 mb-4">
                <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-foreground/40 block">Day 0{idx + 1}</span>
                <h3 className="text-2xl font-serif text-foreground">{dayPlan.day}</h3>
              </div>
              
              {/* Classes List */}
              <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide pr-1">
                {dayPlan.classes.map((cls, cIdx) => (
                  <div key={cIdx} className="group/cls">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-serif text-lg text-foreground/80 leading-none">{cls.time.split(" ")[0]}</span>
                      <span className="text-[9px] font-medium tracking-widest uppercase text-foreground/40">{cls.time.split(" ")[1]}</span>
                    </div>
                    <h4 className="text-sm font-medium text-foreground mb-0.5 group-hover/cls:text-foreground/60 transition-colors">{cls.name}</h4>
                    <span className="text-[9px] uppercase tracking-widest text-foreground/40">{cls.duration}</span>
                  </div>
                ))}
              </div>
              
              {/* Hover Book Action (Subtle) */}
              <div className="mt-4 pt-3 border-t border-foreground/10 flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] uppercase tracking-widest font-medium text-foreground/60">Reserve Spot</span>
                <a 
                  href="#contact" 
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('contact');
                    if (element) {
                      const y = element.getBoundingClientRect().top + window.scrollY - 56;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                      window.history.pushState(null, '', '#contact');
                    }
                  }}
                  className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground hover:text-background flex items-center justify-center transition-colors cursor-pointer"
                >
                  <svg className="w-3 h-3 -rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
              
            </motion.div>
          ))}
          
          {/* Spacer */}
          <div className="shrink-0 w-4 sm:w-8"></div>
        </div>
      </div>
      
    </section>
  );
}
