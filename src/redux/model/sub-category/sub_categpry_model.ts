import { paginationModel } from "../global/pagination_model";

export interface SubCategoryListModel {
  data: Subcategory[];
  pagination: paginationModel | null;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  image: any;
  category: Category;
  _count: Count;
}

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Count {
  products: number;
}
