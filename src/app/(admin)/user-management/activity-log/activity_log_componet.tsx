"use client";

import Button from "@/components/custom/button";
import CashImage from "@/components/custom/CashImage";
import showToast from "@/components/error-handle/show-toast";
import Header from "@/components/header/header";
import Pagination from "@/components/pagination/pagination";
import { headerActivityLog } from "@/constants/data/header_table";
import { getActivityLogService } from "@/redux/action/user-management/activity_log_service";
import { ActivityLogListModel } from "@/redux/model/activity-log/activity_log_model";
import { openGoogleMap } from "@/utils/google-map/open_google_map";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ActivityLogComponentprops {
  initialData: ActivityLogListModel;
}

const ActivityLogComponent: React.FC<ActivityLogComponentprops> = ({
  initialData,
}) => {
  const [activityData, setActivityData] =
    useState<ActivityLogListModel>(initialData);
  const router = useRouter();

  // const response = await
  async function onRefreshClick() {
    router.refresh();
    showToast("Refresh page successfully!", "success");
  }

  function openMap(lat: string, lng: string) {
    openGoogleMap(lat, lat);
  }

  async function onPageChange(value: number) {
    const response = await getActivityLogService({ page: value });
    setActivityData(response);
  }

  return (
    <div>
      <Header onRefreshClick={onRefreshClick} />

      <div className="mt-4 bg-white min-h-full">
        <div>
          <div className="overflow-x-auto min-h-[50vh]">
            <table>
              <thead className="bg-gray-100">
                <tr>
                  {headerActivityLog.map((header, index) => (
                    <th
                      key={header + index.toString()}
                      className="border border-gray-300 px-4 py-2 text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activityData?.data.map((activity) => {
                  return (
                    <tr key={activity.id} className="hover:bg-gray-200">
                      <td className="truncate">{activity.id}</td>
                      <td className="truncate">
                        <CashImage
                          width={32}
                          height={32}
                          imageUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/${activity.user?.image}`}
                        />
                      </td>
                      <td className="truncate">{activity.clientIP}</td>
                      <td className="truncate">{activity?.deviceName}</td>
                      <td className="truncate">{activity.deviceType}</td>
                      <td className="truncate">{activity.osVersion}</td>
                      <td className="truncate">
                        {activity.physicalDevice
                          ? "Real device"
                          : "Fake device"}
                      </td>
                      <td className="truncate">
                        {activity.latitude && activity.latitude ? (
                          <button
                            onClick={() =>
                              openMap(activity.latitude, activity.latitude)
                            }
                            className="text-primary underline"
                          >
                            View user address
                          </button>
                        ) : (
                          <p className="text-amber-700">No user address</p>
                        )}
                      </td>
                      <td className="truncate">{activity.createdAt}</td>
                      <td className="truncate">
                        {activity.user?.id || "Anonymous"}
                      </td>
                      <td className="truncate">
                        {activity.user?.firstName || "Anonymous"}
                      </td>
                      <td className="truncate">
                        {activity.user?.lastName || "Anonymous"}
                      </td>
                      <td className="truncate">
                        {activity.user?.username || "Anonymous"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {activityData.data.length > 0 && (
            <div className="flex justify-end mr-8 mt-8">
              <Pagination
                currentPage={activityData.pagination?.currentPage || 1}
                onPageChange={onPageChange}
                totalPages={activityData.pagination?.totalPages || 1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogComponent;
