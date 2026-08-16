"use client";

import { motion } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800",
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-light text-foreground mb-3"
          >
            Aura <span className="italic font-serif">Gallery</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 font-light max-w-xl mx-auto text-sm md:text-base"
          >
            Glimpses of our practice, our community, and the serene moments in between.
          </motion.p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((src, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-background/5 h-64 flex items-center justify-center"
            >
              {/* This is a placeholder since we don't have actual images yet */}
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 bg-foreground/5 flex flex-col items-center justify-center">
                <span className="text-sm font-light text-foreground/40 tracking-widest uppercase">
                  Photo
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
