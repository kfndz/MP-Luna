import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PackageSearch, Sliders } from "lucide-react";

import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { CategoryPageLayout } from "@/components/catalog/CategoryPageLayout";
import { ProductFilters } from "@/components/catalog/ProductFilters";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import {
  DEFAULT_PRODUCT_FILTERS,
  filterProducts,
} from "@/utils/productFilters";
import {
  sortProducts,
  type ProductSortOption,
} from "@/utils/productSorting";

const Catalog = () => {
  const { products, loading, error } = useProducts();
  const { search } = useLocation();

  const query = useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get("q")?.trim() ?? "";
  }, [search]);

  const [sortBy, setSortBy] =
    useState<ProductSortOption>("relevancia");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(
    DEFAULT_PRODUCT_FILTERS,
  );

  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(
      products,
      filters,
      query,
    );

    return sortProducts(filtered, sortBy);
  }, [filters, products, query, sortBy]);

  const categoryOptions = useMemo(() => {
    const categorySlugs = Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(
            (category): category is string =>
              Boolean(category),
          ),
      ),
    );

    return categorySlugs.map((category) => {
      let formattedName = category
        .replace(/-/g, " ")
        .replace(/\b\w/g, (letter) =>
          letter.toUpperCase(),
        );

      if (category === "saude-beleza") {
        formattedName = "Beleza & Cuidados Pessoais";
      }

      if (category === "moda-acessorios") {
        formattedName = "Moda & Estilo";
      }

      if (category === "esporte-fitness") {
        formattedName = "Esporte & Fitness";
      }

      return {
        id: category,
        name: formattedName,
      };
    });
  }, [products]);

  function clearFiltersAndSearch() {
    setFilters(DEFAULT_PRODUCT_FILTERS);
    setSortBy("relevancia");
  }

  return (
    <CategoryPageLayout>
      <Breadcrumb
        items={[
          { label: "Início", to: "/" },
          { label: "Catálogo", current: true },
        ]}
      />

      <section className="border-b border-border bg-gradient-to-br from-muted/50 to-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Catálogo de produtos
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground">
            {query
              ? `Resultados para “${query}”`
              : "Explore os produtos disponíveis na MP Luna"}
          </p>
        </div>
      </section>

      <section className="py-10 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="w-full max-w-full overflow-hidden lg:col-span-1">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                categories={categoryOptions}
                showFilters={showFilters}
                onClear={clearFiltersAndSearch}
              />
            </div>

            <div className="min-w-0 lg:col-span-3">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
                <span className="text-sm text-muted-foreground">
                  {loading
                    ? "Carregando produtos..."
                    : filteredProducts.length === 0
                      ? "Nenhum produto encontrado"
                      : filteredProducts.length === 1
                        ? "Exibindo 1 produto"
                        : `Exibindo ${filteredProducts.length} produtos`}
                </span>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setShowFilters((current) => !current)
                    }
                    aria-expanded={showFilters}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold transition hover:bg-muted lg:hidden"
                  >
                    <Sliders
                      aria-hidden="true"
                      className="h-4 w-4"
                    />
                    Filtros
                  </button>

                  <label htmlFor="catalog-sort" className="sr-only">
                    Ordenar produtos
                  </label>

                  <select
                    id="catalog-sort"
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(
                        event.target.value as ProductSortOption,
                      )
                    }
                    className="min-h-10 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="relevancia">
                      Relevância
                    </option>
                    <option value="menor-preco">
                      Menor preço
                    </option>
                    <option value="maior-preco">
                      Maior preço
                    </option>
                    <option value="mais-vendidos">
                      Mais vendidos
                    </option>
                    <option value="novos">
                      Mais novos
                    </option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="h-[420px] animate-pulse rounded-2xl border border-border bg-muted"
                    />
                  ))}
                </div>
              ) : error ? (
                <div
                  role="alert"
                  className="rounded-3xl border border-destructive/30 bg-destructive/10 px-6 py-12 text-center"
                >
                  <h2 className="text-xl font-semibold">
                    Não foi possível carregar o catálogo
                  </h2>

                  <p className="mt-2 text-muted-foreground">
                    Tente novamente em alguns instantes.
                  </p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <ProductGrid products={filteredProducts} />
              ) : (
                <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <PackageSearch
                      aria-hidden="true"
                      className="h-8 w-8 text-accent"
                    />
                  </div>

                  <h2 className="text-2xl font-semibold">
                    {products.length === 0
                      ? "Produtos em breve"
                      : "Nenhum produto encontrado"}
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                    {products.length === 0
                      ? "O catálogo ainda não possui produtos cadastrados. Novidades serão adicionadas em breve."
                      : "Tente limpar os filtros ou pesquisar por outro termo."}
                  </p>

                  {products.length === 0 ? (
                    <Link
                      to="/"
                      className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-6 py-2.5 font-semibold text-white transition hover:bg-accent/90"
                    >
                      Voltar ao início
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={clearFiltersAndSearch}
                      className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-6 py-2.5 font-semibold text-white transition hover:bg-accent/90"
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </CategoryPageLayout>
  );
};

export default Catalog;