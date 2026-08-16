"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Settings, LogOut, Menu, X, LayoutDashboard, Image as ImageIcon } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const menuItems = [
    { name: "Leads", icon: Users, href: "/admin" },
    { name: "Instagram", icon: ImageIcon, href: "/admin/instagram" },
    { name: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-background border-b border-foreground/5 sticky top-0 z-50">
        <h1 className="text-lg font-serif font-medium text-foreground tracking-wide">Nehaz Aura</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-foreground/70 hover:text-foreground focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-64 bg-background border-l border-foreground/5 z-50 p-6 flex flex-col md:hidden shadow-xl"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground/50">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-foreground/50 hover:text-foreground">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 space-y-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm ${
                        isActive 
                          ? "bg-foreground text-background font-medium" 
                          : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                      }`}
                    >
                      <item.icon size={16} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 mt-auto rounded-xl text-sm text-red-600/80 hover:bg-red-50 hover:text-red-700 transition-colors w-full"
              >
                <LogOut size={16} />
                Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-background border-r border-foreground/5 h-screen sticky top-0 p-6">
        <div className="mb-12 px-2">
          <h1 className="text-xl font-serif text-foreground tracking-tight mb-1">Nehaz Aura</h1>
          <p className="text-[10px] uppercase tracking-widest text-foreground/40">Administration</p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm ${
                  isActive 
                    ? "bg-foreground text-background shadow-sm" 
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <item.icon size={16} />
                <span className="font-medium tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide text-foreground/50 hover:text-red-600 hover:bg-red-50 transition-all duration-300 w-full mt-auto"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );
}
