import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Footer } from "./Footer";

describe("Footer", () => {
  it("renderiza o copyright com o ano atual", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} DevClub. Todos os direitos reservados.`)).toBeInTheDocument();
  });

  it("sem links, não renderiza a lista", () => {
    render(<Footer />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("com links, renderiza cada um com o href correto", () => {
    const links = [
      { label: "GitHub", href: "https://github.com/example" },
      { label: "LinkedIn", href: "https://linkedin.com/in/example" },
    ];
    render(<Footer links={links} />);

    for (const link of links) {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute("href", link.href);
    }
  });
});
