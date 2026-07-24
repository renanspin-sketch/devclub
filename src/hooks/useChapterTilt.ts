import { useRef } from "react";
import type { RefObject } from "react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";

interface UseChapterTiltOptions<T extends HTMLElement> {
  /** Reaproveita um ref já existente no capítulo (ex.: o mesmo de `useInView`) em vez de criar um novo. */
  ref?: RefObject<T>;
  /**
   * Falso para capítulos sem "capítulo anterior" pra conectar visualmente
   * (hoje só o Boot, que abre a página — no carregamento ele já está
   * totalmente visível, não "entrando" de lugar nenhum). Nesse caso só a
   * saída (inclinando pro próximo capítulo) é animada.
   */
  withEntry?: boolean;
}

/**
 * Dá aos capítulos da Home uma sensação de profundidade 3D conectando um ao
 * outro: cada capítulo inclina levemente ao entrar (como se estivesse
 * emergindo de baixo) e sai inclinando pro lado oposto (como se recuasse
 * pra dentro da tela) conforme o próximo assume seu lugar. `transformPerspective`
 * fica no próprio elemento animado — não depende de nenhum ancestral com
 * `perspective` no CSS, então não exige mudar o layout de `Home`.
 */
export function useChapterTilt<T extends HTMLElement = HTMLElement>({
  ref: externalRef,
  withEntry = true,
}: UseChapterTiltOptions<T> = {}) {
  const internalRef = useRef<T>(null);
  const ref = externalRef ?? internalRef;
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Sem entrada: a progressão só passa a existir quando a base do
    // capítulo se aproxima do topo da viewport (início da saída) —
    // evita que o Boot nasça com um tilt/fade que nunca teve "entrada".
    offset: withEntry ? ["start end", "end start"] : ["end end", "end start"],
  });

  const input = withEntry ? [0, 0.5, 1] : [0, 1];
  const rotateOutput = shouldReduceMotion
    ? input.map(() => 0)
    : withEntry
      ? [8, 0, -8]
      : [0, -8];
  const scaleOutput = shouldReduceMotion
    ? input.map(() => 1)
    : withEntry
      ? [0.94, 1, 0.94]
      : [1, 0.94];
  const opacityInput = withEntry ? [0, 0.2, 0.8, 1] : [0, 0.8, 1];
  const opacityOutput = withEntry ? [0, 1, 1, 0] : [1, 1, 0];

  const rotateX = useTransform(scrollYProgress, input, rotateOutput);
  const scale = useTransform(scrollYProgress, input, scaleOutput);
  const opacity = useTransform(scrollYProgress, opacityInput, opacityOutput);

  return { ref, style: { rotateX, scale, opacity, transformPerspective: 1000 } };
}
