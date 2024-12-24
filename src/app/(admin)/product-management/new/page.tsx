import React from "react";
import { getSubCategoryService } from "@/redux/action/product-management/sub_category_service";
import CreateProductComponent from "./create-product-component";

const NewPage = async () => {
  const responseSub = await getSubCategoryService({});
  return <CreateProductComponent initialSubCategory={responseSub} />;
};

export default NewPage;
