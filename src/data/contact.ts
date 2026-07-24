import type { NavItem } from "@/types/nav";

export interface ContactContent {
  eyebrow: string;
  heading: string;
  description: string;
  email: string;
  socialLinks: NavItem[];
}

/**
 * Conteúdo fictício — placeholder claramente substituível pelos dados
 * reais antes da Fase 13 (Deploy Final). Ver ROADMAP.md.
 */
export const contactContent: ContactContent = {
  eyebrow: "Vamos conversar",
  heading: "Contato",
  description:
    "Tem uma vaga, um projeto ou só quer trocar uma ideia sobre front-end? Meu e-mail está sempre aberto.",
  email: "contato@devclub.dev",
  socialLinks: [
    { label: "GitHub", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
};
