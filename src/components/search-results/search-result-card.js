"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Mycomputer from "../../../public/image/mycomputerworks.svg";
import VerifiedIcon from "../../../public/image/VerifiedIconBlue.svg";
import LiveChatIcon from "../../../public/image/liveChatIcon.svg";
import MoneyIcon from "../../../public/image/Highlights/MoneyBackGuarantee.svg";
import StarFillIcon from "../../../public/image/landingPage/StarIcon.svg";
import LiveChat from "../../components/seller-profile/LiveChat";

const infoItems = [
  { label: "Open:", value: "03:00pm - 10:00pm" },
  { label: "Flat Fee:", value: "$59.99" },
  { label: "Year Founded:", value: "2010" },
];

const mobileInfoItems = [
  { label: "Open Now", value: "09:00am - 01:00pm", highlight: true },
  { label: "Distance", value: "0.4 Miles" },
  { label: "Flat Fee", value: "$199.99 (For Virus Removal)", italic: true },
  { label: "Year Founded", value: "2020" },
];


const SearchResultCard = () => {
  
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="w-full px-3 sm:px-4 lg:px-0">
      {/* === Large & Above === */}
      <div className="hidden lg:flex flex-col">
        <div className="flex py-3 px-[30px] justify-between items-center w-[834px] h-[180px] bg-white shadow-[1px_1px_25px_rgba(0,0,0,0.05),_-1px_-1px_25px_rgba(0,0,0,0.05)] rounded-t-[15px]">
          {/* Left: Logo and Verified */}
          <div className="flex flex-col items-center gap-[12px] w-[124px]">
            <div
              className="flex justify-center items-center"
              style={{ width: "125px", height: "125px", aspectRatio: "1 / 1" }}
            >
              <Image
                src={Mycomputer}
                alt="My Computer Works Logo"
                width={125}
                height={125}
              />
            </div>
            <div className="flex items-center gap-[8px]">
              <Image
                src={VerifiedIcon}
                alt="verified Icon"
                className="w-[20px] h-[20px] aspect-square"
              />
              <span className="text-black text-[14px] italic font-medium leading-[20px] tracking-[0.28px]">
                Verified
              </span>
            </div>
          </div>

          {/* Middle: Text Info */}
          <div className="flex flex-col items-start gap-[12px] w-[600px]">
            <div className="flex justify-between items-start w-full">
              <div className="flex flex-col">
                <h2 className="text-[#0084FF] text-[24px] font-semibold leading-[30px] capitalize whitespace-nowrap">
                  My Computer Works
                </h2>
                <div className="flex items-center gap-2 mt-[6px]">
                  <div className="flex items-center gap-[2px]">
                    {[...Array(5)].map((_, i) => (
                      <Image
                        key={i}
                        src={StarFillIcon}
                        alt="star"
                        className="w-[18px] h-[16px]"
                      />
                    ))}
                  </div>
                  <span className="text-[#666666] text-[14px]">4.9 (852)</span>
                  <span className="text-[#00900E] text-[14px] font-bold leading-6">
                    Excellent
                  </span>
                </div>
              </div>
              <button className="bg-[#059E14] hover:bg-green-700 hover:cursor-pointer text-white text-sm font-medium tracking-[0.28px] px-4 py-2 rounded-lg flex items-center space-x-2"
              onClick={() => setIsChatOpen(true)}
              >
                <span>Live Chat</span>
                <Image src={LiveChatIcon} alt="Chat Icon" />
              </button>
            </div>

            {/* Info Row */}
            <div className="flex text-justify justify-between items-center w-full text-[#666] text-[14px] leading-[24px]">
              {infoItems.map(({ label, value }, index) => (
                <p key={index} className="font-bold">
                  {label} <span className="font-normal">{value}</span>
                </p>
              ))}
            </div>

            {/* Description */}
            <div className="w-full">
              <p className="text-[#666666] text-[14px] leading-6">
                We offer an affordable online remote computer repair service &
                support since 1999. Our expert, friendly technicians provide
                support at an affordable price...
                <span className="text-[#0084FF] cursor-pointer text-[14px] leading-6">
                  {" "}
                  read more
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Info Row (Guarantees) */}
        <div className="grid grid-cols-3 gap-3 bg-[rgba(213,232,255,0.5)] px-[30px] py-[12px] rounded-b-[15px] w-[834px]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Image
                src={MoneyIcon}
                alt="money Icon"
                className="w-[37px] h-[33px]"
              />
              <span className="text-[#666666] text-[14px]">
                Money Back Guarantee
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* === Below Large Screens === */}
      <div className="lg:hidden">
        {/* Mobile Card */}
        <div className="flex flex-col py-4 px-4 justify-start items-center w-full bg-white shadow-[1px_1px_25px_rgba(0,0,0,0.05),_-1px_-1px_25px_rgba(0,0,0,0.05)] rounded-t-[15px] gap-4">
          {/* Top: Title + Live Chat */}
          <div className="flex justify-between items-center w-full">
            <h2 className="text-[#0084FF] text-[18px] font-bold">
              BUSINESS NAME 1
            </h2>
            <button className="bg-[#059E14] hover:bg-green-700 text-white text-sm font-medium px-4 py-[6px] rounded-md flex items-center gap-2">
              <span>Live Chat</span>
              <Image src={LiveChatIcon} alt="Chat Icon" />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 w-full">
            <div className="flex items-center gap-[2px]">
              {[...Array(5)].map((_, i) => (
                <Image
                  key={i}
                  src={StarFillIcon}
                  alt="star"
                  className="w-[18px] h-[16px]"
                />
              ))}
            </div>
            <span className="text-[#666666] text-[14px]">4.9 (852)</span>
            <span className="text-[#00900E] text-[14px] font-bold">
              Excellent
            </span>
          </div>

          {/* Center Icon */}
          <div className="flex justify-start items-center w-full">
            <Image
              src={Mycomputer}
              alt="Business Icon"
              width={125}
              height={125}
            />
          </div>

          {/* Mobile Info */}
          <div className="flex flex-col w-full gap-1">
            {mobileInfoItems.map(
              ({ label, value, highlight, italic }, index) => (
                <p
                  key={index}
                  className={`text-sm font-medium ${
                    highlight ? "text-[#059E14]" : "text-[#666666]"
                  }`}
                >
                  {label}{" "}
                  <span className={`font-semibold text-[#666666] ${italic ? "italic" : ""}`}>
                    : {value}
                  </span>
                </p>
              )
            )}
          </div>

          {/* Description */}
          <p className="text-[#666666] text-[14px] leading-[20px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            Lorem ipsum dolor sit...
            <span className="text-[#0084FF] cursor-pointer"> read more</span>
          </p>
        </div>

        {/* Guarantee Section Mobile */}
        <div className="grid grid-cols-2 gap-2 bg-[rgba(213,232,255,0.5)] p-4 rounded-b-[15px]">
          {[
            "Money Back Guarantee",
            "Apple Certified",
            "Walk-ins Welcome",
            "Walk-ins Welcome",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Image
                src={MoneyIcon}
                alt="money Icon"
                className="w-[24px] h-[24px] hidden lg:block"
              />
              <span className="text-[#666666] text-[13px] leading-[18px]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
      {isChatOpen && <LiveChat onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default SearchResultCard;
