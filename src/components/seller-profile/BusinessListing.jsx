"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import StarRating from "./StarRating";
import BusinessTabs from "./BusinessTabs";
import { TbPhoto } from "react-icons/tb";
import LiveChat from "./LiveChat";
import OpenHoursIcon from "../../../public/image/ProfileIcon/OpenHoursIcon.svg";
import CallIcon from "../../../public/image/ProfileIcon/CallIcon.svg";
import ChateIcon from "../../../public/image/ProfileIcon/ChateIcon.svg";
import Flag from "../../../public/image/ProfileIcon/Flag.svg";
import ShareIcon from "../../../public/image/ProfileIcon/ShareIcon.svg";
import HeartIcon from "../../../public/image/ProfileIcon/HeartIcon.svg";
import HeartLiked from "../../../public/image/ProfileIcon/HeartLiked.svg";
import InformationIcon from "../../../public/image/InformationIcon.svg";
import { useBusinessStore } from "@/stores/businessStore";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import SellerProfileHeader from "./SellerProfileHeader";
import { highlights } from "../seller-onboarding/BusinessProfileForm/HighlightSection";
import api from "@/lib/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import MobileBusinessListing from "./MobileBusinessListing";
import ReportModal from "./ReportModal";
import ShareModal from "./ShareModal";

const extractUrlComponents = (businessIdWithZip) => {
  const parts = businessIdWithZip?.split("-") || [];
  const zipCodeRegex = /^[0-9]{5,6}(?:-[0-9]{4})?$/;

  const zipCode = parts[parts?.length - 1];
  const isValidZip = zipCodeRegex?.test(zipCode);
  const remainingParts = isValidZip ? parts?.slice(0, -1) : parts;

  const placeIndex = remainingParts?.indexOf("place");
  let businessSlug = "";
  let neighborhood = null;

  if (placeIndex !== -1) {
    businessSlug = remainingParts?.slice(0, placeIndex)?.join("-") || "";
    neighborhood = remainingParts?.slice(placeIndex + 1)?.join("-") || null;
  } else {
    businessSlug = remainingParts?.join("-") || "";
  }

  return {
    businessSlug: businessSlug || "",
    zipCode: isValidZip ? zipCode : null,
    neighborhood,
  };
};

