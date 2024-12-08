"use server";

import React from "react";
import SubCategoryComponent from "./sub_category_component";
import { getSubCategoryService } from "@/redux/action/product-management/sub_category_service";

const SubCategoryPage = async () => {
  const response = await getSubCategoryService({});
  return <SubCategoryComponent initialData={response} />;
};

export default SubCategoryPage;
