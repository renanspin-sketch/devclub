import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Badge } from "./Badge";

describe("Badge", () => {
  it("renderiza o conteúdo", () => {
    render(<Badge>React</Badge>);
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("aplica a variante default por padrão", () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText("Default")).toHaveClass("bg-surface-elevated");
  });

  it("aplica a variante accent", () => {
    render(<Badge variant="accent">Accent</Badge>);
    expect(screen.getByText("Accent")).toHaveClass("text-accent-violet-light");
  });
});
