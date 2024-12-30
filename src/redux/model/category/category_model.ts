import { paginationModel } from "../global/pagination_model";

export interface CategoryListModel {
  data: Category[];
  pagination: paginationModel | null;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  image: Image;
  _count: Count;
}

export interface CategorySelect {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Count {
  products: number;
  subcategories: number;
}

interface Image {
  fileName: string;
  id: string;
  imageUrl: string;
}
