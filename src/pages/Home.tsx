import { lazy, Suspense } from "react";

import { Hero } from "@/sections/Hero";

// Hero fica fora do code splitting: é o conteúdo acima da dobra (LCP).
// TODO(Fase B): estas seções serão substituídas pelos 6 capítulos de
// scrollytelling (Boot→Hire) — mantidas por enquanto para a Home não
// ficar quebrada enquanto a Fase A (roteamento) é verificada isoladamente.
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
      <Hero />
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
