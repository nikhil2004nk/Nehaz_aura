"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="philosophy" className="py-10 md:py-12 bg-background text-foreground relative overflow-hidden">
      {/* Huge background text */}
      <div className="absolute top-8 md:top-0 left-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none flex justify-center">
        <h2 className="text-[12vw] md:text-[18vw] lg:text-[20vw] font-serif whitespace-nowrap leading-none tracking-tighter"> PHILOSOPHY</h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 aspect-[4/5] sm:aspect-[3/4] bg-beige-light relative mx-auto w-full max-w-xs md:max-w-sm lg:max-w-none overflow-hidden"
            style={{ borderRadius: '2px 80px 2px 2px' }}
          >
            {/* Optional: Add one of the hero images or a specific about image here */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/hero (1).jpg"
              alt="Nehaz Aura Portrait"
              className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />

            {/* Overlapping small accent block - hidden on smallest screens to prevent clipping */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 bg-foreground p-3 sm:p-4 hidden xs:flex flex-col justify-end shadow-xl">
              <span className="text-background font-serif text-3xl sm:text-4xl leading-none">"</span>
              <p className="text-background text-[8px] sm:text-[10px] uppercase tracking-widest font-medium mt-1">Breathe In.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 lg:pl-10 mt-6 lg:mt-0"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-gray-500">The Journey</span>
              <div className="h-[1px] w-12 md:w-16 bg-gray-300"></div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-4 md:mb-6 leading-[1.1] tracking-tight">
              A return to the <br className="hidden sm:block" /><span className="italic text-gray-500">inner self.</span>
            </h2>

            <div className="space-y-3 md:space-y-4 text-foreground/70 font-light text-sm md:text-base leading-relaxed max-w-xl">
              <p>
                Yoga is more than just physical movement; it&apos;s an architectural reconstruction of your mindset. Through intentional breath and mindfulness, we create space where there was once tension.
              </p>
              <p>
                My practice is rooted in redefining accessibility. I believe in fostering a fiercely non-judgmental environment where you can explore your edge and discover your authentic flow.
              </p>
            </div>

            <div className="mt-8 md:mt-10 pt-4 md:pt-6 border-t border-gray-200">
              <p className="text-base sm:text-lg md:text-xl font-serif italic text-foreground/90">&quot;Movement is medicine for creating change in a person&apos;s physical, emotional, and mental states.&quot;</p>
              <p className="mt-2 md:mt-3 text-[10px] md:text-xs tracking-widest uppercase text-gray-400">— Nehaz Aura</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
