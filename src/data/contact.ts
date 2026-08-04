import type { NavItem } from "@/types/nav";

export interface ContactContent {
  email: string;
  socialLinks: NavItem[];
  /** Link real de WhatsApp fornecido pelo usuário — não é placeholder fictício. */
  whatsapp: string;
}

/**
 * `email`/`socialLinks` são conteúdo fictício — placeholder claramente
 * substituível pelos dados reais antes da Fase 13 (Deploy Final). Ver
 * ROADMAP.md. `whatsapp` é um link real, fornecido pelo usuário, usado
 * pelo CTA "Quero fazer parte" do cabeçalho. Usado pelo `Footer`
 * (socialLinks), pelo `Header` (whatsapp) e pelo Capítulo 6/Hire (email +
 * socialLinks).
 */
export const contactContent: ContactContent = {
  email: "contato@devclub.dev",
  socialLinks: [
    { label: "GitHub", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
  whatsapp:
    "https://api.whatsapp.com/send/?phone=5516990482444&text=quero%20me%20matricular&type=phone_number&app_absent=0",
};
