import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { SkipLink } from "./SkipLink";
import { contactContent } from "@/data/contact";
import { useTheme } from "@/context/ThemeContext";
import codeTexture from "@/assets/backgrounds/code-texture.webp";
import codeTextureMobile from "@/assets/backgrounds/code-texture-mobile.webp";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Formações", href: "/formacoes" },
  { label: "MBA", href: "/mba" },
  { label: "Blog", href: "/blog" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Nossos Alunos", href: "/nossos-alunos" },
  { label: "Login", href: "/login" },
];

/**
 * Casco persistente entre rotas (header/footer/skip link). A navegação de
 * capítulos da Home (Boot→Hire) fica fora daqui — é um indicador lateral
 * próprio da página, não faz sentido em `/blog` ou `/newsletter`.
 */
export function Layout() {
  const { theme } = useTheme();

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
          desproporcional ao tamanho de exibição.

          Véu mais claro que antes (pedido do usuário) — deixa a textura
          mais visível. No tema claro a imagem some (`opacity-0`): é uma
          foto escura por natureza, não existe véu que a faça combinar com
          um fundo claro, então o tema claro fica limpo/liso em vez de
          tentar clarear uma imagem que não foi feita pra isso. */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 -z-10 bg-black bg-cover bg-center transition-opacity duration-slower md:hidden ${
          theme === "light" ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.72)), url(${codeTextureMobile})`,
        }}
      />
      <div
        aria-hidden="true"
        className={`fixed inset-0 -z-10 hidden bg-black bg-cover bg-center transition-opacity duration-slower md:block ${
          theme === "light" ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.72)), url(${codeTexture})`,
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
