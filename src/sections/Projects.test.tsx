import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Projects } from "./Projects";
import { projects } from "@/data/projects";

describe("Projects", () => {
  it("renderiza um card para cada projeto, com título e stack", () => {
    render(<Projects />);

    for (const project of projects) {
      expect(screen.getByRole("heading", { name: project.title })).toBeInTheDocument();
      for (const tech of project.stack) {
        expect(screen.getAllByText(tech).length).toBeGreaterThan(0);
      }
    }
  });

  it("só mostra o link 'Ver projeto' quando o projeto tem demoUrl", () => {
    render(<Projects />);

    const withDemo = projects.filter((p) => p.demoUrl);
    const withoutDemo = projects.filter((p) => !p.demoUrl);

    expect(screen.getAllByRole("link", { name: /Ver projeto/ })).toHaveLength(withDemo.length);
    // Todo projeto neste conjunto de dados tem repoUrl, então "Código"
    // aparece pra todos.
    expect(screen.getAllByRole("link", { name: "Código" })).toHaveLength(projects.length);
    expect(withoutDemo.length).toBeGreaterThan(0); // garante que o caso está coberto pelos dados reais
  });
});
