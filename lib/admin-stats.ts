import { WaitlistEntry } from "./types";

/** Not a component — safe to call Date.now() here. */
export function countLast24h(entries: WaitlistEntry[]): number {
  const dayAgo = Date.now() - 86_400_000;
  return entries.filter((e) => new Date(e.createdAt).getTime() > dayAgo).length;
}
