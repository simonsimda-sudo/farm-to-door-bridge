// Custom Supabase client that always sanitizes PostgREST querystrings.
// We intentionally do NOT edit the auto-generated client.ts.

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  // This should never happen in Lovable Cloud, but helps avoid silent failures.
  // eslint-disable-next-line no-console
  console.error("Missing backend env vars: VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY");
}

const reservedKeys = new Set(["select", "order", "limit", "offset"]);
const isNumeric = (value: string) => /^\d+(?:\.\d+)?$/.test(value);

const shouldStripParam = (key: string, value: string) => {
  // Example: ...&7008208 (PostgREST reads it as a filter key)
  if (/^\d+$/.test(key)) return true;

  // Example: ...&_=7446895 (cache-buster; PostgREST reads '_' as a filter key)
  // More generally: if a non-reserved param has a purely numeric value, it's not a valid PostgREST
  // filter expression (missing operator), and causes PGRST100.
  if (!reservedKeys.has(key) && isNumeric(value)) return true;

  return false;
};

const backendOrigin = (() => {
  try {
    return SUPABASE_URL ? new URL(SUPABASE_URL).origin : undefined;
  } catch {
    return undefined;
  }
})();

const baseFetch = (...args: Parameters<typeof fetch>) => fetch(...args);

const sanitizedFetch: typeof fetch = async (input, init) => {
  try {
    const urlString =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input instanceof Request
            ? input.url
            : undefined;

    if (urlString && backendOrigin) {
      const url = new URL(urlString);
      if (url.origin === backendOrigin) {
        let changed = false;

        for (const [key, value] of Array.from(url.searchParams.entries())) {
          if (shouldStripParam(key, value)) {
            url.searchParams.delete(key);
            changed = true;
          }
        }

        if (changed) {
          // If a Request object is passed, we must re-create it with the sanitized URL.
          if (input instanceof Request) {
            return baseFetch(new Request(url.toString(), input), init);
          }
          return baseFetch(url.toString(), init);
        }
      }
    }
  } catch {
    // Ignore parsing issues and fall through to the original fetch.
  }

  return baseFetch(input as any, init);
};

export const supabase = createClient<Database>(
  SUPABASE_URL || "",
  SUPABASE_PUBLISHABLE_KEY || "",
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: sanitizedFetch,
    },
  }
);
