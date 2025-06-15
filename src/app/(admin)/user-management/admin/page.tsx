/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import CashImage from "@/components/custom/CashImage";
import showToast from "@/components/error-handle/show-toast";
import Header from "@/components/header/header";
import CenteredLoading from "@/components/loading/center_loading";
import ConfirmationModal from "@/components/modal/comfirmation-modal";
import {
  UserRegistrationModal,
  UserFormData,
} from "@/components/modal/user-registration-modal";
import Pagination from "@/components/pagination/Pagination";
import {
  headerAllAdminUser,
  headerAllUser,
} from "@/constants/data/header_table";
import {
  createUserService,
  getAllUserService,
  deleteUserService,
} from "@/redux/action/user-management/all_user_service";
import { UserInfoListModel } from "@/redux/model/all-user/user_list_model";
import { config } from "@/utils/config/config";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import { debounce } from "@/utils/debounce/debounce";
import { useCallback, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

// Interface for API payload
interface CreateUserModel {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

const AllAdminPage = () => {
  const [userData, setUserData] = useState<UserInfoListModel>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    onCallFirstApi({});
  }, []);

  const onRefreshClick = useCallback(
    debounce(async () => {
      onCallApi({});
      showToast("Refresh page successfully!", "success");
    }),
    []
  );

  async function onCallFirstApi({
    page = 1,
    search = "",
  }: {
    page?: number;
    search?: string;
  }) {
    setLoading(true);
    const response = await getAllUserService({
      page,
      search,
      filterBy: "ADMIN",
    });
    setUserData(response);
    setLoading(false);
  }

  async function onCallApi({
    page = 1,
    search = "",
  }: {
    page?: number;
    search?: string;
  }) {
    const response = await getAllUserService({
      page,
      search,
      filterBy: "ADMIN",
    });
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

  // Handle user creation - transform form data to API format
  const handleCreateUser = async (data: UserFormData) => {
    setIsSubmitting(true);
    try {
      // Transform form data to match API interface
      const apiPayload: CreateUserModel = {
        username: data.email, // Use email as username
        email: data.email, // Use email as email
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        isActive: true, // Always set to true
      };

      console.log("API Payload:", apiPayload);

      // Call your create user API
      await createUserService(apiPayload);

      // Close modal
      setIsModalOpen(false);

      // Refresh the data
      await onCallApi({});

      // Show success message
      showToast("Admin user created successfully!", "success");
    } catch (error: any) {
      console.error("Error creating user:", error);
      showToast(error.message || "Failed to create user", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete user click
  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteUserService(userToDelete);

      if (result.success) {
        // Close modal
        setShowDeleteModal(false);
        setUserToDelete(null);

        // Refresh the data
        await onCallApi({});

        // Show success message
        showToast("Admin user deleted successfully!", "success");
      } else {
        // Show error message from service
        showToast(result.message || "Failed to delete user", "error");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      showToast("An unexpected error occurred while deleting user", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle delete modal close
  const handleDeleteModalClose = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  return (
    <div>
      <Header
        title="Admin Listing"
        onRefreshClick={onRefreshClick}
        onSearchChange={onSearchChange}
        placeholder="Search User id, username ..."
        showAdd={true}
        onAddNewClick={() => setIsModalOpen(true)}
      />

      <div className="mt-4 bg-white">
        <div>
          <div className="overflow-x-auto min-h-[50vh]">
            <table>
              <thead className="bg-gray-100">
                <tr>
                  {headerAllAdminUser.map((header, index) => (
                    <th
                      key={header + index.toString()}
                      className="border border-gray-300 px-4 py-2 text-left"
                    >
                      {header}
                    </th>
                  ))}
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Actions
                  </th>
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
                      <td className="max-w-72">{user.id}</td>
                      <td>{user?.username || "- - -"}</td>
                      <td>{formatTimestamp(user.createdAt)}</td>
                      <td>{user.role}</td>
                      <td>{user.firstName || "- - -"}</td>
                      <td>{user.lastName || "- - -"}</td>
                      <td
                        className={
                          user.isActive ? "text-green-500" : "text-red-500"
                        }
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDeleteClick(user.id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          title="Delete user"
                        >
                          <MdDelete size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {userData && userData.data.length > 0 && (
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

      {/* User Registration Modal */}
      <UserRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUser}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Admin User"
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this admin user? This action cannot be undone."
        isNotCancel={false}
      />

      <CenteredLoading loading={loading} />
    </div>
  );
};

export default AllAdminPage;
