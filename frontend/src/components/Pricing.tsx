"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const pricingTiers = [
  {
    name: "Group Classes",
    price: "₹1,999",
    period: "Monthly",
    description: "Consistent practice within a supportive, guided community.",
    features: [
      "Access to all live group sessions",
      "Session recordings for 7 days",
      "Community group chat",
    ]
  },
  {
    name: "1-on-1 Coaching",
    price: "₹4,999",
    period: "Monthly",
    description: "Deep, personalized attention tailored to your exact physical and mental goals.",
    features: [
      "4 Personal live sessions",
      "Customized posture correction",
      "Direct WhatsApp access",
    ]
  },
  {
    name: "Prenatal Special",
    price: "₹6,999",
    period: "Monthly",
    description: "Safe, guided movement and breathwork for you and your baby.",
    features: [
      "Trimester-specific routines",
      "Pelvic floor strengthening",
      "Anxiety & breathwork management",
    ]
  }
];

export default function Pricing() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top: y, behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <section id="pricing" className="py-10 md:py-12 bg-background relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-12 border-b border-foreground/10 pb-4 md:pb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-2 md:mb-3">
              <div className="h-[1px] w-6 md:w-8 bg-foreground/30"></div>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-foreground/60">Investment</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground leading-[1.1] tracking-tight">
              Curated <span className="italic text-foreground/70">Offerings.</span>
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[11px] md:text-xs lg:text-sm text-foreground/60 max-w-[200px] md:max-w-xs text-left md:text-right mt-4 md:mt-0 font-light"
          >
            Select the path that best aligns with your journey towards inner peace and physical balance.
          </motion.p>
        </div>

        <div className="flex flex-col">
          {pricingTiers.map((tier, index) => (
            <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} key={index} className="group cursor-pointer">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative flex flex-col md:flex-row items-start md:items-center justify-between py-5 md:py-6 border-b border-foreground/10 hover:border-foreground/30 transition-colors duration-500"
              >
                {/* Background hover fill effect */}
                <div 
                  className={`absolute inset-0 bg-beige-light transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left -z-10 ${
                    hoveredIndex === index ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />

                <div className="flex flex-col md:w-4/12 pl-2 md:pl-4">
                  <h3 className="text-xl md:text-2xl font-serif text-foreground mb-1 group-hover:italic transition-all duration-300">
                    {tier.name}
                  </h3>
                  <p className="text-[11px] md:text-xs text-foreground/60 font-light leading-relaxed max-w-[250px] group-hover:text-foreground/90 transition-colors">
                    {tier.description}
                  </p>
                </div>

                <div className="hidden md:flex flex-col justify-center gap-1.5 md:w-5/12 px-2 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 delay-100">
                  {tier.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-2">
                      <div className="w-[3px] h-[3px] rounded-full bg-foreground/40"></div>
                      <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-foreground/70">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-3/12 mt-4 md:mt-0 pr-2 md:pr-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 md:mb-1">{tier.period}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl md:text-3xl font-serif tracking-tighter text-foreground">
                      {tier.price}
                    </span>
                    <div className="w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300 group-hover:scale-110">
                      <svg className="w-3 h-3 -rotate-45 group-hover:rotate-0 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
