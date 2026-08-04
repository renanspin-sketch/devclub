import { useRef } from "react";
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
 * bordas do container. A física roda a cada frame escrevendo direto no
 * `transform`/`opacity` de cada elemento via ref, sem passar por estado do
 * React — 6 badges atualizando 60x/s por state re-renderizaria a árvore
 * toda à toa (mesmo raciocínio do hook de frames do Boot).
 *
 * Tamanho do container vem de `ResizeObserver` (não de leituras de
 * `getBoundingClientRect` dentro do loop) para não repetir o
 * forced-reflow que o Lighthouse já pegou uma vez no redimensionamento do
 * canvas do Boot.
 */
function useFloatingTags(containerRef: RefObject<HTMLDivElement>, count: number, active: boolean) {
  const tagRefs = useRef<(HTMLLIElement | null)[]>([]);
  const boundsRef = useRef({ width: 0, height: 0 });
  const states = useRef<TagState[]>(
    Array.from({ length: count }, () => ({ x: 0, y: 0, vx: 0, vy: 0, w: 0, h: 0, ready: false })),
  );

  useAnimationFrame(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!boundsRef.current.width || !boundsRef.current.height) {
      const rect = container.getBoundingClientRect();
      boundsRef.current = { width: rect.width, height: rect.height };
    }
    if (!active) return;
    const bounds = boundsRef.current;

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
    });
  });

  return (index: number) => (el: HTMLLIElement | null) => {
    tagRefs.current[index] = el;
  };
}

/**
 * Capítulo 2 — Build. Tecnologias flutuando livremente dentro de uma
 * "caixa", quicando nas bordas — estilo protetor de tela trazido pelo
 * usuário como referência (substitui o diagrama anterior de núcleo +
 * órbita + linhas de conexão). Sob `prefers-reduced-motion`, os mesmos
 * badges aparecem num layout estático (flex-wrap), sem física nenhuma.
 */
export function Build() {
  const shouldReduceMotion = useReducedMotion();
  const { ref, isInView } = useInView<HTMLElement>();
  const { style } = useChapterTilt({ ref });
  const containerRef = useRef<HTMLDivElement>(null);
  const setTagRef = useFloatingTags(containerRef, NODES.length, isInView && !shouldReduceMotion);

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
