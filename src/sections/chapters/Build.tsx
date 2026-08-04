import { useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { m, useAnimationFrame, useReducedMotion } from "framer-motion";

import { useChapterTilt } from "@/hooks/useChapterTilt";
import { useInView } from "@/hooks/useInView";
import sistemaVideo from "@/assets/videos/sistema.mp4";

const NODES = ["React", "TypeScript", "Node.js", "Tailwind CSS", "Git", "JavaScript"];
// px por frame — mesma ordem de grandeza da referência do usuário.
const SPEED = 0.6;
// Quanto o ângulo de cada badge pode desviar aleatoriamente por frame —
// baixo o suficiente pra ler como deriva orgânica, não tremedeira.
const TURN_RATE = 0.025;

const TAG_CLASSES =
  "whitespace-nowrap rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 font-mono text-xs text-text-primary shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md transition-[border-color,box-shadow,opacity] duration-300 hover:border-accent-cyan/70 hover:shadow-glow-cyan";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

interface TagState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  angle: number;
  ready: boolean;
  dragging: boolean;
  grabDX: number;
  grabDY: number;
  lastPointerX: number;
  lastPointerY: number;
  lastPointerT: number;
}

function createTagState(): TagState {
  return {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    w: 0,
    h: 0,
    angle: 0,
    ready: false,
    dragging: false,
    grabDX: 0,
    grabDY: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    lastPointerT: 0,
  };
}

/**
 * Flutuação livre com deriva orgânica — em vez de quicar em linha reta
 * com ângulo fixo (estilo protetor de tela puro), cada badge tem um
 * ângulo que sofre um pequeno desvio aleatório a cada frame ("wander"),
 * então o caminho lembra mais algo vivo do que uma trajetória mecânica e
 * previsível — pedido do usuário. Uma linha liga cada badge a um ponto
 * fixo no centro da caixa. Dá pra arrastar qualquer badge com o
 * mouse/toque: nesse caso a física para pra ele (a posição passa a
 * seguir o ponteiro, sempre dentro dos limites da caixa) e retoma a
 * deriva ao soltar, na direção do arrasto se houve movimento suficiente
 * (senão, uma direção aleatória nova).
 *
 * A física roda a cada frame escrevendo direto no `transform`/`opacity`
 * de cada badge e nos atributos `x1..y2` de cada linha via ref, sem
 * passar por estado do React — 6 badges e 6 linhas atualizando 60x/s por
 * state re-renderizaria a árvore toda à toa (mesmo raciocínio do hook de
 * frames do Boot).
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
  const states = useRef<TagState[]>(Array.from({ length: count }, createTagState));

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
        state.angle = Math.random() * Math.PI * 2;
        state.ready = true;
        el.style.opacity = "1";
        const line = lineRefs.current[i];
        if (line) line.style.opacity = "1";
      }

      if (!state.dragging) {
        state.angle += (Math.random() - 0.5) * TURN_RATE;
        state.vx = Math.cos(state.angle) * SPEED;
        state.vy = Math.sin(state.angle) * SPEED;

        state.x += state.vx;
        state.y += state.vy;

        if (state.x <= 0) {
          state.x = 0;
          state.angle = Math.PI - state.angle;
        } else if (state.x + state.w >= bounds.width) {
          state.x = bounds.width - state.w;
          state.angle = Math.PI - state.angle;
        }
        if (state.y <= 0) {
          state.y = 0;
          state.angle = -state.angle;
        } else if (state.y + state.h >= bounds.height) {
          state.y = bounds.height - state.h;
          state.angle = -state.angle;
        }
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

  function getDragHandlers(index: number) {
    return {
      onPointerDown: (event: ReactPointerEvent<HTMLLIElement>) => {
        if (!active) return;
        const state = states.current[index];
        const el = tagRefs.current[index];
        const container = containerRef.current;
        if (!state.ready || !el || !container) return;
        el.setPointerCapture(event.pointerId);
        const containerRect = container.getBoundingClientRect();
        state.dragging = true;
        state.vx = 0;
        state.vy = 0;
        state.grabDX = event.clientX - containerRect.left - state.x;
        state.grabDY = event.clientY - containerRect.top - state.y;
        state.lastPointerX = event.clientX;
        state.lastPointerY = event.clientY;
        state.lastPointerT = performance.now();
        el.style.cursor = "grabbing";
      },
      onPointerMove: (event: ReactPointerEvent<HTMLLIElement>) => {
        const state = states.current[index];
        if (!state.dragging) return;
        const container = containerRef.current;
        if (!container) return;
        const containerRect = container.getBoundingClientRect();
        const bounds = boundsRef.current;
        state.x = clamp(
          event.clientX - containerRect.left - state.grabDX,
          0,
          Math.max(0, bounds.width - state.w),
        );
        state.y = clamp(
          event.clientY - containerRect.top - state.grabDY,
          0,
          Math.max(0, bounds.height - state.h),
        );

        const now = performance.now();
        const dt = Math.max(1, now - state.lastPointerT);
        state.vx = ((event.clientX - state.lastPointerX) / dt) * 16;
        state.vy = ((event.clientY - state.lastPointerY) / dt) * 16;
        state.lastPointerX = event.clientX;
        state.lastPointerY = event.clientY;
        state.lastPointerT = now;
      },
      onPointerUp: (event: ReactPointerEvent<HTMLLIElement>) => {
        const state = states.current[index];
        if (!state.dragging) return;
        const el = tagRefs.current[index];
        state.dragging = false;
        el?.releasePointerCapture(event.pointerId);
        if (el) el.style.cursor = "";
        // Se houve arrasto perceptível, retoma na mesma direção (efeito
        // de "soltar" o badge); um clique sem movimento só sorteia uma
        // direção nova.
        const flungSpeed = Math.hypot(state.vx, state.vy);
        state.angle = flungSpeed > 0.15 ? Math.atan2(state.vy, state.vx) : Math.random() * Math.PI * 2;
      },
    };
  }

  return {
    setTagRef: (index: number) => (el: HTMLLIElement | null) => {
      tagRefs.current[index] = el;
    },
    setLineRef: (index: number) => (el: SVGLineElement | null) => {
      lineRefs.current[index] = el;
    },
    getDragHandlers,
  };
}

/**
 * Capítulo 2 — Build. Título e subtítulo ficam ao lado da caixa (em vez
 * de em cima), separados por uma linha fina verde — pedido do usuário.
 * Tecnologias flutuam livremente dentro da caixa, com vídeo de fundo,
 * deriva orgânica e cada uma ligada por uma linha a um ponto fixo no
 * centro; dá pra arrastar qualquer badge. Sob `prefers-reduced-motion`,
 * os mesmos badges aparecem num layout estático (flex-wrap), sem vídeo,
 * linhas, física ou arrasto.
 */
