import { lazy, Suspense } from "react";

import { Boot } from "@/sections/chapters/Boot";
import { Build } from "@/sections/chapters/Build";
import { Deploy } from "@/sections/chapters/Deploy";
import { LevelUp } from "@/sections/chapters/LevelUp";

// TODO(Fase B): Boot, Build, Deploy e Level Up são os 4 primeiros dos 6
// capítulos de scrollytelling — os outros 2 (Connect e Hire) ainda faltam.
// As seções abaixo ainda são as antigas, mantidas até serem substituídas
// capítulo a capítulo. A seção "Formações" em particular fica redundante
// com Level Up (mesmo dado de `src/data/tracks.ts`) — será removida quando
// os 6 capítulos estiverem completos.
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
      <Build />
      <Deploy />
      <LevelUp />
      <Suspense fallback={null}>
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
