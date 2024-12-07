import { getActivityLogService } from "@/redux/action/user_management/activity_log_service";
import { getAllUserService } from "@/redux/action/user_management/all_user_service";
import React from "react";
import ActivityLogComponent from "./activity_log_componet";

const page = async () => {
  const response = await getActivityLogService({});

  return <ActivityLogComponent initialData={response} />;
};

export default page;
