import { useEffect, useRef, useState } from "react";
import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { useScrollFrameSequence } from "@/hooks/useScrollFrameSequence";

// Vite resolve os 28 frames em ordem alfabética (frame-001.webp ...
// frame-028.webp) — já otimizados (854×480, WebP) a partir da sequência
// original fornecida pelo usuário (55 frames, 1 a cada 2 usado aqui: o
// scrub por scroll não precisa da densidade de um vídeo de verdade).
const frameModules = import.meta.glob("@/assets/backgrounds/boot-sequence/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const FRAMES = Object.keys(frameModules)
  .sort()
  .map((key) => frameModules[key]);

const QUESTION = "E se sua carreira começasse com uma linha de código?";
// Fração do progresso de scroll do capítulo dedicada a digitar o texto —
// o resto do scroll fica só pra sequência de imagens continuar por trás.
const TEXT_PROGRESS_END = 0.55;

/**
 * Capítulo 1 — Boot. Substitui o hero tradicional: um trecho de scroll
 * "pinado" (section alta + conteúdo `sticky`) onde a pergunta de abertura
 * se digita e a sequência de imagens de fundo avança conforme o usuário
 * rola — não mais um timer. Sob `prefers-reduced-motion`, vira uma seção
 * simples de 1 viewport com o texto completo e o último frame, estático.
 *
 * A/B de acessibilidade: o texto animado é `aria-hidden` (puramente
 * decorativo) e o `<h1>` carrega a pergunta completa via um span
 * `sr-only`, disponível desde o primeiro paint — não depende do scroll.
 */
export function Boot() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Suaviza o progresso bruto do scroll com uma mola crítica-mente
  // amortecida (sem oscilar, só desacelera) — sem isso, cada frame/letra
  // seguia a posição do scroll 1:1, o que lia como "duro"/abrupto num
  // scroll rápido (roda do mouse, flick de trackpad). `mass` baixo +
  // `damping` alto dão a sensação de "puxar com atraso suave" sem parecer
  // desconectado da rolagem real. Sob reduced-motion usa o valor bruto —
  // suavização de scroll é decorativa, não crítica pra funcionalidade.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.5,
  });
  const progress = shouldReduceMotion ? scrollYProgress : smoothProgress;
  // Único `useScroll` do capítulo (não duplica com `useChapterTilt`, que
  // criaria uma segunda medição de geometria da mesma section) — o fade de
  // saída usa a cauda da mesma faixa de progresso que já dirige texto e
  // imagens: por volta de 85% o pin ainda está preso, então o texto já
  // está totalmente apagado quando a seção começa a rolar embora de vez.
  const exitOpacity = useTransform(
    progress,
    [0, 0.85, 1],
    shouldReduceMotion ? [1, 1, 1] : [1, 1, 0],
  );
  const { canvasRef } = useScrollFrameSequence({
    progress,
    frameUrls: shouldReduceMotion ? [] : FRAMES,
  });

  const typedTextRef = useRef<HTMLSpanElement>(null);
  const isDoneRef = useRef(shouldReduceMotion ?? false);
  const [isDone, setIsDone] = useState(shouldReduceMotion ?? false);

  const applyProgress = (value: number) => {
    const t = Math.min(1, value / TEXT_PROGRESS_END);
    const length = Math.round(t * QUESTION.length);
    if (typedTextRef.current) typedTextRef.current.textContent = QUESTION.slice(0, length);
    const done = length >= QUESTION.length;
    if (done !== isDoneRef.current) {
      isDoneRef.current = done;
      setIsDone(done);
    }
  };

  // Sob reduced-motion, mostra o texto completo de uma vez — sem
  // digitação, sem depender de scroll. Do contrário, sincroniza com a
  // posição de scroll atual no mount (ex.: usuário recarregou a página já
  // rolada) — `useMotionValueEvent` só dispara em mudanças futuras, não
  // com o valor corrente na hora da inscrição.
  useEffect(() => {
    if (shouldReduceMotion) {
      if (typedTextRef.current) typedTextRef.current.textContent = QUESTION;
      return;
    }
    applyProgress(progress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReduceMotion]);

  useMotionValueEvent(progress, "change", (value) => {
    if (shouldReduceMotion) return;
    applyProgress(value);
  });

  return (
    <section
      ref={sectionRef}
      id="boot"
      aria-label="Capítulo 1: Boot"
      // Sempre escuro: o texto aqui é lido sobre a própria sequência de
      // imagens (com um véu escuro por cima), não sobre o `canvas` da
      // página — não pode clarear junto com o tema do site. Ver `globals.css`.
      data-theme="dark"
      style={{ height: shouldReduceMotion ? undefined : "260dvh" }}
      className="relative"
    >
      <div className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center overflow-hidden bg-black px-6 text-center">
        {shouldReduceMotion ? (
          <img
            src={FRAMES[FRAMES.length - 1]}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/75 to-black/85"
        />

        <m.div style={{ opacity: exitOpacity }} className="relative z-10 flex flex-col items-center">
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-text-muted">
            Capítulo 01 / 06 — Boot
          </p>

          <h1 className="grid max-w-2xl font-mono text-2xl leading-snug text-accent-green sm:text-3xl md:text-4xl">
            {/* Cópia invisível do texto completo, empilhada na mesma célula
                de grid — reserva a altura final (2 linhas) desde o primeiro
                paint, pra digitação não empurrar o conteúdo abaixo aos
                poucos (Cumulative Layout Shift de verdade, não só visual). */}
            <span aria-hidden="true" className="invisible col-start-1 row-start-1">
              {QUESTION}
            </span>
            <span aria-hidden="true" className="col-start-1 row-start-1">
              <span ref={typedTextRef} />
              <span
                className="ml-0.5 inline-block h-[0.9em] w-[0.5em] translate-y-[0.12em] animate-blink bg-accent-green align-middle"
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
      </div>
    </section>
  );
}
