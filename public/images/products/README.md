# Product images

Drop official assets here using the exact filenames referenced in
`data/products.ts`. Until then, `PlaceholderImage` (see `components/PlaceholderImage.tsx`)
renders a labeled placeholder in the correct aspect ratio so layout doesn't shift once
real images land.

Expected files, per product:

- `<slug>-front.webp` — frontal shot / mockup (portrait, ~4:5)
- `<slug>-back.webp` — back shot (portrait, ~4:5)
- `<slug>-detail.webp` — print/embroidery detail (square, 1:1)

Recommended export: WebP, max width 1600px, sRGB, no baked-in price or sale badges.
