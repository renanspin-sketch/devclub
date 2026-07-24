import { useRef } from "react";
import { useScroll } from "framer-motion";

/**
 * Progresso de scroll (0→1) de um elemento específico atravessando a
 * viewport inteira (entra por baixo, sai por cima) — usado para animações
 * acopladas ao scroll dentro de um capítulo (ex.: digitação no Boot,
 * montagem de nós no Build), sem repetir o par `useScroll` + `target` em
 * cada capítulo que precisar da mesma lógica.
 */
export function useScrollProgress<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return { ref, progress: scrollYProgress };
}
