import { useId, type CSSProperties } from "react";

/**
 * Cabide de metal escovado, desenhado para ficar *dentro* da peça: o gancho e
 * o pescoço aparecem acima da gola; os ombros ficam escondidos atrás da
 * camiseta. O topo do gancho (x = 100, y = 2) é o ponto que encosta no varal
 * e é o pivô do balanço.
 *
 * viewBox 200 × 64 — a largura do SVG acompanha a largura dos ombros da peça.
 */
export const HANGER_VIEWBOX = { width: 200, height: 64 } as const;
/** Altura (em unidades do viewBox) onde termina o pescoço e começa a gola. */
export const HANGER_NECK_Y = 30;

export function Hanger({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox={`0 0 ${HANGER_VIEWBOX.width} ${HANGER_VIEWBOX.height}`}
      className={className}
      style={style}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2efe6" />
          <stop offset="0.45" stopColor="#a9a69d" />
          <stop offset="1" stopColor="#5d5b55" />
        </linearGradient>
      </defs>
      {/* gancho: abre sobre o varal e desce até o pescoço */}
      <path
        d="M100 30 V17 C100 11 106 7.5 110.5 7.5 C115 7.5 117 11 116 14.5"
        stroke={`url(#${id}-metal)`}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M100 30 V17 C100 9 104 2 110 2" stroke="#f4f2ec" strokeOpacity="0.35" strokeWidth="0.8" />
      {/* ombros (ficam por trás da camiseta; aparecem só nas pontas quando ela balança) */}
      <path
        d="M100 30 C78 34 40 46 10 57 C6 58.5 5 62 9 62 H191 C195 62 194 58.5 190 57 C160 46 122 34 100 30 Z"
        fill={`url(#${id}-metal)`}
        opacity="0.9"
      />
    </svg>
  );
}
