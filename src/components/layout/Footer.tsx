import type { NavItem } from "@/types/nav";

import { Container } from "./Container";

export interface FooterProps {
  links?: NavItem[];
}

export function Footer({ links = [] }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-8">
      <Container className="flex flex-col items-center justify-between gap-4 text-sm text-text-muted md:flex-row">
        <p>© {year} DevClub. Todos os direitos reservados.</p>
        {links.length > 0 && (
          <ul className="flex items-center gap-4">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="transition duration-fast ease-standard hover:text-text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </footer>
  );
}
