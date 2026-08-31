import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../_lib/prisma.js";
import { requireAdminToken } from "../_lib/auth.js";

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function findProduct(idOrSlug: string) {
  return prisma.product.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      category: true,
      subcategory: true,
    },
  });
}

async function resolveCategoryId(categoryIdOrSlug: string) {
  const category =
    (await prisma.category.findUnique({ where: { id: categoryIdOrSlug } })) ??
    (await prisma.category.findUnique({ where: { slug: categoryIdOrSlug } }));

  if (!category) throw new Error("Categoria inválida.");

  return category.id;
}

async function resolveSubcategoryId(
  subcategoryIdOrSlug: string | null | undefined,
  categoryId: string,
) {
  if (!subcategoryIdOrSlug?.trim()) return null;

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

  if (!subcategory) throw new Error("Subcategoria inválida.");

  return subcategory.id;
}

async function prepareProductData(body: any, existingProduct: any) {
  const categoryInput = body.categoryId ?? existingProduct.categoryId;
  const categoryId = await resolveCategoryId(String(categoryInput));

  const subcategoryInput =
    body.subcategoryId !== undefined
      ? body.subcategoryId
      : existingProduct.subcategoryId;

  const subcategoryId = await resolveSubcategoryId(
    subcategoryInput ? String(subcategoryInput) : null,
    categoryId,
  );

  const name = String(body.name ?? existingProduct.name).trim();

  if (!name) throw new Error("Nome do produto é obrigatório.");

  const affiliateUrl = String(
    body.affiliateUrl ?? existingProduct.affiliateUrl,
  ).trim();

  const marketplace = String(
    body.marketplace ?? existingProduct.marketplace,
  ).trim();

  const image = String(body.image ?? existingProduct.image).trim();

  const rawImages = body.images !== undefined ? body.images : existingProduct?.images ?? [];
  const images = Array.isArray(rawImages)
    ? rawImages.map((value) => String(value).trim()).filter(Boolean)
    : [];

  const rawVideos = body.videos !== undefined ? body.videos : existingProduct?.videos ?? [];
  const videos = Array.isArray(rawVideos)
    ? rawVideos.map((value) => String(value).trim()).filter(Boolean)
    : [];

  if (!affiliateUrl) throw new Error("Link de afiliado é obrigatório.");
  if (!marketplace) throw new Error("Marketplace é obrigatório.");
  if (!image) throw new Error("Imagem é obrigatória.");

  return {
    name,
    slug: String(body.slug ?? existingProduct.slug ?? "").trim() || createSlug(name),
    description:
      body.description !== undefined
        ? body.description
          ? String(body.description).trim()
          : null
        : existingProduct.description,
    brand:
      body.brand !== undefined
        ? body.brand
          ? String(body.brand).trim()
          : null
        : existingProduct.brand,
    price: Number(body.price ?? existingProduct.price),
    originalPrice:
      body.originalPrice !== undefined
        ? body.originalPrice === null || body.originalPrice === ""
          ? null
          : Number(body.originalPrice)
        : existingProduct.originalPrice,
    affiliateUrl,
    marketplace,
    image,
    images: images.length > 0 ? images : [image],
    videos,
    rating:
      body.rating !== undefined
        ? body.rating === null || body.rating === ""
          ? 0
          : Number(body.rating)
        : existingProduct.rating,
    reviewCount:
      body.reviewCount !== undefined
        ? body.reviewCount === null || body.reviewCount === ""
          ? 0
          : Number(body.reviewCount)
        : existingProduct.reviewCount,
    stock: Number(body.stock ?? existingProduct.stock ?? 0),
    featured:
      body.featured !== undefined
        ? Boolean(body.featured)
        : existingProduct.featured,
    isOffer:
      body.isOffer !== undefined
        ? Boolean(body.isOffer)
        : existingProduct.isOffer,
    isBestSeller:
      body.isBestSeller !== undefined
        ? Boolean(body.isBestSeller)
        : existingProduct.isBestSeller,
    badge:
      body.badge !== undefined
        ? body.badge
          ? String(body.badge).trim()
          : null
        : existingProduct.badge,
    categoryId,
    subcategoryId,
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  try {
    const id = String(req.query.id ?? "");

    if (!id) {
      return res.status(400).json({
        message: "ID do produto não informado.",
      });
    }

    const existingProduct = await findProduct(id);

    if (!existingProduct) {
      return res.status(404).json({
        message: "Produto não encontrado.",
      });
    }

    if (req.method === "GET") {
      return res.status(200).json(existingProduct);
    }

    if (req.method === "PUT") {
      requireAdminToken(req);

      const data = await prepareProductData(req.body, existingProduct);

      const product = await prisma.product.update({
        where: {
          id: existingProduct.id,
        },
        data,
        include: {
          category: true,
          subcategory: true,
        },
      });

      return res.status(200).json(product);
    }

    if (req.method === "DELETE") {
      requireAdminToken(req);

      await prisma.product.delete({
        where: {
          id: existingProduct.id,
        },
      });

      return res.status(204).send("");
    }

    return res.status(405).json({
      message: "Método não permitido.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao processar produto.";

    if (message === "UNAUTHORIZED") {
      return res.status(401).json({
        message: "Token de autenticação não enviado ou inválido.",
      });
    }

    if (message === "FORBIDDEN") {
      return res.status(403).json({
        message: "Acesso negado.",
      });
    }

    return res.status(400).json({ message });
  }
}