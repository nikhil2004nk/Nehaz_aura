"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Link from "next/link";

const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Hero() {
  const images = [
    "/hero/hero (1).jpg",
    "/hero/hero (2).jpg",
    "/hero/hero (3).jpg",
    "/hero/hero (4).jpg"
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const marqueeControls = useAnimation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  useEffect(() => {
    marqueeControls.set({ opacity: 0.6 });
    marqueeControls.start({ opacity: 0, transition: { duration: 2.5, delay: 0.5, ease: "easeOut" } });
  }, [currentIndex, marqueeControls]);

  return (
    <section id="home" className="relative min-h-[80vh] md:min-h-[85vh] pt-20 pb-8 overflow-hidden bg-background flex flex-col justify-center">
      {/* Decorative vertical text - hidden on small screens to prevent overflow */}
      <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 -rotate-180 hidden md:block" style={{ writingMode: 'vertical-rl' }}>
        <span className="text-[6vh] md:text-[10vh] lg:text-[12vh] font-serif text-beige-dark/20 uppercase leading-none select-none tracking-widest whitespace-nowrap">
          Elevate Your Aura
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col lg:flex-row items-center lg:items-end justify-between mt-4 md:mt-8">
        
        {/* Left Typography Block */}
        <div className="w-full lg:w-7/12 relative z-20 pb-6 lg:pb-0 mix-blend-difference pl-0 md:pl-10 lg:pl-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6"
          >
            <div className="h-[1px] w-8 md:w-12 bg-foreground"></div>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-medium text-foreground">Find Your Center</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[90px] font-serif text-foreground leading-[0.9] tracking-tighter mb-4 md:mb-6"
          >
            Breathe.<br />
            Stretch.<br />
            <span className="italic text-foreground/80">Transform.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xs md:max-w-sm lg:max-w-md text-sm md:text-base text-foreground/70 mb-6 md:mb-8 font-light leading-relaxed"
          >
            Join Nehaz Aura for personalized online yoga sessions designed to bring balance to your body and peace to your mind.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6"
          >
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
              className="group flex items-center gap-3 md:gap-4 cursor-pointer"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-foreground flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-background rounded-full"></div>
              </div>
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-foreground group-hover:text-foreground/70 transition-colors">Book a Session</span>
            </a>
          </motion.div>
        </div>

        {/* Right Asymmetrical Image Mask with Slideshow */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="w-full lg:w-5/12 h-[35vh] sm:h-[45vh] lg:h-[60vh] relative z-0 mt-6 lg:mt-0 group"
        >
          {/* Custom asymmetrical clip path for the image placeholder */}
          <div className="absolute inset-0 bg-beige-light overflow-hidden shadow-xl" style={{ borderRadius: '80px 16px 80px 16px' }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt="Nehaz Aura Yoga"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {/* Elegant gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none z-10"></div>
            
            {/* Massive Background Marquee that fades out */}
            <motion.div 
              initial={{ opacity: 0.6 }}
              animate={marqueeControls}
              className="absolute inset-0 z-10 flex items-center overflow-hidden pointer-events-none mix-blend-overlay"
            >
              <motion.div
                initial={{ x: "0%" }}
                animate={{ x: "-50%" }}
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                className="flex whitespace-nowrap"
              >
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className="text-[15vh] lg:text-[25vh] font-serif uppercase tracking-widest text-white/80 px-8 select-none">
                    NEHAZ AURA
                  </span>
                ))}
              </motion.div>
            </motion.div>
            
            {/* Floating Insta Branding Badge */}
            <a 
              href="https://www.instagram.com/nehaz_aaura/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 right-6 z-20 flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all shadow-lg overflow-hidden group/badge"
            >
              <InstagramIcon size={18} />
              <span className="text-sm font-medium tracking-wide">@nehaz_aaura</span>
              {/* Shine effect on transition */}
              <motion.div 
                key={currentIndex}
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
              ></motion.div>
            </a>

            {/* Abstract overlay elements */}
            <div className="absolute -bottom-10 -left-10 md:-bottom-16 md:-left-16 w-32 h-32 md:w-48 md:h-48 border border-white/30 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none z-10"></div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
