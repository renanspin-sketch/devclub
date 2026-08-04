import { useRef, useState } from "react";
import { m, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";

import { learningTracks } from "@/data/tracks";
import { Container } from "@/components/layout/Container";

// dvh de faixa de scroll por card, além dos 100dvh do pin em si — controla
// quanto rolar dá pra cada troca de card (mais alto = transição mais lenta).
const CARD_STEP_VH = 45;

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
      <path
        d="M4 10.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Capítulo 4 — Level Up. Pedido do usuário: efeito de "scrollytelling" com
 * pin — a seção fica presa na tela (`sticky`) enquanto uma pilha de cards
 * (as trilhas de `src/data/tracks.ts`) avança um de cada vez, ganha um
 * check ao ser concluído, e dá lugar ao próximo, até a seção soltar e a
 * rolagem seguir normalmente. Mesma técnica de pin já usada no Boot
 * (`useScroll` com `target` na própria section + `useSpring` pra suavizar),
 * adaptada de uma sequência contínua (digitação) pra passos discretos
 * (um card ativo por vez).
 *
 * Sob `prefers-reduced-motion`, vira a lista estática simples (sem pin,
 * sem altura extra de scroll, todos os cards visíveis de uma vez).
 */
export function LevelUp() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.5,
  });
  const progress = shouldReduceMotion ? scrollYProgress : smoothProgress;

  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(progress, "change", (value) => {
    if (shouldReduceMotion) return;
    const step = 1 / learningTracks.length;
    const index = Math.min(learningTracks.length - 1, Math.floor(value / step));
    setActiveIndex(index);
  });

  const sectionHeightVh = 100 + learningTracks.length * CARD_STEP_VH;

  return (
    <section
      ref={sectionRef}
      id="level-up"
      aria-label="Capítulo 4: Level Up"
      style={{ height: shouldReduceMotion ? undefined : `${sectionHeightVh}dvh` }}
      className="relative"
    >
      <div
        className={
          shouldReduceMotion
            ? "bg-canvas/80 py-24"
            : "sticky top-0 flex h-[100dvh] items-center overflow-hidden bg-canvas/80"
        }
      >
        <Container>
          <div className="flex flex-col gap-10 md:flex-row md:items-center">
            <div className="md:w-96 md:shrink-0">
              <h2 className="max-w-xl font-display text-3xl font-bold text-accent-green md:text-4xl">
                Trilhas que se desbloqueiam conforme você avança.
              </h2>
              <p className="mt-4 max-w-md text-text-secondary">
                Comece pelos fundamentos. Cada trilha concluída abre caminho pra próxima
                especialização.
              </p>
            </div>

            <div
              className={
                shouldReduceMotion
                  ? "flex-1 space-y-4"
                  : "relative h-[240px] w-full max-w-xl flex-1"
              }
            >
              {learningTracks.map((track, index) => {
                const status = shouldReduceMotion
                  ? "static"
                  : index < activeIndex
                    ? "done"
                    : index === activeIndex
                      ? "active"
                      : "upcoming";
                // "Concluído" recua (posição/escala) mas mantém opacidade
                // total — reduzir a opacidade do card inteiro (como no
                // protótipo de referência) derruba o contraste do texto
                // pra ~1.7:1 no tema claro (falha WCAG mesmo sendo só
                // 0,35 de opacidade). A sensação de "esmaecido" vem de
                // cores mais neutras + fundo mais translúcido, não de
                // desligar o contraste do texto.
                const isDone = status === "done";

                return (
                  <m.article
                    key={track.slug}
                    className={`rounded-lg border border-l-4 p-6 transition-colors duration-300 ${
                      shouldReduceMotion ? "relative" : "absolute inset-0 backdrop-blur-sm"
                    } ${
                      isDone
                        ? "border-white/5 border-l-border-strong bg-surface/50"
                        : "border-white/10 border-l-accent-violet bg-surface/90"
                    }`}
                    animate={
                      status === "active" || status === "static"
                        ? { opacity: 1, y: 0, scale: 1 }
                        : isDone
                          ? { opacity: 1, y: -18, scale: 0.94 }
                          : { opacity: 0, y: 60, scale: 0.96 }
                    }
                    transition={{
                      duration: shouldReduceMotion ? 0.01 : 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <span
                      className={`mb-1.5 block font-mono text-[11px] uppercase tracking-wide ${
                        isDone ? "text-text-muted" : "text-accent-cyan"
                      }`}
                    >
                      Trilha {index + 1} de {learningTracks.length}
                    </span>
                    <h3
                      className={`font-display text-xl font-semibold ${
                        isDone ? "text-text-secondary" : "text-text-primary"
                      }`}
                    >
                      {track.title}
                    </h3>
                    <p className={`mt-1.5 text-sm ${isDone ? "text-text-muted" : "text-text-secondary"}`}>
                      {track.description}
                    </p>

                    {!shouldReduceMotion && (
                      <span
                        aria-hidden="true"
                        className={`absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-accent-gradient text-white transition-[opacity,transform] duration-300 ${
                          isDone ? "scale-100 opacity-100" : "scale-50 opacity-0"
                        }`}
                      >
                        <CheckIcon />
                      </span>
                    )}
                  </m.article>
                );
              })}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
