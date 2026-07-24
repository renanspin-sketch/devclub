import type { NavItem } from "@/types/nav";

export interface ContactContent {
  email: string;
  socialLinks: NavItem[];
}

/**
 * Conteúdo fictício — placeholder claramente substituível pelos dados
 * reais antes da Fase 13 (Deploy Final). Ver ROADMAP.md. Usado pelo
 * `Footer` (socialLinks) e pelo Capítulo 6/Hire (email + socialLinks).
 */
export const contactContent: ContactContent = {
  email: "contato@devclub.dev",
  socialLinks: [
    { label: "GitHub", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
};
