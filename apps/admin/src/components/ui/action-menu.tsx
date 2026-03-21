"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActionMenuItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  className?: string;
}

export function ActionMenu({ items, className }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 192;
      let left = rect.right - menuWidth;
      if (left < 8) left = rect.left + 8;
      
      setPos({
        top: rect.bottom + 8,
        left,
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      // Handle scroll/resize to keep it positioned or just close it
      const handleClose = () => setIsOpen(false);
      window.addEventListener('scroll', handleClose, true);
      window.addEventListener('resize', handleClose);
      return () => {
        window.removeEventListener('scroll', handleClose, true);
        window.removeEventListener('resize', handleClose);
      };
    }
  }, [isOpen, updatePosition]);

  return (
    <div className={cn("inline-block relative", className)}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className={cn(
          "p-2 hover:bg-neutral-light rounded-xl text-gray-400 hover:text-neutral-dark transition-all duration-200 outline-none",
          isOpen && "bg-neutral-light text-neutral-dark shadow-sm ring-4 ring-primary/5"
        )}
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <>
          {/* Transparent backdrop to catch all clicks */}
          <div 
            className="fixed inset-0 z-[9998] bg-transparent cursor-default"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          
          <div
            className="fixed w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-black/10 z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-150 py-1.5 pointer-events-auto"
            style={{ 
              top: pos.top, 
              left: pos.left,
            }}
          >
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold transition-all duration-150 group text-left",
                    item.variant === "danger"
                      ? "text-error hover:bg-error/[0.03]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-neutral-dark"
                  )}
                >
                  {Icon && (
                    <Icon
                      size={16}
                      className={cn(
                        "transition-colors",
                        item.variant === "danger"
                          ? "text-error/60 group-hover:text-error"
                          : "text-gray-300 group-hover:text-primary"
                      )}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
