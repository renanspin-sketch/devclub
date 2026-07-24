import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { SkipLink } from "./SkipLink";
import { contactContent } from "@/data/contact";

const navItems = [
  { label: "Nossos Alunos", href: "/nossos-alunos" },
  { label: "Blog", href: "/blog" },
  { label: "Newsletter", href: "/newsletter" },
];

/**
 * Casco persistente entre rotas (header/footer/skip link). A navegação de
 * capítulos da Home (Boot→Hire) fica fora daqui — é um indicador lateral
 * próprio da página, não faz sentido em `/blog` ou `/newsletter`.
 */
export function Layout() {
  return (
    <>
      <SkipLink />
      <Header navItems={navItems} />
      <main id="top" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer links={contactContent.socialLinks} />
    </>
  );
}
