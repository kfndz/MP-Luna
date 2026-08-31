import { AuthService } from "@/services/AuthService";

import type {
  Product,
  ProductCreateInput,
  ProductUpdateInput,
} from "@/types/product";

const API_URL = "/api/products";

const PRODUCTS_CACHE_DURATION = 60_000;

let productsCache: Product[] | null = null;
let productsCacheTime = 0;
let productsRequest: Promise<Product[]> | null = null;

type ApiCategory = {
  id?: string;
  name?: string;
  slug?: string;
};

type ApiSubcategory = {
  id?: string;
  name?: string;
  slug?: string;
};

type ApiProduct = Omit<
  Product,
  | "price"
  | "originalPrice"
  | "category"
  | "subcategory"
  | "images"
  | "videos"
  | "reviews"
> & {
  price: number | string;
  originalPrice?: number | string | null;

  category?: ApiCategory | string | null;
  subcategory?: ApiSubcategory | string | null;

  images?: Array<string | { url?: string | null }>;
  videos?: string[];

  reviewCount?: number;
  reviews?: number;
};

type GetAllOptions = {
  forceRefresh?: boolean;
};

function normalizeProduct(product: ApiProduct): Product {
  const normalizedImages =
    product.images
      ?.map((image) => {
        if (typeof image === "string") {
          return image;
        }

        return image?.url ?? "";
      })
      .filter(Boolean) ?? [];

  const normalizedVideos = product.videos?.filter(Boolean) ?? [];

  const mainImage =
    product.image ??
    normalizedImages[0] ??
    "/images/home-image.webp";

  const stock = Number(product.stock ?? 0);

  return {
    ...product,

    price: Number(product.price ?? 0),

    originalPrice:
      product.originalPrice === null ||
      product.originalPrice === undefined
        ? null
        : Number(product.originalPrice),

    image: mainImage,

    images:
      normalizedImages.length > 0
        ? normalizedImages
        : [mainImage],

    videos: normalizedVideos,

    rating: Number(product.rating ?? 0),

    reviews: Number(
      product.reviews ??
        product.reviewCount ??
        0,
    ),

    reviewCount: Number(
      product.reviewCount ??
        product.reviews ??
        0,
    ),

    stock,

    inStock: stock > 0,

    category:
      typeof product.category === "string"
        ? product.category
        : product.category?.slug ?? null,

    subcategory:
      typeof product.subcategory === "string"
        ? product.subcategory
        : product.subcategory?.slug ?? null,

    categoryId:
      product.categoryId ??
      (typeof product.category === "object"
        ? product.category?.id ?? null
        : null),

    subcategoryId:
      product.subcategoryId ??
      (typeof product.subcategory === "object"
        ? product.subcategory?.id ?? null
        : null),
  };
}

function clearProductsCache() {
  productsCache = null;
  productsCacheTime = 0;
  productsRequest = null;
}

async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const token = AuthService.getToken();

  const headers = new Headers(options?.headers);

  headers.set("Accept", "application/json");

  if (options?.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Erro ao processar a solicitação.";

    const contentType =
      response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      try {
        const data = await response.json();

        if (data?.error) {
          message = data.error;
        } else if (data?.message) {
          message = data.message;
        }
      } catch {
        // Mantém a mensagem padrão.
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType =
    response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      "A API retornou uma resposta em formato inválido.",
    );
  }

  return response.json() as Promise<T>;
}

async function fetchAllProducts(): Promise<Product[]> {
  const products = await request<ApiProduct[]>(API_URL);

  const normalizedProducts =
    products.map(normalizeProduct);

  productsCache = normalizedProducts;
  productsCacheTime = Date.now();

  return normalizedProducts;
}

async function deleteProduct(
  id: string | number,
): Promise<void> {
  await request<void>(
    `${API_URL}?id=${encodeURIComponent(String(id))}`,
    {
      method: "DELETE",
    },
  );

  clearProductsCache();
}

export const ProductService = {
  async getAll(
    options: GetAllOptions = {},
  ): Promise<Product[]> {
    const cacheIsValid =
      productsCache !== null &&
      Date.now() - productsCacheTime <
        PRODUCTS_CACHE_DURATION;

    if (!options.forceRefresh && cacheIsValid) {
      return productsCache;
    }

    if (!options.forceRefresh && productsRequest) {
      return productsRequest;
    }

    productsRequest = fetchAllProducts();

    try {
      return await productsRequest;
    } finally {
      productsRequest = null;
    }
  },

  async getById(
    id: string | number,
  ): Promise<Product> {
    const product = await request<ApiProduct>(
      `${API_URL}?id=${encodeURIComponent(String(id))}`,
    );

    return normalizeProduct(product);
  },

  async create(
    input: ProductCreateInput,
  ): Promise<Product> {
    const product = await request<ApiProduct>(
      API_URL,
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );

    clearProductsCache();

    return normalizeProduct(product);
  },

  async update(
    id: string | number,
    input: ProductUpdateInput,
  ): Promise<Product> {
    const product = await request<ApiProduct>(
      `${API_URL}?id=${encodeURIComponent(String(id))}`,
      {
        method: "PUT",
        body: JSON.stringify(input),
      },
    );

    clearProductsCache();

    return normalizeProduct(product);
  },

  async delete(
    id: string | number,
  ): Promise<void> {
    await deleteProduct(id);
  },

  async remove(
    id: string | number,
  ): Promise<void> {
    await deleteProduct(id);
  },

  clearCache() {
    clearProductsCache();
  },
};