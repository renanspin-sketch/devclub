import { lazy, Suspense } from "react";

import { Boot } from "@/sections/chapters/Boot";

// TODO(Fase B): Boot é o primeiro dos 6 capítulos de scrollytelling —
// protótipo para validação de direção antes dos outros 5 (Build→Hire).
// As seções abaixo ainda são as antigas, mantidas até serem substituídas
// capítulo a capítulo.
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
