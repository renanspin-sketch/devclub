export interface CommunityPillar {
  slug: string;
  title: string;
  description: string;
}

/**
 * Conteúdo fictício — placeholder claramente substituível pelos pilares
 * reais antes da Fase 13 (Deploy Final). Ver ROADMAP.md.
 *
 * Escrito sem alegações não verificáveis (números de escala, superlativos
 * do tipo "maior comunidade do Brasil", serviços específicos que não
 * existem) — ver decisão registrada no CHANGELOG.md.
 */
export const communityPillars: CommunityPillar[] = [
  {
    slug: "mentoria",
    title: "Mentoria com quem já passou pelo caminho",
    description:
      "Orientação de desenvolvedores atuantes no mercado, pra destravar decisões técnicas e de carreira.",
  },
  {
    slug: "comunidade",
    title: "Comunidade ativa",
    description:
      "Espaço pra tirar dúvida, compartilhar código e evoluir junto com quem está na mesma jornada.",
  },
  {
    slug: "entrevistas",
    title: "Preparação pra entrevistas",
    description:
      "Currículo, portfólio e simulações pra chegar mais seguro na conversa que importa.",
  },
  {
    slug: "rede",
    title: "Rede de indicações",
    description:
      "Conexões dentro da comunidade que ajudam a encurtar o caminho até a primeira vaga.",
  },
];
