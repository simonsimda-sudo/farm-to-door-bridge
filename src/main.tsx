import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

/**
 * Workaround for intermittent malformed querystrings that look like:
 *   .../rest/v1/table?select=*&order=created_at.desc&7008208
 * PostgREST treats the bare numeric segment as a filter and returns PGRST100.
 *
 * We defensively strip any query param keys that are purely digits with an empty value,
 * but only for our backend base URL.
 */
(() => {
  if (typeof window === "undefined" || typeof window.fetch !== "function") return;

  const backendBaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (!backendBaseUrl) return;

  const originalFetch = window.fetch.bind(window);

  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      // supabase-js uses string URLs; keep other RequestInfo types untouched.
      const urlString =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : undefined;

      if (urlString && urlString.startsWith(backendBaseUrl)) {
        const url = new URL(urlString);
        let changed = false;

        for (const [key, value] of Array.from(url.searchParams.entries())) {
          if (/^\d+$/.test(key) && value === "") {
            url.searchParams.delete(key);
            changed = true;
          }
        }

        if (changed) {
          return originalFetch(url.toString(), init);
        }
      }
    } catch {
      // Ignore parsing issues and fall through to the original fetch.
    }

    return originalFetch(input as any, init);
  }) as any;
})();

createRoot(document.getElementById("root")!).render(<App />);
