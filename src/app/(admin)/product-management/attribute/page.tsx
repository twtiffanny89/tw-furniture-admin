"use server";

import React from "react";
import AttributeComponent from "./attribute-component";
import { getAttributeService } from "@/redux/action/product-management/attribute-service";

const AttributePage = async () => {
  const response = await getAttributeService({});
  return <AttributeComponent initialData={response} />;
};

export default AttributePage;
