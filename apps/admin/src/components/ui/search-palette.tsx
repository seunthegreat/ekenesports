"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useHotkeys } from "@/hooks/use-hotkeys";

export function SearchPalette() {
  const [open, setOpen] = useState(false);

  // Toggle on Cmd+K or Ctrl+K
  useHotkeys("k", (e) => setOpen((prev) => !prev), { ctrlOrCmd: true, preventDefault: true });
  // Close on Escape
  useHotkeys("escape", () => setOpen(false));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
          <Search className="text-gray-400" size={20} />
          <input 
            type="text" 
            autoFocus 
            placeholder="Search products, orders, customers..." 
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
          />
          <button onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-md">
            <X size={16} />
          </button>
        </div>
        <div className="p-4 bg-gray-50/50 min-h-[200px] flex items-center justify-center text-sm font-medium text-gray-500">
          Start typing to search globally...
        </div>
      </div>
    </div>
  );
}
