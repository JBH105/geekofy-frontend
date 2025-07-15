"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import myComputerNetworks from "../../../../public/image/mycomputerworks.svg";
import StarEmptyIcon from "../../../../public/image/StarEmptyIcon.svg";
import StarFillIcon from "../../../../public/image/StarFillIcon.svg";
import ReviewUserAddIcon from "../../../../public/image/ReviewUserAddIcon.svg";
import CallIcon from "../../../../public/image/CallIcon.svg";
import OpenIcon from "../../../../public/image/OpenIcon.svg";
import InformationIcon from "../../../../public/image/InformationIcon.svg";
import api from "@/lib/api";
import { TbPhoto } from "react-icons/tb";
import SellerProfileHeader from "@/components/seller-profile/SellerProfileHeader";
import { useSession } from "next-auth/react";

const RateBusinessStep = ({ token, sellerId }) => {
  const [rating, setRating] = useState(0);
  const [sellerData, setSellerData] = useState(null);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const totalStars = 5;
  const businessName = sellerData?.businessName;
  const businessSlug = sellerData?.businessSlug;

  useEffect(() => {
    const fetchSellerDetails = async () => {
      setIsLoading(true);
      try {
        // Construct query parameters based on available token or sellerId
        const queryParams = token ? { token } : sellerId ? { sellerId } : {};

        const response = await api.get(
          "/api/business/review-equest/sellerDetails",
          {
            params: queryParams,
          }
        );

        if (response.data.success) {
          const data = response.data.data;

          if (data?.businessDetails?.profileImage) {
            try {
              const imageResponse = await api.get("/api/s3", {
                params: { key: data.businessDetails.profileImage },
              });

              setSellerData({
                ...data,
                businessDetails: {
                  ...data.businessDetails,
                  profileImage: imageResponse?.data?.data?.url || "",
                },
              });
            } catch (error) {
              console.error("Error fetching image URL:", error);
              setSellerData(data);
            }
          } else {
            setSellerData(data);
          }
        }
      } catch (error) {
        console.error("Error fetching seller details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Run fetch if either token or sellerId exists
    if (token || sellerId) {
      fetchSellerDetails();
    }
  }, [token, sellerId]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    const cleaned = ("" + phone).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyB-nR5lurFay72JtqJ75zuu7B9THG2MmVo`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results[0]) {
        return data.results[0].address_components;
      }
      throw new Error("Geocoding failed: " + data.status);
    } catch (error) {
      console.error("Geocoding error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const formatAddress = async () => {
      if (!sellerData) {
        setFormattedAddress("");
        return;
      }

      // Case 1: When we have latitude/longitude (use geocoding)
      if (sellerData.locationLat && sellerData.locationLng) {
        try {
          // Step 4: Get address components from Google Maps API
          const addressComponents = await getAddressFromCoordinates(
            sellerData.locationLat,
            sellerData.locationLng
          );
          console.log("🚀 ~ formatAddress ~ addressComponents:@@@@@@@@@@", addressComponents)

          // Step 5: Extract the specific address parts we need
          const street =
            addressComponents.find((c) => c.types.includes("route"))
              ?.long_name || "";
          const city =
            addressComponents.find((c) => c.types.includes("locality"))
              ?.long_name || "";
          const state =
            addressComponents.find((c) =>
              c.types.includes("administrative_area_level_1")
            )?.short_name || "";
          const zipCode =
            addressComponents.find((c) => c.types.includes("postal_code"))
              ?.long_name || "";

          // Step 6: Combine the parts and set the formatted address
          setFormattedAddress(
            [street, city, state, zipCode].filter(Boolean).join(", ")
          );
          console.log("🚀 ~ formatAddress ~ street:", street)
        } catch (error) {
          console.error("Geocoding failed, using fallback address:", error);
          // Fallback to basic address if geocoding fails
          formatBasicAddress();
        }
      } else {
        // Case 2: When we don't have coordinates (use basic address fields)
        formatBasicAddress();
      }
    };

    // Helper function for basic address formatting
    const formatBasicAddress = () => {
      const { address, city, state, zipCode } = sellerData || {};
      setFormattedAddress(
        [address, city, state, zipCode].filter(Boolean).join(", ")
      );
    };

    // Run the address formatter
    formatAddress();
  }, [sellerData]); 

  const handleSubmit = async () => {
    if (!sellerData?.sellerAccountId || !rating || !email) {
      console.error("Missing required fields for submission");
      return;
    }

    setIsLoading(true);
    const payload = {
      sellerAccountId: sellerData.sellerAccountId,
      customerName: customerName || "Anonymous",
      email,
      rating,
      comment,
      token,
      // media: uploadedMedia.map((item) => ({
      //   key: item.key,
      //   type: item.type,
      // })),
    };

    try {
      const response = await api.post("/api/business/review", payload);
      if (response.data.success) {
        console.log("Review submitted successfully");
        setIsSubmitted(true);
        setRating(0);
        setCustomerName("");
        setEmail("");
        setComment("");
        setUploadedMedia([]);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });
      formData.append(
        "path",
        `geekofy-assets/${businessName}/${businessSlug}/reviews`
      );

      // Upload files to S3
      const uploadRes = await api.post("/api/s3", formData);
      const keys = uploadRes?.data?.data?.keys;

      // Get URLs for uploaded files
      const urlRes = await api.get("/api/s3", {
        params: { keys: JSON.stringify(keys) },
      });

      const newMedia = urlRes.data?.data?.urls.map((url, idx) => ({
        url,
        key: keys[idx],
        type: files[idx].type.startsWith("image/") ? "image" : "video",
      }));

      setUploadedMedia((prev) => [...prev, ...newMedia]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload media. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeMedia = (index) => {
    setUploadedMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGoHome = () => {
    window.location.href = "/"; // Redirect to home page
  };

  const ThankYouPage = () => (
    <div className="flex-1 p-8 rounded-[15px] bg-white shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center">
      <p className="text-[#666666] font-helvetica text-[24px] font-normal leading-[30px] mb-6">
        Thank you for your review of {businessName}!
      </p>
      <button
        onClick={handleGoHome}
        className="py-3 px-10 bg-[#0084FF] rounded-[8px] flex justify-center items-center text-[#FFFFFF] text-base font-normal font-helvetica leading-6 text-center not-italic cursor-pointer"
      >
        Go to Home Page
      </button>
    </div>
  );

  const DAYS_OF_WEEK = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getCurrentTimeForTimezone = (timezone) => {
    const options = {
      timeZone: timezone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      weekday: "long",
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const parts = formatter.formatToParts(new Date());

    const result = {};
    parts.forEach((part) => {
      result[part.type] = part.value;
    });

    return {
      day: result.weekday,
      hours: parseInt(result.hour),
      minutes: parseInt(result.minute),
      timeString: `${result.hour}:${result.minute}`,
      timeZone: timezone,
    };
  };

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    timeStr = timeStr.toLowerCase().trim();

    // Handle special cases
    if (/12\s*noon/i.test(timeStr)) return 12 * 60;
    if (/midnight/i.test(timeStr)) return 0;

    // Extract time parts
    let [timePart, period] = timeStr.split(/(?=\s*(am|pm))/i);
    timePart = timePart.trim();

    if (!period && /(am|pm)/i.test(timePart)) {
      const split = timePart.split(/(am|pm)/i);
      timePart = split[0].trim();
      period = split[1].toLowerCase();
    }

    const [hoursStr, minutesStr] = timePart.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr ? parseInt(minutesStr, 10) : 0;

    // Convert to 24-hour format
    if (period === "pm" && hours !== 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return "";
    timeStr = timeStr.toLowerCase().trim();
    if (/12\s*noon/i.test(timeStr)) return "12 Noon";
    if (/midnight/i.test(timeStr)) return "Midnight";

    let [timePart, period] = timeStr.split(/(?=\s*(am|pm))/i);
    timePart = timePart.trim();

    if (!period && /(am|pm)/i.test(timePart)) {
      const split = timePart.split(/(am|pm)/i);
      timePart = split[0].trim();
      period = split[1].toLowerCase();
    }

    const [hours, minutes] = timePart
      .split(":")
      .map((part) => parseInt(part, 10));
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes
      ? `:${minutes.toString().padStart(2, "0")}`
      : "";

    return `${formattedHours}${formattedMinutes} ${period || "am"}`;
  };

  const getBusinessStatus = (businessHours) => {
    if (!businessHours || !businessHours.length) {
      return {
        status: "Closed",
        nextClose: null,
        nextOpen: null,
      };
    }

    // Get current day and time for the business's timezone
    const todayHours = businessHours.find((day) => {
      const currentTime = getCurrentTimeForTimezone(day.timezone);
      return day.name === currentTime.day;
    });

    if (!todayHours || !todayHours.isOpen || !todayHours.timeSlots?.length) {
      const nextOpen = getNextOpeningTime(businessHours);
      return {
        status: formatNextOpeningTime(nextOpen),
        nextClose: null,
        nextOpen,
      };
    }

    // Check for 24/7 open
    const has24Hours = todayHours.timeSlots.some(
      (slot) =>
        timeToMinutes(slot.open) === 0 &&
        (timeToMinutes(slot.close) === 0 ||
          timeToMinutes(slot.close) === 24 * 60)
    );

    if (has24Hours) {
      return {
        status: "Open 24/7",
        nextClose: null,
        nextOpen: null,
      };
    }

    const currentTime = getCurrentTimeForTimezone(todayHours.timezone);
    const currentMinutes = currentTime.hours * 60 + currentTime.minutes;

    // Check if currently open
    let isOpen = false;
    let nextCloseTime = null;
    let minutesUntilClose = Infinity;

    for (const slot of todayHours.timeSlots) {
      const openMinutes = timeToMinutes(slot.open);
      let closeMinutes = timeToMinutes(slot.close);
      if (closeMinutes === 0) closeMinutes = 24 * 60;

      if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
        isOpen = true;
        const timeUntilClose = closeMinutes - currentMinutes;
        if (timeUntilClose < minutesUntilClose) {
          minutesUntilClose = timeUntilClose;
          nextCloseTime = slot.close;
        }
      }
    }

    if (isOpen) {
      if (minutesUntilClose <= 60) {
        return {
          status: `Closes in ${minutesUntilClose} min`,
          nextClose: nextCloseTime,
          nextOpen: null,
        };
      }
      return {
        status: "Open Now",
        nextClose: nextCloseTime,
        nextOpen: null,
      };
    }

    // If not open now, show next opening time
    const nextOpen = getNextOpeningTime(businessHours);
    return {
      status: formatNextOpeningTime(nextOpen),
      nextClose: null,
      nextOpen,
    };
  };

  const formatBusinessHoursPopup = () => {
    if (!sellerData?.businessDetails?.businessHours) return null;

    const orderedDays = DAYS_OF_WEEK.filter((day) => day !== "Sunday").concat(
      "Sunday"
    );

    return (
      <div className="absolute left-1/2 z-9999 hidden w-auto min-w-[245px] -translate-y-1/2 transform rounded-lg bg-white p-3 shadow-lg group-hover:block">
        <div className="mb-2 text-sm font-semibold text-[#464646]">
          Business Hours
        </div>
        <div className="space-y-2">
          {orderedDays.map((dayName) => {
            const dayData = sellerData.businessDetails.businessHours.find(
              (d) => d.name === dayName
            );
            const currentTime = dayData
              ? getCurrentTimeForTimezone(dayData.timezone)
              : null;
            const isToday = dayData && dayName === currentTime?.day;
            const dayClasses = `flex ${
              isToday ? "font-bold text-[#666666]" : "text-[#666666]"
            }`;

            if (!dayData || !dayData.isOpen || !dayData.timeSlots?.length) {
              return (
                <div key={dayName} className={dayClasses}>
                  <span className="w-28">{dayName}</span>
                  <span className="text-[#666666]">Closed</span>
                </div>
              );
            }

            return (
              <div key={dayName} className={dayClasses}>
                <span className="w-28">{dayName}</span>
                <div className="flex gap-5 items-center">
                  <div className="flex gap-5 items-center text-[#666666] text-nowrap">
                    {dayData.timeSlots.map((slot, index) => (
                      <React.Fragment key={index}>
                        <div>
                          {formatTimeDisplay(slot.open)} -{" "}
                          {formatTimeDisplay(slot.close)}
                        </div>
                        {index !== dayData.timeSlots.length - 1 && <div>&</div>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const formatCurrentDayHours = () => {
    if (!sellerData?.businessDetails?.businessHours) return "Closed";

    const status = getBusinessStatus(sellerData.businessDetails.businessHours);
    return status.status;
  };

  const isCurrentlyOpen = () => {
    if (!sellerData?.businessDetails?.businessHours) return false;

    const status = getBusinessStatus(sellerData.businessDetails.businessHours);
    return (
      status.status === "Open Now" ||
      status.status === "Open 24/7" ||
      status.status.startsWith("Closes in")
    );
  };

  const getNextOpeningTime = (businessHours) => {
    if (!businessHours || !businessHours.length) return null;
  
    const now = new Date();
    const currentDayIndex = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    
    // Check next 7 days (including today in case we're past closing time)
    for (let i = 0; i < 7; i++) {
      const dayIndex = (currentDayIndex + i) % 7;
      const dayName = DAYS_OF_WEEK[dayIndex];
      const dayData = businessHours.find(d => d.name === dayName);
      
      if (dayData && dayData.isOpen && dayData.timeSlots?.length) {
        // Get the earliest opening time for this day
        const firstSlot = dayData.timeSlots[0];
        const openTime = firstSlot.open;
        
        // If it's today, check if we're before the opening time
        if (i === 0) {
          const currentTime = getCurrentTimeForTimezone(dayData.timezone);
          const currentMinutes = currentTime.hours * 60 + currentTime.minutes;
          const openMinutes = timeToMinutes(openTime);
          
          if (currentMinutes < openMinutes) {
            return { day: dayName, time: openTime };
          }
        } else {
          // For future days, return the first opening time
          return { day: dayName, time: openTime };
        }
      }
    }
    
    return null;
  };
  
  const formatNextOpeningTime = (nextOpen) => {
    if (!nextOpen) return "Closed";

    const formattedTime = formatTimeDisplay(nextOpen.time);
    return `Opens ${nextOpen.day} at ${formattedTime}`;
  };


  return (
    <>
      <SellerProfileHeader />
      <div className="layout_container flex flex-col md:flex-row justify-center items-start gap-6 w-full py-7 md:px-20">
        {/* Loader Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-[#00000066] flex items-center justify-center z-50">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          </div>
        )}

        {/* ReviewsSidebar Content */}
        <div className="w-full md:max-w-[304px]">
          <div className="p-6 bg-white rounded-2xl shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] flex flex-col gap-5">
            <div className="flex justify-center">
              {sellerData?.businessDetails?.profileImage ? (
                <div className="flex-shrink-0 w-[100px] h-[100px] bg-white flex items-center justify-center overflow-hidden  border border-gray-200 rounded-md">
                  <Image
                    src={sellerData?.businessDetails?.profileImage}
                    alt="Business Profile"
                    width={100}
                    height={100}
                    className="object-scale-down height_revert"
                  />
                </div>
              ) : (
                <TbPhoto className="w-[100px] h-[100px]" />
              )}
            </div>
            <div className="flex flex-col gap-[17px]">
              <div className="flex gap-[10px] items-start">
                <div className="">
                  <Image
                    src={ReviewUserAddIcon}
                    alt="ReviewUserAddIcon"
                    className="w-6 h-6"
                  />
                </div>
                <p className="text-[#666666] text-[14px] font-normal font-helvetica leading- text-wrap">
                  {formattedAddress || "Address not available"}
                </p>
              </div>
              <div className="flex gap-[10px] items-start">
                <div className="w-6 h-6">
                  <Image src={CallIcon} alt="CallIcon" />
                </div>
                <p className="text-[#666666] text-[14px] font-normal font-helvetica leading- text-wrap">
                  {sellerData
                    ? [sellerData.ownerPhone]
                        .filter(Boolean)
                        .map(formatPhoneNumber)
                        .join(", ")
                    : ""}
                </p>
              </div>
              <div className="flex gap-[10px] items-start">
                <div className="mt-1">
                  <Image src={OpenIcon} alt="OpenIcon" />
                </div>
                <div className="flex flex-wrap items-center gap-x-[6px] gap-y-[2px] text-[14px] font-normal font-helvetica leading-tight max-w-full">
                  {/* Status */}
                  <span
                    className={`${
                      formatCurrentDayHours().startsWith("Closes in")
                        ? "text-[#FF0000]"
                        : isCurrentlyOpen() ||
                          formatCurrentDayHours() === "Open 24/7"
                        ? "text-[#0084FF]"
                        : "text-[#FF0000]"
                    }`}
                  >
                    {(() => {
                      const status = formatCurrentDayHours();
                      if (status === "Open 24/7") return "Open";
                      if (status.startsWith("Closes in")) return status;
                      if (status === "Open Now") return "Open Now";
                      return "Closed";
                    })()}
                  </span>

                  {/* Time Slot */}
                  <span className="text-[#666666] whitespace-nowrap">
                    {(() => {
                      const status = getBusinessStatus(
                        sellerData?.businessDetails?.businessHours
                      );
                      const currentDayData =
                        sellerData?.businessDetails?.businessHours.find(
                          (day) =>
                            day.name ===
                            getCurrentTimeForTimezone(day.timezone).day
                        );

                      if (status.status === "Open 24/7") return "Open 24/7";

                      if (
                        status.status === "Open Now" ||
                        status.status.startsWith("Closes in")
                      ) {
                        return currentDayData?.timeSlots
                          ?.map(
                            (slot) =>
                              `${formatTimeDisplay(
                                slot.open
                              )} - ${formatTimeDisplay(slot.close)}`
                          )
                          .join(" & ");
                      }

                      if (status.status.startsWith("Opens ")) {
                        const parts = status.status
                          .replace("Opens ", "")
                          .split(" at ");
                        const [day, time] = parts;
                        const today = getCurrentTimeForTimezone(
                          sellerData?.businessDetails?.businessHours.find(
                            (d) => d.name === day
                          )?.timezone
                        ).day;

                        if (day === today) return `Opens at ${time}`;
                        return `Opens ${day} at ${time}`;
                      }

                      return "";
                    })()}
                  </span>

                  {/* Info Icon - Wrapped in group div */}
                  {sellerData?.businessDetails?.businessHours && (
                    <div className="group relative -mt-[2px]">
                      <Image src={InformationIcon} alt="InformationIcon" />
                      {formatBusinessHoursPopup()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RateBusinessStep Content */}
        {isSubmitted ? (
          <ThankYouPage />
        ) : (
          <div className="flex-1 p-8 rounded-[15px] bg-white shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
            {rating === 0 ? (
              // Initial star rating prompt
              <>
                <div className="">
                  <p className="text-[#666666] font-helvetica text-base font-normal leading-[30px]">
                    Please rate your overall experience with{" "}
                    <span className="font-bold">{businessName}</span>
                  </p>

                  <div className="flex justify-start mt-4 space-x-2">
                    {[...Array(totalStars)].map((_, index) => {
                      const starValue = index + 1;
                      return (
                        <button
                          key={index}
                          onClick={() => setRating(starValue)}
                          className="focus:outline-none cursor-pointer"
                        >
                          {starValue <= rating ? (
                            <Image
                              src={StarFillIcon}
                              alt="Filled star"
                              className="w-8 h-8"
                            />
                          ) : (
                            <Image
                              src={StarEmptyIcon}
                              alt="Empty star"
                              className="w-8 h-8"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-[46px] flex flex-col gap-5 items-start">
                  <p className="text-[#666666] font-helvetica text-base font-normal leading-[30px]">
                    Please rate your overall experience with {businessName}
                  </p>
                  <div className="flex gap-[8px] items-center">
                    {[...Array(totalStars)].map((_, index) => {
                      const starValue = index + 1;
                      return (
                        <button
                          key={index}
                          onClick={() => setRating(starValue)}
                          className="focus:outline-none cursor-pointer"
                        >
                          <Image
                            src={
                              starValue <= rating ? StarFillIcon : StarEmptyIcon
                            }
                            alt={
                              starValue <= rating ? "Filled star" : "Empty star"
                            }
                            className="w-8 h-8"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col justify-start gap-[46px]">
                  <div className="flex flex-col gap-3 justify-start">
                    <p className="text-[#666666]  text-[16px] not-italic font-normal leading-[30px]">
                      {rating <= 3
                        ? `Sorry to hear that you had a bad experience with ${businessName}, What went wrong?`
                        : `Tell us how ${businessName} made you happy?`}
                    </p>
                    <div className="h-[180px] self-stretch rounded-[15px] border border-dashed border-[#000] flex items-center">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review here..."
                        className="w-full h-full p-4 text-[16px] font-helvetica font-normal leading-[30px] border-none outline-none resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <p className="text-[#666666] text-[16px] not-italic font-normal leading-[30px]">
                        Would you like to add photos or videos?
                      </p>
                      <p className="text-[#666666] text-[16px] not-italic font-normal leading-[30px]">
                        Strengthen your review by uploading photos & videos.
                      </p>
                      {uploadedMedia.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {uploadedMedia.map((media, index) => (
                            <div key={index} className="relative">
                              {media.type === "image" ? (
                                <Image
                                  src={media.url}
                                  alt={`Uploaded ${index}`}
                                  width={80}
                                  height={80}
                                  className="rounded-md object-cover"
                                />
                              ) : (
                                <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                                  <span className="text-xs">Video</span>
                                </div>
                              )}
                              <button
                                onClick={() => removeMedia(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,video/*"
                        multiple
                      />
                      <button
                        onClick={handleBrowseClick}
                        disabled={isUploading}
                        className="py-3 px-10 bg-[#0084FF] rounded-[8px] flex justify-center items-center text-[#FFFFFF] text-base font-normal font-helvetica leading-6 text-center not-italic cursor-pointer disabled:opacity-50"
                      >
                        {isUploading ? "Uploading..." : "Browse"}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 items-start">
                    <div className="flex flex-col">
                      <p className="text-[#666666]  text-[16px] not-italic font-normal leading-[30px]">
                        What's your name?
                      </p>
                      <p className="text-[#666666]  text-[16px] not-italic font-normal leading-[30px]">
                        Leave this blank if you'd like to publish your review
                        anonymously.
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="block px-3.5 pb-2.5 pt-4 w-[461px] h-[48px] text-sm bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 peer border-[#999999]"
                        placeholder=" "
                        autoComplete="off"
                      />
                      <label
                        htmlFor="customerName"
                        className="absolute text-sm text-[#999999] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3 "
                      >
                        Full name
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 items-start">
                    <div className="flex flex-col">
                      <p className="text-[#666666]  text-[16px] not-italic font-normal leading-[30px]">
                        What's your email?
                      </p>
                      <p className="text-[#666666]  text-[16px] not-italic font-normal leading-[30px]">
                        We need your email address to verify that your review is
                        genuine
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block px-3.5 pb-2.5 pt-4  text-sm bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 peer border-[#999999] w-[461px] h-[48px]"
                        placeholder=" "
                        autoComplete="off"
                      />
                      <label
                        htmlFor="email"
                        className="absolute text-sm text-[#999999] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3 "
                      >
                        Email
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmit}
                      className="py-3 px-10 bg-[#0084FF] rounded-[8px] flex justify-center items-center text-[#FFFFFF] text-base font-normal font-helvetica leading-6 text-center not-italic cursor-pointer"
                      disabled={isLoading}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default RateBusinessStep;
