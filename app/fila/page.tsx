import type { Metadata } from "next";
import { WaitlistForm } from "@/components/WaitlistForm";
import { StarMark } from "@/components/icons/StarMark";
import { getProductBySlug } from "@/data/products";

export const metadata: Metadata = {
  title: "Fila de espera",
  description:
    "Entre na fila de espera da 148 e tenha prioridade na comunicação do lançamento do primeiro drop.",
};

interface FilaPageProps {
  searchParams: Promise<{ produto?: string }>;
}

export default async function FilaPage({ searchParams }: FilaPageProps) {
  const { produto } = await searchParams;
  const product = produto ? getProductBySlug(produto) : undefined;

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-xl flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-10 flex flex-col gap-4">
        <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-paper/50">
          <StarMark className="h-3 w-3" />
          Fila de espera
        </span>
        <h1 className="font-display text-4xl uppercase leading-[0.95] tracking-wide text-paper sm:text-5xl">
          Entre na fila.
        </h1>
        <p className="text-paper/60">
          {product
            ? `Avisamos você assim que "${product.name}" estiver disponível.`
            : "Quem entra agora recebe prioridade quando o primeiro drop abrir."}
        </p>
      </div>

      <WaitlistForm productInterest={product?.slug} source="fila_page" />
    </section>
  );
}
