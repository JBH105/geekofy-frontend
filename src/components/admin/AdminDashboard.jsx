"use client";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import BusinessTable from "./BusinessTable";
import BuyerManagement from "./BuyerManagement";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [
    {
      id: 1,
      title: "Listed Business",
      desc: "All businesses",
    },
    {
      id: 2,
      title: "Buyer",
      desc: "Registered buyer",
    },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="w-full min-h-screen relative">
      <Header />

      <div className="layout_container">
        <div className="px-2 mt-3">
          <div className="text-xl font-bold text-[#333333] mb-1">Admin</div>
          <div className="border-t-[5px] rounded-full border-[#0084FF] w-24" />
        </div>
      </div>

      <div className="layout_container flex flex-col md:flex-row justify-center items-start gap-6 w-full py-7 md:px-2">
        <Sidebar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <div className="flex-1">
          {activeTab === 1 ? <BusinessTable /> : <BuyerManagement />}
        </div>
      </div>
    </div>
  );
}
