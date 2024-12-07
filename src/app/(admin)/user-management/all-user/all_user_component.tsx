"use client";

import Button from "@/components/custom/button";
import CashImage from "@/components/custom/CashImage";
import showToast from "@/components/error-handle/show-toast";
import Header from "@/components/header/header";
import { headerAllUser } from "@/constants/data/header_table";
import { UserInfoListModel } from "@/redux/model/all-user/user_list_model";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AllUserComponentProps {
  initialData: UserInfoListModel;
}

const AllUserComponent: React.FC<AllUserComponentProps> = ({ initialData }) => {
  const [userData, setUserData] = useState<UserInfoListModel>(initialData);
  const router = useRouter();

  // const response = await
  async function onRefreshClick() {
    router.refresh();
    showToast("Refresh page successfully!", "success");
  }

  return (
    <div>
      <Header onRefreshClick={onRefreshClick} />

      <div className="mt-4 bg-white ">
        <div>
          <div className="overflow-x-auto min-h-[85vh]">
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
                {userData?.data.map((user) => {
                  return (
                    <tr key={user.id} className="hover:bg-gray-200">
                      <td className="truncate">{user.id}</td>
                      <td className="truncate">
                        <CashImage
                          width={32}
                          height={32}
                          imageUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/${user.image.imageUrl}`}
                        />
                      </td>
                      <td className="truncate">{user?.username || "- - -"}</td>
                      <td className="truncate">{user?.createdAt}</td>
                      <td className="truncate">{user.role}</td>
                      <td className="truncate">{user.firstName || "- - -"}</td>
                      <td className="truncate">{user.lastName || "- - -"}</td>
                      <td className="truncate">{user.phoneNumber}</td>
                      <td className="truncate">
                        {user.active ? "Active" : "Inactive"}
                      </td>
                      <td className="truncate">{user.phoneNumber}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUserComponent;
