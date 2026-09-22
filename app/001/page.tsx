import type { Metadata } from "next";
import { SectionTitle } from "@/components/SectionTitle";
import { ProductCard } from "@/components/ProductCard";
import { WaitlistCTA } from "@/components/WaitlistCTA";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { CollectionViewTracker } from "@/components/CollectionViewTracker";
import { collections } from "@/data/collections";
import { getProductsByLine } from "@/data/products";

const collection = collections["001"];

export const metadata: Metadata = {
  title: collection.title,
  description: collection.description,
};

export default function Linha001Page() {
  const products = getProductsByLine("001");

  return (
    <>
      <CollectionViewTracker collection="001" />
      <section className="relative flex min-h-[60vh] flex-col justify-end overflow-hidden bg-ink sm:min-h-[75vh]">
        <PlaceholderImage label="148 / 001 — editorial" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        <div className="relative flex flex-col gap-4 px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-paper/50">
            Linha 001
          </span>
          <h1 className="font-display text-6xl uppercase leading-[0.9] tracking-wide text-paper sm:text-7xl md:text-8xl">
            148 / 001
          </h1>
          <p className="max-w-sm text-paper/70">{collection.description}</p>
        </div>
      </section>

      <section className="bg-ink py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Em breve" title="A peça essencial" className="mb-10 sm:mb-14" />
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
            Entre na fila para a 001
          </p>
          <WaitlistCTA
            productInterest="linha-001"
            source="linha_001_page"
            tone="ink"
            helperText="Prioridade na comunicação do lançamento."
          />
        </div>
      </section>
    </>
  );
}
