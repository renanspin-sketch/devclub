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

  it("só mostra os links 'Código'/'Ver projeto' quando o projeto tem repoUrl/demoUrl", () => {
    render(<Projects />);

    const withRepo = projects.filter((p) => p.repoUrl);
    const withDemo = projects.filter((p) => p.demoUrl);
    const withoutDemo = projects.filter((p) => !p.demoUrl);

    expect(screen.getAllByRole("link", { name: "Código" })).toHaveLength(withRepo.length);
    expect(screen.getAllByRole("link", { name: /Ver projeto/ })).toHaveLength(withDemo.length);
    expect(withoutDemo.length).toBeGreaterThan(0); // garante que o caso está coberto pelos dados reais
  });

  it("renderiza imagem apenas nos projetos que têm `image`, com alt text", () => {
    render(<Projects />);

    const withImage = projects.filter((p) => p.image);
    expect(withImage.length).toBeGreaterThan(0); // garante que o caso está coberto

    for (const project of withImage) {
      expect(screen.getByRole("img", { name: project.image?.alt })).toBeInTheDocument();
    }
  });
});
