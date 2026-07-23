import { useCallback, useState } from "react";

/**
 * Copia texto para a área de transferência e expõe um estado `isCopied`
 * temporário para feedback visual (ver DESIGN-SYSTEM.md#animação-e-microinterações).
 * Genérico o suficiente para ser reutilizado em qualquer botão de "copiar"
 * do produto, não apenas no e-mail de contato.
 */
export function useCopyToClipboard(resetDelayMs = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        window.setTimeout(() => setIsCopied(false), resetDelayMs);
      } catch {
        setIsCopied(false);
      }
    },
    [resetDelayMs],
  );

  return { isCopied, copy };
}
