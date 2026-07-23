// Roda Lighthouse (mobile + desktop) contra o build de produção servido
// localmente. Não usa o dev server — Vite em modo dev não é minificado e
// não reflete a performance real da build. Ver ROADMAP.md (Fase 10).
//
// O preview server sobe via API do próprio Vite (não um child process)
// para não depender de matar árvore de processos no shell — spawn+kill
// de um processo via npx/shell não é confiável no Windows (o wrapper do
// npm não repassa sinais ao processo real que ele inicia).
import { execSync } from "node:child_process";
import { platform } from "node:os";
import { writeFileSync, mkdirSync } from "node:fs";
import { preview } from "vite";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const PORT = 4173;
const URL = `http://localhost:${PORT}`;

async function runAudit(chrome, formFactor) {
  const isMobile = formFactor === "mobile";
  const options = {
    logLevel: "error",
    output: "html",
    port: chrome.port,
  };
  // Mobile usa o preset default do Lighthouse (já calibrado pra mobile:
  // throttling de rede/CPU simulando um aparelho médio em 4G). Desktop
  // precisa do preset próprio — sem ele, o Lighthouse aplica throttling
  // de mobile a uma viewport desktop, o que penaliza a nota injustamente.
  const config = isMobile ? undefined : desktopConfig;
  const runnerResult = await lighthouse(URL, options, config);
  const { categories, audits } = runnerResult.lhr;
  const scores = Object.fromEntries(
    Object.entries(categories).map(([key, cat]) => [key, Math.round(cat.score * 100)]),
  );

  for (const [key, cat] of Object.entries(categories)) {
    if (Math.round(cat.score * 100) >= 95) continue;
    console.log(`\n[${formFactor}] ${key} < 95 — auditorias com problema real (score < 0.9):`);
    for (const ref of cat.auditRefs) {
      const audit = audits[ref.id];
      // < 0.9, não < 1 — uma auditoria em 0.95-0.99 já é boa; listar essas
      // só gera ruído e atrapalha achar o que de fato precisa de atenção.
      if (audit.score !== null && audit.score < 0.9) {
        console.log(`  - ${audit.id}: ${audit.title} (score=${audit.score})`);
        if (audit.description) {
          console.log(`    ${audit.description.replace(/\n/g, " ").slice(0, 200)}`);
        }
      }
    }
  }

  mkdirSync("lighthouse-reports", { recursive: true });
  writeFileSync(`lighthouse-reports/${formFactor}.html`, runnerResult.report);
  writeFileSync(
    `lighthouse-reports/${formFactor}.json`,
    JSON.stringify({ scores, formFactor }, null, 2),
  );

  return scores;
}

console.log("Buildando produção...");
execSync("npm run build", { stdio: "inherit" });

console.log("Subindo vite preview...");
const previewServer = await preview({ preview: { port: PORT, strictPort: true } });

let chrome;
try {
  console.log("Preview no ar. Rodando Lighthouse...\n");

  chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new", "--no-sandbox"],
    chromePath: process.env.CHROME_PATH,
  });

  const mobile = await runAudit(chrome, "mobile");
  console.log("Mobile: ", mobile);

  const desktop = await runAudit(chrome, "desktop");
  console.log("Desktop:", desktop);
} finally {
  if (chrome) {
    try {
      await chrome.kill();
    } catch {
      // No Windows, a limpeza do diretório temporário do Chrome às vezes
      // falha com EPERM se o processo ainda não liberou o handle antes do
      // rmSync — os relatórios já foram gravados nesse ponto. Ainda assim,
      // garante que o processo do Chrome não fique órfão consumindo CPU
      // (isso já causou quedas de score em execuções subsequentes).
      if (platform() === "win32" && chrome.pid) {
        try {
          execSync(`taskkill /pid ${chrome.pid} /T /F`, { stdio: "ignore" });
        } catch {
          // processo já pode ter encerrado sozinho
        }
      }
    }
  }
  await new Promise((resolve, reject) => {
    previewServer.httpServer.close((err) => (err ? reject(err) : resolve()));
  });
}
