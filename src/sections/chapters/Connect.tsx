import { m, useReducedMotion } from "framer-motion";

import { useChapterTilt } from "@/hooks/useChapterTilt";
import { useInView } from "@/hooks/useInView";

interface NetworkNode {
  label: string;
  x: number;
  y: number;
}

const NODES: NetworkNode[] = [
  { label: "Alunos", x: -130, y: -130 },
  { label: "Mentores", x: 130, y: -130 },
  { label: "Comunidade", x: -130, y: 130 },
  { label: "Empresas parceiras", x: 130, y: 130 },
];

// Malha: todo par de nós conectado, não um único hub central — reforça a
// ideia de rede distribuída (em vez do padrão "tudo aponta pra você" do
// Capítulo 2/Build).
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 3],
  [2, 3],
];

// Pontos decorativos, sem rótulo — reforçam a sensação de rede povoada
// além dos 4 nós nomeados. Posições fixas (não aleatorizadas a cada
// render) para não invalidar snapshots visuais entre execuções.
const SATELLITES: { left: string; top: string; size: number; delay: number }[] = [
  { left: "12%", top: "22%", size: 6, delay: 0 },
  { left: "82%", top: "18%", size: 5, delay: 0.4 },
  { left: "20%", top: "78%", size: 7, delay: 0.8 },
  { left: "78%", top: "72%", size: 5, delay: 1.2 },
  { left: "50%", top: "8%", size: 4, delay: 0.2 },
  { left: "8%", top: "50%", size: 4, delay: 1.6 },
  { left: "92%", top: "48%", size: 6, delay: 0.6 },
  { left: "50%", top: "92%", size: 5, delay: 1.0 },
];

/**
 * Capítulo 5 — Connect. Alunos, mentores, comunidade e empresas parceiras
 * como uma malha de nós pulsante — todo par conectado (não um hub único),
 * pontos-satélite decorativos reforçam a ideia de rede viva e povoada.
 */
export function Connect() {
  const shouldReduceMotion = useReducedMotion();
  const { ref, isInView } = useInView<HTMLElement>();
  const { style } = useChapterTilt({ ref });

  return (
    <section
      ref={ref}
      id="connect"
      aria-label="Capítulo 5: Connect"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-canvas px-6 py-24 text-center"
    >
      <m.div style={style} className="flex flex-col items-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-text-muted">
          Capítulo 05 / 06 — Connect
        </p>
        <h2 className="max-w-xl font-display text-3xl font-bold text-text-primary md:text-4xl">
          Você não aprende sozinho. Aprende dentro de uma rede.
        </h2>
        <p className="mt-4 max-w-md text-text-secondary">
          Alunos, mentores e empresas parceiras conectados numa comunidade viva.
        </p>

        <div className="relative mt-16 h-[380px] w-[380px] max-w-full sm:h-[420px] sm:w-[420px]">
          <svg
            viewBox="-210 -210 420 420"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            {EDGES.map(([from, to], i) => {
              const a = NODES[from];
              const b = NODES[to];
              const length = Math.hypot(b.x - a.x, b.y - a.y);
              return (
                <m.line
                  key={`${from}-${to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#7C5CFC"
                  strokeWidth={1.5}
                  strokeDasharray={length}
                  initial={{ strokeDashoffset: length, opacity: 0 }}
                  animate={isInView ? { strokeDashoffset: 0, opacity: 0.35 } : {}}
                  transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.7,
                    delay: shouldReduceMotion ? 0 : 0.1 * i,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              );
            })}
          </svg>

          {SATELLITES.map((dot, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`absolute rounded-full bg-accent-cyan/50 ${
                shouldReduceMotion ? "" : "animate-pulse"
              }`}
              style={{
                left: dot.left,
                top: dot.top,
                width: dot.size,
                height: dot.size,
                animationDelay: `${dot.delay}s`,
              }}
            />
          ))}

          {NODES.map((node, i) => (
            <div
              key={node.label}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) translate(${node.x}px, ${node.y}px)`,
              }}
            >
              <m.div
                className="flex h-20 w-20 items-center justify-center rounded-full border border-border-strong bg-surface p-2 text-center font-mono text-[11px] leading-tight text-text-primary shadow-glow-violet"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={
                  isInView
                    ? shouldReduceMotion
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 1, scale: [1, 1.08, 1] }
                    : {}
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0.01, delay: 0 }
                    : {
                        opacity: { duration: 0.4, delay: 0.3 + 0.1 * i },
                        scale: {
                          duration: 2.4,
                          delay: 0.3 + 0.1 * i,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut",
                        },
                      }
                }
              >
                {node.label}
              </m.div>
            </div>
          ))}
        </div>
      </m.div>
    </section>
  );
}
