"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import type { Product } from "@/lib/types";
import { StarMark } from "@/components/icons/StarMark";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { Hanger, HANGER_NECK_Y, HANGER_VIEWBOX } from "./Hanger";
import { DEFAULT_BOX, hangingImage, measureGarment, priceLabel, statusLabel, type GarmentBox } from "./garment";
import styles from "./Varal.module.css";

interface VaralProps {
  products: Product[];
  eyebrow?: string;
  title?: string;
}

/**
 * pin    — desktop com mouse: a seção prende na tela e a rolagem vertical
 *          percorre o varal na horizontal (câmera acompanhando).
 * swipe  — toque / telas menores: varal com arrasto lateral e encaixe.
 * static — "reduzir movimento" ligado: arrasto lateral, sem balanço.
 */
type Mode = "pin" | "swipe" | "static";

/* ---------- proporções (em relação à largura W da peça) ---------- */
const SHOULDER = 0.64; // largura do cabide ÷ largura da peça
const GAP = 0.36; // espaço entre peças ÷ W
const GARMENT_MAX_H = 1.26; // altura reservada para a peça ÷ W
const CLOTH_CAP = 1.18; // peças mais compridas que isso encolhem (sobra folga para o destaque)
const CAPTION_H = 64; // px reservados para o nome abaixo da peça
const RAIL_TOP = 26; // px do topo do palco até o varal

/* ---------- física do balanço (graus) ---------- */
const STIFFNESS = 27; // ~0,8 Hz: período de uma camiseta pendurada
const DAMPING = 1.7;
const MAX_ANGLE = 8;
const SCROLL_PUSH = 0.028; // quanto a velocidade da câmera empurra as peças
const HOVER_KICK = 16;
const DWELL = 0.18; // fração da rolagem em que cada peça fica parada no centro

interface Phys {
  a: number; // ângulo do cabide
  v: number; // velocidade angular
  g: number; // atraso do tecido em relação ao cabide
  seed: number;
}

/* ---------- modo conforme o aparelho (media queries) ---------- */
const PIN_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const CALM_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeMode(onChange: () => void) {
  const qs = [window.matchMedia(PIN_QUERY), window.matchMedia(CALM_QUERY)];
  qs.forEach((q) => q.addEventListener("change", onChange));
  return () => qs.forEach((q) => q.removeEventListener("change", onChange));
}
function readMode(): Mode {
  if (window.matchMedia(CALM_QUERY).matches) return "static";
  return window.matchMedia(PIN_QUERY).matches ? "pin" : "swipe";
}
const serverMode = (): Mode => "swipe";

function hangerGeometry(w: number) {
  const scale = (SHOULDER * w) / HANGER_VIEWBOX.width;
  const hangerW = SHOULDER * w;
  const hangerH = HANGER_VIEWBOX.height * scale;
  const hookTop = 2 * scale; // o topo do gancho no SVG fica em y = 2
  const garmentTop = (HANGER_NECK_Y - 2) * scale - 0.015 * w;
  return { hangerW, hangerH, hookTop, garmentTop };
}

