import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import type { AnchorHTMLAttributes, MouseEvent as ReactMouseEvent } from "react";
import type { NavItem } from "@/types/nav";
import { IconButton } from "@/components/ui/IconButton";
import { buttonVariants } from "@/components/ui/button-variants";
import { contactContent } from "@/data/contact";
import { cn } from "@/lib/cn";
import { useTheme } from "@/context/ThemeContext";
import logoIcon from "@/assets/icons/icone.png";

import { Container } from "./Container";

export interface HeaderProps {
  navItems?: NavItem[];
}

/**
 * Quatro tipos de `href`, cada um tratado de um jeito:
 * - `"/"` (Home): pedido do usuário — força reload de página (âncora
 *   simples), não navegação client-side.
 * - `"/#algo"` (ex.: `Formações` → `#level-up`): âncora pra uma seção da
 *   Home. Se já estiver na Home, rola direto até lá sem navegar de novo.
 *   Se estiver em outra página, deixa o `<Link>` navegar normalmente — o
 *   hash fica na URL e a Home rola até lá sozinha assim que o capítulo
 *   (lazy) montar (ver `Home.tsx`).
 * - Rota interna comum (`/sobre` etc.): `<Link>` normal do Router.
 * - Absoluto (`http...`): link externo de verdade (não é rota deste
 *   site) — abre em nova aba.
 */
function NavLink({
  href,
  className,
  children,
  onClick,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  onClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  if (href === "/") {
    return (
      <a href="/" className={className} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  const hashIndex = href.indexOf("#");
  if (href.startsWith("/") && hashIndex !== -1) {
    const targetPath = href.slice(0, hashIndex) || "/";
    const targetHash = href.slice(hashIndex + 1);
    return (
      <Link
        to={href}
        className={className}
        onClick={(event) => {
          onClick?.(event);
          if (window.location.pathname === targetPath) {
            event.preventDefault();
            document.getElementById(targetHash)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
        {...props}
      >
        {children}
      </Link>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="10" cy="10" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.4 4.6l-1.4 1.4M6 14l-1.4 1.4M15.4 15.4L14 14M6 6 4.6 4.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M17.2 11.5A7.3 7.3 0 0 1 8.5 2.8a6 6 0 1 0 8.7 8.7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Alterna entre os temas — mostra o ícone do tema pra onde o clique leva. */
function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <IconButton
      size="sm"
      className={className}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      onClick={toggleTheme}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </IconButton>
  );
}

export function Header({ navItems = [] }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();
  const shouldReduceMotion = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Fecha com Esc e devolve o foco ao botão que abriu o menu — padrão
  // esperado para menus tipo disclosure, inclusive quando o usuário já
  // tabulou para dentro do menu (ou além dele) antes de pressionar Esc.
  useEffect(() => {
    if (!isMenuOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-canvas/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          onClick={() => setIsMenuOpen(false)}
          className="flex items-center gap-2 font-display text-lg font-bold text-text-primary"
        >
          <img
            src={logoIcon}
            alt=""
            aria-hidden="true"
            width={39}
            height={42}
            className="h-7 w-auto [image-rendering:pixelated]"
          />
          DevClub
        </Link>

        {navItems.length > 0 && (
          <>
            {/* 6 itens + CTA não cabem numa linha antes de `lg` (1024px)
                — testado em 768px e quebrava em duas linhas; 900px já
                cabia, mas `lg` é o breakpoint padrão mais próximo com
                folga real. */}
            <div className="hidden items-center gap-6 lg:flex">
              <nav aria-label="Navegação principal">
                <ul className="flex items-center gap-6">
                  {navItems.map((item) => (
                    <li key={item.label}>
                      <NavLink
                        href={item.href}
                        className="text-sm text-text-secondary transition duration-fast ease-standard hover:text-text-primary"
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="flex items-center gap-4 border-l border-border pl-6">
                <ThemeToggle />
                <a
                  href={contactContent.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({ variant: "primary", size: "sm" })}
                >
                  Quero fazer parte
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1 lg:hidden">
              <ThemeToggle />
              <IconButton
                ref={menuButtonRef}
                aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={isMenuOpen}
                aria-controls={menuId}
                onClick={() => setIsMenuOpen((open) => !open)}
              >
                <MenuIcon open={isMenuOpen} />
              </IconButton>
            </div>
          </>
        )}
      </Container>

      {navItems.length > 0 && (
        <AnimatePresence initial={false}>
          {isMenuOpen && (
            <m.nav
              id={menuId}
              aria-label="Navegação principal"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden border-b border-border lg:hidden"
            >
              <Container>
                <ul className="flex flex-col gap-1 py-4">
                  {navItems.map((item) => (
                    <li key={item.label}>
                      <NavLink
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block rounded-md px-2 py-2 text-text-secondary transition duration-fast ease-standard hover:bg-surface hover:text-text-primary"
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                  <li className="pt-3">
                    <a
                      href={contactContent.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full")}
                    >
                      Quero fazer parte
                    </a>
                  </li>
                </ul>
              </Container>
            </m.nav>
          )}
        </AnimatePresence>
      )}
    </header>
  );
}
