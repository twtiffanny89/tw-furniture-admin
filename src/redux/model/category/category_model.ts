import { paginationModel } from "../global/pagination_model";

export interface CategoryListModel {
  data: Category[];
  pagination: paginationModel | null;
}

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  _count: Count;
}

interface Count {
  products: number;
  subcategories: number;
}