export function Varal({ products, eyebrow = "A coleção", title = "No varal" }: VaralProps) {
  const n = products.length;
  const router = useRouter();

  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const swingRefs = useRef<(HTMLElement | null)[]>([]);
  const clothRefs = useRef<(HTMLElement | null)[]>([]);
  const phys = useRef<Phys[]>([]);

  const mode = useSyncExternalStore(subscribeMode, readMode, serverMode);
  const [w, setW] = useState(240);
  const [stageW, setStageW] = useState(1200);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [boxes, setBoxes] = useState<Record<string, GarmentBox>>({});

  const gap = Math.round(w * GAP);
  const step = w + gap;
  const travel = Math.max(0, (n - 1) * step);
  const geo = hangerGeometry(w);
  const itemH = Math.round(geo.garmentTop + GARMENT_MAX_H * w + CAPTION_H);

  // a peça clicada só fica "escolhida" enquanto a câmera está nela
  const chosen = picked === active ? picked : null;

  // estado "vivo" lido pelo laço de animação sem recriá-lo
  const live = useRef({ mode, step, travel, n, active });
  useLayoutEffect(() => {
    live.current = { mode, step, travel, n, active };
    if (phys.current.length !== n) {
      phys.current = Array.from({ length: n }, (_, i) => ({ a: 0, v: 0, g: 0, seed: (i * 2.399) % (Math.PI * 2) }));
    }
  });

  /* ---------- tamanho das peças a partir do palco ---------- */
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(() => {
      const sw = stage.clientWidth;
      setStageW(sw);
      if (mode === "pin") {
        const sh = stage.clientHeight;
        const byHeight = (sh - CAPTION_H - RAIL_TOP - 8) / (0.09 + GARMENT_MAX_H);
        setW(Math.round(Math.max(170, Math.min(320, byHeight, sw * 0.24))));
      } else {
        setW(Math.round(Math.max(170, Math.min(290, sw * 0.62))));
      }
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, [mode]);

  /* ---------- entrada da seção ---------- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  // ao entrar, as peças "caem" no varal e balançam até assentar
  useEffect(() => {
    if (!revealed || mode === "static") return;
    phys.current.forEach((p, i) => {
      p.a = (i % 2 ? 1 : -1) * (4 + ((i * 37) % 5));
      p.v = 0;
    });
  }, [revealed, mode]);

  /* ---------- posição da câmera ↔ rolagem ---------- */
  const scrollToIndex = useCallback(
    (i: number) => {
      const idx = Math.max(0, Math.min(n - 1, i));
      if (mode === "pin") {
        const root = rootRef.current;
        if (!root) return;
        const top0 = root.getBoundingClientRect().top + window.scrollY;
        const target = top0 + (n > 1 ? (idx / (n - 1)) * travel : 0);
        window.scrollTo({ top: target, behavior: "smooth" });
      } else {
        stageRef.current?.scrollTo({ left: idx * step, behavior: mode === "static" ? "auto" : "smooth" });
      }
    },
    [mode, n, step, travel],
  );

  /* ---------- laço de animação: câmera + balanço ---------- */
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const trackEl = trackRef.current;
    if (!root || !stage || !trackEl) return;

    let raf = 0;
    let running = false;
    let last = performance.now();
    let cam = Number.NaN;
    let prevPos = Number.NaN;

    const frame = (t: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (t - last) / 1000));
      last = t;
      const L = live.current;
      let velocity = 0; // px/s do varal na tela (+ = indo para a direita)
      let pos: number; // quanto já se andou no varal (px)

      if (L.mode === "pin") {
        const rect = root.getBoundingClientRect();
        const span = rect.height - window.innerHeight;
        const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
        // a câmera "para" um instante em cada peça: a rolagem entre duas peças
        // usa uma curva com patamares, então cada uma ganha seu momento no centro
        const u = p * (L.n - 1);
        const k = Math.min(L.n - 2, Math.floor(u));
        const f = L.n > 1 ? u - k : 0;
        const e = Math.min(1, Math.max(0, (f - DWELL) / (1 - 2 * DWELL)));
        const eased = L.n > 1 ? k + e * e * (3 - 2 * e) : 0;
        const target = -eased * L.step;
        if (Number.isNaN(cam)) cam = target;
        const prev = cam;
        cam += (target - cam) * (1 - Math.exp(-dt * 9));
        velocity = (cam - prev) / dt;
        trackEl.style.transform = `translate3d(${cam.toFixed(2)}px,0,0)`;
        if (ghostRef.current) ghostRef.current.style.transform = `translate3d(${(cam * 0.18).toFixed(2)}px,0,0)`;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${L.travel ? -cam / L.travel : 0})`;
        pos = -cam;
      } else {
        pos = stage.scrollLeft;
        if (Number.isNaN(prevPos)) prevPos = pos;
        velocity = -(pos - prevPos) / dt;
        prevPos = pos;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${L.travel ? Math.min(1, pos / L.travel) : 0})`;
      }

      const idx = Math.max(0, Math.min(L.n - 1, Math.round(pos / L.step)));
      if (idx !== L.active) setActive(idx);

      if (L.mode !== "static") {
        const secs = t / 1000;
        const push = -velocity * SCROLL_PUSH;
        for (let i = 0; i < phys.current.length; i++) {
          const p = phys.current[i];
          const wind = 5.5 * Math.sin(secs * 0.8 + p.seed) + 3.2 * Math.sin(secs * 1.9 + p.seed * 1.7);
          const acc = -STIFFNESS * p.a - DAMPING * p.v + wind + push;
          p.v += acc * dt;
          p.a = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, p.a + p.v * dt));
          // o tecido atrasa um pouco em relação ao cabide
          p.g += (-p.v * 0.045 - p.g) * (1 - Math.exp(-dt * 7));
          const sw = swingRefs.current[i];
          const cl = clothRefs.current[i];
          if (sw) sw.style.transform = `rotate(${p.a.toFixed(3)}deg)`;
          if (cl) cl.style.transform = `rotate(${p.g.toFixed(3)}deg) scaleY(${(1 + Math.abs(p.v) * 0.00025).toFixed(4)})`;
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // só anima enquanto a seção está (quase) na tela
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "200px 0px" });
    io.observe(root);

    if (mode === "static") {
      swingRefs.current.forEach((el) => el && (el.style.transform = ""));
      clothRefs.current.forEach((el) => el && (el.style.transform = ""));
    }
    if (mode !== "pin") trackEl.style.transform = "";

    return () => {
      io.disconnect();
      stop();
    };
  }, [mode]);

  /* ---------- interação ---------- */
  function kick(i: number, amount: number) {
    const p = phys.current[i];
    if (!p || mode === "static") return;
    p.v += amount;
  }

  function onEnter(i: number, e: PointerEvent<HTMLButtonElement>) {
    if (e.pointerType !== "mouse") return;
    setHover(i);
    const r = e.currentTarget.getBoundingClientRect();
    kick(i, e.clientX < r.left + r.width / 2 ? HOVER_KICK : -HOVER_KICK);
  }

  function onMove(i: number, e: PointerEvent<HTMLButtonElement>) {
    if (e.pointerType !== "mouse") return;
    kick(i, Math.max(-6, Math.min(6, e.movementX * 0.35)));
  }

  function openProduct(product: Product) {
    track(ANALYTICS_EVENTS.productClick, { slug: product.slug, source: "varal" });
    router.push(`/produto/${product.slug}`);
  }

  function onPick(i: number) {
    if (chosen === i) {
      openProduct(products[i]);
      return;
    }
    setPicked(i);
    kick(i, 10);
    if (i !== active) scrollToIndex(i);
  }

  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIndex(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIndex(active - 1);
    }
  }

  /* ---------- medição das fotos (uma vez por foto) ---------- */
  const measured = useRef(new Set<string>());
  const onMeasure = useCallback((slug: string, img: HTMLImageElement) => {
    if (measured.current.has(slug) || !img.complete || !img.naturalWidth) return;
    const box = measureGarment(img);
    if (!box) return;
    measured.current.add(slug);
    setBoxes((b) => ({ ...b, [slug]: box }));
  }, []);

  // confere as fotos já carregadas e escuta as próximas direto no trilho
  // (independe de o evento chegar pelo componente de imagem)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const sweep = () =>
      el.querySelectorAll<HTMLImageElement>("img[data-slug]").forEach((img) => onMeasure(img.dataset.slug ?? "", img));
    sweep();
    el.addEventListener("load", sweep, true);
    return () => el.removeEventListener("load", sweep, true);
  }, [onMeasure]);

  if (n === 0) return null;

  const current = products[Math.min(active, n - 1)];
  const price = priceLabel(current);
  const focusIndex = hover ?? active;
  const padX = Math.max(0, Math.round(stageW / 2 - w / 2));

  const trackStyle = {
    "--w": `${w}px`,
    "--gap": `${gap}px`,
    "--item-h": `${itemH}px`,
    "--rail-top": `${RAIL_TOP}px`,
    "--hook": `${geo.hookTop}px`,
    "--pad": `${padX}px`,
    "--hanger-w": `${geo.hangerW}px`,
    "--hanger-h": `${geo.hangerH}px`,
    paddingLeft: padX,
    paddingRight: padX,
  } as CSSProperties;

  return (
    <section
      ref={rootRef}
      className={styles.root}
      data-mode={mode}
      data-revealed={revealed || undefined}
      aria-roledescription="varal de produtos"
      aria-label={title}
      onKeyDown={onKeyDown}
      style={mode === "pin" ? { height: `calc(100svh + ${travel}px)` } : undefined}
    >
      <div className={styles.sticky}>
        <div className={styles.frame}>
          <header className={styles.head}>
            <div className={styles.titles}>
              <span className={styles.eyebrow}>{eyebrow}</span>
              <h2 className={styles.title}>{title}</h2>
            </div>
            <p className={styles.hint}>
              <StarMark className={styles.hintStar} />
              {mode === "pin" ? "Role para percorrer o varal" : "Arraste para o lado"}
            </p>
          </header>

          <div ref={stageRef} className={styles.stage}>
            <div className={styles.spot} aria-hidden="true" />
            <div ref={ghostRef} className={styles.ghost} aria-hidden="true">
              148
            </div>

            <div ref={trackRef} className={styles.track} style={trackStyle}>
              <div className={styles.rail} aria-hidden="true">
                <span className={styles.cable} />
                <span className={styles.cable} />
              </div>

              <ol className={styles.list}>
                {products.map((product, i) => {
                  const box = boxes[product.slug] ?? DEFAULT_BOX;
                  // peças muito compridas encolhem um pouco para não invadir o nome
                  const boxW = box.right - box.left;
                  const boxH = box.bottom - box.top;
                  const ratio = boxH / (boxW * box.aspect);
                  const gw = ratio > CLOTH_CAP ? (w * CLOTH_CAP) / ratio : w;
                  const imgW = gw / boxW;
                  const imgH = imgW / box.aspect;
                  const clothH = boxH * imgH;
                  // cabide do tamanho da peça, com o gancho sempre na mesma altura do varal
                  const hg = hangerGeometry(gw);
                  const hangerTop = geo.hookTop - hg.hookTop;
                  const state = chosen === i ? "picked" : focusIndex === i ? "focus" : hover !== null ? "dim" : "rest";
                  return (
                    <li
                      key={product.slug}
                      className={styles.item}
                      data-state={state}
                      data-active={active === i || undefined}
                      style={{ "--i": i } as CSSProperties}
                    >
                      <button
                        type="button"
                        className={styles.piece}
                        aria-label={`${product.name}${chosen === i ? " — abrir a peça" : " — destacar"}`}
                        aria-pressed={chosen === i}
                        onPointerEnter={(e) => onEnter(i, e)}
                        onPointerMove={(e) => onMove(i, e)}
                        onPointerLeave={() => setHover((h) => (h === i ? null : h))}
                        onFocus={() => setHover(null)}
                        onClick={() => onPick(i)}
                      >
                        <span className={styles.figure}>
                          <span ref={(el) => { swingRefs.current[i] = el; }} className={styles.swing}>
                            <Hanger className={styles.hanger} style={{ top: hangerTop, width: hg.hangerW, height: hg.hangerH }} />
                            <span
                              ref={(el) => { clothRefs.current[i] = el; }}
                              className={styles.cloth}
                              style={{ top: geo.hookTop + hg.garmentTop, height: clothH }}
                            >
                              <span
                                className={styles.photo}
                                style={{ left: (w - gw) / 2 - box.left * imgW, top: -box.top * imgH, width: imgW, height: imgH }}
                              >
                                <Image
                                  src={hangingImage(product)}
                                  alt=""
                                  fill
                                  sizes={`${Math.ceil(imgW)}px`}
                                  draggable={false}
                                  data-slug={product.slug}
                                  onLoad={(e) => onMeasure(product.slug, e.currentTarget)}
                                />
                              </span>
                            </span>
                          </span>
                        </span>
                      </button>
                      <div className={styles.caption}>
                        <span className={styles.captionCode}>{product.code}</span>
                        <span className={styles.captionName}>{product.name}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <footer className={styles.info} aria-live="polite">
            <div className={styles.detail}>
              <span className={styles.counter}>
                {String(active + 1).padStart(2, "0")} <i>/</i> {String(n).padStart(2, "0")}
              </span>
              <div className={styles.detailText} key={current.slug}>
                <span className={styles.code}>
                  {current.code}
                  <b className={styles.status}>{statusLabel(current.status)}</b>
                  {price && <b className={styles.price}>{price}</b>}
                </span>
                <h3 className={styles.name}>{current.name}</h3>
                {current.reference && <p className={styles.reference}>{current.reference.citation}</p>}
                {current.tagline && <p className={styles.tagline}>{current.tagline}</p>}
              </div>
            </div>
            <div className={styles.controls}>
              <Link
                href={`/produto/${current.slug}`}
                className={styles.cta}
                onClick={() => track(ANALYTICS_EVENTS.productClick, { slug: current.slug, source: "varal" })}
              >
                Ver a peça <span aria-hidden="true">→</span>
              </Link>
              <div className={styles.nav}>
                <button type="button" className={styles.arrow} onClick={() => scrollToIndex(active - 1)} disabled={active === 0} aria-label="Peça anterior">
                  ←
                </button>
                <button type="button" className={styles.arrow} onClick={() => scrollToIndex(active + 1)} disabled={active === n - 1} aria-label="Próxima peça">
                  →
                </button>
              </div>
              <span className={styles.progress} aria-hidden="true">
                <span ref={progressRef} />
              </span>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}
