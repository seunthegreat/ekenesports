import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        secondary: "bg-secondary text-neutral-dark",
        sale: "bg-error text-white",
        outline: "border border-current text-current",
        // Status pill — dot + text on a tinted background
        status: "px-3 py-1 text-[10px] font-bold uppercase tracking-widest gap-1.5 border border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// -----------------------------------------------------------------
// StatusBadge — dot-indicator pill used across admin tables
// Pass bg/text colours that match the status semantic.
// -----------------------------------------------------------------
interface StatusBadgeProps {
  label: string;
  bg: string;   // e.g. "bg-emerald-50"
  text: string; // e.g. "text-emerald-600"
  dot: string;  // e.g. "bg-emerald-500"
  className?: string;
}

export function StatusBadge({ label, bg, text, dot, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest border border-transparent transition-all",
        bg,
        text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dot)} />
      {label}
    </span>
  );
}
