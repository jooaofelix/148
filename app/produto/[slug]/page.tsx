import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductStory } from "@/components/ProductStory";
import { WaitlistCTA } from "@/components/WaitlistCTA";
import { ProductViewTracker } from "@/components/ProductViewTracker";
import { getProductBySlug, products } from "@/data/products";
import { collections } from "@/data/collections";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.tagline ?? product.story,
    openGraph: {
      title: `${product.name} · 148`,
      description: product.tagline ?? product.story,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const collection = collections[product.line];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <ProductViewTracker slug={product.slug} />
      <p className="mb-6 text-xs uppercase tracking-[0.2em] text-paper/40 sm:mb-10">
        <a href={`/${collection.slug}`} className="hover:text-paper/70">
          {collection.name}
        </a>
      </p>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery product={product} />

        <div className="flex flex-col gap-10">
          <ProductStory product={product} />

          <div className="border-t border-paper/10 pt-8">
            <WaitlistCTA
              label="Quero essa"
              productInterest={product.slug}
              source="product_page"
              helperText="Avisamos você assim que essa peça estiver disponível."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
