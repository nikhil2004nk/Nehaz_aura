"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";

export interface Option {
  value: string;
  label: string;
  color?: string;
}

interface CustomSelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  showSearch?: boolean;
  size?: "default" | "sm";
  allowClear?: boolean;
}

export default function CustomSelect({
  id,
  name = "",
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  className = "",
  showSearch = false,
  size = "default",
  allowClear = true,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">("bottom");
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScroll = useCallback(() => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      setCanScrollUp(scrollTop > 1);
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 1);
    }
  }, []);

  const scrollList = (dir: number) => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: dir * 60, behavior: "smooth" });
      setTimeout(checkScroll, 200);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm(""); // Reset search when closing
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Calculate position, auto-focus search, and handle window scroll
  useEffect(() => {
    if (isOpen) {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        // If less than 240px below and more space above, open upwards
        if (spaceBelow < 240 && rect.top > spaceBelow) {
          setDropdownPosition("top");
        } else {
          setDropdownPosition("bottom");
        }
      }

      setTimeout(() => {
        searchInputRef.current?.focus();
        checkScroll();
      }, 100);

      const handleScroll = (e: Event) => {
        // Don't close if scrolling inside the dropdown itself
        if (containerRef.current?.contains(e.target as Node)) return;
        setIsOpen(false);
        setSearchTerm("");
      };

      // Close on any scroll (capture: true catches scrolls from parent containers)
      window.addEventListener("scroll", handleScroll, { passive: true, capture: true });

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    onChange({
      target: {
        name,
        value: optionValue,
      },
    });
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-xl flex items-center justify-between focus:outline-none transition-colors ${
          size === "sm" ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
        } ${selectedOption?.color 
          ? "border font-medium" 
          : "bg-background border border-foreground/10 text-foreground focus:border-foreground/30"
        }`}
        style={selectedOption?.color ? {
          backgroundColor: `${selectedOption.color}15`,
          borderColor: `${selectedOption.color}40`,
          color: selectedOption.color,
        } : undefined}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.color && (
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: selectedOption.color }} />
          )}
          {selectedOption ? selectedOption.label : <span className="text-foreground/50">{placeholder}</span>}
        </span>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {selectedOption && allowClear && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleSelect("");
              }}
              className="p-1 text-foreground/40 hover:text-foreground hover:bg-foreground/10 rounded-full transition-colors cursor-pointer"
            >
              <X size={12} />
            </div>
          )}
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            width="10"
            height="6"
            viewBox="0 0 12 8"
            fill="none"
            className="text-foreground/40"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropdownPosition === "bottom" ? -5 : 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dropdownPosition === "bottom" ? -5 : 5 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-[100] w-full bg-background border border-foreground/10 rounded-xl shadow-xl shadow-foreground/5 overflow-hidden flex flex-col ${
              dropdownPosition === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
            }`}
            // Setting a max height for the dropdown container
            style={{ maxHeight: '170px' }}
          >
            {/* Search Input (Optional) */}
            {showSearch && (
              <div className="p-2 border-b border-foreground/5 shrink-0">
                <div className="relative flex items-center">
                  <Search size={14} className="absolute left-3 text-foreground/40" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-foreground/5 border-none text-foreground text-xs rounded-lg pl-9 pr-8 py-2.5 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchTerm("");
                        searchInputRef.current?.focus();
                      }}
                      className="absolute right-2 p-1 text-foreground/40 hover:text-foreground transition-colors rounded-full hover:bg-foreground/10"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Up Arrow */}
            {canScrollUp && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); scrollList(-1); }}
                className="flex items-center justify-center py-1 text-foreground/30 hover:text-foreground/60 hover:bg-foreground/5 transition-colors shrink-0 border-b border-foreground/5"
              >
                <ChevronUp size={12} />
              </button>
            )}

            {/* Options List */}
            <ul ref={listRef} onScroll={checkScroll} className="overflow-y-auto py-1 scrollbar-hide flex-grow">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full text-left transition-colors hover:bg-foreground/5 ${
                        value === opt.value ? "bg-foreground/5 font-medium" : "font-light"
                      } ${size === "sm" ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"}`}
                    >
                      <span className="flex items-center gap-2">
                        {opt.color && (
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />
                        )}
                        {opt.label}
                      </span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 text-center text-xs text-foreground/50 font-light">
                  No results found
                </li>
              )}
            </ul>

            {/* Down Arrow */}
            {canScrollDown && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); scrollList(1); }}
                className="flex items-center justify-center py-1 text-foreground/30 hover:text-foreground/60 hover:bg-foreground/5 transition-colors shrink-0 border-t border-foreground/5"
              >
                <ChevronDown size={12} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
