export interface ProductDetailModel {
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

export interface Value {
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

export interface Variant {
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
  images: Image2[];
}

interface Attribute3 {
  id: string;
  variantId: string;
  attributeValueId: string;
  attributeId: string;
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
}

interface Image2 {
  fileName: string;
  id: string;
  imageUrl: string;
}
