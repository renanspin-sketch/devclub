import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { m, useAnimationFrame, useReducedMotion } from "framer-motion";

import { useChapterTilt } from "@/hooks/useChapterTilt";
import { useInView } from "@/hooks/useInView";
import sistemaVideo from "@/assets/videos/sistema.mp4";

const NODES = ["React", "TypeScript", "Node.js", "Tailwind CSS", "Git", "JavaScript"];
// px por frame — mesma ordem de grandeza da referência do usuário.
const SPEED = 0.6;

const TAG_CLASSES =
  "whitespace-nowrap rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 font-mono text-xs text-text-primary shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md transition-[border-color,box-shadow,opacity] duration-300 hover:border-accent-cyan/70 hover:shadow-glow-cyan";

interface TagState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  ready: boolean;
}

/**
 * Flutuação livre estilo "protetor de tela" (referência trazida pelo
 * usuário): cada badge tem posição e velocidade próprias e quica nas
 * bordas do container, e uma linha liga cada um ao ponto fixo no centro da
 * caixa (pedido do usuário — o núcleo "Você" que existia antes de virar
 * flutuação livre foi removido, mas o ponto de ancoragem ficou). A física
 * roda a cada frame escrevendo direto no `transform`/`opacity` de cada
 * badge e nos atributos `x2`/`y2` de cada linha via ref, sem passar por
 * estado do React — 6 badges e 6 linhas atualizando 60x/s por state
 * re-renderizaria a árvore toda à toa (mesmo raciocínio do hook de frames
 * do Boot).
 *
 * Tamanho do container vem de `ResizeObserver` (não de leituras de
 * `getBoundingClientRect` dentro do loop) para não repetir o
 * forced-reflow que o Lighthouse já pegou uma vez no redimensionamento do
 * canvas do Boot.
 */
