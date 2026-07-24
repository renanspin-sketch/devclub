import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import type { AnchorHTMLAttributes } from "react";
import type { NavItem } from "@/types/nav";
import { IconButton } from "@/components/ui/IconButton";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/cn";

import { Container } from "./Container";

export interface HeaderProps {
  navItems?: NavItem[];
}

/**
 * `href` começando com "/" é uma rota (navegação client-side via Router);
 * qualquer outra coisa (ex.: "#contato") é uma âncora normal. Evita que
 * links de rota causem reload de página inteira.
 */
function NavLink({
  href,
  className,
  children,
  ...props
}: { href: string; children: React.ReactNode } & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
>) {
  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...props}>
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

function PersonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="10" cy="6.5" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.5 17c.9-3.6 4-5.5 6.5-5.5s5.6 1.9 6.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
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
          className="font-display text-lg font-bold text-text-primary"
        >
          DevClub
        </Link>

        {navItems.length > 0 && (
          <>
            <div className="hidden items-center gap-6 md:flex">
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
                <Link
                  to="/"
                  className="flex items-center gap-1.5 text-sm text-text-secondary transition duration-fast ease-standard hover:text-text-primary"
                >
                  <PersonIcon />
                  Área do aluno
                </Link>
                <Link to="/" className={buttonVariants({ variant: "primary", size: "sm" })}>
                  Quero fazer parte
                </Link>
              </div>
            </div>

            <IconButton
              ref={menuButtonRef}
              className="md:hidden"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
              aria-controls={menuId}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <MenuIcon open={isMenuOpen} />
            </IconButton>
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
              className="overflow-hidden border-b border-border md:hidden"
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
                  <li className="flex flex-col gap-2 pt-3">
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-1.5 rounded-md px-2 py-2 text-text-secondary transition duration-fast ease-standard hover:bg-surface hover:text-text-primary"
                    >
                      <PersonIcon />
                      Área do aluno
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full")}
                    >
                      Quero fazer parte
                    </Link>
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
