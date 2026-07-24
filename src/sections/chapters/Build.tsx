import { useMemo } from "react";
import { m, useReducedMotion } from "framer-motion";

import { useChapterTilt } from "@/hooks/useChapterTilt";
import { useInView } from "@/hooks/useInView";

const NODES = ["React", "TypeScript", "Node.js", "Tailwind CSS", "Git", "JavaScript"];
const RADIUS = 170;

function useOrbitPositions(count: number, radius: number) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
      }),
    [count, radius],
  );
}

/**
 * Capítulo 2 — Build. Tecnologias como nós conectados a um centro, linhas
 * desenhando-se progressivamente ao entrar na viewport — representa
 * visualmente "aprender ferramentas conectadas", não uma lista de texto.
 *
 * Cada nó é um wrapper estático (posição via transform simples, translate
 * de centralização + offset orbital compostos numa única string) com um
 * `m.div` filho só pra opacidade/escala — motion e Tailwind não competem
 * pela propriedade `transform` do mesmo elemento, o que quebraria a
 * centralização (motion sobrescreve qualquer transform aplicado via classe).
 */
export function Build() {
  const shouldReduceMotion = useReducedMotion();
  const { ref, isInView } = useInView<HTMLElement>();
  const { style } = useChapterTilt({ ref });
  const positions = useOrbitPositions(NODES.length, RADIUS);

  return (
    <section
      ref={ref}
      id="build"
      aria-label="Capítulo 2: Build"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-canvas px-6 py-24 text-center"
    >
      <m.div style={style} className="flex flex-col items-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-text-muted">
          Capítulo 02 / 06 — Build
        </p>
        <h2 className="max-w-xl font-display text-3xl font-bold text-text-primary md:text-4xl">
          Cada tecnologia é uma peça — juntas, viram um sistema.
        </h2>
        <p className="mt-4 max-w-md text-text-secondary">
          Você não aprende ferramentas soltas. Aprende como elas se conectam.
        </p>

        <div className="relative mt-16 h-[380px] w-[380px] max-w-full sm:h-[420px] sm:w-[420px]">
          <svg
            viewBox="-210 -210 420 420"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              {/* gradientUnits="userSpaceOnUse" com coordenadas absolutas do
                  viewBox — o padrão (objectBoundingBox, 0→1 relativo à caixa
                  do próprio elemento) degenera pra linhas com largura ou
                  altura zero (ex.: uma linha perfeitamente vertical), e o
                  SVG simplesmente não pinta nada nesse caso. */}
              <linearGradient
                id="build-gradient"
                gradientUnits="userSpaceOnUse"
                x1="-210"
                y1="-210"
                x2="210"
                y2="210"
              >
                <stop offset="0" stopColor="#7C5CFC" />
                <stop offset="1" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
            {positions.map((pos, i) => (
              // strokeDasharray/Dashoffset em vez de `pathLength` do Framer
              // Motion: em teste manual, `pathLength` não desenhava as linhas
              // perfeitamente verticais (x1 === x2) de forma confiável — a
              // técnica manual é mecânica SVG pura, sem essa dependência.
              <m.line
                key={NODES[i]}
                x1={0}
                y1={0}
                x2={pos.x}
                y2={pos.y}
                stroke="url(#build-gradient)"
                strokeWidth={1.5}
                strokeDasharray={RADIUS}
                initial={{ strokeDashoffset: RADIUS, opacity: 0 }}
                animate={isInView ? { strokeDashoffset: 0, opacity: 0.6 } : {}}
                transition={{
                  duration: shouldReduceMotion ? 0.01 : 0.8,
                  delay: shouldReduceMotion ? 0 : 0.15 * i,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}
          </svg>

          <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent-gradient font-display text-xs font-bold text-text-primary shadow-glow-violet">
            Você
          </div>

          {positions.map((pos, i) => (
            <div
              key={NODES[i]}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px)`,
              }}
            >
              <m.div
                className="whitespace-nowrap rounded-full border border-border-strong bg-surface px-3 py-2 font-mono text-xs text-text-primary"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: shouldReduceMotion ? 0.01 : 0.4,
                  delay: shouldReduceMotion ? 0 : 0.15 * i + 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {NODES[i]}
              </m.div>
            </div>
          ))}
        </div>
      </m.div>
    </section>
  );
}
