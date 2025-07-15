"use client";
import Image from "next/image";

export default function SidebarMain({ tabs, activeTab, onTabChange }) {
  return (
    <div className="w-full md:max-w-[262px]">
      <div className="bg-white px-5 py-8 rounded-2xl shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] mb-4">
        <div className="space-y-3">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center gap-4 p-[8px] rounded-md cursor-pointer transition-all duration-200 ${
                activeTab === tab.id ? "bg-[#0084FF]" : "hover:bg-gray-50"
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <div
                className={`w-8 h-8 border-2 rounded-full flex items-center pt-[1px] justify-center text-sm font-semibold flex-shrink-0 ${
                  activeTab === tab.id
                    ? "border-white text-white"
                    : "border-[#666] text-[#666]"
                }`}
              >
                {tab.id}
              </div>

              <div className="flex flex-col pt-[2px]">
                <h3
                  className={`text-base font-semibold leading-[20px] ${
                    activeTab === tab.id ? "text-white" : "text-[#333]"
                  }`}
                >
                  {tab.title}
                </h3>
                <p
                  className={`text-sm leading-[18px] mt-1 ${
                    activeTab === tab.id ? "text-white" : "text-[#666]"
                  }`}
                >
                  {tab.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
