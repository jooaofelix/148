import { Product } from "@/lib/types";
import { StarMark } from "./icons/StarMark";

interface ProductStoryProps {
  product: Product;
}

export function ProductStory({ product }: ProductStoryProps) {
  const specs = [
    { label: "Composição", value: product.composition },
    { label: "Modelagem", value: product.fit },
    { label: "Gramatura", value: product.weight },
  ].filter((s) => s.value);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-paper/40">
            {product.code}
          </span>
          {product.premium && (
            <span className="flex items-center gap-1.5 border border-paper/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-paper">
              <StarMark className="h-2.5 w-2.5" />
              Premium
            </span>
          )}
        </div>
        <h1 className="font-display text-4xl uppercase leading-[0.95] tracking-wide text-paper sm:text-5xl">
          {product.name}
        </h1>
        {product.tagline && <p className="text-lg text-paper/70">{product.tagline}</p>}
      </div>

      {product.reference && (
        <div className="flex items-center gap-3 border-y border-paper/10 py-4">
          <StarMark className="h-4 w-4 shrink-0 text-paper/60" />
          <span className="font-blackletter text-xl text-paper/80">
            {product.reference.citation}
          </span>
        </div>
      )}

      {product.story && (
        <p className="max-w-md text-base leading-relaxed text-paper/70">{product.story}</p>
      )}

      {specs.length > 0 && (
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          {specs.map((spec) => (
            <div key={spec.label} className="flex flex-col gap-1 border-t border-paper/10 pt-3">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-paper/40">
                {spec.label}
              </dt>
              <dd className="text-paper/80">{spec.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
