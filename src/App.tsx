import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/sections/Hero";

const navItems = [
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Contato", href: "#contato" },
];

function App() {
  return (
    <>
      <Header navItems={navItems} />
      <main id="top">
        <Hero />
      </main>
      <Footer />
    </>
  );
}

export default App;
