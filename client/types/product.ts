export type ProductAvailability =
  | "AVAILABLE"
  | "UNAVAILABLE"
  | "UNKNOWN";

export interface Product {
  id: string | number;

  name: string;
  slug?: string;

  description?: string | null;
  brand?: string | null;

  price: number;
  originalPrice?: number | null;

  affiliateUrl?: string | null;
  marketplace?: string | null;

  externalProductId?: string | null;
  priceCheckedAt?: string | null;
  availability?: ProductAvailability;

  image?: string | null;
  images?: string[];
  videos?: string[];

  rating?: number;
  reviews?: number;
  reviewCount?: number;

  stock?: number;
  inStock?: boolean;

  featured?: boolean;
  isOffer?: boolean;
  isBestSeller?: boolean;

  badge?: string | null;

  category?: string | null;
  subcategory?: string | null;

  categoryId?: string | null;
  subcategoryId?: string | null;

  specifications?: Record<string, string>;

  createdAt?: string;
  updatedAt?: string;
}

export type ProductCreateInput = {
  name: string;
  slug?: string;

  description?: string | null;
  brand?: string | null;

  price: number;
  originalPrice?: number | null;

  affiliateUrl?: string | null;
  marketplace?: string | null;

  externalProductId?: string | null;
  priceCheckedAt?: string | null;
  availability?: ProductAvailability;

  image?: string | null;
  images?: string[];
  videos?: string[];

  rating?: number;
  reviewCount?: number;

  stock?: number;

  featured?: boolean;
  isOffer?: boolean;
  isBestSeller?: boolean;

  badge?: string | null;

  categoryId?: string | null;
  subcategoryId?: string | null;

  specifications?: Record<string, string>;
};

export type ProductUpdateInput =
  Partial<ProductCreateInput>;