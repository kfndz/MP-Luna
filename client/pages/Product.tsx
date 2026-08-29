import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronRight,
  Heart,
  RotateCcw,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getCategoryBySlug, getSubcategoryBySlug } from "@/lib/categories";
import { FavoriteService } from "@/services/FavoriteService";
import { ProductService } from "@/services/ProductService";
import type { Product as ProductType } from "@/types/product";

function formatPrice(value?: number | string | null) {
  const numberValue = Number(value ?? 0);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
}

const Product = () => {
  const { id } = useParams<{ id: string }>();

  const [productData, setProductData] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      if (!id) {
        if (isMounted) {
          setProductData(null);
          setAllProducts([]);
          setError("Produto não encontrado.");
          setLoading(false);
          setSelectedImage(0);
        }

        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [product, products] = await Promise.all([
          ProductService.getById(id),
          ProductService.getAll(),
        ]);

        if (!isMounted) return;

        setProductData(product ?? null);
        setAllProducts(products);
        setSelectedImage(0);
      } catch (err) {
        if (!isMounted) return;

        setProductData(null);
        setAllProducts([]);
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar o produto.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!productData?.id) return;

    setIsWishlisted(FavoriteService.isFavorite(productData.id));
  }, [productData?.id]);

  const images = useMemo(() => {
    const baseImages = productData?.images?.filter(Boolean) ?? [];

    if (baseImages.length > 0) {
      return baseImages;
    }

    if (productData?.image) {
      return [productData.image];
    }

    return ["/images/home-image.webp"];
  }, [productData]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando produto...</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-20 text-center md:py-24">
          <h1 className="mb-4 text-3xl font-semibold">
            Produto não encontrado
          </h1>

          <p className="mb-8 text-muted-foreground">
            {error ??
              "Este produto não está mais disponível ou a URL informada é inválida."}
          </p>

          <Link
            to="/catalogo"
            className="inline-flex items-center rounded-lg bg-accent px-6 py-3 font-semibold text-white"
          >
            Voltar ao catálogo
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  const categorySlug = productData.category ?? undefined;
  const subcategorySlug = productData.subcategory ?? undefined;

  const categoryData = categorySlug
    ? getCategoryBySlug(categorySlug)
    : undefined;

  const subcategoryData =
    categorySlug && subcategorySlug
      ? getSubcategoryBySlug(categorySlug, subcategorySlug)
      : undefined;

  const categoryName = categoryData?.name ?? categorySlug ?? "Catálogo";

  const subcategoryName = subcategoryData?.name ?? subcategorySlug;

  let relatedProducts = allProducts.filter(
    (product) =>
      Boolean(subcategorySlug) &&
      product.subcategory === subcategorySlug &&
      product.id !== productData.id,
  );

  if (relatedProducts.length < 4) {
    relatedProducts = allProducts.filter(
      (product) =>
        product.category === categorySlug && product.id !== productData.id,
    );
  }

  relatedProducts = relatedProducts.slice(0, 4);

  const specifications = Object.entries(productData.specifications ?? {});

  const price = Number(productData.price ?? 0);

  const originalPrice =
    productData.originalPrice !== null &&
    productData.originalPrice !== undefined
      ? Number(productData.originalPrice)
      : undefined;

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const reviewCount = productData.reviews ?? productData.reviewCount ?? 0;

  const stock = Number(productData.stock ?? 0);

  const isInStock = Boolean(
    productData.affiliateUrl && productData.availability !== "UNKNOWN"
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <nav aria-label="Navegação estrutural" className="overflow-x-auto">
            <div className="flex min-w-max items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
              <Link
                to="/"
                className="whitespace-nowrap transition-colors hover:text-accent"
              >
                Início
              </Link>

              <ChevronRight className="h-4 w-4 flex-shrink-0" />

              <Link
                to={categorySlug ? `/categoria/${categorySlug}` : "/catalogo"}
                className="whitespace-nowrap transition-colors hover:text-accent"
              >
                {categoryName}
              </Link>

              {categorySlug && subcategorySlug && subcategoryName && (
                <>
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />

                  <Link
                    to={`/categoria/${categorySlug}/${subcategorySlug}`}
                    className="whitespace-nowrap transition-colors hover:text-accent"
                  >
                    {subcategoryName}
                  </Link>
                </>
              )}

              <ChevronRight className="h-4 w-4 flex-shrink-0" />

              <span className="max-w-[150px] truncate font-medium text-accent sm:max-w-[300px]">
                {productData.name}
              </span>
            </div>
          </nav>
        </div>
      </div>

      <main>
        <section className="py-8 sm:py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-14 grid grid-cols-1 gap-8 lg:mb-20 lg:grid-cols-2 lg:gap-12">
              {/* Imagens */}
              <div className="space-y-4">
                <div className="mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-2xl border border-border bg-muted">
                  <img
                    src={images[selectedImage] ?? images[0]}
                    alt={productData.name ?? "Produto"}
                    onError={(event) => {
                      event.currentTarget.src = "/images/home-image.webp";
                    }}
                    className="h-full w-full object-contain p-4 sm:p-6"
                  />
                </div>

                {images.length > 1 && (
                  <div className="mx-auto grid max-w-[560px] grid-cols-4 gap-2">
                    {images.map((img, index) => (
                      <button
                        key={`${img}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        aria-label={`Selecionar imagem ${index + 1}`}
                        className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                          selectedImage === index
                            ? "border-accent"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${productData.name} ${index + 1}`}
                          onError={(event) => {
                            event.currentTarget.src = "/images/home-image.webp";
                          }}
                          className="h-full w-full object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="min-w-0">
                <h1 className="mb-4 break-words text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                  {productData.name}
                </h1>

                <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mb-6">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className="h-4 w-4 fill-accent text-accent sm:h-5 sm:w-5"
                      />
                    ))}
                  </div>

                  <span className="text-sm">
                    <strong>{productData.rating ?? 0}</strong>{" "}
                    <span className="text-muted-foreground">
                      ({reviewCount} avaliações)
                    </span>
                  </span>
                </div>

                {/* Preço */}
                <div className="mb-6">
                  <span className="block text-3xl font-bold leading-tight sm:text-4xl">
                    {formatPrice(price)}
                  </span>

                  {originalPrice && originalPrice > price && (
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-base text-muted-foreground line-through sm:text-lg">
                        {formatPrice(originalPrice)}
                      </span>

                      {discount > 0 && (
                        <span className="text-sm font-semibold text-accent">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Botões */}
                <div className="mb-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={productData.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={`flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl px-5 py-4 text-center font-semibold text-white transition-all active:scale-[0.98] ${
                      isInStock
                        ? "bg-accent hover:bg-accent/90"
                        : "pointer-events-none bg-muted-foreground/50"
                    }`}
                    aria-disabled={!isInStock}
                  >
                    <ShoppingCart className="h-5 w-5 flex-shrink-0" />

                    <span>
                      {isInStock
                        ? `Comprar na ${
                            productData.marketplace ?? "loja oficial"
                          }`
                        : "Comprar no Marketplace"}
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      const favorited = FavoriteService.toggle(productData.id);

                      setIsWishlisted(favorited);
                    }}
                    aria-label={
                      isWishlisted
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"
                    }
                    className={`flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 px-5 py-4 font-semibold transition-colors sm:w-14 sm:px-0 ${
                      isWishlisted
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border text-foreground hover:border-accent"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isWishlisted ? "fill-current" : ""
                      }`}
                    />

                    <span className="sm:hidden">
                      {isWishlisted
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"}
                    </span>
                  </button>
                </div>

                {/* Descrição */}
                {productData.description && (
                  <div className="mb-8 border-t border-border pt-8">
                    <h2 className="mb-4 text-xl font-bold">
                      Descrição do produto
                    </h2>

                    <div className="whitespace-pre-line break-words text-sm leading-7 text-muted-foreground sm:text-base">
                      {productData.description}
                    </div>
                  </div>
                )}

                {/* Confiança */}
                <div className="grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="flex-shrink-0 rounded-lg bg-accent/10 p-2.5">
                      <Truck className="h-5 w-5 text-accent" />
                    </div>

                    <div>
                      <p className="font-semibold">Entrega pelo marketplace</p>

                      <p className="text-sm text-muted-foreground">
                        Consulte prazo e condições na loja
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="flex-shrink-0 rounded-lg bg-accent/10 p-2.5">
                      <RotateCcw className="h-5 w-5 text-accent-secondary" />
                    </div>

                    <div>
                      <p className="font-semibold">Política de devolução</p>

                      <p className="text-sm text-muted-foreground">
                        Consulte as condições do marketplace
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="flex-shrink-0 rounded-lg bg-accent/10 p-2.5">
                      <Shield className="h-5 w-5 text-accent" />
                    </div>

                    <div>
                      <p className="font-semibold">Compra no site parceiro</p>

                      <p className="text-sm text-muted-foreground">
                        Você será direcionado para a loja responsável pela venda
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Especificações */}
            {specifications.length > 0 && (
              <section className="mb-14 border-t border-border pt-10 lg:mb-20 lg:pt-12">
                <h2 className="mb-6 text-2xl font-bold md:mb-8">
                  Especificações
                </h2>

                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {specifications.map(([key, value], index) => (
                      <div
                        key={key}
                        className={`p-4 ${
                          index % 2 === 1 ? "bg-muted/30" : ""
                        }`}
                      >
                        <p className="text-sm font-semibold text-muted-foreground">
                          {key}
                        </p>

                        <p className="mt-1 break-words font-semibold">
                          {String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Relacionados */}
            {relatedProducts.length > 0 && (
              <section className="border-t border-border pt-10 lg:pt-12">
                <h2 className="mb-6 text-2xl font-bold md:mb-8">
                  Produtos Relacionados
                </h2>

                <ProductGrid products={relatedProducts} />
              </section>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Product;
