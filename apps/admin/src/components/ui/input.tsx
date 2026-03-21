import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  variant?: "default" | "underline";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, variant = "default", ...props }, ref) => {
    return (
      <input
        className={cn(
          "w-full transition-colors",
          variant === "default" && [
            "h-10 px-3 rounded-lg border bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            error ? "border-error focus:ring-error/50 focus:border-error" : "border-gray-300",
            "placeholder:text-gray-400"
          ],
          variant === "underline" && [
            "h-10 border-0 border-b pb-2 bg-transparent text-sm font-bold focus:outline-none focus:ring-0 focus:border-primary rounded-none hover:border-gray-500",
            error ? "border-error" : "border-gray-200",
            "placeholder:text-gray-300 placeholder:font-normal"
          ],
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
