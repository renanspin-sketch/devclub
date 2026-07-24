import { lazy, Suspense } from "react";

import { Boot } from "@/sections/chapters/Boot";

// TODO(Fase B): os 6 capítulos de scrollytelling (Boot→Hire) estão
// completos. As seções abaixo ainda são as antigas, mantidas até a
// próxima passada de limpeza: "Formações" fica redundante com Level Up
// (mesmo dado de `src/data/tracks.ts`), "Community" com Connect, e
// "Hero"/"Contact" com Boot/Hire — Contact segue em uso de verdade por
// enquanto, é o destino real do CTA de `Hire`. Falta também orquestrar o
// indicador lateral "Capítulo X/6" e a paleta evolutiva entre os 6
// capítulos como conjunto, adiado até aqui de propósito (ver ROADMAP.md).
//
// Só o Boot fica fora do code splitting — é o único capítulo visível no
// primeiro paint (LCP). Os outros 5, mesmo compostos de SVG/Framer Motion
// razoavelmente pesados, ficavam todos no bundle principal antes de virarem
// `lazy` aqui — isso media ~2,5s de atraso no LCP no perfil de CPU
// throttled do Lighthouse mobile (trabalho de parse/exec de JS que a
// página nem tinha renderizado ainda na tela).
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

const Formacoes = lazy(() =>
  import("@/sections/Formacoes").then((mod) => ({ default: mod.Formacoes })),
);
const Stack = lazy(() => import("@/sections/Stack").then((mod) => ({ default: mod.Stack })));
const Community = lazy(() =>
  import("@/sections/Community").then((mod) => ({ default: mod.Community })),
);
const About = lazy(() => import("@/sections/About").then((mod) => ({ default: mod.About })));
const Projects = lazy(() =>
  import("@/sections/Projects").then((mod) => ({ default: mod.Projects })),
);
const Contact = lazy(() =>
  import("@/sections/Contact").then((mod) => ({ default: mod.Contact })),
);

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
        <Formacoes />
        <Stack />
        <Community />
        <About />
        <Projects />
        <Contact />
      </Suspense>
    </>
  );
}
