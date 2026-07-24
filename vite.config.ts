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
      // margem de segurança sobre a cobertura real medida (70/89/63/74 em
      // 2026-07-23), não uma meta aspiracional escolhida a priori.
      thresholds: {
        lines: 70,
        statements: 65,
        functions: 60,
        branches: 85,
      },
    },
  },
}));
