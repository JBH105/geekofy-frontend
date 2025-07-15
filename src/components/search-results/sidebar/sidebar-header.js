import React from "react";
import { RxCross2 } from "react-icons/rx";

const SidebarHeader = ({ text, handleClear, showClear }) => {
  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between w-full h-7 border-b border-gray-200 pb-1">
        <h1 className="text-[#666] text-justify text-[14px] font-semibold leading-6 tracking-[0.14px]">
          {text}
        </h1>
        {showClear && (
          <div
            className="pt-[2px] flex items-center gap-1 text-[#6B7280] text-[12px] font-medium leading-6 tracking-[0.12px] cursor-pointer group hover:text-[#1E40AF] transition-colors duration-200 ease-in-out"
            onClick={handleClear}
          >
            <RxCross2 className="w-[10px] h-[10px] text-[#6B7280] group-hover:text-[#1E40AF] group-hover:scale-110 transition-transform duration-200" />
            Clear
          </div>
        )}
      </div>
      <div className="hidden lg:block absolute bottom-0 left-0 h-[4px] w-[48px] rounded-full bg-[#0084FF]" />
    </div>
  );
};

export default SidebarHeader;
