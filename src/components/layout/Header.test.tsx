import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { Header } from "./Header";

const navItems = [
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

// Header usa <Link> do react-router (logo, Área do aluno, CTA) mesmo
// quando os itens de nav são âncoras — por isso todo render precisa de
// um Router por perto, mesmo neste conjunto de testes que só exercita
// links de âncora.
function renderHeader(props: Parameters<typeof Header>[0]) {
  return render(
    <MemoryRouter>
      <Header {...props} />
    </MemoryRouter>,
  );
}

describe("Header", () => {
  it("renderiza a logo e os links de navegação", () => {
    renderHeader({ navItems });
    expect(screen.getByRole("link", { name: "DevClub" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Sobre" })).toHaveLength(1);
  });

  it("sem navItems, não renderiza nav nem botão de menu", () => {
    renderHeader({ navItems: [] });
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("abre o menu mobile ao clicar, expõe aria-expanded e um segundo conjunto de links", async () => {
    const user = userEvent.setup();
    renderHeader({ navItems });

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
    renderHeader({ navItems });

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
    renderHeader({ navItems });

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    const mobileLinks = screen.getAllByRole("link", { name: "Sobre" });
    await user.click(mobileLinks[mobileLinks.length - 1]);

    expect(screen.getByRole("button", { name: "Abrir menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
