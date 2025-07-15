"use client";

import { useState } from "react";
import LeftSidebar from "./LeftSidebar";
import ChatSection from "./ChatSection";
import RightSidebar from "./RightSidebar";
import SellerProfileHeader from "../seller-profile/SellerProfileHeader";
import useHover from "./useHover";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";

export default function CustomerSupportDashboard() {

  const [showRightSidebar, setShowRightSidebar] = useState(false);

  // Static data - can be replaced with API calls in the future
  const [customers] = useState([
    {
      id: 1,
      name: "Customer name 1",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Latest message truncated ...",
      unreadCount: 3,
    },
    {
      id: 2,
      name: "Customer name 2",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Latest message truncated ...",
      unreadCount: 3,
    },
    {
      id: 3,
      name: "Customer name 3",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Latest message truncated ...",
      unreadCount: 3,
    },
    {
      id: 4,
      name: "Customer name 4",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Latest message truncated ...",
    },
    {
      id: 5,
      name: "Customer name 5",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Latest message truncated ...",
    },
    {
      id: 6,
      name: "Customer name 6",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Latest message truncated ...",
    },
    {
      id: 7,
      name: "Customer name 7",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Latest message truncated ...",
    },
    {
      id: 8,
      name: "Customer name 8",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Latest message truncated ...",
    },
    {
      id: 9,
      name: "Customer name 9",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Latest message truncated ...",
    },
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [messagesRef, isMessagesHovered] = useHover();
  const [sidebarRef, isSidebarHovered] = useHover();

  const [conversation, setConversation] = useState([
    {
      id: 1,
      sender: "Sam Altman",
      time: "Feb 22, 2025, 7:53 PM",
      message: "Hello",
    },
    {
      id: 2,
      sender: "Me",
      time: "Feb 22, 2025, 7:54 PM",
      message: "How can I help you?\nWelcome",
    },
    {
      id: 3,
      sender: "Sam Altman",
      time: "Feb 22, 2025, 7:53 PM",
      message: "My phone number is 875-434-4345",
    },
    {
      id: 4,
      sender: "Sam Altman",
      time: "Feb 22, 2025, 7:55 PM",
      message:
        "Online computer repairs for all makes and models: Windows, Mac, Chromebook, Desktops and Laptop PC's. Find out why we're the best",
    },
    {
      id: 5,
      sender: "Sam b",
      time: "Feb 22, 2025, 7:53 PM",
      message: "My phone number is 875-434-4345",
    },
    {
      id: 6,
      sender: "Sam c",
      time: "Feb 22, 2025, 7:53 PM",
      message: "My phone number is 875-434-4345",
    },
    {
      id: 7,
      sender: "Sam d",
      time: "Feb 22, 2025, 7:53 PM",
      message: "My phone number is 875-434-4345",
    },
    {
      id: 8,
      sender: "Sam e",
      time: "Feb 22, 2025, 7:53 PM",
      message: "My phone number is 875-434-4345",
    },
    
  ]);

  const [customerInfo] = useState({
    name: "Sam Altman",
    phone: "+1",
    email: "",
    location: "Texas, US",
    ip: "23.43.673.565",
    comments: "",
  });

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    // In a real app, you would fetch the conversation for this customer
    // For now, we'll keep the same conversation
  };

  const handleSendMessage = (message) => {
    const newMessage = {
      id: conversation.length + 1,
      sender: "Me",
      time: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      message: message,
    };
    setConversation([...conversation, newMessage]);
  };

  const handleCustomerInfoUpdate = (updatedInfo) => {
    // In a real app, you would update the customer info in your backend
    console.log("Customer info updated:", updatedInfo);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
  };

  return (
    <>
      <SellerProfileHeader />
      <div className="layout_container mx-auto mb-2 px-4 sm:px-6 md:px-20 py-2 sm:py-4 md:py-6">
        <div className="flex h-[82vh] gap-[20px]">

          {/* Left Sidebar - Customer List */}
          <div className={`${showRightSidebar ? "hidden" : "block"} flex flex-col h-full`}>
            <LeftSidebar
              customers={customers}
              selectedCustomer={selectedCustomer}
              onCustomerSelect={handleCustomerSelect}
              sidebarRef={sidebarRef}
              isSidebarHovered={isSidebarHovered}
            />
          </div>

          {/* Middle Section - Chat */}
          <ChatSection
            conversation={conversation}
            onSendMessage={handleSendMessage}
            messagesRef={messagesRef}
            isMessagesHovered={isMessagesHovered}
          />

          {/* Right Sidebar - Customer Info */}
          <div className={`${showRightSidebar ? "block w-[255px] lg:w-[255px] md:w-[200px] sm:w-full" : "hidden"}`}>
            <RightSidebar
              customerInfo={customerInfo}
              onCustomerInfoUpdate={handleCustomerInfoUpdate}
            />
          </div>
          
           {/*  Toggle Button for Right Sidebar */}
         <TbLayoutSidebarLeftExpand
            className="h-9 w-9 hover:cursor-pointer rounded-full p-2"
            onClick={toggleSidebar}
          />
        </div>
      </div>
    </>
  );
}
