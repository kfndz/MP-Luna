import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, User, Menu, X } from "lucide-react";

import { CategoryDropdown } from "./CategoryDropdown";
import { CategoryAccordion } from "./CategoryAccordion";
import type { Product } from "@/types/product";
import { useProducts } from "@/hooks/useProducts";

export function Header() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");

  const { products } = useProducts();

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const deferredMobileSearchTerm = useDeferredValue(mobileSearchTerm);

  /*
   * Impede o conteúdo atrás do menu mobile de rolar.
   * O próprio menu continuará tendo scroll.
   */
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  function getProductUrl(product: Product) {
    return `/produto/${product.slug ?? product.id}`;
  }

  function filterProducts(term: string) {
    const normalizedTerm = term.trim().toLowerCase();

    if (!normalizedTerm) return [];

    return products
      .filter((product) =>
        [
          product.name,
          product.brand,
          product.description,
          product.category,
          product.subcategory,
          product.marketplace,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedTerm),
          ),
      )
      .slice(0, 5);
  }

  const desktopResults = useMemo(
    () => filterProducts(deferredSearchTerm),
    [deferredSearchTerm, products],
  );

  const mobileResults = useMemo(
    () => filterProducts(deferredMobileSearchTerm),
    [deferredMobileSearchTerm, products],
  );

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setMobileSearchTerm("");
  }

  function handleSearchSubmit(term: string) {
    const query = term.trim();

    if (!query) return;

    navigate(`/catalogo?q=${encodeURIComponent(query)}`);

    setSearchTerm("");
    setMobileSearchTerm("");
    setMobileMenuOpen(false);
  }

  function handleProductClick(product: Product) {
    navigate(getProductUrl(product));

    setSearchTerm("");
    setMobileSearchTerm("");
    setMobileMenuOpen(false);
  }

  function SearchSuggestions({ results }: { results: Product[] }) {
    if (results.length === 0) return null;

    return (
      <div className="absolute left-0 right-0 top-full z-[70] mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {results.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => handleProductClick(product)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-muted"
          >
            <img
              src={product.image ?? "/images/home-image.webp"}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.src = "/images/home-image.webp";
              }}
              className="h-11 w-11 flex-shrink-0 rounded-lg bg-muted object-cover"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {product.name}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {product.marketplace ?? "Produto"}
                {" • "}
                {product.category ?? "Catálogo"}
              </p>
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    /*
     * A faixa amarela e o header agora fazem parte do mesmo
     * bloco sticky. Isso evita que um elemento cubra o outro.
     */
    <div className="sticky top-0 z-50">
      {/* Announcement Bar */}
      <div className="bg-accent px-4 py-2 text-center text-xs font-medium leading-snug text-white sm:text-sm">
        Produtos Exclusivos com as melhores ofertas!
        <span className="ml-1">Aproveite agora!</span>
      </div>

      {/* Main Header */}
      <header className="relative border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
        <div className="container mx-auto px-4">
          <div className="flex h-[80px] items-center justify-between md:h-[100px]">
            {/* Logo */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              aria-label="Ir para a página inicial da MP Luna"
              title="MP Luna - Início"
              className="flex min-w-0 flex-shrink-0 items-center overflow-hidden"
            >
              <img
                src="/logo-mp-luna.png"
                alt="MP Luna"
                className="w-[78px] h-auto object-contain sm:w-[84px] md:w-[92px] lg:w-[96px] xl:w-[108px]"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 lg:flex lg:gap-8">
              <CategoryDropdown />

              <Link
                to="/ofertas"
                className="text-sm font-medium transition-colors hover:text-accent"
              >
                Ofertas
              </Link>

              <Link
                to="/mais-vendidos"
                className="text-sm font-medium transition-colors hover:text-accent"
              >
                Mais Vendidos
              </Link>
            </nav>

            {/* Desktop Search */}
            <div className="mx-4 hidden min-w-0 max-w-md flex-1 items-center md:flex lg:mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearchSubmit(event.currentTarget.value);
                    }
                  }}
                  className="h-10 w-full rounded-lg border-2 border-border bg-muted px-4 pr-11 text-sm outline-none transition-all focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent"
                />

                <button
                  type="button"
                  onClick={() => handleSearchSubmit(searchTerm)}
                  aria-label="Buscar produtos"
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground transition hover:text-accent"
                >
                  <Search className="h-4 w-4" />
                </button>

                <SearchSuggestions results={desktopResults} />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
              <Link
                to="/favoritos"
                className="relative hidden rounded-lg p-2 transition-colors hover:bg-muted lg:block"
              >
                <Heart className="h-5 w-5" />
              </Link>

              <Link
                to="/admin/login"
                className="hidden rounded-lg p-2 transition-colors hover:bg-muted sm:block"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Mobile Search/Menu */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Abrir busca"
                className="rounded-xl p-2.5 transition-colors hover:bg-muted md:hidden"
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((current) => !current)}
                aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={mobileMenuOpen}
                className="rounded-xl bg-muted p-2.5 transition-colors hover:bg-muted/80 lg:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            {/* Fundo escuro atrás do menu */}
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={closeMobileMenu}
              className="fixed inset-x-0 bottom-0 top-full z-40 bg-black/25 lg:hidden"
            />

            {/*
             * O menu tem scroll próprio.
             * A home atrás permanece parada.
             */}
            <div className="absolute left-0 right-0 top-full z-50 max-h-[calc(100dvh-112px)] overflow-y-auto border-t border-border bg-background shadow-xl lg:hidden">
              <div className="space-y-3 px-4 py-5">
                {/* Mobile Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={mobileSearchTerm}
                    onChange={(event) =>
                      setMobileSearchTerm(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSearchSubmit(event.currentTarget.value);
                      }
                    }}
                    className="h-11 w-full rounded-xl border-2 border-border bg-muted px-4 pr-12 text-sm outline-none transition-all focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent"
                  />

                  <button
                    type="button"
                    onClick={() => handleSearchSubmit(mobileSearchTerm)}
                    aria-label="Buscar produtos"
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground transition hover:text-accent"
                  >
                    <Search className="h-5 w-5" />
                  </button>

                  <SearchSuggestions results={mobileResults} />
                </div>

                <div>
                  <p className="pb-2 pt-3 text-xs font-semibold uppercase text-muted-foreground">
                    Categorias
                  </p>

                  <CategoryAccordion />
                </div>

                <hr className="border-border" />

                <nav className="space-y-1 pb-4">
                  <Link
                    to="/favoritos"
                    onClick={closeMobileMenu}
                    className="block rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted hover:text-accent"
                  >
                    Favoritos
                  </Link>

                  <Link
                    to="/ofertas"
                    onClick={closeMobileMenu}
                    className="block rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted hover:text-accent"
                  >
                    Ofertas
                  </Link>

                  <Link
                    to="/mais-vendidos"
                    onClick={closeMobileMenu}
                    className="block rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted hover:text-accent"
                  >
                    Mais Vendidos
                  </Link>

                  <Link
                    to="/admin/login"
                    onClick={closeMobileMenu}
                    className="block rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted hover:text-accent"
                  >
                    Painel Administrativo
                  </Link>
                </nav>
              </div>
            </div>
          </>
        )}
      </header>
    </div>
  );
}
