/**
 * Bypass block (WCAG 2.4.1): primeiro elemento focável da página, permite
 * pular a navegação do Header e ir direto ao conteúdo principal. Fica
 * visualmente oculto até receber foco por teclado.
 */
export function SkipLink() {
  return (
    <a
      href="#top"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-text-primary focus:shadow-lg focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 focus:ring-offset-canvas"
    >
      Pular para o conteúdo principal
    </a>
  );
}
