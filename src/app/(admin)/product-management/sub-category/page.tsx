"use server";

import React from "react";
import SubCategoryComponent from "./sub_category_component";
import { getSubCategoryService } from "@/redux/action/product-management/sub_category_service";
import { getCategoryService } from "@/redux/action/product-management/category_service";

const SubCategoryPage = async () => {
  const response = await getSubCategoryService({});
  const responseCategory = await getCategoryService({});
  return (
    <SubCategoryComponent
      initialData={response}
      initialCategory={responseCategory}
    />
  );
};

export default SubCategoryPage;
