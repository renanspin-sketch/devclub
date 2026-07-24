import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Hire } from "./Hire";
import { contactContent } from "@/data/contact";

describe("Hire", () => {
  it("CTA primário copia o e-mail e dá feedback visual", async () => {
    // userEvent.setup() instala seu próprio stub de clipboard — por isso o
    // mock precisa ser definido DEPOIS do setup(), não antes (um
    // Object.defineProperty em beforeEach seria sobrescrito).
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
      writable: true,
    });

    render(<Hire />);

    const copyButton = screen.getByRole("button", {
      name: `Quero fazer parte — copiar e-mail: ${contactContent.email}`,
    });
    await user.click(copyButton);

    expect(writeText).toHaveBeenCalledWith(contactContent.email);
    expect(
      screen.getByRole("button", { name: "E-mail copiado para a área de transferência" }),
    ).toHaveTextContent("Copiado!");
  });

  it("link 'Enviar e-mail' usa mailto: com o endereço correto", () => {
    render(<Hire />);
    const mailLink = screen.getByRole("link", { name: "Enviar e-mail" });
    expect(mailLink).toHaveAttribute("href", `mailto:${contactContent.email}`);
  });

  it("renderiza todos os links sociais do conteúdo", () => {
    render(<Hire />);
    for (const social of contactContent.socialLinks) {
      expect(screen.getByRole("link", { name: social.label })).toHaveAttribute(
        "href",
        social.href,
      );
    }
  });
});
