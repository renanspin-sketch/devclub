import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./Button";

describe("Button", () => {
  it("renderiza os children e responde a clique", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Enviar</Button>);

    const button = screen.getByRole("button", { name: "Enviar" });
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("usa a variante primary por padrão", () => {
    render(<Button>Padrão</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-accent-gradient");
  });

  it("não dispara onClick quando disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Desabilitado
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Desabilitado" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("estado isLoading: fica desabilitado, marca aria-busy e comunica o carregamento", () => {
    render(<Button isLoading>Salvar</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Carregando")).toBeInTheDocument();
    // O texto original continua no DOM (largura preservada), só fica
    // visualmente oculto — ver Button.tsx e DESIGN-SYSTEM.md#botão.
    expect(screen.getByText("Salvar")).toBeInTheDocument();
  });

  it("encaminha o ref para o elemento <button>", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
