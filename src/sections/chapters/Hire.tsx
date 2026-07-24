import { m } from "framer-motion";

import { buttonVariants } from "@/components/ui/button-variants";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/layout/Container";
import { useChapterTilt } from "@/hooks/useChapterTilt";

/**
 * Capítulo 6 — Hire, fechamento da jornada de 6 capítulos. O CTA aponta
 * pra `#contato`, a seção real (com cópia de e-mail funcional) que ainda
 * segue renderizada em `Home` — não é um link morto pra uma página de
 * inscrição que não existe.
 */
export function Hire() {
  const { ref, style } = useChapterTilt<HTMLElement>();

  return (
    <section
      ref={ref}
      id="hire"
      aria-label="Capítulo 6: Hire"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-canvas/80 px-6 py-24 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-gradient opacity-25 blur-3xl"
      />

      <m.div style={style}>
        <Container className="flex flex-col items-center gap-6">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              Capítulo 06 / 06 — Hire
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="max-w-3xl font-display text-4xl font-bold text-text-primary md:text-5xl">
              Do primeiro <code className="font-mono text-accent-cyan">console.log</code>{" "}
              à{" "}
              <span className="bg-accent-gradient bg-clip-text text-transparent">
                primeira contratação
              </span>
              .
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="max-w-xl text-lg text-text-secondary">
              Seis capítulos, uma trilha só: a sua. Formação prática, projetos reais e uma
              comunidade que empurra pra frente — o próximo commit é seu.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#contato"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                Quero fazer parte
              </a>
              <a
                href="#level-up"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                Ver trilhas de formação
              </a>
            </div>
          </Reveal>
        </Container>
      </m.div>
    </section>
  );
}
