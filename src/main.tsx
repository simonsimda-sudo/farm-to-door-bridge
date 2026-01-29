import { createElement } from "react";
import { createRoot } from "react-dom/client";
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

  const isDev = import.meta.env.DEV;
  let backendOrigin: string;
  try {
    backendOrigin = new URL(backendBaseUrl).origin;
  } catch {
    return;
  }
  const reservedKeys = new Set(["select", "order", "limit", "offset"]);
  const isNumeric = (value: string) => /^\d+(?:\.\d+)?$/.test(value);

  const shouldStripParam = (key: string, value: string) => {
    // Example: ...&7008208  (PostgREST reads it as a filter key)
    if (/^\d+$/.test(key)) return true;

    // Example: ...&_=7446895  (common cache-buster; PostgREST reads '_' as a filter key)
    // More generally: if a non-reserved param has a purely numeric value, it's not a valid PostgREST
    // filter expression (missing operator), and causes PGRST100.
    if (!reservedKeys.has(key) && isNumeric(value)) return true;

    return false;
  };

  const originalFetch = window.fetch.bind(window);

  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const urlString =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input instanceof Request
              ? input.url
              : undefined;

      if (urlString) {
        const url = new URL(urlString);
        if (url.origin !== backendOrigin) {
          return originalFetch(input as any, init);
        }

        let changed = false;

        for (const [key, value] of Array.from(url.searchParams.entries())) {
          if (shouldStripParam(key, value)) {
            url.searchParams.delete(key);
            changed = true;
          }
        }

        if (changed) {
          if (isDev) {
            // Helpful for confirming the sanitizer is active.
            console.debug("[fetch-sanitizer] cleaned URL", {
              before: urlString,
              after: url.toString(),
            });
          }

          // If supabase-js passes a Request object, avoid re-constructing via `new Request(url, req)`
          // (can be brittle across runtimes). Instead, forward a string URL plus a RequestInit
          // derived from the original request.
          if (input instanceof Request) {
            const requestInit: RequestInit = {
              ...init,
              method: input.method,
              headers: input.headers,
              signal: input.signal,
              credentials: input.credentials,
              cache: input.cache,
              redirect: input.redirect,
              referrer: input.referrer,
              referrerPolicy: input.referrerPolicy,
              integrity: input.integrity,
              keepalive: input.keepalive,
              mode: input.mode,
            };

            if (input.method !== "GET" && input.method !== "HEAD") {
              requestInit.body = input.body as any;
            }

            return originalFetch(url.toString(), requestInit);
          }

          return originalFetch(url.toString(), init);
        }
      }
    } catch {
      // Ignore parsing issues and fall through to the original fetch.
    }

    return originalFetch(input as any, init);
  }) as any;
})();

// IMPORTANT: We dynamically import App *after* the fetch-sanitizer is installed.
// With ESM, static imports are executed before this module's top-level code.
// If App (or its dependencies) initializes the backend client during module
// evaluation, it may capture the original fetch before our sanitizer runs.
(async () => {
  const { default: App } = await import("./App.tsx");
  createRoot(document.getElementById("root")!).render(createElement(App));
})();
