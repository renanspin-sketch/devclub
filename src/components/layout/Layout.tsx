import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { SkipLink } from "./SkipLink";
import { contactContent } from "@/data/contact";
import codeTexture from "@/assets/backgrounds/code-texture.webp";
import codeTextureMobile from "@/assets/backgrounds/code-texture-mobile.webp";

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
      {/* Fundo fixo em toda a navegação, atrás de header/conteúdo/footer.
          Cada seção com fundo próprio (`bg-canvas/80` etc.) deixa passar um
          pouco dessa camada; seções sem fundo (as antigas, via `Section`)
          mostram a imagem quase integralmente por trás. `fixed` pra não
          repetir/rolar junto com o conteúdo.

          Duas variantes (640px mobile / 1920px desktop) — `background-image`
          não tem `srcset`, então a troca por breakpoint é feita com duas
          divs visíveis condicionalmente. Servir a versão de 1920px pra uma
          viewport de ~400px media medida 0.5 no Lighthouse por imagem
          desproporcional ao tamanho de exibição. */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-black bg-cover bg-center md:hidden"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.82), rgba(0,0,0,0.9)), url(${codeTextureMobile})`,
        }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 hidden bg-black bg-cover bg-center md:block"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.82), rgba(0,0,0,0.9)), url(${codeTexture})`,
        }}
      />
      <SkipLink />
      <Header navItems={navItems} />
      <main id="top" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer links={contactContent.socialLinks} />
    </>
  );
}
