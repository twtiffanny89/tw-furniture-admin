/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import CashImage from "@/components/custom/CashImage";
import showToast from "@/components/error-handle/show-toast";
import HeaderCalender from "@/components/header/HeaderCalender";
import Pagination from "@/components/pagination/Pagination";
import { headerActivityLog } from "@/constants/data/header_table";
import { getActivityLogService } from "@/redux/action/user-management/activity_log_service";
import { ActivityLogListModel } from "@/redux/model/activity-log/activity_log_model";
import { config } from "@/utils/config/config";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import { debounce } from "@/utils/debounce/debounce";
import { openGoogleMap } from "@/utils/google-map/open_google_map";
import { useCallback, useEffect, useState } from "react";

const ActivityLogComponent = () => {
  const [activityData, setActivityData] =
    useState<ActivityLogListModel | null>();
  const [selectedFromDate, setSelectedFromDate] = useState<string>("");
  const [selectedToDate, setSelectedToDate] = useState<string>("");

  useEffect(() => {
    onCallApi({});
  }, []);

  const onSearchClick = useCallback(
    debounce(async () => {
      showToast("Your filter date is successfully!", "success");
      onCallApi({ dateFrom: selectedFromDate, dateTo: selectedToDate });
    }),
    [selectedFromDate, selectedToDate]
  );

  function openMap(lat: string, lng: string) {
    openGoogleMap(lat, lng);
  }

  async function onCallApi({
    page = 1,
    dateFrom = "",
    dateTo = "",
  }: {
    page?: number;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const response = await getActivityLogService({ page, dateFrom, dateTo });
    setActivityData(response);
  }

  function onClearSearchClick() {
    setSelectedFromDate("");
    setSelectedToDate("");
    onCallApi({});
  }

  return (
    <div className="min-h-screen">
      <HeaderCalender
        selectedFromDate={selectedFromDate}
        handleFromDateChange={setSelectedFromDate}
        selectedToDate={selectedToDate}
        handleToDateChange={setSelectedToDate}
        onSearchClick={onSearchClick}
        title="Actvity log"
        onClearSearchClick={onClearSearchClick}
      />
      <div className="mt-4 bg-white">
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
                {activityData?.data.map((activity, index) => {
                  const displayIndex =
                    ((activityData.pagination?.currentPage || 1) - 1) * 15 +
                    index +
                    1;
                  return (
                    <tr key={activity.id} className="hover:bg-gray-200">
                      <td>{displayIndex}</td>
                      <td>{activity.id}</td>
                      <td>
                        <CashImage
                          width={32}
                          height={32}
                          imageUrl={`${config.BASE_URL}${activity.user?.image}`}
                        />
                      </td>
                      <td>{`${activity?.deviceName} - ${activity.deviceType} - ${activity.osVersion}`}</td>
                      <td>{activity.clientIP}</td>
                      <td>
                        {activity.physicalDevice
                          ? "Real device"
                          : "Fake device"}
                      </td>
                      <td>
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
                      <td>{formatTimestamp(activity.createdAt)}</td>
                      <td>{activity.user?.id || "Anonymous"}</td>
                      <td>{activity.user?.firstName || "Anonymous"}</td>
                      <td>{activity.user?.lastName || "Anonymous"}</td>
                      <td>{activity.user?.username || "Anonymous"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {activityData && activityData.data.length > 0 && (
            <div className="flex justify-end mr-8 mt-8">
              <Pagination
                currentPage={activityData.pagination?.currentPage || 1}
                onPageChange={(page) => onCallApi({ page })}
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
