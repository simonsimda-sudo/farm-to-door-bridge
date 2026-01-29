export function isAbortLikeError(error: unknown): boolean {
  if (!error) return false;

  // Standard fetch abort
  if (error instanceof DOMException && error.name === "AbortError") return true;
  if (error instanceof Error && error.name === "AbortError") return true;

  const message =
    typeof (error as any)?.message === "string" ? (error as any).message : "";
  const name = typeof (error as any)?.name === "string" ? (error as any).name : "";

  return (
    name === "AbortError" ||
    message.includes("AbortError") ||
    message.toLowerCase().includes("aborted") ||
    message.includes("ERR_ABORTED")
  );
}

export function formatBackendError(error: unknown): string {
  if (!error) return "Unknown error";

  if (typeof error === "string") return error;

  // Supabase/PostgREST style
  const code = typeof (error as any)?.code === "string" ? (error as any).code : undefined;
  const message =
    typeof (error as any)?.message === "string" ? (error as any).message : undefined;
  const details =
    typeof (error as any)?.details === "string" ? (error as any).details : undefined;

  const parts = [code, message, details].filter(Boolean);
  if (parts.length) return parts.join(" · ");

  // Generic Error
  if (error instanceof Error) return error.message || error.name;

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error";
  }
}
