import { PrismaClient } from "@prisma/client";
import { ProductRepository } from "../repositories/productRepository.js";

const prisma = new PrismaClient();

type ProductInput = {
  name: string;
  slug?: string;
  description?: string | null;
  brand?: string | null;
  price: number | string;
  originalPrice?: number | string | null;
  affiliateUrl: string;
  marketplace: string;
  image: string;
  images?: string[];
  videos?: string[];
  rating?: number | string | null;
  reviewCount?: number | string | null;
  stock?: number | string | null;
  featured?: boolean;
  isOffer?: boolean;
  isBestSeller?: boolean;
  badge?: string | null;
  categoryId: string;
  subcategoryId?: string | null;
};

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeOptionalString(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

async function resolveCategoryId(categoryIdOrSlug: string) {
  const category =
    (await prisma.category.findUnique({
      where: { id: categoryIdOrSlug },
    })) ??
    (await prisma.category.findUnique({
      where: { slug: categoryIdOrSlug },
    }));

  if (!category) {
    throw new Error("Categoria inválida.");
  }

  return category.id;
}

async function resolveSubcategoryId(
  subcategoryIdOrSlug: string | null | undefined,
  categoryId: string,
) {
  if (!subcategoryIdOrSlug?.trim()) {
    return null;
  }

  const subcategory =
    (await prisma.subcategory.findUnique({
      where: { id: subcategoryIdOrSlug },
    })) ??
    (await prisma.subcategory.findFirst({
      where: {
        slug: subcategoryIdOrSlug,
        categoryId,
      },
    }));

  if (!subcategory) {
    throw new Error("Subcategoria inválida.");
  }

  return subcategory.id;
}

async function prepareProductData(input: ProductInput) {
  const stock = Number(input.stock ?? 0);
  const categoryId = await resolveCategoryId(input.categoryId);
  const subcategoryId = await resolveSubcategoryId(
    input.subcategoryId,
    categoryId,
  );

  return {
    name: input.name.trim(),
    slug: input.slug?.trim() || createSlug(input.name),
    description: normalizeOptionalString(input.description),
    brand: normalizeOptionalString(input.brand),
    price: Number(input.price),
    originalPrice:
      input.originalPrice === undefined ||
      input.originalPrice === null ||
      input.originalPrice === ""
        ? null
        : Number(input.originalPrice),
    affiliateUrl: input.affiliateUrl.trim(),
    marketplace: input.marketplace.trim(),
    image: input.image.trim(),
    images: (input.images ?? []).map((value) => value.trim()).filter(Boolean),
    videos: (input.videos ?? []).map((value) => value.trim()).filter(Boolean),
    rating:
      input.rating === undefined ||
      input.rating === null ||
      input.rating === ""
        ? 0
        : Number(input.rating),
    reviewCount:
      input.reviewCount === undefined ||
      input.reviewCount === null ||
      input.reviewCount === ""
        ? 0
        : Number(input.reviewCount),
    stock,
    featured: Boolean(input.featured),
    isOffer: Boolean(input.isOffer),
    isBestSeller: Boolean(input.isBestSeller),
    badge: normalizeOptionalString(input.badge),
    categoryId,
    subcategoryId,
  };
}

export const ProductService = {
  async getAll() {
    return ProductRepository.findAll();
  },

  async getById(idOrSlug: string) {
    return ProductRepository.findById(idOrSlug);
  },

  async create(input: ProductInput) {
    const data = await prepareProductData(input);
    return ProductRepository.create(data);
  },

  async update(idOrSlug: string, input: Partial<ProductInput>) {
    const existingProduct = await ProductRepository.findById(idOrSlug);

    if (!existingProduct) {
      return null;
    }

    const mergedInput: ProductInput = {
      name: input.name ?? existingProduct.name,
      slug: input.slug ?? existingProduct.slug,
      description:
        input.description !== undefined
          ? input.description
          : existingProduct.description,
      brand:
        input.brand !== undefined
          ? input.brand
          : existingProduct.brand,
      price: input.price ?? existingProduct.price.toString(),
      originalPrice:
        input.originalPrice !== undefined
          ? input.originalPrice
          : existingProduct.originalPrice?.toString() ?? null,
      affiliateUrl: input.affiliateUrl ?? existingProduct.affiliateUrl,
      marketplace: input.marketplace ?? existingProduct.marketplace,
      image: input.image ?? existingProduct.image,
      images: input.images ?? existingProduct.images ?? [],
      videos: input.videos ?? existingProduct.videos ?? [],
      rating:
        input.rating !== undefined
          ? input.rating
          : existingProduct.rating,
      reviewCount:
        input.reviewCount !== undefined
          ? input.reviewCount
          : existingProduct.reviewCount,
      stock:
        input.stock !== undefined
          ? input.stock
          : existingProduct.stock,
      featured:
        input.featured !== undefined
          ? input.featured
          : existingProduct.featured,
      isOffer:
        input.isOffer !== undefined
          ? input.isOffer
          : existingProduct.isOffer,
      isBestSeller:
        input.isBestSeller !== undefined
          ? input.isBestSeller
          : existingProduct.isBestSeller,
      badge:
        input.badge !== undefined
          ? input.badge
          : existingProduct.badge,
      categoryId: input.categoryId ?? existingProduct.categoryId,
      subcategoryId:
        input.subcategoryId !== undefined
          ? input.subcategoryId
          : existingProduct.subcategoryId,
    };

    const data = await prepareProductData(mergedInput);
    return ProductRepository.update(idOrSlug, data);
  },

  async delete(idOrSlug: string) {
    return ProductRepository.delete(idOrSlug);
  },

  async remove(idOrSlug: string) {
    return ProductRepository.delete(idOrSlug);
  },
};