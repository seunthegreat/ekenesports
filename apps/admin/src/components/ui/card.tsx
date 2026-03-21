"use client";

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  rounded?: "xl" | "2xl" | "3xl" | "none";
  border?: boolean | "primary";
  shadow?: "none" | "sm" | "md" | "lg";
}

export function Card({ 
  children, 
  className, 
  padding = "md", 
  rounded = "2xl", 
  border = true,
  shadow = "sm"
}: CardProps) {
  const paddings = {
    none: "p-0",
    xs: "p-3",
    sm: "p-4",
    md: "p-6 lg:p-8",
    lg: "p-10 lg:p-12",
    xl: "p-12 lg:p-16",
  };

  const rounds = {
    none: "rounded-none",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-[32px]",
  };

  const shadows = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg shadow-black/5",
  };

  return (
    <div className={cn(
      "bg-white transition-all duration-300",
      paddings[padding],
      rounds[rounded],
      shadows[shadow],
      border === "primary" ? "border border-primary/20 bg-primary/[0.02]" : border ? "border border-gray-100" : "border-none",
      className
    )}>
      {children}
    </div>
  );
}
