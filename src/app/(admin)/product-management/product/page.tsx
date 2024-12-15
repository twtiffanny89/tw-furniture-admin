import { getAllProductService } from "@/redux/action/product-management/product-service";
import React from "react";
import dynamic from "next/dynamic";
const ProductComponent = dynamic(() => import("./poduct-component"));

const ProductPage = async () => {
  const response = await getAllProductService({});
  return <ProductComponent initialData={response} />;
};

export default ProductPage;
