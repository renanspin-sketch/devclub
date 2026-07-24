import { m } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/layout/Container";
import { useChapterTilt } from "@/hooks/useChapterTilt";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { contactContent } from "@/data/contact";

function CopyIcon({ copied }: { copied: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      {copied ? (
        <path
          d="M4 10l4 4 8-8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M7 7h8v8H7V7Zm-2 2H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

/**
 * Capítulo 6 — Hire, fechamento da jornada de 6 capítulos e fim da página
 * (as seções antigas que existiam abaixo dele foram removidas — Hire
 * herda a funcionalidade real de contato que estava em `Contact`, que
 * não existe mais como seção própria).
 */
export function Hire() {
  const { ref, style } = useChapterTilt<HTMLElement>();
  const { isCopied, copy } = useCopyToClipboard();

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
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={() => copy(contactContent.email)}
                aria-label={
                  isCopied
                    ? "E-mail copiado para a área de transferência"
                    : `Quero fazer parte — copiar e-mail: ${contactContent.email}`
                }
              >
                {isCopied ? "Copiado!" : "Quero fazer parte"}
                <CopyIcon copied={isCopied} />
              </Button>
              <a
                href={`mailto:${contactContent.email}`}
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                Enviar e-mail
              </a>
            </div>
            <p aria-live="polite" className="sr-only">
              {isCopied ? "E-mail copiado para a área de transferência." : ""}
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <ul className="flex items-center gap-6 pt-2 text-sm font-medium">
              {contactContent.socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-text-secondary transition duration-fast ease-standard hover:text-text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </m.div>
    </section>
  );
}
