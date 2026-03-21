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



  useEffect(() => {
    if (isOpen) {
      const handleClose = () => setIsOpen(false);
      window.addEventListener('scroll', handleClose, true);
      window.addEventListener('resize', handleClose);
      return () => {
        window.removeEventListener('scroll', handleClose, true);
        window.removeEventListener('resize', handleClose);
      };
    }
  }, [isOpen]);

  return (
    <div className={cn("inline-block relative", className)}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const menuWidth = 192;
            let left = rect.right - menuWidth;
            if (left < 8) left = rect.left + 8;
            setPos({
              top: rect.bottom + 8 + window.scrollY,
              left: left + window.scrollX,
            });
          }
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
            className="absolute inset-0 z-[9998] bg-transparent cursor-default"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          
          <div
            className="absolute w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-black/10 z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-200 py-1.5 pointer-events-auto origin-top-right"
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
                      : "text-neutral-dark hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  {Icon && (
                    <Icon
                      size={16}
                      className="transition-colors shrink-0"
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
