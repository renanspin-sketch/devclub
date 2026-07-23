import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Só o subconjunto "latin" (Basic Latin + Latin-1 Supplement) — cobre todo
// o português, incluindo acentuação (á, ã, ç, é, í, ó, ú...). "latin-ext"
// é para línguas da Europa Central (polonês, húngaro etc.) e não é usado
// aqui. Os arquivos por subconjunto não têm `unicode-range`, então cada
// import baixa incondicionalmente — importar "latin-ext" também dobraria
// as fontes baixadas à toa. Os arquivos "completos" (ex.: 400.css) embutem
// cirílico/grego/vietnamita além do necessário. Ver ARCHITECTURE.md#estratégias-de-performance.
import "@fontsource/sora/latin-600.css";
import "@fontsource/sora/latin-700.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/jetbrains-mono/latin-400.css";

import "@/styles/globals.css";
import App from "@/App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Elemento #root não encontrado em index.html.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
