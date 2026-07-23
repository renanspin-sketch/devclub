import { Button } from "@/components/ui/Button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/layout/Section";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { contactContent } from "@/data/contact";

function CopyIcon({ copied }: { copied: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      {copied ? (
        <path
          d="M4 10l4 4 8-8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M7 7h8v8H7V7Zm-2 2H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function Contact() {
  const { isCopied, copy } = useCopyToClipboard();

  return (
    <Section id="contato" aria-label="Contato">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <Reveal>
          <span className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
            {contactContent.eyebrow}
          </span>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
            {contactContent.heading}
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-lg text-text-secondary">{contactContent.description}</p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => copy(contactContent.email)}
              aria-label={
                isCopied
                  ? "E-mail copiado para a área de transferência"
                  : `Copiar e-mail: ${contactContent.email}`
              }
            >
              {isCopied ? "Copiado!" : contactContent.email}
              <CopyIcon copied={isCopied} />
            </Button>
            <a
              href={`mailto:${contactContent.email}`}
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Enviar e-mail
            </a>
          </div>
          <p aria-live="polite" className="sr-only">
            {isCopied ? "E-mail copiado para a área de transferência." : ""}
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <ul className="flex items-center gap-6 pt-4 text-sm font-medium">
            {contactContent.socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-secondary transition duration-fast ease-standard hover:text-text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
