"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Philosophy", href: "philosophy" },
    { name: "Schedule", href: "schedule" },
    { name: "Offerings", href: "pricing" }
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // Calculate offset based on scroll-padding-top (3.5rem = 56px)
      const y = element.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top: y, behavior: 'smooth' });
      // Update URL without jumping
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-background/70 backdrop-blur-lg border-b border-foreground/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" onClick={(e) => { if(window.location.pathname==='/'){ handleScroll(e, 'home'); } }} className="text-xl font-serif text-foreground tracking-widest uppercase flex items-center gap-2 cursor-pointer">
              <div className="w-2 h-2 bg-foreground rounded-full"></div>
              NEHAZ AURA
            </a>
          </div>
          
          {/* Desktop Links */}
          <div className="hidden md:flex space-x-10 items-center">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={`#${item.href}`}
                onClick={(e) => handleScroll(e, item.href)}
                className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground/60 hover:text-foreground transition-colors duration-300 relative group cursor-pointer"
              >
                {item.name}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="hidden md:flex">
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, 'contact')}
              className="group flex items-center gap-3 px-6 py-2.5 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:shadow-lg hover:shadow-foreground/20 cursor-pointer"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Book Session</span>
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground focus:outline-none p-2"
            >
              {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-foreground/5 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col items-center space-y-4">
              {navLinks.map((item) => (
                <a
                  key={item.name}
                  href={`#${item.href}`}
                  onClick={(e) => handleScroll(e, item.href)}
                  className="text-[10px] uppercase tracking-[0.3em] font-medium text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
              <div className="w-8 h-[1px] bg-foreground/10 my-2"></div>
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, 'contact')}
                className="w-[80%] max-w-[200px] text-center px-4 py-2.5 rounded-full bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer"
              >
                Book a Session
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
