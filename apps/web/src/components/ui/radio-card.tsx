import { cn } from "@/lib/utils";

interface RadioCardProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  description?: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
}

export function RadioCard({ selected, onClick, label, description, right, children }: RadioCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-gray-200 hover:border-gray-300"
      )}
    >
      <div
        className={cn(
          "mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
          selected ? "border-primary" : "border-gray-300"
        )}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
        {children}
      </div>
      {right && <div className="flex-shrink-0 text-sm font-mono font-semibold">{right}</div>}
    </button>
  );
}
