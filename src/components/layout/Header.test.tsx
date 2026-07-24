import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Header } from "./Header";

const navItems = [
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

describe("Header", () => {
  it("renderiza a logo e os links de navegação", () => {
    render(<Header navItems={navItems} />);
    expect(screen.getByRole("link", { name: "DevClub" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Sobre" })).toHaveLength(1);
  });

  it("sem navItems, não renderiza nav nem botão de menu", () => {
    render(<Header navItems={[]} />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("abre o menu mobile ao clicar, expõe aria-expanded e um segundo conjunto de links", async () => {
    const user = userEvent.setup();
    render(<Header navItems={navItems} />);

    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(screen.getByRole("button", { name: "Fechar menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    // Um link "Sobre" do nav desktop + um do menu mobile recém-aberto.
    expect(screen.getAllByRole("link", { name: "Sobre" })).toHaveLength(2);
  });

  it("Esc fecha o menu e devolve o foco ao botão, mesmo depois de tabular para os links", async () => {
    const user = userEvent.setup();
    render(<Header navItems={navItems} />);

    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    await user.click(toggle);
    await user.tab(); // sai do botão, entra no primeiro link do menu

    expect(document.activeElement).not.toBe(toggle);

    await user.keyboard("{Escape}");

    expect(screen.getByRole("button", { name: "Abrir menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Abrir menu" }));
  });

  it("clicar em um link do menu mobile fecha o menu", async () => {
    const user = userEvent.setup();
    render(<Header navItems={navItems} />);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    const mobileLinks = screen.getAllByRole("link", { name: "Sobre" });
    await user.click(mobileLinks[mobileLinks.length - 1]);

    expect(screen.getByRole("button", { name: "Abrir menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
