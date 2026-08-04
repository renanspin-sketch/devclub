import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { useMotionValueEvent } from "framer-motion";

interface UseScrollFrameSequenceOptions {
  /** Progresso de 0 a 1 (normalmente vindo de `useScroll`) que dirige qual frame é desenhado. */
  progress: MotionValue<number>;
  /** Vazio desliga o hook por completo (ex.: sob `prefers-reduced-motion`, onde o chamador renderiza um fallback estático próprio em vez do canvas). */
  frameUrls: string[];
}

// Quantos frames à frente do índice atual ficam pré-carregados, pra
// suavizar scroll rápido sem precisar buscar todos de uma vez.
const LOOKAHEAD = 3;

/**
 * Desenha uma sequência de imagens num `<canvas>` conforme o scroll avança —
 * a técnica por trás de aberturas "scroll-scrubbed" (ex.: páginas de
 * produto com vídeo controlado pelo scroll). Usa `<canvas>` em vez de
 * trocar o `src` de um `<img>`: desenhar uma imagem já decodificada em
 * memória é mais barato que forçar o navegador a redecodificar a cada
 * frame — e, sem menos importância, `<canvas>` não entra nas heurísticas
 * de LCP do Chrome (que hoje só consideram `<img>`, `background-image` e
 * texto), então a métrica continua medindo o conteúdo real da página.
 *
 * Os frames são carregados sob demanda (só o 1º de imediato, os outros
 * conforme o scroll se aproxima deles, com uma pequena folga à frente) —
 * não todos de uma vez no mount. Carregar as 28 imagens juntas no início
 * derrubou o Lighthouse mobile de 95 pra 81 (medido): mesmo adiando pra
 * `requestIdleCallback`, o disparo de 27 requisições + decodificações em
 * rajada continuava competindo com o carregamento crítico da página. Como
 * os frames além do primeiro só ficam visíveis depois que o usuário rola
 * ~120dvh, não faz sentido buscá-los antes de precisar.
 */
export function useScrollFrameSequence({ progress, frameUrls }: UseScrollFrameSequenceOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadingRef = useRef<Set<number>>(new Set());
  const currentFrameRef = useRef(0);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    const ctx = canvas?.getContext("2d");
    if (!canvas || !img || !ctx || !img.complete || canvas.width === 0) return;

    // Emula `object-fit: cover` — canvas não tem isso nativamente.
    const { width, height } = canvas;
    const canvasRatio = width / height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;
    if (imgRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    } else {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    }
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  const loadFrame = (i: number, onReady?: () => void) => {
    if (imagesRef.current[i] || loadingRef.current.has(i)) return;
    loadingRef.current.add(i);
    const img = new Image();
    img.decoding = "async";
    img.src = frameUrls[i];
    img.onload = () => {
      loadingRef.current.delete(i);
      imagesRef.current[i] = img;
      onReady?.();
    };
    img.onerror = () => loadingRef.current.delete(i);
  };

  useEffect(() => {
    if (frameUrls.length === 0) return;
    imagesRef.current = new Array(frameUrls.length).fill(null);
    loadingRef.current.clear();
    loadFrame(0, () => drawFrame(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loadFrame/drawFrame são recriadas por render mas leem só refs estáveis
  }, [frameUrls]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // `ResizeObserver` em vez de ler `getBoundingClientRect` + escutar
    // `resize` da window: o callback do observer já roda depois do layout
    // assentar, sem forçar um recálculo síncrono no meio do mount (que o
    // Lighthouse pegou como "forced reflow" real quando isso lia geometria
    // e escrevia `canvas.width`/`height` na mesma função).
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { inlineSize: width, blockSize: height } = entry.contentBoxSize[0];
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      drawFrame(currentFrameRef.current);
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(progress, "change", (value) => {
    if (frameUrls.length === 0) return;
    const targetIndex = Math.min(
      frameUrls.length - 1,
      Math.max(0, Math.floor(value * frameUrls.length)),
    );

    // Puxa o alvo e alguns frames à frente (na direção do scroll) sob
    // demanda — sem isso, cada frame novo só apareceria depois de um
    // ciclo de rede completo, visivelmente atrasado do movimento do scroll.
    for (let i = targetIndex; i <= Math.min(frameUrls.length - 1, targetIndex + LOOKAHEAD); i++) {
      loadFrame(i, () => {
        if (i === currentFrameRef.current) drawFrame(i);
      });
    }

    // Mostra o carregado mais próximo do alvo (pra baixo) em vez de
    // deixar o canvas parado num frame antigo enquanto o alvo carrega.
    let index = targetIndex;
    while (index > 0 && !imagesRef.current[index]) index--;
    if (index === currentFrameRef.current && imagesRef.current[index]) return;
    currentFrameRef.current = index;
    drawFrame(index);
  });

  return { canvasRef };
}
