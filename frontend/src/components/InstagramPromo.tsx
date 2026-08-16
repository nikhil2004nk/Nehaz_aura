"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const reelIds = [
  "Db3DGg2TuHB", // Reel 1
  "DbTEnlzzHdK", // Reel 2
  "DavAtVzzEMi", // Reel 3
  "Dbw-irLOSBY"  // Reel 4
];

export default function InstagramPromo() {
  const [activeReel, setActiveReel] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Auto-rotate the reels every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReel((prev) => (prev + 1) % reelIds.length);
    }, 5000); // 5 seconds per reel

    return () => clearInterval(interval);
  }, []);

  // Play only the active video, pause the rest to save resources and fix playback issues
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (vid) {
        if (idx === activeReel) {
          vid.play().catch(e => console.log("Autoplay prevented:", e));
        } else {
          vid.pause();
        }
      }
    });
  }, [activeReel]);

  return (
    <section className="py-10 md:py-12 bg-background overflow-hidden relative border-t border-beige-dark/20">
      {/* Abstract background blobs for a premium feel */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-beige-light rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#f0ebd8] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center justify-between">
          
          {/* Left Side: Copy & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] text-foreground/50 uppercase mb-3 block">
              Join the Community
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6 leading-tight">
              Connect with <span className="italic text-foreground/70">Nehaz Aura</span>
            </h2>
            <p className="text-foreground/70 font-light mb-10 max-w-lg leading-relaxed text-sm">
              Discover a vibrant community of yogis. From daily inspiration and mini-flows to behind-the-scenes moments, my Instagram is where our journey continues off the mat. Join over 10K+ followers tuning in every day.
            </p>
            
            <div className="flex gap-8 mb-10">
              <div>
                <span className="block text-3xl font-serif text-foreground mb-1">10K+</span>
                <span className="text-[9px] uppercase tracking-widest text-foreground/50 font-medium">Followers</span>
              </div>
              <div className="w-[1px] bg-foreground/10"></div>
              <div>
                <span className="block text-3xl font-serif text-foreground mb-1">1M+</span>
                <span className="text-[9px] uppercase tracking-widest text-foreground/50 font-medium">Video Views</span>
              </div>
            </div>
            
            <a 
              href="https://www.instagram.com/nehaz_aaura/" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 rounded-full bg-foreground text-background text-xs uppercase tracking-widest font-medium hover:bg-foreground/80 transition-all duration-300 shadow-lg shadow-foreground/10 hover:shadow-xl hover:-translate-y-1"
            >
              Follow on Instagram
            </a>
          </motion.div>

          {/* Right Side: Embedded Auto-Rotating Reels */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 flex justify-center lg:justify-end"
          >
            <div className="relative p-2 bg-white/40 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/60">
              <div className="relative overflow-hidden rounded-[2rem] bg-black w-[260px] h-[460px] sm:w-[280px] sm:h-[500px]">
                
                {/* Auto-playing MP4s */}
                {[1, 2, 3, 4].map((num, index) => (
                  <div 
                    key={num}
                    className={`absolute inset-0 transition-opacity duration-1000 ${activeReel === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                  >
                    <video 
                      ref={el => { videoRefs.current[index] = el; }}
                      src={`/reels/reel${num}.mp4`}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>
                ))}
                
                {/* Insta Reel UI Overlay - Clickable to promote Insta */}
                <a 
                  href="https://www.instagram.com/nehaz_aaura/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-20 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 via-transparent to-transparent group cursor-pointer hover:from-black/70 transition-all duration-300"
                >
                  {/* Right Action Bar */}
                  <div className="absolute right-4 bottom-12 flex flex-col items-center gap-5 text-white">
                    <div className="flex flex-col items-center gap-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="drop-shadow-md"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      <span className="text-[10px] font-medium drop-shadow-md">12K</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="drop-shadow-md"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      <span className="text-[10px] font-medium drop-shadow-md">342</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="drop-shadow-md"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                      <span className="text-[10px] font-medium drop-shadow-md">Share</span>
                    </div>
                    <div className="mt-2 w-6 h-6 rounded-md bg-white/20 border border-white/50 flex items-center justify-center backdrop-blur-sm shadow-md">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                    </div>
                  </div>

                  {/* Bottom Left User Info */}
                  <div className="pr-16 text-white drop-shadow-md group-hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-white/30 border border-white/50 flex items-center justify-center backdrop-blur-sm overflow-hidden">
                        <span className="text-xs font-serif font-bold text-white">NA</span>
                      </div>
                      <span className="text-sm font-medium tracking-wide">nehazaura</span>
                      <span className="px-2 py-0.5 rounded border border-white/40 text-[9px] font-medium tracking-widest bg-white text-black ml-1 shadow-sm">Follow</span>
                    </div>
                    <p className="text-[11px] font-light leading-snug line-clamp-2 text-white/90 group-hover:text-white transition-colors duration-300">
                      Finding balance and flowing through the chaos. Unroll your mat and join the community. ✨🧘‍♀️
                    </p>
                  </div>
                </a>

                {/* Progress Indicators (Carousel specific) */}
                <div className="absolute top-4 left-0 right-0 z-20 flex justify-center gap-1.5 px-4 opacity-50">
                  {[1, 2, 3, 4].map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-0.5 rounded-full transition-all duration-500 ${activeReel === idx ? 'flex-1 bg-white shadow-sm' : 'flex-1 bg-white/40'}`}
                    />
                  ))}
                </div>

              </div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 -right-6 -bottom-6 w-32 h-32 bg-foreground/5 rounded-full blur-2xl"></div>
              <div className="absolute -z-10 -left-6 -top-6 w-32 h-32 bg-white/40 rounded-full blur-2xl"></div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
