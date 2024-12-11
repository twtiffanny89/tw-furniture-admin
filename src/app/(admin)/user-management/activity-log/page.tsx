"use server";

import { getActivityLogService } from "@/redux/action/user-management/activity_log_service";
import React from "react";
import ActivityLogComponent from "./activity_log_componet";

const ActivityLogPage = async () => {
  const response = await getActivityLogService({});

  return <ActivityLogComponent initialData={response} />;
};

export default ActivityLogPage;
