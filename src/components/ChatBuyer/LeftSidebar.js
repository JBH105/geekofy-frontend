"use client";

import Image from "next/image";
import SearchAdminIcon from "../../../public/image/SearchAdminIcon.svg";
import testImg from "../../../public/image/ProfileUser.svg";

export default function LeftSidebar({
  customers,
  selectedCustomer,
  onCustomerSelect,
  isSidebarHovered,
  sidebarRef,
}) {
  return (
    <div className="w-[255PX] flex flex-col h-full lg:w-[255px] md:w-[200px] sm:w-full">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-[245PX] pl-3 pr-10 py-2 border rounded-[10px] border-[#CCCCCC] outline-none"
          />
          <Image
            src={SearchAdminIcon}
            alt="SearchAdminIcon"
            className="absolute right-5 top-2"
          />
        </div>
      </div>

      <div
        ref={sidebarRef}
        className={`flex-1 overflow-y-auto ${isSidebarHovered ? "custom-scrollbar-light" : "no-scrollbar"}`}
          style={{ height: "calc(100% - 48px)" }} 
      >
        <div className="pt-3 text-base font-medium text-[#666666] leading-6">
          All Messages
        </div>

        {customers.map((customer) => (
          <div
            key={customer.id}
            className={`w-[245px] py-3 border-b-1 border-[#CCCCCC] cursor-pointer hover:bg-[#D5E8FF] ${
              selectedCustomer?.id === customer.id ? "" : ""
            }`}
            onClick={() => onCustomerSelect(customer)}
          >
            <div className="flex items-center ">
              <div className="w-12 h-12 mr-3 rounded-full overflow-hidden">
                <Image
                  src={testImg}
                  alt={customer.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0 ">
                <div className="flex items-center justify-between ">
                  <div className="text-base font-bold leading-6 text-[#0084FF]">
                    {customer.name}
                  </div>
                  {customer.unreadCount > 0 && (
                    <div className="bg-[#00900E] text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                      {customer.unreadCount}
                    </div>
                  )}
                </div>
                <div className="text-sm leading-6 text-[#666666] truncate">
                  {customer.message}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
