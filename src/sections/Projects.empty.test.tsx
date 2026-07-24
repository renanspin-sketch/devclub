import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// vi.mock é hoisted para o topo do arquivo pelo Vitest — por isso o estado
// vazio fica isolado neste arquivo em vez de misturado com Projects.test.tsx,
// que testa contra os dados reais.
vi.mock("@/data/projects", () => ({ projects: [] }));

const { Projects } = await import("./Projects");

describe("Projects — estado vazio", () => {
  it("mostra uma mensagem em vez do grid quando não há projetos", () => {
    render(<Projects />);

    expect(
      screen.getByText("Nenhum projeto publicado ainda — em breve, novidades por aqui."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
  });
});
