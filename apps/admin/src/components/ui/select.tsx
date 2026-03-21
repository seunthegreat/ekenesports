import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          className={cn(
            "w-full h-10 px-3 rounded-lg border bg-white text-sm transition-colors appearance-none",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "pr-10",
            error
              ? "border-error focus:ring-error/50 focus:border-error"
              : "border-gray-300",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown size={16} />
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
