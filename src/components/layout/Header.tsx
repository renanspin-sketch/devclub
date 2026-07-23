import type { NavItem } from "@/types/nav";

import { Container } from "./Container";

export interface HeaderProps {
  navItems?: NavItem[];
}

export function Header({ navItems = [] }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-canvas/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="font-display text-lg font-bold text-text-primary">
          DevClub
        </a>
        {navItems.length > 0 && (
          <nav aria-label="Navegação principal">
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
        )}
      </Container>
    </header>
  );
}
