import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";

import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { ThemeProvider } from "@/context/ThemeContext";

// Cada rota fora da Home é code-split — só a Home precisa carregar rápido
// (é a página de entrada mais provável). Ver ARCHITECTURE.md#estratégias-de-performance.
const NossosAlunos = lazy(() =>
  import("@/pages/NossosAlunos").then((mod) => ({ default: mod.NossosAlunos })),
);
const Blog = lazy(() => import("@/pages/Blog").then((mod) => ({ default: mod.Blog })));
const BlogPost = lazy(() =>
  import("@/pages/BlogPost").then((mod) => ({ default: mod.BlogPost })),
);
const Newsletter = lazy(() =>
  import("@/pages/Newsletter").then((mod) => ({ default: mod.Newsletter })),
);

function App() {
  return (
    // `domAnimation` carrega só animação/gestos/exit — exclui drag e layout
    // projection, que não usamos e respondiam pela maior fatia do bundle
    // (ver relatório do `npm run build:analyze`). `strict` impede o uso
    // acidental de `motion.*` (bundle completo) em vez de `m.*` no futuro.
    <ThemeProvider>
      <LazyMotion features={domAnimation} strict>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path="/nossos-alunos"
                element={
                  <Suspense fallback={null}>
                    <NossosAlunos />
                  </Suspense>
                }
              />
              <Route
                path="/blog"
                element={
                  <Suspense fallback={null}>
                    <Blog />
                  </Suspense>
                }
              />
              <Route
                path="/blog/:slug"
                element={
                  <Suspense fallback={null}>
                    <BlogPost />
                  </Suspense>
                }
              />
              <Route
                path="/newsletter"
                element={
                  <Suspense fallback={null}>
                    <Newsletter />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </LazyMotion>
    </ThemeProvider>
  );
}

export default App;
