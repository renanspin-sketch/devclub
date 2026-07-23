import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { NavItem } from "@/types/nav";
import { IconButton } from "@/components/ui/IconButton";

import { Container } from "./Container";

export interface HeaderProps {
  navItems?: NavItem[];
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

export function Header({ navItems = [] }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();

  // Fecha com Esc — padrão esperado para menus tipo disclosure.
  useEffect(() => {
    if (!isMenuOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-canvas/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a
          href="#top"
          onClick={() => setIsMenuOpen(false)}
          className="font-display text-lg font-bold text-text-primary"
        >
          DevClub
        </a>

        {navItems.length > 0 && (
          <>
            <nav aria-label="Navegação principal" className="hidden md:block">
              <ul className="flex items-center gap-6">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-text-secondary transition duration-fast ease-standard hover:text-text-primary"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <IconButton
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
            <motion.nav
              id={menuId}
              aria-label="Navegação principal"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden border-b border-border md:hidden"
            >
              <Container>
                <ul className="flex flex-col gap-1 py-4">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block rounded-md px-2 py-2 text-text-secondary transition duration-fast ease-standard hover:bg-surface hover:text-text-primary"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Container>
            </motion.nav>
          )}
        </AnimatePresence>
      )}
    </header>
  );
}