export default function BusinessListing() {

  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data: { headerData }, isLoading: { header: isHeaderLoading }, error: { header: headerError }, fetchHeaderData, resetStore } = useBusinessStore();

  const { tab, businessIdWithZip, city } = useParams();

  const [components, setComponents] = useState(() => extractUrlComponents(businessIdWithZip));

  const { businessSlug, zipCode, neighborhood } = components;

  const { data: session } = useSession();
  const sellerId = session?.user?.id;
  const activeTab = tab || "overview";
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!headerData && !isHeaderLoading && !headerError && businessSlug) {
      resetStore();
      fetchHeaderData(businessSlug);
    }
  }, [ headerData, isHeaderLoading, headerError, businessSlug, fetchHeaderData, resetStore, businessIdWithZip ]);

  const metaTitle = headerData?.name ? `${headerData?.name} in ${city} (${zipCode}) – Trusted Experts on Geekofy` : `${city} (${zipCode}) – Trusted Experts on Geekofy`;

  const handleFavoriteToggle = async () => {
    if (!sellerId || isFavoriteLoading) return;
    setIsFavoriteLoading(true);
    try {
      if (isFavorite) {
      } else {
        await api.post("/api/favorite", { favoriteProfileId: sellerId });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorite:", error);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const TIMEZONE_OFFSETS = {
    "America/New_York": -4, // EDT (Eastern Daylight Time)
    "America/Chicago": -5, // CDT (Central Daylight Time)
    "America/Denver": -6, // MDT (Mountain Daylight Time)
    "America/Los_Angeles": -7, // PDT (Pacific Daylight Time)
  };

  const DAYS_OF_WEEK = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getCurrentDayAndTime = (timezone) => {
    const now = new Date();
    const utcDay = now.getUTCDay();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();

    const offsetHours = TIMEZONE_OFFSETS[timezone] || 0;

    let localHours = utcHours + offsetHours;
    let localDay = utcDay;

    if (localHours < 0) {
      localHours += 24;
      localDay = (utcDay - 1 + 7) % 7;
    } else if (localHours >= 24) {
      localHours -= 24;
      localDay = (utcDay + 1) % 7;
    }

    return {
      day: DAYS_OF_WEEK[localDay],
      hours: localHours,
      minutes: utcMinutes,
      timeString: `${String(localHours).padStart(2, "0")}:${String(
        utcMinutes
      ).padStart(2, "0")}`,
    };
  };

  const parseTimeSlot = (slot) => {
    if (!slot) return null;
    const [open, close] = slot.split(" - ");
    if (!open || !close) return null;

    const parseTime = (timeStr) => {
      const normalizedTimeStr = timeStr
        .toLowerCase()
        .replace(/(\d+:\d+)\s+(am|pm)/i, "$1$2");
      let [time, period] = normalizedTimeStr.split(/(?=[ap]m)/i);
      if (!period && timeStr.toLowerCase().includes("midnight")) {
        period = "midnight";
        time = "12:00";
      }
      const [hours, minutes] = time.split(":").map(Number);
      return {
        hours:
          period === "pm" && hours !== 12
            ? hours + 12
            : period === "am" && hours === 12
            ? 0
            : period === "midnight" && hours === 12
            ? 24
            : hours,
        minutes: minutes || 0,
        display: time + (period ? period : ""),
      };
    };

    return {
      open: parseTime(open.trim()),
      close: parseTime(close.trim()),
    };
  };

  const getTimeRemaining = (closeTime, currentTime) => {
    const closeInMinutes = closeTime.hours * 60 + closeTime.minutes;
    const currentInMinutes = currentTime.hours * 60 + currentTime.minutes;
    const remainingMinutes = closeInMinutes - currentInMinutes;

    if (remainingMinutes <= 0) return null;

    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;

    return {
      hours,
      minutes,
      display: `${hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : ""} ${
        minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : ""
      }`.trim(),
    };
  };

  const formatBusinessHours = (hoursData, currentDayInfo) => {
    if (!Array.isArray(hoursData))
      return { status: "Closed", display: "Hours not available", tooltip: "" };

    const isOpen24_7 = hoursData.every(
      (day) =>
        day.isOpen &&
        day.timeSlots?.length === 1 &&
        day.timeSlots[0].open.toLowerCase().trim() === "12:00 am" &&
        day.timeSlots[0].close.toLowerCase().trim() === "midnight"
    );

    const allDaysHours = DAYS_OF_WEEK.map((dayName) => {
      const dayData = hoursData.find((d) => d.name === dayName);
      if (!dayData || !dayData.isOpen || !dayData.timeSlots?.length) {
        return `${dayName}: Closed`;
      }
      const is24Hour =
        dayData.timeSlots.length === 1 &&
        dayData.timeSlots[0].open.toLowerCase().trim() === "12:00 am" &&
        dayData.timeSlots[0].close.toLowerCase().trim() === "midnight";
      return `${dayName}: ${
        is24Hour
          ? "Open 24 hrs"
          : dayData.timeSlots
              .map((slot) => `${slot.open} - ${slot.close}`)
              .join(", ")
      }`;
    }).join("\n");

    if (isOpen24_7) {
      return {
        status: "Open 24/7",
        display: "Open 24/7",
        tooltip: allDaysHours,
      };
    }

    const currentDay = hoursData.find((day) => day.name === currentDayInfo.day);

    if (!currentDay || !currentDay.isOpen || !currentDay.timeSlots?.length) {
      const currentDayIndex = DAYS_OF_WEEK.indexOf(currentDayInfo.day);
      let nextOpenDay = null;

      for (let i = 1; i < 7; i++) {
        const nextIndex = (currentDayIndex + i) % 7;
        const nextDayName = DAYS_OF_WEEK[nextIndex];
        const nextDayData = hoursData.find(
          (d) => d.name === nextDayName && d.isOpen && d.timeSlots?.length > 0
        );

        if (nextDayData) {
          nextOpenDay = { day: nextDayName, slot: nextDayData.timeSlots[0] };
          break;
        }
      }

      if (nextOpenDay) {
        const parsedSlot = parseTimeSlot(
          `${nextOpenDay.slot.open} - ${nextOpenDay.slot.close}`
        );
        return {
          status: "Closed",
          display: ` - Opens ${nextOpenDay.day} at ${parsedSlot.open.display}`,
          tooltip: allDaysHours,
        };
      }

      return { status: "Closed", display: "Closed", tooltip: allDaysHours };
    }

    const isCurrentDay24Hour =
      currentDay.timeSlots.length === 1 &&
      currentDay.timeSlots[0].open.toLowerCase().trim() === "12:00 am" &&
      currentDay.timeSlots[0].close.toLowerCase().trim() === "midnight";

    if (isCurrentDay24Hour) {
      return {
        status: "Open 24 hrs",
        display: "Open 24 hrs",
        tooltip: allDaysHours,
      };
    }

    const currentTimeSlot = currentDay.timeSlots.find((slot) => {
      const parsedSlot = parseTimeSlot(`${slot.open} - ${slot.close}`);
      if (!parsedSlot) return false;

      const currentTotalMinutes =
        currentDayInfo.hours * 60 + currentDayInfo.minutes;
      const openTotalMinutes =
        parsedSlot.open.hours * 60 + parsedSlot.open.minutes;
      const closeTotalMinutes =
        parsedSlot.close.hours * 60 + parsedSlot.close.minutes;

      return (
        currentTotalMinutes >= openTotalMinutes &&
        currentTotalMinutes < closeTotalMinutes
      );
    });

    if (currentTimeSlot) {
      const parsedSlot = parseTimeSlot(
        `${currentTimeSlot.open} - ${currentTimeSlot.close}`
      );
      const timeRemaining = getTimeRemaining(parsedSlot.close, currentDayInfo);

      const closeDisplay = parsedSlot.close.display
        .toLowerCase()
        .includes("midnight")
        ? "Midnight"
        : parsedSlot.close.display;

      if (timeRemaining && timeRemaining.hours < 2) {
        return {
          status: "Closes Soon",
          display: `Closes in ${timeRemaining.display} ${parsedSlot.open.display} - ${closeDisplay}`,
          tooltip: allDaysHours,
        };
      } else {
        return {
          status: "Open Now",
          display: `Open Now ${parsedSlot.open.display} - ${closeDisplay}`,
          tooltip: allDaysHours,
        };
      }
    }

    const futureSlotsToday = currentDay.timeSlots
      .filter((slot) => {
        const parsedSlot = parseTimeSlot(`${slot.open} - ${slot.close}`);
        return (
          parsedSlot &&
          (parsedSlot.open.hours > currentDayInfo.hours ||
            (parsedSlot.open.hours === currentDayInfo.hours &&
              parsedSlot.open.minutes > currentDayInfo.minutes))
        );
      })
      .sort((a, b) => {
        const aTime = parseTimeSlot(`${a.open} - ${a.close}`).open;
        const bTime = parseTimeSlot(`${b.open} - ${b.close}`).open;
        return (
          aTime.hours * 60 + aTime.minutes - (bTime.hours * 60 + bTime.minutes)
        );
      });

    if (futureSlotsToday.length > 0) {
      const nextSlot = futureSlotsToday[0];
      const parsedSlot = parseTimeSlot(`${nextSlot.open} - ${nextSlot.close}`);
      const openDisplay = parsedSlot.open.display
        .toLowerCase()
        .includes("midnight")
        ? "Midnight"
        : parsedSlot.open.display;

      return {
        status: "Closed",
        display: `- Opens at ${openDisplay}`,
        tooltip: allDaysHours,
      };
    }

    const currentDayIndex = DAYS_OF_WEEK.indexOf(currentDayInfo.day);
    let nextOpenDay = null;

    for (let i = 1; i < 7; i++) {
      const nextIndex = (currentDayIndex + i) % 7;
      const nextDayName = DAYS_OF_WEEK[nextIndex];
      const nextDayData = hoursData.find(
        (d) => d.name === nextDayName && d.isOpen && d.timeSlots?.length > 0
      );

      if (nextDayData) {
        nextOpenDay = { day: nextDayName, slot: nextDayData.timeSlots[0] };
        break;
      }
    }

    if (nextOpenDay) {
      const parsedSlot = parseTimeSlot(
        `${nextOpenDay.slot.open} - ${nextOpenDay.slot.close}`
      );
      const openDisplay = parsedSlot.open.display
        .toLowerCase()
        .includes("midnight")
        ? "Midnight"
        : parsedSlot.open.display;

      return {
        status: "Closed",
        display: ` - Opens ${nextOpenDay.day} at ${openDisplay}`,
        tooltip: allDaysHours,
      };
    }

    return { status: "Closed", display: "Closed", tooltip: allDaysHours };
  };

  const getBusinessTimezone = (hoursData) => {
    if (!Array.isArray(hoursData) || hoursData.length === 0)
      return "America/New_York";
    const firstDayWithTimezone = hoursData.find((day) => day.timezone);
    return firstDayWithTimezone?.timezone || "America/New_York";
  };

  const handleReportClick = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleShareClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <SellerProfileHeader />
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />
      </Head>
      <div className="bg-[#FCFCFC] min-h-[100vh]">
        <div className="layout_container mx-auto px-4 sm:px-20">
          {session && (
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-2 mt-2 shadow-lg">
              <p className="text-yellow-900">"This is preview only"</p>
            </div>
          )}
          {/* Breadcrumb - Hidden on mobile */}
          {isHeaderLoading || !headerData ? (
            <div className="my-6 hidden lg:block">
              <Skeleton
                width={350}
                height={12}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
            </div>
          ) : (
            <div className="my-6 text-[12px] text-[#666666] hidden lg:block">
              <Link href="/seller-onboarding" className="hover:underline">
                Home
              </Link>
              {headerData?.location?.country &&
                ` / ${headerData.location.country}`}
              {headerData?.location?.state && ` / ${headerData.location.state}`}
              {headerData?.location?.city && ` / ${headerData.location.city}`}
              {headerData?.location?.zipCode &&
                ` / ${headerData.location.zipCode}`}
              {headerData?.name && ` / ${headerData.name}`}
            </div>
          )}

          {/* Mobile Layout */}
          <MobileBusinessListing
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
            activeTab={activeTab}
            isFavorite={isFavorite}
            isFavoriteLoading={isFavoriteLoading}
            handleFavoriteToggle={handleFavoriteToggle}
            formatBusinessHours={formatBusinessHours}
            getBusinessTimezone={getBusinessTimezone}
            getCurrentDayAndTime={getCurrentDayAndTime}
          />

          {/* Desktop Layout - Unchanged */}
          <div className="hidden lg:block">
            <div className="border-b border-[#999999]">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                {/* Header Section */}
                {isHeaderLoading || !headerData ? (
                  <div className="flex items-start space-x-6 w-full">
                    <Skeleton
                      width={100}
                      height={100}
                      squre
                      baseColor="#e5e7eb"
                      highlightColor="#f3f4f6"
                    />
                    <div className="flex-1 space-y-3">
                      <Skeleton
                        width={250}
                        height={28}
                        baseColor="#e5e7eb"
                        highlightColor="#f3f4f6"
                      />
                      <div className="flex items-center space-x-3">
                        <Skeleton
                          width={100}
                          height={16}
                          baseColor="#e5e7eb"
                          highlightColor="#f3f4f6"
                        />
                        <Skeleton
                          width={50}
                          height={14}
                          baseColor="#e5e7eb"
                          highlightColor="#f3f4f6"
                        />
                        <Skeleton
                          width={80}
                          height={16}
                          baseColor="#e5e7eb"
                          highlightColor="#f3f4f6"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                        <div className="flex items-center space-x-2">
                          <Skeleton
                            width={20}
                            height={20}
                            circle
                            baseColor="#e5e7eb"
                            highlightColor="#f3f4f6"
                          />
                          <Skeleton
                            width={80}
                            height={14}
                            baseColor="#e5e7eb"
                            highlightColor="#f3f4f6"
                          />
                          <Skeleton
                            width={200}
                            height={14}
                            baseColor="#e5e7eb"
                            highlightColor="#f3f4f6"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Skeleton
                            width={20}
                            height={20}
                            circle
                            baseColor="#e5e7eb"
                            highlightColor="#f3f4f6"
                          />
                          <Skeleton
                            width={130}
                            height={14}
                            baseColor="#e5e7eb"
                            highlightColor="#f3f4f6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-[100px] h-[100px] bg-white flex items-center justify-center overflow-hidden border border-gray-200 rounded-md">
                      {headerData?.logo ? (
                        <Image
                          src={headerData.logo || "/placeholder.svg"}
                          alt={`${headerData?.name} logo`}
                          width={100}
                          height={100}
                          className="object-scale-down height_revert"
                        />
                      ) : (
                        <TbPhoto className="w-[100px] h-[100px]" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h1 className="text-[28px] leading-[30px] tracking-[1px] font-bold text-[#333333] mb-2">
                        {headerData?.name}
                      </h1>
                      <div className="flex items-center space-x-3 mb-2">
                        <StarRating rating={headerData?.rating} />
                        <span className="text-sm leading-6 text-[#666666]">
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

                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                        <div className="flex items-center space-x-2 text-sm text-[#666666]">
                          <Image
                            src={OpenHoursIcon || "/placeholder.svg"}
                            alt="OpenHoursIcon"
                            width={20}
                            height={20}
                          />
                          {headerData?.hoursData && (
                            <>
                              <span className="leading-6 tracking-[0.56px]">
                                {(() => {
                                  // Get the timezone from hoursData
                                  const timezone = getBusinessTimezone(
                                    headerData?.hoursData
                                  );
                                  const currentDayInfo =
                                    getCurrentDayAndTime(timezone);
                                  const hoursInfo = formatBusinessHours(
                                    headerData?.hoursData,
                                    currentDayInfo
                                  );
                                  if (hoursInfo.status === "Open 24/7") {
                                    return (
                                      <span className="font-semibold">
                                        Open 24/7
                                      </span>
                                    );
                                  }
                                  if (hoursInfo.status === "Open 24 hrs") {
                                    return (
                                      <span className="font-semibold">
                                        Open 24 hrs
                                      </span>
                                    );
                                  }
                                  if (hoursInfo.status === "Open Now") {
                                    return (
                                      <>
                                        <span className="font-semibold">
                                          Open Now
                                        </span>
                                        <span>
                                          {" "}
                                          {hoursInfo.display
                                            .replace("Open Now", "")
                                            .trim()}
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
                                          <span className="text-red-500">
                                            {timeText}
                                          </span>
                                          <span className="text-[#666666]">
                                            {" "}
                                            - {timingText}
                                          </span>
                                        </>
                                      );
                                    }
                                    if (
                                      hoursInfo.display.startsWith("Closes in")
                                    ) {
                                      // Find the time range pattern (like "12:00am - 07:00am")
                                      const timeRangeMatch =
                                        hoursInfo.display.match(
                                          /\d{1,2}:\d{2}(am|pm)\s*-\s*\d{1,2}:\d{2}(am|pm)/
                                        );

                                      if (timeRangeMatch) {
                                        const timeRange = timeRangeMatch[0];
                                        const closingInfo = hoursInfo.display
                                          .replace(timeRange, "")
                                          .trim();

                                        return (
                                          <>
                                            <span className="text-red-500">
                                              {closingInfo}
                                            </span>
                                            <span className="text-[#666666]">
                                              {" "}
                                              {timeRange}
                                            </span>
                                          </>
                                        );
                                      }

                                      // If no time range is found, make everything red
                                      return (
                                        <span className="text-red-500">
                                          {hoursInfo.display}
                                        </span>
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
                                      <span className="font-semibold">
                                        Closed
                                      </span>
                                      <span> {hoursInfo.display}</span>
                                    </>
                                  );
                                })()}
                              </span>
                              <div className="group relative inline-block">
                                <Image
                                  src={InformationIcon || "/placeholder.svg"}
                                  alt="InformationIcon"
                                  className="cursor-pointer"
                                  width={15}
                                  height={15}
                                />
                                <div className="absolute left-1/2 z-9999 hidden w-auto min-w-[245px] -translate-y-1/2 transform rounded-lg bg-white p-3 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] group-hover:block">
                                  <div className="mb-2 text-sm font-semibold text-[#464646]">
                                    Business Hours
                                  </div>
                                  <div className="space-y-2">
                                    {DAYS_OF_WEEK.filter(
                                      (day) => day !== "Sunday"
                                    )
                                      .concat(["Sunday"])
                                      .map((dayName) => {
                                        const dayData =
                                          headerData?.hoursData?.find(
                                            (d) => d.name === dayName
                                          );
                                        const timezone = getBusinessTimezone(
                                          headerData?.hoursData
                                        );
                                        const isToday =
                                          dayName ===
                                          getCurrentDayAndTime(timezone).day;
                                        const dayClasses = `flex ${
                                          isToday ? "font-bold" : ""
                                        }`;
                                        if (
                                          !dayData ||
                                          !dayData.isOpen ||
                                          !dayData.timeSlots?.length
                                        ) {
                                          return (
                                            <div
                                              key={dayName}
                                              className={dayClasses}
                                            >
                                              <span className="w-28">
                                                {dayName}
                                              </span>
                                              <span className="text-[#666666]">
                                                Closed
                                              </span>
                                            </div>
                                          );
                                        }

                                        const is24Hour =
                                          dayData.timeSlots.length === 1 &&
                                          dayData.timeSlots[0].open
                                            .toLowerCase()
                                            .trim() === "12:00am" &&
                                          dayData.timeSlots[0].close
                                            .toLowerCase()
                                            .trim() === "midnight";

                                        if (is24Hour) {
                                          return (
                                            <div
                                              key={dayName}
                                              className={dayClasses}
                                            >
                                              <span className="w-28">
                                                {dayName}
                                              </span>
                                              <div className="flex-1">
                                                <div className="text-[#666666]">
                                                  12:00am - Midnight
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }

                                        return (
                                          <div
                                            key={dayName}
                                            className={dayClasses}
                                          >
                                            <span className="w-28">
                                              {dayName}
                                            </span>
                                            <div className="flex gap-5 items-center">
                                              <div className="flex gap-5 items-center text-[#666666] text-nowrap">
                                                {dayData.timeSlots.map(
                                                  (slot, index) => {
                                                    const formatTime = (
                                                      timeStr
                                                    ) => {
                                                      if (
                                                        /12\s*noon/i.test(
                                                          timeStr
                                                        )
                                                      )
                                                        return "12 Noon";
                                                      if (
                                                        /midnight/i.test(
                                                          timeStr
                                                        )
                                                      )
                                                        return "Midnight";
                                                      timeStr = timeStr
                                                        .toLowerCase()
                                                        .trim();
                                                      let [timePart, period] =
                                                        timeStr.split(
                                                          /(?=\s*(am|pm))/i
                                                        );
                                                      timePart =
                                                        timePart.trim();
                                                      if (
                                                        !period &&
                                                        /(am|pm)/i.test(
                                                          timePart
                                                        )
                                                      ) {
                                                        const split =
                                                          timePart.split(
                                                            /(am|pm)/i
                                                          );
                                                        timePart =
                                                          split[0].trim();
                                                        period =
                                                          split[1].toLowerCase();
                                                      }
                                                      const [hours, minutes] =
                                                        timePart
                                                          .split(":")
                                                          .map((part) =>
                                                            Number.parseInt(
                                                              part,
                                                              10
                                                            )
                                                          );
                                                      const formattedHours =
                                                        hours
                                                          .toString()
                                                          .padStart(2, "0");
                                                      const formattedMinutes =
                                                        minutes
                                                          ? `:${minutes
                                                              .toString()
                                                              .padStart(
                                                                2,
                                                                "0"
                                                              )}`
                                                          : "";
                                                      return `${formattedHours}${formattedMinutes}${
                                                        period || "am"
                                                      }`;
                                                    };

                                                    return (
                                                      <React.Fragment
                                                        key={index}
                                                      >
                                                        <div>
                                                          {formatTime(
                                                            slot.open
                                                          )}{" "}
                                                          -{" "}
                                                          {formatTime(
                                                            slot.close
                                                          )}
                                                        </div>
                                                        {index !==
                                                          dayData.timeSlots
                                                            .length -
                                                            1 && <div>&</div>}
                                                      </React.Fragment>
                                                    );
                                                  }
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center leading-6 tracking-[0.84px] space-x-3 text-sm text-[#666666]">
                          <Image
                            src={CallIcon || "/placeholder.svg"}
                            alt="CallIcon"
                            width={20}
                            height={20}
                          />
                          <span>{headerData?.phone || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center flex-col justify-between h-full gap-6">
                  {isHeaderLoading || !headerData ? (
                    <>
                      <Skeleton
                        width={120}
                        height={40}
                        baseColor="#e5e7eb"
                        highlightColor="#f3f4f6"
                        className="rounded-lg"
                      />
                      <div className="flex items-end justify-between w-full space-x-4">
                        <Skeleton
                          width={24}
                          height={24}
                          circle
                          baseColor="#e5e7eb"
                          highlightColor="#f3f4f6"
                        />
                        <Skeleton
                          width={24}
                          height={24}
                          circle
                          baseColor="#e5e7eb"
                          highlightColor="#f3f4f6"
                        />
                        <Skeleton
                          width={24}
                          height={24}
                          circle
                          baseColor="#e5e7eb"
                          highlightColor="#f3f4f6"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsChatOpen(true)}
                        className="bg-[#059E14] hover:bg-green-700 text-white text-sm font-medium tracking-[0.24px] px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
                      >
                        <span>Live Chat</span>
                        <Image
                          src={ChateIcon || "/placeholder.svg"}
                          alt="ChateIcon"
                        />
                      </button>

                      <div className="flex items-end justify-between w-full">
                        <button
                          className="cursor-pointer"
                          onClick={handleReportClick}
                        >
                          <Image src={Flag || "/placeholder.svg"} alt="Flag" />
                        </button>
                        <button
                          className="cursor-pointer"
                          onClick={handleShareClick}
                        >
                          <Image
                            src={ShareIcon || "/placeholder.svg"}
                            alt="ShareIcon"
                            width={24}
                            height={24}
                          />
                        </button>
                        <button
                          onClick={handleFavoriteToggle}
                          disabled={isFavoriteLoading}
                          className="transition-all duration-200 hover:scale-110 cursor-pointer"
                        >
                          <Image
                            src={isFavorite ? HeartLiked : HeartIcon}
                            alt={isFavorite ? "Liked" : "Like"}
                            width={24}
                            height={24}
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:space-x-6 w-full">
              <div className="w-full lg:w-[74.46%]">
                <BusinessTabs
                  activeTab={activeTab}
                  isParentLoading={isHeaderLoading || !headerData}
                />
              </div>
              <div className="w-full lg:w-[25.50%] space-y-5 h-full bg-[#D5E8FFB2] rounded-[15px] py-5 px-5 !my-[10px] lg:mt-0">
                {isHeaderLoading || !headerData?.features
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Skeleton
                          width={21}
                          height={20}
                          circle
                          baseColor="#e5e7eb"
                          highlightColor="#f3f4f6"
                        />
                        <Skeleton
                          width={200}
                          height={16}
                          baseColor="#e5e7eb"
                          highlightColor="#f3f4f6"
                        />
                      </div>
                    ))
                  : headerData.features.map((feature, index) => (
                      <div key={index}>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center">
                            <Image
                              src={
                                Array.isArray(highlights)
                                  ? highlights
                                      ?.flatMap((item) => item?.highlights)
                                      ?.find?.((data) => data?.name === feature)
                                      ?.icon || ""
                                  : ""
                              }
                              alt={feature}
                              width={21}
                              height={20}
                              className="object-contain filter grayscale"
                            />
                          </div>
                          <span className="text-sm font-medium tracking-[0.24px] leading-5 text-[#666666]">
                            {feature}
                          </span>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
        {isChatOpen && <LiveChat onClose={() => setIsChatOpen(false)} />}
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={handleCloseReportModal}
        />
        <ShareModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          city={city}
          businessSlug={businessSlug}
          zipCode={zipCode}
          neighborhood={neighborhood}
          tab={activeTab}
        />
      </div>
    </>
  );
}
