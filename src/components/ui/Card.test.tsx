import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Card } from "./Card";

describe("Card", () => {
  it("renderiza o conteúdo", () => {
    render(<Card>Conteúdo do card</Card>);
    expect(screen.getByText("Conteúdo do card")).toBeInTheDocument();
  });

  it("não tem classes de hover por padrão", () => {
    render(<Card data-testid="card">Estático</Card>);
    expect(screen.getByTestId("card")).not.toHaveClass("hover:-translate-y-1");
  });

  it("aplica classes de hover quando interactive", () => {
    render(
      <Card interactive data-testid="card">
        Interativo
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("hover:-translate-y-1");
  });
});
