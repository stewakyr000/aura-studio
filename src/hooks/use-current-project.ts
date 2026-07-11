import { useEffect, useState, useCallback } from "react";

const KEY = "sanctum.currentProjectId";

function read(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function useCurrentProjectId(): [string | null, (id: string | null) => void] {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(read());
    const handler = (e: StorageEvent) => {
      if (e.key === KEY) setId(e.newValue);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const update = useCallback((next: string | null) => {
    if (typeof window === "undefined") return;
    if (next) window.localStorage.setItem(KEY, next);
    else window.localStorage.removeItem(KEY);
    setId(next);
    // notify same-tab listeners
    window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: next }));
  }, []);

  return [id, update];
}