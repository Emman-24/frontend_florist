export interface ProductPrice {
  amount: number;
  discountAmount: number;
  currency: string;
  hasDiscount: boolean;
  discountPercent: number;
}

export interface ProductImage {
  publicId: string;
  originalUrl: string;
  thumbnailUrl: string;
  mediumUrl: string;
  altText: string;
  isPrimary: boolean;
  position: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  path: string;
}

export interface ProductTag {
  id: number;
  text: string;
  route: string;
}

export interface ProductDescription {
  shortDescription: string;
  description: string;
}

export interface ProductFlower {
  id: number;
  name: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  seoName: string;
  price: ProductPrice;
  isAvailable: boolean;
  seasonal: boolean;
  featured: boolean;
  views: number;
  description: ProductDescription;
  gallery: ProductImage[];
  flowers: ProductFlower[];
  categories: ProductCategory[];
  tags: ProductTag[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetailResponse {
  data: ProductDetail;
  message: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  seoName: string;
  price: ProductPrice;
  isAvailable: boolean;
  seasonal: boolean;
  featured: boolean;
  primaryImage: ProductImage;
  categories: ProductCategory[];
  tags: ProductTag[];
}

export interface PageableSort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Pageable {
  sort: PageableSort;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
  offset: number;
}

export interface ProductPageResponse {
  totalPages: number;
  totalElements: number;
  sort: PageableSort;
  pageable: Pageable;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  size: number;
  content: Product[];
  number: number;
  empty: boolean;
}

export interface ProductSearchParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  categoryId?: number;
  tagId?: number;
  featured?: boolean;
  seasonal?: boolean;
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
}
