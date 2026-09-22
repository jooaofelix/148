import Link from "next/link";
import { Collection } from "@/lib/types";
import { SmartImage } from "./SmartImage";
import { StarMark } from "./icons/StarMark";
import { ImageReveal } from "./ImageReveal";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <ImageReveal>
      <Link
        href={`/${collection.slug}`}
        className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden border border-paper/10"
      >
        <SmartImage
          src={collection.cover}
          alt={`Coleção ${collection.name}`}
          className="transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

        <div className="relative flex flex-col gap-2 p-6">
          <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-paper/60">
            <StarMark className="h-3 w-3" />
            {collection.status === "em-breve" ? "Em breve" : "Disponível"}
          </span>
          <h3 className="font-display text-3xl uppercase leading-none tracking-wide text-paper sm:text-4xl">
            {collection.name}
          </h3>
          <p className="max-w-xs text-sm text-paper/70">{collection.description}</p>
        </div>
      </Link>
    </ImageReveal>
  );
}
