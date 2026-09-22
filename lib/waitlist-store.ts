import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { WaitlistEntry } from "./types";

/**
 * Storage abstraction for the waitlist. Two implementations ship today:
 *
 * - `FileWaitlistStore` — JSON-file-backed (Node's `fs`), real and durable,
 *   used on any host with a writable filesystem (local dev, Node servers).
 * - `InMemoryWaitlistStore` — process-memory only, used automatically when
 *   running on Cloudflare Workers (no filesystem there, and writes would
 *   otherwise vanish or throw). Leads still validate/dedupe/rate-limit
 *   correctly, but do NOT persist across deploys or between isolates —
 *   it exists so a Cloudflare preview deploy doesn't break, not as a
 *   real production backend.
 *
 * Before relying on the waitlist in production on Cloudflare, swap
 * `InMemoryWaitlistStore` for a D1- or KV-backed class implementing this
 * same `WaitlistStore` interface — nothing above this module needs to change.
 */
export interface WaitlistStore {
  add(
    input: Omit<WaitlistEntry, "id" | "createdAt" | "consentAt">
  ): Promise<{ entry: WaitlistEntry; deduped: boolean }>;
  list(): Promise<WaitlistEntry[]>;
  count(): Promise<number>;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Merges a new submission into an existing entry for the same (normalized) e-mail. */
function upsert(
  entries: WaitlistEntry[],
  input: Omit<WaitlistEntry, "id" | "createdAt" | "consentAt">
): { entries: WaitlistEntry[]; entry: WaitlistEntry; deduped: boolean } {
  const email = normalizeEmail(input.email);
  const existingIndex = entries.findIndex((e) => normalizeEmail(e.email) === email);
  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    const existing = entries[existingIndex];
    const merged: WaitlistEntry = {
      ...existing,
      name: input.name || existing.name,
      phone: input.phone || existing.phone,
      size: input.size ?? existing.size,
      productInterest: input.productInterest ?? existing.productInterest,
      sourcePage: input.sourcePage || existing.sourcePage,
      utm: input.utm ?? existing.utm,
    };
    const next = [...entries];
    next[existingIndex] = merged;
    return { entries: next, entry: merged, deduped: true };
  }

  const entry: WaitlistEntry = {
    ...input,
    email,
    id: randomUUID(),
    createdAt: now,
    consentAt: now,
  };
  return { entries: [...entries, entry], entry, deduped: false };
}

class FileWaitlistStore implements WaitlistStore {
  private readonly dataDir = path.join(process.cwd(), ".data");
  private readonly dataFile = path.join(this.dataDir, "waitlist.json");
  /** Serializes writes so concurrent requests can't clobber each other. */
  private queue: Promise<unknown> = Promise.resolve();

  private async readAll(): Promise<WaitlistEntry[]> {
    try {
      const raw = await readFile(this.dataFile, "utf-8");
      return JSON.parse(raw) as WaitlistEntry[];
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw err;
    }
  }

  private async writeAll(entries: WaitlistEntry[]): Promise<void> {
    await mkdir(this.dataDir, { recursive: true });
    await writeFile(this.dataFile, JSON.stringify(entries, null, 2), "utf-8");
  }

  private run<T>(fn: () => Promise<T>): Promise<T> {
    const result = this.queue.then(fn, fn);
    this.queue = result.catch(() => undefined);
    return result;
  }

  add(
    input: Omit<WaitlistEntry, "id" | "createdAt" | "consentAt">
  ): Promise<{ entry: WaitlistEntry; deduped: boolean }> {
    return this.run(async () => {
      const { entries, entry, deduped } = upsert(await this.readAll(), input);
      await this.writeAll(entries);
      return { entry, deduped };
    });
  }

  list(): Promise<WaitlistEntry[]> {
    return this.run(() => this.readAll());
  }

  async count(): Promise<number> {
    return (await this.list()).length;
  }
}

/** No persistence: safe fallback so builds/requests on Cloudflare Workers never crash. */
class InMemoryWaitlistStore implements WaitlistStore {
  private entries: WaitlistEntry[] = [];

  async add(
    input: Omit<WaitlistEntry, "id" | "createdAt" | "consentAt">
  ): Promise<{ entry: WaitlistEntry; deduped: boolean }> {
    const { entries, entry, deduped } = upsert(this.entries, input);
    this.entries = entries;
    return { entry, deduped };
  }

  async list(): Promise<WaitlistEntry[]> {
    return this.entries;
  }

  async count(): Promise<number> {
    return this.entries.length;
  }
}

/**
 * Cloudflare Workers has no filesystem and identifies itself via
 * `navigator.userAgent` (the detection method Cloudflare's own docs
 * recommend) — Node and other hosts don't set that value.
 */
const isCloudflareWorkers =
  typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

export const waitlistStore: WaitlistStore = isCloudflareWorkers
  ? new InMemoryWaitlistStore()
  : new FileWaitlistStore();
