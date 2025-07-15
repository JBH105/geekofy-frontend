"use client";

import Image from "next/image";
import ProfileChatIcon from "../../../public/image/ProfileChatIcon.svg";
import EditChatIcon from "../../../public/image/EditChatIcon.svg";
import PhoneChatIcon from "../../../public/image/PhoneChatIcon.svg";
import EditChatIcon1 from "../../../public/image/EditChatIcon1.svg";
import CountryFlags from "../../../public/image/CountryFlags.svg";
import mycomputerworks from "../../../public/image/mycomputerworks.svg";
import CopyChatIcon from "../../../public/image/CopyChatIcon.svg";
import Email from "../../../public/image/Email.svg";
import { useState } from "react";

export default function RightSidebar({ customerInfo, onCustomerInfoUpdate }) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const handleCopyIP = () => {
    navigator.clipboard.writeText(customerInfo.ip);
  };

  return (
    <>
      <div className="w-[285px]">
        <div className="space-y-3">
          <div className="bg-white px-[12px] py-[10px] rounded-[10px] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[12px]">
                <Image src={ProfileChatIcon} alt="ProfileChatIcon" />
                <div className="font-normal text-[#666666] leading-6">
                  {customerInfo.name}
                </div>
              </div>
              <button className="text-orange-500 hover:text-orange-600">
                <Image src={EditChatIcon} alt="EditChatIcon" />
              </button>
            </div>
          </div>
          <div className="bg-white px-[12px] py-[10px] rounded-[10px] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-[#666666]">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Image src={PhoneChatIcon} alt="PhoneChatIcon" />
                </div>
                {isEditingPhone ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => setIsEditingPhone(false)}
                    autoFocus
                    className="ml-2 outline-none"
                  />
                ) : (
                  <div className="ml-2" onClick={() => setIsEditingPhone(true)}>
                    {phone || ""}
                  </div>
                )}
              </div>
              <button
                className="cursor-pointer"
                onClick={() => setIsEditingPhone(!isEditingPhone)}
              >
                <Image src={EditChatIcon1} alt="EditChatIcon1" />
              </button>
            </div>
          </div>
          <div className="bg-white px-[12px] py-[10px] rounded-[10px] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-[#666666]">
                <Image src={Email} alt="Email" />
                {isEditingEmail ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setIsEditingEmail(false)}
                    autoFocus
                    className="ml-2 outline-none"
                  />
                ) : (
                  <div className="ml-2" onClick={() => setIsEditingEmail(true)}>
                    {email || ""}
                  </div>
                )}
              </div>
              <button
                className="cursor-pointer"
                onClick={() => setIsEditingEmail(!isEditingEmail)}
              >
                <Image src={EditChatIcon1} alt="EditChatIcon1" />
              </button>
            </div>
          </div>
          <div className="bg-white px-[12px] py-[10px] rounded-[10px] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center">
              <Image
                src={CountryFlags}
                alt="CountryFlags"
                height={13}
                width={24}
                className="mr-2"
              />
              <div className="text-base text-[#666666] leading-6">
                {customerInfo.location}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 mt-2">
              <div className="text-[#666666] text-base leading-6 ">IP</div>
              <div className="text-[#666666] text-base leading-6 mr-[94px]">
                {customerInfo.ip}
              </div>
              <button
                className="cursor-pointer"
                onClick={handleCopyIP}
                title="Copy IP address"
              >
                <div className="w-4.5 h-4.5">
                  <Image
                    src={CopyChatIcon}
                    alt="CopyChatIcon"
                    width={22}
                    height={23}
                  />
                </div>
              </button>
            </div>
          </div>
          <div className="bg-white px-[12px] py-[10px] rounded-[10px] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
            <textarea
              className="w-full p-2 h-80 outline-none resize-none"
              placeholder="Additional comments"
              defaultValue={customerInfo.comments || ""}
            ></textarea>
          </div>
          {/* <div className="bg-white px-[12px] py-[10px] rounded-[10px] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
            <div className="flex justify-center px-[12px] py-[10px]">
              <Image
                src={mycomputerworks}
                alt="mycomputerworks"
                width={175}
                height={175}
              />
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}
