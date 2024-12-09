import React from "react";
import CategoryComponent from "./category_component";
import { getCategoryService } from "@/redux/action/product-management/category_service";

const CategoryPage = async () => {
  const response = await getCategoryService({});

  return <CategoryComponent initialData={response} />;
};

export default CategoryPage;
