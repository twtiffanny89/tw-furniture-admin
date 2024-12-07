"use client";

import Button from "@/components/custom/button";
import Header from "@/components/header/header";
import { headerAllUser } from "@/constants/data/header_table";
import { getAllUserService } from "@/service/user_management/all_user_service";
import React from "react";

const AllUserPage = () => {
  // const response = await
  async function getData() {
    await getAllUserService();
  }

  return (
    <div>
      <Header />
      <Button onClick={getData}>Test</Button>

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
                {/* {dataListingPreview?.map((report) => {
                    return (
                      <tr key={report.no} className="hover:bg-gray-200">
                        <td className="truncate">{report.no}</td>
                        <td className="truncate">{report.date}</td>
                        <td className="truncate">{report.branch}</td>
                        <td className="truncate">{report.typeOfTxn}</td>
                        <td className="truncate"></td>
                        <td className="truncate"></td>
                        <td className="truncate"></td>
                        <td className="truncate"></td>
                        <td className="truncate"></td>
                        <td className="truncate"></td>
                        <td className="truncate"></td>
                        <td className="truncate"></td>
                        <td className="truncate"></td>
                        <td className="truncate">{report.status}</td>
                        <td className="truncate">{report.remark}</td>
                        <td className="truncate">{report.cashCustodian}</td>
                        <td className="truncate">{report.checkedBy}</td>
                        <td className="truncate">{report.approvedBy}</td>
                      </tr>
                    );
                  })} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUserPage;
