import { lazy, Suspense } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { Hero } from "@/sections/Hero";
import { contactContent } from "@/data/contact";

// Hero fica fora do code splitting: é o conteúdo acima da dobra (LCP),
// carregá-lo sob demanda só atrasaria a primeira renderização. As seções
// abaixo da dobra são carregadas sob demanda — ver ARCHITECTURE.md#estratégias-de-performance.
const About = lazy(() => import("@/sections/About").then((mod) => ({ default: mod.About })));
const Projects = lazy(() =>
  import("@/sections/Projects").then((mod) => ({ default: mod.Projects })),
);
const Skills = lazy(() => import("@/sections/Skills").then((mod) => ({ default: mod.Skills })));
const Contact = lazy(() =>
  import("@/sections/Contact").then((mod) => ({ default: mod.Contact })),
);

const navItems = [
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Skills", href: "#skills" },
  { label: "Contato", href: "#contato" },
];

function App() {
  return (
    // `domAnimation` carrega só animação/gestos/exit — exclui drag e layout
    // projection, que não usamos e respondiam pela maior fatia do bundle
    // (ver relatório do `npm run build:analyze`). `strict` impede o uso
    // acidental de `motion.*` (bundle completo) em vez de `m.*` no futuro.
    <LazyMotion features={domAnimation} strict>
      <SkipLink />
      <Header navItems={navItems} />
      <main id="top" tabIndex={-1} className="outline-none">
        <Hero />
        <Suspense fallback={null}>
          <About />
          <Projects />
          <Skills />
          <Contact />
        </Suspense>
      </main>
      <Footer links={contactContent.socialLinks} />
    </LazyMotion>
  );
}

export default App;
