import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { WaitlistEntry } from "./types";

/**
 * Storage abstraction for the waitlist. The pre-launch site ships a
 * JSON-file-backed implementation (Node runtime only) so leads are real
 * and durable without standing up infrastructure. When the project moves
 * to Cloudflare, swap `fileStore` below for a D1- or KV-backed class that
 * implements the same `WaitlistStore` interface — nothing above this
 * module needs to change.
 */
export interface WaitlistStore {
  add(
    input: Omit<WaitlistEntry, "id" | "createdAt" | "consentAt">
  ): Promise<{ entry: WaitlistEntry; deduped: boolean }>;
  list(): Promise<WaitlistEntry[]>;
  count(): Promise<number>;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

class FileWaitlistStore implements WaitlistStore {
  /** Serializes writes so concurrent requests can't clobber each other. */
  private queue: Promise<unknown> = Promise.resolve();

  private async readAll(): Promise<WaitlistEntry[]> {
    try {
      const raw = await readFile(DATA_FILE, "utf-8");
      return JSON.parse(raw) as WaitlistEntry[];
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw err;
    }
  }

  private async writeAll(entries: WaitlistEntry[]): Promise<void> {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
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
      const entries = await this.readAll();
      const email = normalizeEmail(input.email);
      const existingIndex = entries.findIndex(
        (e) => normalizeEmail(e.email) === email
      );

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
        entries[existingIndex] = merged;
        await this.writeAll(entries);
        return { entry: merged, deduped: true };
      }

      const entry: WaitlistEntry = {
        ...input,
        email,
        id: randomUUID(),
        createdAt: now,
        consentAt: now,
      };
      entries.push(entry);
      await this.writeAll(entries);
      return { entry, deduped: false };
    });
  }

  list(): Promise<WaitlistEntry[]> {
    return this.run(() => this.readAll());
  }

  async count(): Promise<number> {
    return (await this.list()).length;
  }
}

export const waitlistStore: WaitlistStore = new FileWaitlistStore();
