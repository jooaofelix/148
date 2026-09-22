import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Marquee } from "@/components/Marquee";
import { SectionTitle } from "@/components/SectionTitle";
import { CollectionCard } from "@/components/CollectionCard";
import { ProductCard } from "@/components/ProductCard";
import { WaitlistCTA } from "@/components/WaitlistCTA";
import { ImageReveal } from "@/components/ImageReveal";
import { collectionList } from "@/data/collections";
import { getFeaturedProducts } from "@/data/products";
import { site } from "@/data/site";

export default function Home() {
  const featured = getFeaturedProducts();

  return (
    <>
      <Hero />
      <Manifesto />
      <Marquee texts={[...site.marquee]} tone="ink" />

      <section className="on-paper bg-paper-dim py-20 text-ink sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Primeiras linhas" title="O universo 148" tone="ink" className="mb-10 sm:mb-14" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {collectionList.map((collection) => (
              <CollectionCard key={collection.slug} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Prévia" title="Peças em breve" className="mb-10 sm:mb-14" />
          <div className="grid grid-cols-2 gap-4 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="on-paper bg-paper py-20 text-ink sm:py-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <ImageReveal>
            <p className="font-display text-3xl uppercase leading-tight tracking-wide sm:text-4xl md:text-5xl">
              Quando isso lançar,
              <br />
              você vai querer ver.
            </p>
          </ImageReveal>
          <p className="max-w-sm text-sm text-ink/60">
            Entre na fila de espera e receba prioridade na comunicação do lançamento.
          </p>
          <div className="pt-2">
            <WaitlistCTA source="home_closing" tone="ink" />
          </div>
        </div>
      </section>
    </>
  );
}
