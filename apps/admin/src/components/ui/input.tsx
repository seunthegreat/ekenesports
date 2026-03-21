import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        className={cn(
          "w-full h-10 px-3 rounded-lg border bg-white text-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
          "placeholder:text-gray-400",
          error
            ? "border-error focus:ring-error/50 focus:border-error"
            : "border-gray-300",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
