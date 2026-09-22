import { WaitlistEntry } from "./types";

const UTM_KEYS = ["source", "medium", "campaign", "content", "term"] as const;

export function parseUtm(
  searchParams: URLSearchParams
): WaitlistEntry["utm"] | undefined {
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = searchParams.get(`utm_${key}`);
    if (value) utm[key] = value;
  }
  return Object.keys(utm).length > 0 ? utm : undefined;
}
