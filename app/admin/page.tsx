import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { waitlistStore } from "@/lib/waitlist-store";
import { countLast24h } from "@/lib/admin-stats";
import { getProductBySlug } from "@/data/products";
import { StarMark } from "@/components/icons/StarMark";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface AdminPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { error } = await searchParams;
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
        <h1 className="mb-6 font-display text-3xl uppercase tracking-wide text-paper">Admin</h1>
        <form action="/api/admin/login" method="POST" className="flex flex-col gap-4">
          <input
            type="password"
            name="password"
            placeholder="Senha"
            required
            className="border border-paper/25 bg-transparent px-4 py-3 text-paper placeholder:text-paper/30 focus:border-paper"
          />
          {error && <p className="text-sm text-paper/70">Senha incorreta.</p>}
          <button
            type="submit"
            className="bg-paper px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-ink"
          >
            Entrar
          </button>
        </form>
      </section>
    );
  }

  const entries = await waitlistStore.list();
  const total = entries.length;
  const last24h = countLast24h(entries);

  const byDay = new Map<string, number>();
  const bySize = new Map<string, number>();
  const byProduct = new Map<string, number>();
  const bySource = new Map<string, number>();

  for (const entry of entries) {
    const day = entry.createdAt.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);

    if (entry.size) bySize.set(entry.size, (bySize.get(entry.size) ?? 0) + 1);

    const productLabel = entry.productInterest
      ? getProductBySlug(entry.productInterest)?.name ?? entry.productInterest
      : "Nenhum específico";
    byProduct.set(productLabel, (byProduct.get(productLabel) ?? 0) + 1);

    const sourceLabel = entry.utm?.source ?? entry.source;
    bySource.set(sourceLabel, (bySource.get(sourceLabel) ?? 0) + 1);
  }

  const sortedDays = [...byDay.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 14);
  const sortedProducts = [...byProduct.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const sortedSources = [...bySource.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const sortedSizes = [...bySize.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <StarMark className="h-4 w-4 text-paper/50" />
          <h1 className="font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">
            Fila de espera
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/admin/export"
            className="border border-paper/30 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-paper hover:border-paper"
          >
            Exportar CSV
          </a>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="text-xs uppercase tracking-[0.2em] text-paper/50 hover:text-paper"
            >
              Sair
            </button>
          </form>
        </div>
      </div>

      <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Total na fila" value={total} />
        <Stat label="Últimas 24h" value={last24h} />
        <Stat label="Com tamanho" value={entries.filter((e) => e.size).length} />
        <Stat label="Com produto de interesse" value={entries.filter((e) => e.productInterest).length} />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <Table title="Cadastros por dia" rows={sortedDays} />
        <Table title="Produtos mais desejados" rows={sortedProducts} />
        <Table title="Tamanhos mais escolhidos" rows={sortedSizes} />
        <Table title="Origem dos cadastros" rows={sortedSources} />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-paper/10 p-4">
      <p className="font-display text-3xl text-paper">{value}</p>
      <p className="text-xs uppercase tracking-[0.15em] text-paper/50">{label}</p>
    </div>
  );
}

function Table({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-paper/50">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-paper/40">Sem dados ainda.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-paper/10 border-t border-paper/10">
          {rows.map(([key, count]) => (
            <li key={key} className="flex items-center justify-between py-2 text-sm text-paper/80">
              <span>{key}</span>
              <span className="text-paper/50">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