export function Build() {
  const shouldReduceMotion = useReducedMotion();
  const { ref, isInView } = useInView<HTMLElement>();
  const { style } = useChapterTilt({ ref });
  const containerRef = useRef<HTMLDivElement>(null);
  const { setTagRef, setLineRef, getDragHandlers } = useFloatingTags(
    containerRef,
    NODES.length,
    isInView && !shouldReduceMotion,
  );

  return (
    <section
      ref={ref}
      id="build"
      aria-label="Capítulo 2: Build"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-canvas/80 px-6 py-24"
    >
      <m.div
        style={style}
        className="flex w-full max-w-6xl flex-col items-center gap-10 text-center md:flex-row md:text-left"
      >
        <div className="flex flex-col items-center md:w-96 md:shrink-0 md:items-start">
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-text-muted">
            Capítulo 02 / 06 — Build
          </p>
          <h2 className="max-w-xl font-display text-3xl font-bold text-accent-green md:text-4xl">
            Cada tecnologia é uma peça — juntas, viram um sistema.
          </h2>
          <p className="mt-4 max-w-md text-text-secondary">
            Você não aprende ferramentas soltas. Aprende como elas se conectam.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="h-px w-full shrink-0 bg-accent-green/50 md:h-auto md:w-px md:self-stretch"
        />

        <div
          ref={containerRef}
          // Sempre escuro quando o vídeo está presente: os badges são
          // lidos sobre o vídeo (com um véu por cima), não sobre o
          // `canvas` da página — não pode clarear junto com o tema do
          // site. Sob `prefers-reduced-motion` não há vídeo, então a
          // caixa vira um cartão comum e segue o tema normalmente. Ver
          // `globals.css`.
          data-theme={shouldReduceMotion ? undefined : "dark"}
          className="relative h-[300px] w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-surface/40 sm:h-[380px] md:flex-1"
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
                  className={`absolute left-0 top-0 cursor-grab touch-none opacity-0 will-change-transform ${TAG_CLASSES}`}
                  {...getDragHandlers(i)}
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
