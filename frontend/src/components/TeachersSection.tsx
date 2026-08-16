"use client";

import { useEffect, useState } from "react";
import { environment } from "../config/environment";
import { motion } from "framer-motion";

const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface Teacher {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  instagramUrl: string;
}

export default function TeachersSection() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch(`${environment.apiUrl}/teachers?publicOnly=true`);
        if (res.ok) {
          const { data } = await res.json();
          setTeachers(data);
        }
      } catch (error) {
        console.error("Failed to fetch teachers", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (isLoading || teachers.length === 0) return null;

  return (
    <section className="py-10 md:py-12 bg-background relative overflow-hidden border-t border-foreground/5">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-beige-light/30 blur-3xl opacity-50" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-beige-light/20 blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif text-foreground mb-2"
          >
            Meet Your <span className="italic text-foreground/70">Instructors</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/60 text-sm font-light leading-relaxed"
          >
            Guided by experienced practitioners dedicated to helping you find your flow.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {teachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group w-full max-w-[260px] relative flex flex-col bg-background rounded-xl p-3 border border-foreground/5 hover:border-foreground/15 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg mb-3 bg-foreground/5 shrink-0">
                {teacher.imageUrl && (
                  <img
                    src={teacher.imageUrl}
                    alt={teacher.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {teacher.instagramUrl && (
                  <a
                    href={teacher.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 w-7 h-7 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-white/30"
                  >
                    <InstagramIcon size={12} />
                  </a>
                )}
              </div>
              
              <div className="text-center px-1 flex-1 flex flex-col">
                <h3 className="text-base font-serif text-foreground mb-1 leading-tight">{teacher.name}</h3>
                <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/50 mb-2 font-medium">{teacher.role}</p>
                <p className="text-foreground/60 text-[10px] font-light leading-snug flex-1 line-clamp-4">
                  {teacher.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
