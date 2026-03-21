"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  footer?: React.ReactNode;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className,
  maxWidth = "md",
  footer 
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.classList.add("no-scroll");
      document.documentElement.classList.add("no-scroll");
    } else {
      // Ensure scroll lock is removed when modal closes
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      // Ensure scroll lock is removed on unmount
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-[#1A1A2E]/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
      />
      
      {/* Modal Card */}
      <div className={cn(
        "relative w-full bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in duration-300",
        maxWidths[maxWidth],
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 flex-shrink-0">
          {title ? (
            <h3 className="text-lg font-heading font-extrabold text-neutral-dark tracking-tight">
              {title}
            </h3>
          ) : <div />}
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-neutral-dark hover:bg-gray-50 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-50 flex items-center justify-end gap-3 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
