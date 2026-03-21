"use client";

import { useEffect } from "react";

export function useHotkeys(
  key: string,
  callback: (e: KeyboardEvent) => void,
  options: { ctrlOrCmd?: boolean; preventDefault?: boolean } = {}
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the pressed key matches
      if (e.key.toLowerCase() !== key.toLowerCase()) return;

      // Check for modifier keys (Cmd on Mac, Ctrl on Windows)
      if (options.ctrlOrCmd && !e.metaKey && !e.ctrlKey) return;

      if (options.preventDefault) {
        e.preventDefault();
      }

      callback(e);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, options]);
}
