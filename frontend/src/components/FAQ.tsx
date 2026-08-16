"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Do I need prior yoga experience?",
    answer: "Not at all! My classes are designed to be accessible for all levels. Whether you're a complete beginner or an advanced practitioner, I provide modifications to ensure you get exactly what your body needs."
  },
  {
    question: "Is prenatal yoga safe for all trimesters?",
    answer: "Yes, but it's always best to consult your doctor first. I tailor prenatal sessions specifically to the trimester you are in, focusing on safe movements, pelvic floor strengthening, and breathing techniques to support you through pregnancy."
  },
  {
    question: "What equipment do I need for online sessions?",
    answer: "All you really need is a yoga mat and a quiet space with a stable internet connection. Optional props like yoga blocks, a strap, or a bolster can be helpful, but we can easily improvise with household items like books or pillows!"
  },
  {
    question: "What happens if I miss a scheduled class?",
    answer: "Life happens! If you are part of the Group Classes or Prenatal Special, you will have access to the session recordings for 7 days so you can practice on your own time. For 1-on-1 coaching, we ask for 24-hour notice to reschedule."
  },
  {
    question: "How do the online sessions work?",
    answer: "We use Zoom for all our live sessions. Once you book a session and complete the form, you will receive an email with the private meeting link and instructions on how to prepare for our time together."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10 md:py-12 bg-beige-light relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-2 md:mb-3"
          >
            <div className="h-[1px] w-6 md:w-8 bg-foreground/30"></div>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-foreground/60">FAQ</span>
            <div className="h-[1px] w-6 md:w-8 bg-foreground/30"></div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground leading-[1.1] tracking-tight mb-4"
          >
            Common <span className="italic text-foreground/70">inquiries.</span>
          </motion.h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-b border-foreground/10"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between py-4 md:py-5 text-left focus:outline-none group"
              >
                <span className="text-sm md:text-base font-serif text-foreground group-hover:text-foreground/70 transition-colors pr-4">
                  {faq.question}
                </span>
                <span className="ml-4 flex-shrink-0 relative w-4 h-4 flex items-center justify-center text-foreground/50">
                  <span className={`absolute w-3 h-[1px] bg-current transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}></span>
                  <span className={`absolute w-3 h-[1px] bg-current transition-transform duration-300 ${openIndex === index ? 'rotate-0' : 'rotate-90'}`}></span>
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 md:pb-6 text-foreground/70 font-light leading-relaxed pr-8 md:pr-12 text-[11px] md:text-xs max-w-2xl">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
