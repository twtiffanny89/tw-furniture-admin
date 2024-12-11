"use client";

import Button from "@/components/custom/button";
import CashImage from "@/components/custom/CashImage";
import { Switch } from "@/components/custom/Switch";
import showToast from "@/components/error-handle/show-toast";
import Header from "@/components/header/header";
import Pagination from "@/components/pagination/pagination";
import { headerAllUser } from "@/constants/data/header_table";
import { getAllUserService } from "@/redux/action/user-management/all_user_service";
import {
  UserInfoListModel,
  UserInfoModel,
} from "@/redux/model/all-user/user_list_model";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import { debounce } from "@/utils/debounce/debounce";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FiEdit } from "react-icons/fi";

interface AllUserComponentProps {
  initialData: UserInfoListModel;
}

const AllUserComponent: React.FC<AllUserComponentProps> = ({ initialData }) => {
  const [userData, setUserData] = useState<UserInfoListModel>(initialData);
  const [loadingUpdate, setLoadingUpdate] = useState({
    id: "",
    loading: false,
  });

  const onRefreshClick = useCallback(
    debounce(async () => {
      onCallApi({});
      showToast("Refresh page successfully!", "success");
    }),
    []
  );

  async function onCallApi({
    page = 1,
    search = "",
  }: {
    page?: number;
    search?: string;
  }) {
    const response = await getAllUserService({ page, search });
    setUserData(response);
  }

  const onSearchChange = useCallback(
    debounce(async (query: string) => {
      if (query && query.length > 0) {
        onCallApi({ search: query });
      } else {
        onCallApi({});
      }
    }),
    []
  );

  async function toggleUserStatus(user: UserInfoModel) {
    setLoadingUpdate({
      id: user.id,
      loading: true,
    });
    setLoadingUpdate({
      id: "",
      loading: false,
    });
  }

  return (
    <div>
      <Header
        title="User Listing"
        onRefreshClick={onRefreshClick}
        onSearchChange={onSearchChange}
        placeholder="Search User id, username ..."
      />

      <div className="mt-4 bg-white min-h-full">
        <div>
          <div className="overflow-x-auto min-h-[50vh]">
            <table>
              <thead className="bg-gray-100">
                <tr>
                  {headerAllUser.map((header, index) => (
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
                {userData?.data.map((user, index) => {
                  const displayIndex =
                    ((userData.pagination?.currentPage || 1) - 1) * 15 +
                    index +
                    1;
                  return (
                    <tr key={user.id} className="hover:bg-gray-200">
                      <td>{displayIndex}</td>
                      <td>{user.id}</td>
                      <td>
                        <CashImage
                          width={32}
                          height={32}
                          imageUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/${user.image?.imageUrl}`}
                        />
                      </td>
                      <td>{user?.username || "- - -"}</td>
                      <td>{formatTimestamp(user.createdAt)}</td>
                      <td>{user.role}</td>
                      <td>{user.firstName || "- - -"}</td>
                      <td>{user.lastName || "- - -"}</td>
                      <td>{user.phoneNumber}</td>
                      <td>
                        <div className="flex gap-2 items-center">
                          <Switch
                            disable={loadingUpdate.loading}
                            checked={user.active}
                            onChange={() => toggleUserStatus(user)}
                          />
                          <span
                            className={
                              user.active ? "text-green-500" : "text-red-500"
                            }
                          >
                            {user.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <Button
                          // onClick={() => onOpenModalSub(sub)}
                          className="w-6 h-6 "
                        >
                          <FiEdit size={14} className="text-white" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {userData.data.length > 0 && (
            <div className="flex justify-end mr-8 mt-8">
              <Pagination
                currentPage={userData.pagination?.currentPage || 1}
                onPageChange={(value) => onCallApi({ page: value })}
                totalPages={userData.pagination?.totalPages || 1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUserComponent;
