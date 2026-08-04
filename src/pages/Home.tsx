import { lazy, Suspense, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

import { Boot } from "@/sections/chapters/Boot";

// Só o Boot fica fora do code splitting — é o único capítulo visível no
// primeiro paint (LCP). Os outros 5, mesmo compostos de SVG/Framer Motion
// razoavelmente pesados, ficavam todos no bundle principal antes de virarem
// `lazy` aqui — isso media ~2,5s de atraso no LCP no perfil de CPU
// throttled do Lighthouse mobile.
const Build = lazy(() => import("@/sections/chapters/Build").then((mod) => ({ default: mod.Build })));
const Deploy = lazy(() =>
  import("@/sections/chapters/Deploy").then((mod) => ({ default: mod.Deploy })),
);
const LevelUp = lazy(() =>
  import("@/sections/chapters/LevelUp").then((mod) => ({ default: mod.LevelUp })),
);
const Connect = lazy(() =>
  import("@/sections/chapters/Connect").then((mod) => ({ default: mod.Connect })),
);
const Hire = lazy(() => import("@/sections/chapters/Hire").then((mod) => ({ default: mod.Hire })));

export function Home() {
  const shouldReduceMotion = useReducedMotion();

  // Chega na Home com um hash na URL (ex.: link do menu "Formações" →
  // "/#level-up" clicado de outra página) — rola até o capítulo assim que
  // ele existir no DOM. Os capítulos são `lazy`, então o elemento pode não
  // estar montado ainda no primeiro paint; tenta a cada frame por um
  // tempo curto em vez de assumir que já existe.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    let frameId: number;
    let attempts = 0;
    const tryScroll = () => {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
        return;
      }
      attempts += 1;
      if (attempts < 60) frameId = requestAnimationFrame(tryScroll);
    };
    tryScroll();

    return () => cancelAnimationFrame(frameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Boot />
      <Suspense fallback={null}>
        <Build />
        <Deploy />
        <LevelUp />
        <Connect />
        <Hire />
      </Suspense>
    </>
  );
}
