import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-beige-dark/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-medium text-foreground mb-4 tracking-wide uppercase">NEHAZ AURA</h3>
            <p className="text-foreground/70 font-light text-sm max-w-xs leading-relaxed">
              Bringing balance, strength, and peace directly to you through personalized online yoga sessions.
            </p>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-6">Explore</h4>
            <ul className="space-y-3">
              <li><Link href="#philosophy" className="hover:text-foreground transition-colors">Philosophy</Link></li>
              <li><Link href="#schedule" className="hover:text-foreground transition-colors">Schedule</Link></li>
              <li><Link href="#pricing" className="hover:text-foreground transition-colors">Offerings</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-6">Connect</h4>
            <div className="flex flex-col space-y-4">
              <a href="https://www.instagram.com/nehaz_aaura/" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-medium text-foreground/60 hover:text-foreground transition-colors flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full border border-foreground/10 flex items-center justify-center group-hover:border-foreground/30 group-hover:bg-foreground/5 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
                Instagram
              </a>
              
              <a href="https://wa.me/917304112069" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-medium text-foreground/60 hover:text-foreground transition-colors flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full border border-foreground/10 flex items-center justify-center group-hover:border-foreground/30 group-hover:bg-foreground/5 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg>
                </div>
                WhatsApp
              </a>
              
              <a href="mailto:contact@nehazaura.com" className="text-xs uppercase tracking-widest font-medium text-foreground/60 hover:text-foreground transition-colors flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full border border-foreground/10 flex items-center justify-center group-hover:border-foreground/30 group-hover:bg-foreground/5 transition-all">
                  <Mail size={14} strokeWidth={2} />
                </div>
                Email
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-beige-dark/20 text-center text-xs font-light text-foreground/50">
          <p>&copy; {new Date().getFullYear()} Nehaz Aura. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
