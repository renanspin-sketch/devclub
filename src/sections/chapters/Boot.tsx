import { useEffect, useState } from "react";
import { m, useReducedMotion } from "framer-motion";

import { useChapterTilt } from "@/hooks/useChapterTilt";

const PROMPT = "$ ";
const QUESTION = "E se sua carreira começasse com uma linha de código?";
const TYPE_SPEED_MS = 45;

/**
 * Capítulo 1 — Boot. Substitui o hero tradicional: terminal escuro,
 * cursor piscando, pergunta de abertura digitada em tempo real.
 *
 * A/B de acessibilidade do efeito de digitação: o texto animado fica
 * `aria-hidden` (é puramente decorativo) e o `<h1>` carrega a pergunta
 * completa via um span `sr-only` — leitor de tela não espera a animação
 * nem recebe fragmentos parciais.
 */
export function Boot() {
  const shouldReduceMotion = useReducedMotion();
  const { ref, style } = useChapterTilt<HTMLElement>({ withEntry: false, withRotate: false });
  const [typedLength, setTypedLength] = useState(
    shouldReduceMotion ? QUESTION.length : 0,
  );

  useEffect(() => {
    if (shouldReduceMotion || typedLength >= QUESTION.length) return;
    const timeout = window.setTimeout(() => setTypedLength((n) => n + 1), TYPE_SPEED_MS);
    return () => window.clearTimeout(timeout);
  }, [typedLength, shouldReduceMotion]);

  const typedText = QUESTION.slice(0, typedLength);
  const isDone = typedLength >= QUESTION.length;

  return (
    <section
      ref={ref}
      id="boot"
      aria-label="Capítulo 1: Boot"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-black/80 px-6 text-center"
    >
      <m.div style={style} className="relative z-10 flex flex-col items-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-text-muted">
          Capítulo 01 / 06 — Boot
        </p>

        <h1 className="grid max-w-2xl font-mono text-2xl leading-snug text-accent-cyan sm:text-3xl md:text-4xl">
          {/* Cópia invisível do texto completo, empilhada na mesma célula de
              grid — reserva a altura final (2 linhas) desde o primeiro
              paint, pra digitação não empurrar o conteúdo abaixo aos
              poucos (esse "empurrão" contava como Cumulative Layout Shift
              de verdade, medido via Lighthouse). */}
          <span aria-hidden="true" className="invisible col-start-1 row-start-1">
            {PROMPT}
            {QUESTION}
          </span>
          <span aria-hidden="true" className="col-start-1 row-start-1">
            {PROMPT}
            {typedText}
            <span
              className="ml-0.5 inline-block h-[0.9em] w-[0.5em] translate-y-[0.12em] animate-blink bg-accent-cyan align-middle"
              aria-hidden="true"
            />
          </span>
          <span className="sr-only">{QUESTION}</span>
        </h1>

        <div
          className={`mt-16 flex flex-col items-center gap-2 text-text-muted transition-opacity duration-slower ${
            isDone ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          <span className="font-mono text-xs uppercase tracking-widest">
            Role para continuar
          </span>
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 animate-bounce">
            <path
              d="M4 7l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </m.div>
    </section>
  );
}
