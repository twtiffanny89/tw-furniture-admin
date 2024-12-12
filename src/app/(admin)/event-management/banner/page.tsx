import React from "react";
import BannerComponent from "./banner_component";
import { getBannerService } from "@/redux/action/event-management/banner_service";

const page = async () => {
  const response = await getBannerService({});
  return <BannerComponent initialData={response} />;
};

export default page;
