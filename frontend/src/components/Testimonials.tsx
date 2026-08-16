"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote: "Neha's classes have completely transformed my mornings. The balance of strength and mindfulness she brings to every session is incredible.",
    name: "Sarah Jenkins",
    location: "New York",
  },
  {
    quote: "I was a complete beginner, but her patient and encouraging approach made me feel comfortable immediately. I can't imagine my week without these classes now.",
    name: "Michael Chen",
    location: "California",
  },
  {
    quote: "Truly a premium experience. The personalized attention even in a virtual format makes you feel like you're in a private studio.",
    name: "Emma Robertson",
    location: "London",
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="testimonials" className="py-10 md:py-12 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <div className="text-center mb-10 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-light text-foreground mb-4"
          >
            Stories of <span className="italic font-serif">Transformation</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-background p-10 rounded-3xl shadow-sm border border-beige-dark/10 relative"
            >
              <div className="text-4xl text-beige-dark absolute top-6 left-6 font-serif opacity-50">"</div>
              <p className="text-foreground/80 font-light italic leading-relaxed mb-8 relative z-10 pt-4">
                {t.quote}
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-beige-dark/40 mr-4"></div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{t.name}</h4>
                  <p className="text-xs text-foreground/50">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
