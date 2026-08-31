import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/lib/categories";
import type {
  Product,
  ProductAvailability,
  ProductCreateInput,
} from "@/types/product";

import ProductMediaUpload from "./ProductMediaUpload";

type Props = {
  product?: Product | null;
  onCancel?: () => void;
  onSave: (input: ProductCreateInput) => void | Promise<void>;
  isSaving?: boolean;
};

function createSlug(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const selectClassName =
  "min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60";

const checkboxCardClassName =
  "flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition hover:border-accent/50";

export default function ProductForm({
  product,
  onCancel,
  onSave,
  isSaving = false,
}: Props) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState<number | undefined>();
  const [originalPrice, setOriginalPrice] = useState<number | undefined>();

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [marketplace, setMarketplace] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");

  const [externalProductId, setExternalProductId] = useState("");
  const [availability, setAvailability] =
    useState<ProductAvailability>("AVAILABLE");

  const [description, setDescription] = useState("");
  const [rating, setRating] = useState<number | undefined>();
  const [reviewCount, setReviewCount] = useState<number | undefined>();

  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [badge, setBadge] = useState("");

  const [featured, setFeatured] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  const selectedCategory = useMemo(
    () => categories.find((item) => item.slug === category),
    [category],
  );

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setBrand(product.brand || "");
      setPrice(
        product.price === null || product.price === undefined
          ? undefined
          : Number(product.price),
      );

      setOriginalPrice(
        product.originalPrice === null || product.originalPrice === undefined
          ? undefined
          : Number(product.originalPrice),
      );

      setCategory(product.category || "");
      setSubcategory(product.subcategory || "");
      setMarketplace(product.marketplace || "");
      setAffiliateUrl(product.affiliateUrl || "");
      setExternalProductId(product.externalProductId || "");
      setAvailability(product.availability || "AVAILABLE");
      setDescription(product.description || "");
      setRating(product.rating ?? undefined);

      setReviewCount(product.reviewCount ?? product.reviews ?? undefined);

      const productImages = (product.images ?? []).filter(Boolean);
      setImages(
        productImages.length > 0
          ? productImages
          : product.image
            ? [product.image]
            : [],
      );
      setVideos((product.videos ?? []).filter(Boolean));
      setBadge(product.badge || "");
      setFeatured(product.featured ?? false);
      setIsOffer(product.isOffer ?? false);
      setIsBestSeller(product.isBestSeller ?? false);

      return;
    }

    setName("");
    setBrand("");
    setPrice(undefined);
    setOriginalPrice(undefined);
    setCategory("");
    setSubcategory("");
    setMarketplace("");
    setAffiliateUrl("");
    setExternalProductId("");
    setAvailability("AVAILABLE");
    setDescription("");
    setRating(undefined);
    setReviewCount(undefined);
    setImages([]);
    setVideos([]);
    setBadge("");
    setFeatured(false);
    setIsOffer(false);
    setIsBestSeller(false);
  }, [product]);

  useEffect(() => {
    if (!selectedCategory || !subcategory) {
      return;
    }

    const subcategoryExists = selectedCategory.subcategories.some(
      (item) => item.slug === subcategory,
    );

    if (!subcategoryExists) {
      setSubcategory("");
    }
  }, [selectedCategory, subcategory]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (isSaving) return;

    if (price === undefined || !Number.isFinite(price) || price < 0) {
      return;
    }

    const input: ProductCreateInput = {
      name: name.trim(),
      slug: product?.slug || createSlug(name),
      brand: brand.trim() || undefined,
      price,
      originalPrice,
      categoryId: category,
      subcategoryId: subcategory || null,
      marketplace,
      affiliateUrl: affiliateUrl.trim(),
      externalProductId: externalProductId.trim() || null,
      availability,
      priceCheckedAt: new Date().toISOString(),
      rating,
      reviewCount,
      featured,
      isOffer,
      isBestSeller,
      badge: badge.trim() || undefined,
      description: description.trim(),
      image: images[0] ?? "",
      images,
      videos,
    };

    await onSave(input);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-8"
    >
      <div className="border-b border-border pb-5">
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
          {product ? "Editar produto" : "Cadastrar produto"}
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Preencha as informações que serão exibidas no catálogo.
        </p>
      </div>

      <fieldset disabled={isSaving} className="space-y-6 disabled:opacity-75">
        <section className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">
              Informações principais
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Nome, marca e classificação do produto.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="product-name"
                className="mb-2 block text-sm font-medium text-muted-foreground"
              >
                Nome *
              </label>

              <Input
                id="product-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="product-brand"
                className="mb-2 block text-sm font-medium text-muted-foreground"
              >
                Marca
              </label>

              <Input
                id="product-brand"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                htmlFor="product-rating"
                className="mb-2 block text-sm font-medium text-muted-foreground"
              >
                Nota
              </label>

              <Input
                id="product-rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                inputMode="decimal"
                value={rating ?? ""}
                onChange={(event) =>
                  setRating(
                    event.target.value ? Number(event.target.value) : undefined,
                  )
                }
              />
            </div>

            <div>
              <label
                htmlFor="product-reviews"
                className="mb-2 block text-sm font-medium text-muted-foreground"
              >
                Avaliações
              </label>

              <Input
                id="product-reviews"
                type="number"
                min="0"
                inputMode="numeric"
                value={reviewCount ?? ""}
                onChange={(event) =>
                  setReviewCount(
                    event.target.value ? Number(event.target.value) : undefined,
                  )
                }
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <div>
            <h3 className="font-semibold text-foreground">Preço</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Informe o preço atual e, se houver, o preço anterior.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="product-price"
                className="mb-2 block text-sm font-medium text-muted-foreground"
              >
                Preço atual *
              </label>

              <Input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={price ?? ""}
                onChange={(event) =>
                  setPrice(
                    event.target.value ? Number(event.target.value) : undefined,
                  )
                }
                required
              />
            </div>

            <div>
              <label
                htmlFor="product-old-price"
                className="mb-2 block text-sm font-medium text-muted-foreground"
              >
                Preço antigo
              </label>

              <Input
                id="product-old-price"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={originalPrice ?? ""}
                onChange={(event) =>
                  setOriginalPrice(
                    event.target.value ? Number(event.target.value) : undefined,
                  )
                }
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <div>
            <h3 className="font-semibold text-foreground">Organização</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Escolha a categoria e a subcategoria correspondentes.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="product-category"
                className="mb-2 block text-sm font-medium text-muted-foreground"
              >
                Categoria *
              </label>

              <select
                id="product-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                className={selectClassName}
              >
                <option value="">Selecione uma categoria</option>

                {categories.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="product-subcategory"
                className="mb-2 block text-sm font-medium text-muted-foreground"
              >
                Subcategoria
              </label>

              <select
                id="product-subcategory"
                value={subcategory}
                onChange={(event) => setSubcategory(event.target.value)}
                disabled={!selectedCategory}
                className={selectClassName}
              >
                <option value="">Selecione uma subcategoria</option>

                {selectedCategory?.subcategories.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <div>
            <h3 className="font-semibold text-foreground">Loja e afiliado</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Informe a loja responsável e o link de redirecionamento.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="product-marketplace"
                className="mb-2 block text-sm font-medium text-muted-foreground"
              >
                Marketplace *
              </label>

              <select
                id="product-marketplace"
                value={marketplace}
                onChange={(event) => setMarketplace(event.target.value)}
                required
                className={selectClassName}
              >
                <option value="">Selecione</option>
                <option value="Amazon">Amazon</option>
                <option value="Shopee">Shopee</option>
                <option value="Mercado Livre">Mercado Livre</option>
                <option value="Magalu">Magalu</option>
                <option value="AliExpress">AliExpress</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="product-affiliate-url"
                className="mb-2 block text-sm font-medium text-muted-foreground"
              >
                Link de afiliado *
              </label>
              <Input
                id="product-affiliate-url"
                type="url"
                inputMode="url"
                value={affiliateUrl}
                onChange={(event) => setAffiliateUrl(event.target.value)}
                placeholder="https://..."
                required
              />
            </div>
            <div>
              <label
                htmlFor="product-external-id"
                className="mb-2 block text-sm font-medium text-muted-foreground"
              >
                ID do produto no marketplace
              </label>

              <Input
                id="product-external-id"
                value={externalProductId}
                onChange={(event) => setExternalProductId(event.target.value)}
                placeholder="Ex.: MLB1234567890"
              />

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Opcional. Será utilizado futuramente para integração e
                atualização automática.
              </p>
            </div>

            <div>
              <label
                htmlFor="product-availability"
                className="mb-2 block text-sm font-medium text-muted-foreground"
              >
                Disponibilidade *
              </label>

              <select
                id="product-availability"
                value={availability}
                onChange={(event) =>
                  setAvailability(event.target.value as ProductAvailability)
                }
                required
                className={selectClassName}
              >
                <option value="AVAILABLE">Disponível no marketplace</option>

                <option value="UNAVAILABLE">Indisponível no marketplace</option>

                <option value="AVAILABLE">Disponibilidade não confirmada</option>
              </select>

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Selecione conforme a situação atual na loja parceira.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <div>
            <h3 className="font-semibold text-foreground">Apresentação</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Defina badge, descrição e imagem do produto.
            </p>
          </div>

          <div>
            <label
              htmlFor="product-badge"
              className="mb-2 block text-sm font-medium text-muted-foreground"
            >
              Badge
            </label>

            <Input
              id="product-badge"
              value={badge}
              onChange={(event) => setBadge(event.target.value)}
              placeholder="Ex.: Oferta, Mais vendido, Novo"
            />
          </div>

          <div>
            <label
              htmlFor="product-description"
              className="mb-2 block text-sm font-medium text-muted-foreground"
            >
              Descrição
            </label>

            <Textarea
              id="product-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-32 resize-y"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-muted-foreground">
              Fotos e vídeos do produto *
            </label>

            <ProductMediaUpload
              images={images}
              videos={videos}
              onImagesChange={setImages}
              onVideosChange={setVideos}
            />

            {images.length === 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Adicione pelo menos uma foto para o produto.
              </p>
            )}
          </div>
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <div>
            <h3 className="font-semibold text-foreground">
              Exibição no catálogo
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Escolha onde este produto deverá receber destaque.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className={checkboxCardClassName}>
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
                className="h-4 w-4 accent-current"
              />

              <span>Destaque na Home</span>
            </label>

            <label className={checkboxCardClassName}>
              <input
                type="checkbox"
                checked={isOffer}
                onChange={(event) => setIsOffer(event.target.checked)}
                className="h-4 w-4 accent-current"
              />

              <span>Oferta</span>
            </label>

            <label className={checkboxCardClassName}>
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(event) => setIsBestSeller(event.target.checked)}
                className="h-4 w-4 accent-current"
              />

              <span>Mais vendido</span>
            </label>
          </div>
        </section>
      </fieldset>

      <div className="sticky bottom-0 -mx-4 flex flex-col-reverse gap-3 border-t border-border bg-card/95 px-4 pb-1 pt-4 backdrop-blur sm:-mx-6 sm:flex-row sm:justify-end sm:px-6 lg:-mx-8 lg:px-8">
        {onCancel && (
          <Button
            variant="outline"
            type="button"
            disabled={isSaving}
            className="min-h-11 w-full gap-2 rounded-xl sm:w-auto"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
        )}

        <Button
          type="submit"
          disabled={isSaving || images.length === 0}
          className="min-h-11 w-full gap-2 rounded-xl sm:w-auto"
        >
          <Save className="h-4 w-4" />

          {isSaving ? "Salvando..." : "Salvar produto"}
        </Button>
      </div>
    </form>
  );
}
