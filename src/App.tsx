import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Projects } from "@/sections/Projects";
import { Skills } from "@/sections/Skills";

const navItems = [
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Skills", href: "#skills" },
  { label: "Contato", href: "#contato" },
];

function App() {
  return (
    <>
      <Header navItems={navItems} />
      <main id="top">
        <Hero />
        <About />
        <Projects />
        <Skills />
      </main>
      <Footer />
    </>
  );
}

export default App;
