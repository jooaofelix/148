import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { ProductCard } from "@/components/ProductCard";
import { CollectionCard } from "@/components/CollectionCard";
import { WaitlistCTA } from "@/components/WaitlistCTA";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { StarMark } from "@/components/icons/StarMark";
import { collectionList } from "@/data/collections";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Drop",
  description: "Prévia do primeiro drop da 148. Ainda não está à venda — entre na fila.",
};

export default function DropPage() {
  return (
    <>
      <section className="relative flex min-h-[55vh] flex-col justify-end overflow-hidden bg-ink sm:min-h-[70vh]">
        <PlaceholderImage label="Primeiro drop — editorial" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        <div className="relative flex flex-col gap-4 px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-paper/50">
            <StarMark className="h-3 w-3" />
            Primeiro drop
          </span>
          <h1 className="font-display text-5xl uppercase leading-[0.9] tracking-wide text-paper sm:text-7xl md:text-8xl">
            Em breve.
          </h1>
          <p className="max-w-sm text-paper/70">
            Ainda não está à venda. Mas você pode ser o primeiro a saber quando abrir.
          </p>
        </div>
      </section>

      <section className="on-paper bg-paper-dim py-20 text-ink sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="O que vem por aí" title="Duas linhas" tone="ink" className="mb-10 sm:mb-14" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {collectionList.map((collection) => (
              <CollectionCard key={collection.slug} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Todas as peças" title="Prévia completa" className="mb-10 sm:mb-14" />
          <div className="grid grid-cols-2 gap-4 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="on-paper bg-paper py-20 text-ink sm:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <p className="font-display text-2xl uppercase tracking-wide sm:text-3xl">
            Entre na fila antes de todo mundo
          </p>
          <WaitlistCTA source="drop_page" tone="ink" helperText="Sem spam. Só o essencial, no momento certo." />
          <Link href="/manifesto" className="text-xs uppercase tracking-[0.2em] text-ink/50 underline underline-offset-4">
            Conheça o conceito
          </Link>
        </div>
      </section>
    </>
  );
}
