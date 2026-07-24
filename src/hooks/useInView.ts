import { useRef } from "react";
import { useInView as useFramerInView } from "framer-motion";

export interface UseInViewOptions {
  /** Dispara uma única vez (padrão) ou alterna a cada entrada/saída da viewport. */
  once?: boolean;
}

/**
 * Wrapper fino sobre o `useInView` do Framer Motion, com a margem padrão
 * do projeto (mesma usada pelo `Reveal`) — evita repetir as mesmas opções
 * em cada capítulo/seção que precisa saber se está visível (ex.: ativar o
 * indicador "Capítulo X/6" quando o capítulo entra na viewport).
 */
export function useInView<T extends HTMLElement = HTMLElement>({
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null);
  const isInView = useFramerInView(ref, { once, margin: "-80px" });
  return { ref, isInView };
}