function useFloatingTags(containerRef: RefObject<HTMLDivElement>, count: number, active: boolean) {
  const tagRefs = useRef<(HTMLLIElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const boundsRef = useRef({ width: 0, height: 0 });
  const states = useRef<TagState[]>(
    Array.from({ length: count }, () => ({ x: 0, y: 0, vx: 0, vy: 0, w: 0, h: 0, ready: false })),
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      boundsRef.current = { width: entry.contentRect.width, height: entry.contentRect.height };
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  useAnimationFrame(() => {
    if (!active) return;
    const bounds = boundsRef.current;
    if (!bounds.width || !bounds.height) return;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    states.current.forEach((state, i) => {
      const el = tagRefs.current[i];
      if (!el) return;

      if (!state.ready) {
        // Cada rótulo tem uma largura diferente — só dá pra medir depois
        // que o badge já foi pintado ao menos uma vez.
        const rect = el.getBoundingClientRect();
        state.w = rect.width;
        state.h = rect.height;
        state.x = Math.random() * Math.max(0, bounds.width - state.w);
        state.y = Math.random() * Math.max(0, bounds.height - state.h);
        const angle = Math.random() * Math.PI * 2;
        state.vx = Math.cos(angle) * SPEED;
        state.vy = Math.sin(angle) * SPEED;
        state.ready = true;
        el.style.opacity = "1";
        const line = lineRefs.current[i];
        if (line) line.style.opacity = "1";
      }

      state.x += state.vx;
      state.y += state.vy;

      if (state.x <= 0) {
        state.x = 0;
        state.vx *= -1;
      } else if (state.x + state.w >= bounds.width) {
        state.x = bounds.width - state.w;
        state.vx *= -1;
      }
      if (state.y <= 0) {
        state.y = 0;
        state.vy *= -1;
      } else if (state.y + state.h >= bounds.height) {
        state.y = bounds.height - state.h;
        state.vy *= -1;
      }

      el.style.transform = `translate(${state.x}px, ${state.y}px)`;

      const line = lineRefs.current[i];
      if (line) {
        line.setAttribute("x1", String(centerX));
        line.setAttribute("y1", String(centerY));
        line.setAttribute("x2", String(state.x + state.w / 2));
        line.setAttribute("y2", String(state.y + state.h / 2));
      }
    });
  });

  return {
    setTagRef: (index: number) => (el: HTMLLIElement | null) => {
      tagRefs.current[index] = el;
    },
    setLineRef: (index: number) => (el: SVGLineElement | null) => {
      lineRefs.current[index] = el;
    },
  };
}

/**
 * Capítulo 2 — Build. Tecnologias flutuando livremente dentro de uma
 * "caixa" com vídeo de fundo, quicando nas bordas — estilo protetor de
 * tela trazido pelo usuário como referência — cada uma ligada por uma
 * linha a um ponto fixo no centro. Sob `prefers-reduced-motion`, os mesmos
 * badges aparecem num layout estático (flex-wrap), sem vídeo, linhas ou
 * física nenhuma.
 */
export function Build() {
  const shouldReduceMotion = useReducedMotion();
  const { ref, isInView } = useInView<HTMLElement>();
  const { style } = useChapterTilt({ ref });
  const containerRef = useRef<HTMLDivElement>(null);
  const { setTagRef, setLineRef } = useFloatingTags(
    containerRef,
    NODES.length,
    isInView && !shouldReduceMotion,
  );

  return (
    <section
      ref={ref}
      id="build"
      aria-label="Capítulo 2: Build"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-canvas/80 px-6 py-24 text-center"
    >
      <m.div style={style} className="flex w-full max-w-2xl flex-col items-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-text-muted">
          Capítulo 02 / 06 — Build
        </p>
        <h2 className="max-w-xl font-display text-3xl font-bold text-accent-green md:text-4xl">
          Cada tecnologia é uma peça — juntas, viram um sistema.
        </h2>
        <p className="mt-4 max-w-md text-text-secondary">
          Você não aprende ferramentas soltas. Aprende como elas se conectam.
        </p>

        <div
          ref={containerRef}
          className="relative mt-16 h-[300px] w-full overflow-hidden rounded-xl border border-white/10 bg-surface/40 sm:h-[380px]"
        >
          {/* Vídeo de fundo só entra depois que o capítulo já foi visto
              (`isInView`) — evita carregar/decodificar antes da hora — e
              fica de fora sob `prefers-reduced-motion`, igual a todo o
              resto do capítulo (a caixa cai de volta pro brilho estático
              que já existia). */}
          {!shouldReduceMotion && isInView && (
            <video
              aria-hidden="true"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            >
              <source src={sistemaVideo} type="video/mp4" />
            </video>
          )}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-canvas/50" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-accent-gradient opacity-[0.05] blur-3xl"
          />

          {!shouldReduceMotion && (
            <>
              {/* Ponto fixo no centro da caixa — cada badge fica ligado a
                  ele por uma linha reta enquanto flutua. `x1`/`y1`/`x2`/`y2`
                  são escritos a cada frame pelo `useFloatingTags`, junto
                  com o `transform` do badge correspondente. */}
              <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
                {NODES.map((label, i) => (
                  <line
                    key={`line-${label}`}
                    ref={setLineRef(i)}
                    x1="50%"
                    y1="50%"
                    x2="50%"
                    y2="50%"
                    stroke="#22D3EE"
                    strokeWidth={1.5}
                    strokeOpacity={0.4}
                    className="opacity-0 transition-opacity duration-300"
                  />
                ))}
              </svg>
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2">
                <m.div
                  aria-hidden="true"
                  className="h-3 w-3 rounded-full bg-accent-gradient shadow-glow-cyan"
                  animate={isInView ? { scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] } : {}}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </>
          )}

          {shouldReduceMotion ? (
            <ul role="list" className="flex h-full flex-wrap items-center justify-center gap-3 p-8">
              {NODES.map((label) => (
                <li key={label} className={TAG_CLASSES}>
                  {label}
                </li>
              ))}
            </ul>
          ) : (
            <ul role="list" className="absolute inset-0">
              {NODES.map((label, i) => (
                <li
                  key={label}
                  ref={setTagRef(i)}
                  className={`absolute left-0 top-0 opacity-0 will-change-transform ${TAG_CLASSES}`}
                >
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </m.div>
    </section>
  );
}
