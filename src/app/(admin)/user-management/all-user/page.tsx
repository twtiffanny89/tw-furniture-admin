import React from "react";
import { getAllUserService } from "@/redux/action/user_management/all_user_service";
import AllUserComponent from "./all_user_component";

const AllUserPage = async () => {
  const response = await getAllUserService({});

  return <AllUserComponent initialData={response} />;
};

export default AllUserPage;
