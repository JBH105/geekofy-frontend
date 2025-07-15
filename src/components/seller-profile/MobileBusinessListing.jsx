"use client";

import React, { useState } from "react";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import StarRating from "./StarRating";
import BusinessTabs from "./BusinessTabs";
import { TbPhoto } from "react-icons/tb";
import Link from "next/link";
import OpenHoursIcon from "../../../public/image/ProfileIcon/OpenHoursIcon.svg";
import CallIcon from "../../../public/image/ProfileIcon/CallIcon.svg";
import ChateIcon from "../../../public/image/ProfileIcon/ChateIcon.svg";
import Flag from "../../../public/image/ProfileIcon/Flag.svg";
import ShareIcon from "../../../public/image/ProfileIcon/ShareIcon.svg";
import HeartIcon from "../../../public/image/ProfileIcon/HeartIcon.svg";
import HeartLiked from "../../../public/image/ProfileIcon/HeartLiked.svg";
import InformationIcon from "../../../public/image/InformationIcon.svg";
import { useBusinessStore } from "@/stores/businessStore";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function MobileBusinessListing({
  isChatOpen,
  setIsChatOpen,
  activeTab,
  isFavorite,
  isFavoriteLoading,
  handleFavoriteToggle,
  formatBusinessHours,
  getBusinessTimezone,
  getCurrentDayAndTime,
}) {
  const {
    data: { headerData },
    isLoading: { header: isHeaderLoading },
  } = useBusinessStore();

  const { businessIdWithZip, city } = useParams();
  const parts = businessIdWithZip.split("-");
  const zipCode = parts[parts.length - 1];
  const businessSlug = parts.slice(0, parts.length - 2).join("-");
  const { data: session } = useSession();
  const [showMobileHoursTooltip, setShowMobileHoursTooltip] = useState(false);

  if (isHeaderLoading || !headerData) {
    return null;
  }

  return (
    <div className="lg:hidden">
      <div className="space-y-4">
        {/* Business Name */}
        <h1 className="text-2xl font-bold text-[#333333] tracking-wide mt-2">
          {headerData?.name}
        </h1>

        {/* Live Chat Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-[#059E14] hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center space-x-2 w-fit"
        >
          <span>Live Chat</span>
          <Image src={ChateIcon || "/placeholder.svg"} alt="ChateIcon" />
        </button>

        {/* Business Image */}
        <div className="bg-gray-100 w-[200px] h-[200px] flex items-start justify-start rounded-lg border">
          {headerData?.logo ? (
            <Image
              src={headerData.logo || "/placeholder.svg"}
              alt={`${headerData?.name} logo`}
              width={200}
              height={200}
              className="object-scale-down height_revert"
            />
          ) : (
            <TbPhoto className="w-24 h-24 text-gray-400" />
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <StarRating rating={headerData?.rating} />
          <span className="text-sm font-medium">
            {headerData?.rating} ({headerData?.reviewCount})
          </span>
          <span className="text-sm font-medium text-[#00900E]">
            {headerData?.rating >= 4.5
              ? "Excellent"
              : headerData?.rating >= 4
              ? "Very Good"
              : headerData?.rating >= 3.5
              ? "Good"
              : headerData?.rating >= 3
              ? "Fair"
              : headerData?.rating >= 2.5
              ? "Average"
              : ""}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-[#666666]">
            <Image
              src={CallIcon || "/placeholder.svg"}
              alt="CallIcon"
              width={16}
              height={16}
            />
            <span>{headerData?.phone || "N/A"}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Image
              src={OpenHoursIcon || "/placeholder.svg"}
              alt="OpenHoursIcon"
              width={16}
              height={16}
            />
            {headerData?.hoursData && (
              <>
                <span className="leading-6 tracking-[0.56px]">
                  {(() => {
                    const timezone = getBusinessTimezone(headerData?.hoursData);
                    const hoursInfo = formatBusinessHours(
                      headerData.hoursData,
                      getCurrentDayAndTime(timezone)
                    );
                    if (hoursInfo.status === "Open 24/7") {
                      return <span className="font-semibold">Open 24/7</span>;
                    }
                    if (hoursInfo.status === "Open 24 hrs") {
                      return <span className="font-semibold">Open 24 hrs</span>;
                    }
                    if (hoursInfo.status === "Open Now") {
                      return (
                        <>
                          <span className="font-semibold">Open Now</span>
                          <span>
                            {" "}
                            {hoursInfo.display.replace("Open Now", "").trim()}
                          </span>
                        </>
                      );
                    }
                    if (hoursInfo.status === "Closes Soon") {
                      const match = hoursInfo.display.match(
                        /^Closes in (.+?) (\d{1,2}:\d{2} (am|pm)) - (\d{1,2}:\d{2} (am|pm))$/i
                      );
                      if (match) {
                        const timeText = `Closes in ${match[1]}`;
                        const timingText = `${match[2]} - ${match[4]}`;
                        return (
                          <>
                            <span className="text-red-500">{timeText}</span>
                            <span className="text-[#666666]">
                              {" "}
                              - {timingText}
                            </span>
                          </>
                        );
                      }
                      if (hoursInfo.display.startsWith("Closes in")) {
                        const parts = hoursInfo.display.split(
                          /(Closes in [^ ]+ [^ ]+)/i
                        );
                        const timeText = parts[1] || hoursInfo.display;
                        const timingText = hoursInfo.display
                          .replace(timeText, "")
                          .trim();
                        return (
                          <>
                            <span className="text-red-500">{timeText}</span>
                            {timingText && (
                              <span className="text-[#666666]">
                                {" "}
                                - {timingText}
                              </span>
                            )}
                          </>
                        );
                      }
                      return (
                        <span className="text-red-500">
                          {hoursInfo.display}
                        </span>
                      );
                    }
                    return (
                      <>
                        <span className="font-semibold text-red-500">
                          Closed
                        </span>
                        <span className="text-[#666666]">
                          {" "}
                          {hoursInfo.display}
                        </span>
                      </>
                    );
                  })()}
                </span>
                <div className="relative inline-block">
                  <Image
                    src={InformationIcon || "/placeholder.svg"}
                    alt="InformationIcon"
                    className="cursor-pointer"
                    width={15}
                    height={15}
                    onClick={() =>
                      setShowMobileHoursTooltip(!showMobileHoursTooltip)
                    }
                  />
                  {showMobileHoursTooltip && (
                    <div className="fixed inset-0 z-50 w-full p-4 bg-white overflow-y-auto flex items-center justify-center">
                      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-4">
                        <div className="mb-4 text-lg font-semibold text-[#464646] text-center">
                          Business Hours
                        </div>
                        <div className="space-y-3">
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].map((dayName) => {
                            const dayData = headerData?.hoursData?.find(
                              (d) => d.name === dayName
                            );
                            const timezone = getBusinessTimezone(
                              headerData?.hoursData
                            );
                            const isToday =
                              dayName === getCurrentDayAndTime(timezone).day;
                            const dayClasses = `flex justify-between ${
                              isToday ? "font-bold" : ""
                            }`;

                            if (
                              !dayData ||
                              !dayData.isOpen ||
                              !dayData.timeSlots?.length
                            ) {
                              return (
                                <div key={dayName} className={dayClasses}>
                                  <span>{dayName}</span>
                                  <span className="text-[#666666]">Closed</span>
                                </div>
                              );
                            }

                            return (
                              <div key={dayName} className={dayClasses}>
                                <span>{dayName}</span>
                                <div className="text-[#666666]">
                                  {dayData.timeSlots.map((slot, index) => (
                                    <span key={index}>
                                      {slot.open} - {slot.close}
                                      {index !== dayData.timeSlots.length - 1 &&
                                        ", "}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => setShowMobileHoursTooltip(false)}
                          className="mt-4 w-full py-2 bg-[#059E14] text-white rounded-lg"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center justify-start space-x-3">
          <button className="">
            <Image
              src={ShareIcon || "/placeholder.svg"}
              alt="ShareIcon"
              width={24}
              height={24}
            />
          </button>
          <button className="">
            <Image
              src={Flag || "/placeholder.svg"}
              alt="Flag"
              width={24}
              height={24}
            />
          </button>
          <button className="">
            <Image
              src={CallIcon || "/placeholder.svg"}
              alt="CallIcon"
              width={24}
              height={24}
            />
          </button>
          <button
            onClick={handleFavoriteToggle}
            disabled={isFavoriteLoading}
            className="mb-1 transition-all duration-200 hover:scale-110"
          >
            <Image
              src={isFavorite ? HeartLiked : HeartIcon}
              alt={isFavorite ? "Liked" : "Like"}
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* Features Section - Mobile Grid */}
        <div className="inline-flex scrollbar-hide overflow-x-auto w-full p-2 bg-[#D5E8FFB2]">
          <div className="grid-cols-3 gap-y-1 grid min-w-[600px] w-full">
            {headerData.features.slice(0, 6).map((feature, index) => (
              <p key={index} className="text-[#444444] text-sm font-medium">
                {feature}
              </p>
            ))}
          </div>
        </div>

        {/* Business Tabs - Mobile */}
        <div className="mt-6">
          <BusinessTabs activeTab={activeTab} isParentLoading={false} />
        </div>
      </div>
    </div>
  );
}
