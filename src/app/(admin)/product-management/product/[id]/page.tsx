import React from "react";
import ProductDetailComponet from "./product-detail-component";
import { getSubCategoryService } from "@/redux/action/product-management/sub_category_service";

const ProductPage = async () => {
  const responseSub = await getSubCategoryService({});
  return <ProductDetailComponet initialSubCategory={responseSub} />;
};

export default ProductPage;
