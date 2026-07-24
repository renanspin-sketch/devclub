import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input } from "./Input";

describe("Input", () => {
  it("associa o label ao campo (acessível via getByLabelText)", () => {
    render(<Input label="Nome" />);
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
  });

  it("aceita digitação", async () => {
    const user = userEvent.setup();
    render(<Input label="E-mail" />);

    const input = screen.getByLabelText("E-mail");
    await user.type(input, "foo@bar.com");

    expect(input).toHaveValue("foo@bar.com");
  });

  it("sem erro: não marca aria-invalid nem renderiza alerta", () => {
    render(<Input label="Campo" />);
    expect(screen.getByLabelText("Campo")).not.toHaveAttribute("aria-invalid");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("com erro: marca aria-invalid, associa via aria-describedby e mostra role=alert", () => {
    render(<Input label="Campo" error="Campo obrigatório" />);

    const input = screen.getByLabelText("Campo");
    const alert = screen.getByRole("alert");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(alert).toHaveTextContent("Campo obrigatório");
    expect(input.getAttribute("aria-describedby")).toBe(alert.id);
  });
});
