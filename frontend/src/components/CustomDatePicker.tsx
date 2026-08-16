"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export default function CustomDatePicker({ value, onChange, placeholder = "Select Date", className = "", minDate, maxDate }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial value or default to today for the calendar view
  const initialDate = value ? new Date(value + "T00:00:00") : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Generate calendar grid (42 days for 6 weeks)
  const getDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
    
    const days = [];
    
    // Previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, daysInPrevMonth - i),
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }
    
    // Next month days to complete 42 cells (6 rows)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }
    
    return days;
  };

  const days = getDays();
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  const handleSelectDate = (date: Date) => {
    // Format to YYYY-MM-DD
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  // Format display value
  const displayValue = value 
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value + "T00:00:00"))
    : placeholder;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-background border border-foreground/10 rounded-xl px-3 py-2 hover:border-foreground/30 transition-colors w-full focus:outline-none"
      >
        <CalendarIcon size={14} className="text-foreground/40 mr-2 shrink-0" />
        <span className={`text-xs ${value ? "text-foreground font-medium" : "text-foreground/50"}`}>
          {displayValue}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute z-[100] mt-2 right-0 md:left-0 md:right-auto bg-background border border-foreground/10 rounded-xl shadow-xl shadow-foreground/5 p-4 w-[280px]"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 hover:bg-foreground/5 rounded-full text-foreground/50 hover:text-foreground transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <h3 className="font-serif font-medium text-foreground text-sm">
                {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentMonth)}
              </h3>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 hover:bg-foreground/5 rounded-full text-foreground/50 hover:text-foreground transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-[10px] font-medium uppercase tracking-widest text-foreground/40">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((dayObj, i) => {
                const yyyy = dayObj.date.getFullYear();
                const mm = String(dayObj.date.getMonth() + 1).padStart(2, "0");
                const dd = String(dayObj.date.getDate()).padStart(2, "0");
                const dateStr = `${yyyy}-${mm}-${dd}`;
                const isSelected = value === dateStr;
                
                const isToday = new Date().toDateString() === dayObj.date.toDateString();
                
                // Set time to 00:00:00 for accurate day-level comparison
                const compareDate = new Date(dayObj.date);
                compareDate.setHours(0, 0, 0, 0);
                
                let isDisabled = false;
                if (minDate) {
                  const min = new Date(minDate);
                  min.setHours(0, 0, 0, 0);
                  if (compareDate < min) isDisabled = true;
                }
                if (maxDate) {
                  const max = new Date(maxDate);
                  max.setHours(0, 0, 0, 0);
                  if (compareDate > max) isDisabled = true;
                }

                return (
                  <div key={i} className="flex items-center justify-center h-8">
                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleSelectDate(dayObj.date)}
                      className={`
                        h-8 w-8 flex items-center justify-center rounded-full text-xs transition-all duration-200
                        ${!dayObj.isCurrentMonth ? "text-foreground/20" : "text-foreground"}
                        ${isSelected ? "bg-foreground text-white font-bold shadow-md scale-110" : "hover:bg-foreground/10"}
                        ${isToday && !isSelected ? "border border-foreground/30 font-semibold" : ""}
                        ${isDisabled ? "opacity-30 cursor-not-allowed hover:bg-transparent" : ""}
                      `}
                    >
                      {dayObj.day}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
