"use server";

import React from "react";
import AboutUsComponent from "./about_us_component";
import { getAboutUsService } from "@/redux/action/user-management/about_us_service";

const AboutUsPage = async () => {
  const resposne = await getAboutUsService();

  return <AboutUsComponent initialData={resposne} />;
};

export default AboutUsPage;
