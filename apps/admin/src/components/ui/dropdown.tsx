"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  fullWidth?: boolean;
  variant?: "pill" | "input";
}

export function Dropdown({
  options,
  value,
  onChange,
  className,
  placeholder = "Select option",
  fullWidth = false,
  variant = "pill"
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    // Note: Re-using the logic from Step 1226 but fixing the ref variable name if it was inconsistent
    const containerRef = dropdownRef;
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative inline-block", fullWidth && "w-full flex", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2.5 outline-none transition-all shadow-sm",
          variant === "pill"
            ? "px-4 py-2 bg-white border border-gray-100 rounded-full text-[11px] font-heading font-extrabold text-[#1A1A2E]/60 uppercase tracking-widest hover:border-primary/20 hover:text-primary"
            : "w-full px-5 py-4 bg-neutral-light/40 border border-gray-100 rounded-2xl text-sm font-bold text-neutral-dark hover:border-gray-200",
          isOpen && (variant === "pill"
            ? "border-primary/30 ring-4 ring-primary/5 text-primary"
            : "border-primary/30 bg-white ring-4 ring-primary/5")
        )}
      >
        <span className="flex-1 text-left">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={variant === "pill" ? 14 : 18}
          className={cn(
            "text-gray-300 transition-transform duration-300 shrink-0",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-black/5 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200 py-1",
          fullWidth ? "left-0 right-0" : "right-0 min-w-[200px]"
        )}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-5 py-3 text-[13px] font-bold transition-colors block",
                value === option.value
                  ? "bg-primary/5 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-neutral-dark"
              )}
            >
              <div className="flex items-center justify-between">
                {option.label}
                {value === option.value && (
                   <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
