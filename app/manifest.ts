import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "148 — Toda a criação louva",
    short_name: "148",
    description: "Streetwear com raízes no Salmo 148. Primeiro drop em breve.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/images/brand/148-mark.webp", sizes: "512x512", type: "image/webp" },
    ],
  };
}
