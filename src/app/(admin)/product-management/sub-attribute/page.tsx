"use server";
import { getSubAttributeService } from "@/redux/action/product-management/sub-attribude-service";
import React from "react";
import SubAttributeComponent from "./sub-attribute-component";
import { getAttributeService } from "@/redux/action/product-management/attribute-service";

const SubAttributePage = async () => {
  const responseAttribute = await getAttributeService({});
  const response = await getSubAttributeService({});
  return (
    <SubAttributeComponent
      initialAttribute={responseAttribute}
      initialData={response}
    />
  );
};
export default SubAttributePage;
