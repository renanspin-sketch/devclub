import { m, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

export interface RevealProps extends HTMLMotionProps<"div"> {
  /** Atraso em segundos, usado para escalonar a entrada de elementos irmãos. */
  delay?: number;
}

/**
 * Primitivo de scroll-reveal reutilizado por todas as seções de conteúdo
 * (ver DESIGN-SYSTEM.md#animação-e-microinterações). Dispara uma única vez
 * ao entrar na viewport e recolhe para um fade instantâneo quando o usuário
 * prefere movimento reduzido — a checagem fica centralizada aqui para que
 * nenhuma seção precise reimplementá-la.
 */
export function Reveal({ delay = 0, ...props }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.4,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...props}
    />
  );
}
