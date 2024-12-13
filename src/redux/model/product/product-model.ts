import { paginationModel } from "../global/pagination_model";

export interface ProductListModel {
  data: Product[];
  pagination: paginationModel | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  subcategoryId: string;
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
  subcategory: Subcategory;
  attributes: Attribute[];
  variants: Variant[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface Attribute {
  attribute: Attribute2;
  values: Value[];
}

interface Attribute2 {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Value {
  id: string;
  valueType: string;
  value: string;
  label: string;
  attributeId: string;
  createdAt: string;
  updatedAt: string;
  image: Image[];
}

interface Image {
  fileName: string;
  id: string;
  imageUrl: string;
}

interface Variant {
  id: string;
  productId: string;
  price: string;
  discount?: string;
  discountType: string;
  discountStartDate?: string;
  discountEndDate?: string;
  stock: number;
  sku: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attributes: Attribute3[];
  images: Image[];
}

export interface Attribute3 {
  id: string;
  variantId: string;
  attributeValueId: string;
  attributeId: string;
  createdAt: string;
  updatedAt: string;
  attributeValue: AttributeValue;
}

export interface AttributeValue {
  id: string;
  valueType: string;
  value: string;
  label: string;
  attributeId: string;
  createdAt: string;
  updatedAt: string;
}
