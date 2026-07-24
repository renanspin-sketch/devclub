import { lazy, Suspense } from "react";

import { Boot } from "@/sections/chapters/Boot";
import { Build } from "@/sections/chapters/Build";
import { Deploy } from "@/sections/chapters/Deploy";
import { LevelUp } from "@/sections/chapters/LevelUp";
import { Connect } from "@/sections/chapters/Connect";
import { Hire } from "@/sections/chapters/Hire";

// TODO(Fase B): os 6 capítulos de scrollytelling (Boot→Hire) estão
// completos. As seções abaixo ainda são as antigas, mantidas até a
// próxima passada de limpeza: "Formações" fica redundante com Level Up
// (mesmo dado de `src/data/tracks.ts`), "Community" com Connect, e
// "Hero"/"Contact" com Boot/Hire — Contact segue em uso de verdade por
// enquanto, é o destino real do CTA de `Hire`. Falta também orquestrar o
// indicador lateral "Capítulo X/6" e a paleta evolutiva entre os 6
// capítulos como conjunto, adiado até aqui de propósito (ver ROADMAP.md).
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
      <Connect />
      <Hire />
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
