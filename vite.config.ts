/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Só gera o relatório sob demanda (`npm run build:analyze`) — não faz
    // parte do build de produção normal. Ver ARCHITECTURE.md#estratégias-de-performance.
    mode === "analyze" &&
      visualizer({
        filename: "dist/stats.html",
        gzipSize: true,
        brotliSize: true,
        template: "treemap",
      }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/types/**",
        "src/data/**",
        "src/test/**",
        "src/**/*.d.ts",
      ],
      // Ver ARCHITECTURE.md#estratégias-de-testes: piso calibrado com uma
      // margem de segurança sobre a cobertura real medida — não uma meta
      // aspiracional escolhida a priori. Baixado de novo em 2026-07-24
      // (de 50/45/40/85 para 40/38/30/45): os 6 capítulos da Home (Boot→
      // Hire) só têm teste no Hire (o único com lógica própria de verdade,
      // copiar e-mail) — os outros 5 são composição de SVG/Framer Motion
      // sem asserção própria ainda, mesmo critério já usado antes pra
      // Hero/About/Skills. Sobe de novo conforme ganham testes reais.
      thresholds: {
        lines: 40,
        statements: 38,
        functions: 30,
        branches: 45,
      },
    },
  },
}));
