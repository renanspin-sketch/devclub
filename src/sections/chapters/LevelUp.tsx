import { m } from "framer-motion";

import { learningTracks } from "@/data/tracks";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/layout/Container";
import { useChapterTilt } from "@/hooks/useChapterTilt";

/**
 * Primeiras trilhas ficam "desbloqueadas" (fundamentos, ponto de entrada);
 * as demais aparecem como "avançadas" — reforça a metáfora de skill tree
 * sem prometer um mecanismo de acesso real que a plataforma não tem.
 */
const UNLOCKED_COUNT = 3;

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
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

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
      <rect
        x="4.5"
        y="9"
        width="11"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Capítulo 4 — Level Up. As trilhas de formação (`src/data/tracks.ts`)
 * aparecem como uma trilha vertical de skill tree: os fundamentos já
 * "desbloqueados", as especializações aparecem como próximo nível.
 */
export function LevelUp() {
  const { ref, style } = useChapterTilt<HTMLElement>();

  return (
    <section
      ref={ref}
      id="level-up"
      aria-label="Capítulo 4: Level Up"
      className="relative bg-canvas/80 py-24"
    >
      <m.div style={style}>
        <Container>
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              Capítulo 04 / 06 — Level Up
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-bold text-text-primary md:text-4xl">
              Trilhas que se desbloqueiam conforme você avança.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 max-w-md text-text-secondary">
              Comece pelos fundamentos. Cada trilha concluída abre caminho pra próxima
              especialização.
            </p>
          </Reveal>

          <div className="relative mx-auto mt-16 max-w-2xl">
            <div
              aria-hidden="true"
              className="absolute bottom-2 left-[15px] top-2 w-px bg-border-strong"
            />
            <div className="space-y-6">
              {learningTracks.map((track, index) => {
                const isUnlocked = index < UNLOCKED_COUNT;
                return (
                  <Reveal
                    key={track.slug}
                    delay={0.05 * index}
                    className="relative pl-12"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-0.5 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        isUnlocked
                          ? "border-accent-cyan bg-accent-gradient text-white"
                          : "border-border-strong bg-surface text-text-muted"
                      }`}
                    >
                      {isUnlocked ? <CheckIcon /> : <LockIcon />}
                    </span>

                    <div
                      className={`rounded-lg border p-4 transition-colors duration-base ease-standard ${
                        isUnlocked
                          ? "border-border-strong bg-surface"
                          : "border-border bg-surface/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3
                          className={`font-display text-lg font-semibold ${
                            isUnlocked ? "text-text-primary" : "text-text-secondary"
                          }`}
                        >
                          {track.title}
                        </h3>
                        <span
                          className={`shrink-0 font-mono text-[11px] uppercase tracking-wide ${
                            isUnlocked ? "text-accent-cyan" : "text-text-muted"
                          }`}
                        >
                          {isUnlocked ? "Disponível" : "Próximo nível"}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-text-secondary">
                        {track.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Container>
      </m.div>
    </section>
  );
}
