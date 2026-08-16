"use client";

import { motion } from "framer-motion";
import { Leaf, Briefcase, Heart, Sparkles } from "lucide-react";

const audiences = [
  {
    icon: <Leaf size={24} className="text-foreground/80" />,
    title: "The Curious Beginner",
    description: "You've never stepped on a mat before and want a safe, non-judgmental space to learn the foundations.",
  },
  {
    icon: <Briefcase size={24} className="text-foreground/80" />,
    title: "The Busy Professional",
    description: "You spend hours at a desk and need to release physical tension and find mental clarity in a short time.",
  },
  {
    icon: <Heart size={24} className="text-foreground/80" />,
    title: "The Mobility Seeker",
    description: "You are an athlete or fitness enthusiast looking to improve flexibility, balance, and prevent injuries.",
  },
  {
    icon: <Sparkles size={24} className="text-foreground/80" />,
    title: "The Spiritual Explorer",
    description: "You want to move beyond physical exercise and use breathwork to connect deeply with your inner self.",
  }
];

export default function WhoIsThisFor() {
  return (
    <section id="who-is-this-for" className="py-10 md:py-12 bg-beige-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/3"
          >
            <span className="text-xs md:text-sm font-medium tracking-widest text-foreground/50 uppercase mb-3 block">
              Find Your Place
            </span>
            <h2 className="text-3xl lg:text-4xl font-light text-foreground mb-4 md:mb-6 leading-tight">
              Is <span className="italic font-serif">Nehaz Aura</span> for you?
            </h2>
            <p className="text-foreground/70 font-light leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
              Whether you are looking to touch your toes for the first time, or trying to find a moment of absolute stillness in a chaotic world, there is a space carved out just for you here.
            </p>
            <div className="w-20 h-[1px] bg-foreground/20"></div>
          </motion.div>

          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {audiences.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-8 rounded-3xl bg-background border border-beige-dark/20 hover:border-foreground/20 transition-all duration-300 hover:shadow-xl hover:shadow-beige-dark/20 relative overflow-hidden"
              >
                {/* Decorative background circle that expands on hover */}
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-beige-light rounded-full transition-transform duration-500 group-hover:scale-[3] opacity-50 z-0"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-beige-light flex items-center justify-center mb-6 group-hover:bg-background transition-colors duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-foreground/70 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
