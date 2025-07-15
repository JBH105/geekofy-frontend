"use client";
import Image from "next/image";
import CallIcon from "../../../public/image/CallIcon.svg";
import SearchAdminIcon from "../../../public/image/SearchAdminIcon.svg";
import EditIcon from "../../../public/image/EditIcon.svg";
import Email from "../../../public/image/Email.svg";
import { useState } from "react";

export default function BuyerManagement() {
  const [checkboxState, setCheckboxState] = useState({
    total: false,
    active: false,
    tempClosed: false,
    permClosed: false,
  });
  const [counts, setCounts] = useState({
    total: 0,
    active: 0,
    tempClosed: 0,
    permClosed: 0,
  });
  const buyers = [
    {
      id: 1,
      name: "John Doe",
      phone: "(567) 865-7896",
      email: "contact@buyer.com",
      registered: "mm/dd/yy",
      reviews: 7,
    },
    {
      id: 3,
      name: "Michael Jackson",
      phone: "null",
      email: "contact@gmail.com",
      registered: "mm/dd/yy",
      reviews: 28,
    },
  ];

  return (
    <main className="bg-white p-8 rounded-2xl shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] mb-4">
      <div className="">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search buyer"
              // value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-[#e1e1e1] rounded-md px-3 py-3 w-64 text-[#666666]"
            />
            <Image
              src={SearchAdminIcon}
              alt="Search Icon"
              className="ml-3 w-6 h-6 mr-[60px]"
            />
          </div>
          <div className="flex items-center space-x-[20px] text-sm mr-20">
            <div className="flex items-center">
              <input
                type="checkbox"
                // checked={checkboxState.total}
                // onChange={() => handleCheckboxChange("total")}
                className="w-4 h-4 rounded border border-[#666666] bg-[#FFFFFF] appearance-none checked:bg-[#666666] checked:border-[#666666] focus:outline-none cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-white checked:after:text-xs checked:after:font-bold"
              />
              <span className="text-[#333333] text-sm font-normal ml-2">
                Total Registered Buyers : 459
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="rounded-[10px] border border-[#e1e1e1] bg-[#f2f2f2]">
                <th className="text-left py-3 px-2 text-sm text-[#000000] font-medium whitespace-nowrap">
                  S. No.
                </th>
                <th className="text-left py-3 px-2 text-sm text-[#000000] font-medium whitespace-nowrap">
                  Buyer Name
                </th>
                <th className="text-left py-3 px-2 text-sm text-[#000000] font-medium whitespace-nowrap">
                  Contact Info
                </th>
                <th className="text-left py-3 px-2 text-sm text-[#000000] font-medium whitespace-nowrap">
                  Registered
                </th>
                <th className="text-left py-3 px-2 text-sm text-[#000000] font-medium whitespace-nowrap">
                  Total Reviews
                </th>
                <th className="text-left py-3 px-2 text-sm text-[#000000] font-medium whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((buyer) => (
                <tr key={buyer.id} className="">
                  <td className="py-4 px-2 text-sm font-normal text-[#666666]">
                    {buyer.id}
                  </td>
                  <td className="py-4 px-2 text-sm font-normal text-[#666666]">
                    {buyer.name}
                  </td>
                  <td className="py-4 px-2 text-sm font-normal">
                    <div className="flex items-center text-[#666666] mb-1">
                      <Image
                        src={CallIcon}
                        alt="Call Icon"
                        className="w-4 h-4 mr-2"
                      />
                      <span>{buyer.phone}</span>
                    </div>
                    <div className="flex items-center text-[#666666]">
                      <Image
                        src={Email}
                        alt="Email Icon"
                        className="w-4 h-4 mr-2"
                      />
                      <span>{buyer.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-sm font-normal text-[#666666]">
                    {buyer.registered}
                  </td>
                  <td className="py-4 px-2 text-sm font-normal text-[#666666]">
                    {buyer.reviews}
                  </td>
                  <td className="py-4 px-2">
                    <Image
                      src={EditIcon}
                      alt="Edit Icon"
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
