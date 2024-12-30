import { paginationModel } from "../global/pagination_model";

export interface ProductPreviewListModel {
  data: ProductPreview[];
  pagination: paginationModel | null;
}

export interface ProductPreview {
  id: string;
  fromId: string;
  toId: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  productTo: ProductTo;
}

export interface ProductTo {
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
  attributes: Attribute[];
  variants: Variant[];
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
  name: string;
  attributeValueId: string;
  productAttributeId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  attributeValue: AttributeValue;
}

interface AttributeValue {
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
  sku?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attributes: Attribute3[];
  images: Image2[];
}

interface Attribute3 {
  id: string;
  variantId: string;
  attributeValueId: string;
  attributeId: string;
  createdAt: string;
  updatedAt: string;
  attributeValue: AttributeValue2;
}

interface AttributeValue2 {
  id: string;
  valueType: string;
  value: string;
  label: string;
  attributeId: string;
  createdAt: string;
  updatedAt: string;
}

interface Image2 {
  fileName: string;
  id: string;
  imageUrl: string;
}
