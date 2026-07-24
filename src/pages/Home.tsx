import { lazy, Suspense } from "react";

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
