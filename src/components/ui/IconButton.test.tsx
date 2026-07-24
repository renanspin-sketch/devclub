import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("expõe o aria-label como nome acessível", () => {
    render(
      <IconButton aria-label="Abrir menu">
        <svg aria-hidden="true" />
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "Abrir menu" })).toBeInTheDocument();
  });

  it("usa type=button por padrão (evita submit acidental em forms)", () => {
    render(<IconButton aria-label="Ação">×</IconButton>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("responde a clique", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton aria-label="Fechar" onClick={onClick}>
        ×
      </IconButton>,
    );

    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
