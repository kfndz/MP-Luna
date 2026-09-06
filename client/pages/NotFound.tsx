import { useEffect, useRef } from "react";
import {
  ChevronRight,
  Home,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function NotFound() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = "Página não encontrada | MP Luna";

    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main
        id="main-content"
        className="flex flex-1 items-center justify-center px-4 py-16 sm:py-20 md:py-28"
      >
        <div className="mx-auto w-full max-w-3xl text-center">
          <div
            aria-hidden="true"
            className="mb-8 text-7xl font-black text-accent/20 sm:text-8xl md:text-9xl"
          >
            404
          </div>

          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mb-4 text-3xl font-bold outline-none sm:text-4xl md:text-5xl"
          >
            Página não encontrada
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            A página que você tentou acessar não existe, foi removida
            ou teve o endereço alterado.
          </p>

          <div className="mb-12 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <Home
                aria-hidden="true"
                className="h-5 w-5"
              />

              Ir para o início
            </Link>

            <Link
              to="/catalogo"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-foreground px-6 py-3 font-semibold text-foreground transition hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
            >
              <Search
                aria-hidden="true"
                className="h-5 w-5"
              />

              Ver catálogo
            </Link>
          </div>

          <nav
            aria-labelledby="popular-pages-title"
            className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 text-left sm:p-8"
          >
            <h2
              id="popular-pages-title"
              className="mb-4 font-semibold"
            >
              Páginas populares
            </h2>

            <ul className="space-y-1 text-sm">
              {[
                { label: "Página inicial", to: "/" },
                { label: "Catálogo", to: "/catalogo" },
                { label: "Sobre nós", to: "/sobre" },
                { label: "Contato", to: "/contato" },
                {
                  label: "Perguntas frequentes",
                  to: "/faq",
                },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-2 rounded-lg px-2 py-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <ChevronRight
                      aria-hidden="true"
                      className="h-4 w-4 flex-shrink-0"
                    />

                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 border-t border-border pt-8">
            <p className="mb-3 text-sm text-muted-foreground">
              Ainda precisa de ajuda?
            </p>

            <Link
              to="/contato"
              className="font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Entre em contato com o suporte
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}