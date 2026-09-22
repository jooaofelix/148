import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { site } from "@/data/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${site.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/drop",
    "/001",
    "/art",
    "/manifesto",
    "/fila",
    "/privacidade",
    "/termos",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/produto/${product.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
