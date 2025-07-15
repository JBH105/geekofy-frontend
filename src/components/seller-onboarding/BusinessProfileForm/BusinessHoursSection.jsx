"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import CopyIcon from "../../../../public/image/CopyIcon.svg";
import DeleteIcon from "../../../../public/image/DeleteIcon.svg";
import RoundPulsIcon from "../../../../public/image/RoundPulsIcon.svg";
import RoundPulseHide from "../../../../public/image/RoundPulseHide.svg";
import CloseTimeOptionsDropdown from "./CloseTimeOptionsDropdown";
import OpenTimeOptionsDropdown from "./OpenTimeOptionsDropdown";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

export default function BusinessHoursSection({
  setBusinessHoursSection,
  businessHoursData,
  saveBusinessDetails,
  zipCode,
}) {
  const getTimezoneFromZip = (zipCode) => {
    if (!zipCode) return "America/New_York";
    const firstDigit = zipCode.toString()[0];

    switch (firstDigit) {
      case "0":
      case "1":
      case "2":
      case "3":
        return "America/New_York";
      case "4":
      case "5":
      case "6":
      case "7":
        return "America/Chicago";
      case "8":
        return "America/Denver";
      case "9":
        return "America/Los_Angeles";
      default:
        return "America/New_York";
    }
  };

  const [days, setDays] = useState(
    businessHoursData || [
      {
        name: "Monday",
        isOpen: false,
        timeSlots: [],
        timezone: getTimezoneFromZip(zipCode),
      },
      {
        name: "Tuesday",
        isOpen: false,
        timeSlots: [],
        timezone: getTimezoneFromZip(zipCode),
      },
      {
        name: "Wednesday",
        isOpen: false,
        timeSlots: [],
        timezone: getTimezoneFromZip(zipCode),
      },
      {
        name: "Thursday",
        isOpen: false,
        timeSlots: [],
        timezone: getTimezoneFromZip(zipCode),
      },
      {
        name: "Friday",
        isOpen: false,
        timeSlots: [],
        timezone: getTimezoneFromZip(zipCode),
      },
      {
        name: "Saturday",
        isOpen: false,
        timeSlots: [],
        timezone: getTimezoneFromZip(zipCode),
      },
      {
        name: "Sunday",
        isOpen: false,
        timeSlots: [],
        timezone: getTimezoneFromZip(zipCode),
      },
    ]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (JSON.stringify(days) !== JSON.stringify(businessHoursData)) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [days, businessHoursData]);

  useEffect(() => {
    const newTimezone = getTimezoneFromZip(zipCode);
    setDays((prevDays) =>
      prevDays.map((day) => ({
        ...day,
        timezone: newTimezone,
      }))
    );
  }, [zipCode]);

  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const formatTimeString = (hour, period) => {
    const displayHour = hour % 12 || 12;
    const formattedHour = displayHour < 10 ? `0${displayHour}` : displayHour;
    return `${formattedHour}:00 ${period}`;
  };

  const generateTimeOptions = () => {
    const options = [];
    const periods = ["am", "pm"];

    for (let hour = 0; hour < 24; hour++) {
      const period = hour < 12 ? periods[0] : periods[1];
      if (hour === 12) {
        options.push("12 Noon");
      } else {
        options.push(formatTimeString(hour, period));
      }
    }

    options.push("Midnight");

    return options;
  };

  const allTimeOptions = generateTimeOptions();

  const openTimeOptions = allTimeOptions.filter((time) => time !== "Midnight");

  const cloneObject = (obj) => JSON.parse(JSON.stringify(obj));

  const closeTimeOptions = allTimeOptions.filter((time) => time !== "12:00 am");

  const toggleDay = (dayIndex) => {
    const newDays = cloneObject([...days]);
    newDays[dayIndex].isOpen = !newDays[dayIndex].isOpen;
    if (newDays[dayIndex].isOpen && newDays[dayIndex].timeSlots.length === 0) {
      newDays[dayIndex].timeSlots.push({
        open: "Select Time",
        close: "Select Time",
      });
    }
    setDays(cloneObject(newDays));
  };

  const updateOpenTime = (dayIndex, slotIndex, time) => {
    const newDays = cloneObject([...days]);
    newDays[dayIndex].timeSlots[slotIndex].open = time;
    setDays(cloneObject(newDays));
  };

  const updateCloseTime = (dayIndex, slotIndex, time) => {
    const newDays = cloneObject([...days]);
    newDays[dayIndex].timeSlots[slotIndex].close = time;
    setDays(cloneObject(newDays));
  };

  const copyToAll = () => {
    if (
      !days.some((day) => day.isOpen) ||
      days.every((day) => day.timeSlots.length === 0)
    )
      return;

    const firstOpenDay = days.find(
      (day) => day.isOpen && day.timeSlots.length > 0
    );
    const newDays = days.map((day) => ({
      ...day,
      isOpen: true,
      timeSlots: [...firstOpenDay.timeSlots.map((slot) => ({ ...slot }))],
      timezone: day.timezone, // Preserve timezone
    }));
    setDays(cloneObject(newDays));
  };

  const clearAll = () => {
    const newDays = days.map((day) => ({
      ...day,
      isOpen: false,
      timeSlots: [],
      timezone: getTimezoneFromZip(zipCode), // Preserve timezone
    }));
    setDays(cloneObject(newDays));
    setShowValidationErrors(false);
  };

  const addTimeSlot = (dayIndex) => {
    const newDays = cloneObject([...days]);
    newDays[dayIndex].timeSlots.push({
      open: "Select Time",
      close: "Select Time",
    });
    setDays(cloneObject(newDays));
  };

  const removeTimeSlot = (dayIndex, slotIndex) => {
    const newDays = cloneObject([...days]);
    newDays[dayIndex].timeSlots.splice(slotIndex, 1);
    setDays(cloneObject(newDays));
  };

  const isAnyDayOpen = days.some((day) => day.isOpen);

  const handleCancel = () => {
    if (hasChanges) {
      setIsModalOpen(true);
    } else {
      setBusinessHoursSection((prev) => ({ ...prev, show: false }));
    }
  };

  const timeToMinutes = (time) => {
    if (time === "Midnight") return 24 * 60;
    if (time === "12 Noon") return 12 * 60;

    const [hourStr, period] = time.split(" ");
    const [hours, minutes] = hourStr.split(":").map(Number);
    let totalHours = hours;
    if (period === "pm" && hours !== 12) totalHours += 12;
    if (period === "am" && hours === 12) totalHours = 0;
    return totalHours * 60 + minutes;
  };

  const getDisabledTimes = (dayIndex, slotIndex, days) => {
    if (slotIndex === 0 || days[dayIndex].timeSlots.length < 1) {
      return [];
    }

    const firstSlot = days[dayIndex].timeSlots[0];
    const startTime = timeToMinutes(firstSlot.open);
    const endTime = timeToMinutes(firstSlot.close);

    const allTimes = [
      ...openTimeOptions,
      ...closeTimeOptions.filter((time) => !openTimeOptions.includes(time)),
    ];

    const disabledTimes = allTimes.filter((time) => {
      const timeInMinutes = timeToMinutes(time);
      return timeInMinutes <= endTime;
    });

    return disabledTimes;
  };

  const isFullDaySlot = (day) => {
    return (
      day.timeSlots.length === 1 &&
      day.timeSlots[0].open === "12:00 am" &&
      day.timeSlots[0].close === "Midnight"
    );
  };

  const validateTimeSlots = () => {
    let isValid = true;

    days.forEach((day) => {
      if (day.isOpen) {
        day.timeSlots.forEach((slot) => {
          if (slot.open === "Select Time" || slot.close === "Select Time") {
            isValid = false;
          }
        });
      }
    });

    return isValid;
  };

  const hasEmptyTimeSlots = () => {
    return days.some(
      (day) =>
        day.isOpen &&
        day.timeSlots.some(
          (slot) => slot.open === "Select Time" || slot.close === "Select Time"
        )
    );
  };

  const handleSave = () => {
    const isValid = validateTimeSlots();

    if (!isValid) {
      setShowValidationErrors(true);
      return;
    }

    setShowValidationErrors(false);
    setBusinessHoursSection((prev) => ({ ...prev, show: false, data: days }));
    saveBusinessDetails({ businessHours: days });
  };

  const handleConfirmExit = () => {
    setIsModalOpen(false)
    setBusinessHoursSection((prev) => ({ ...prev, show: false }));
  }

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-[#666666] leading-5 mb-2">
              Business Hours And Opening Days
            </h2>
            <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-8"></div>
          </div>
          <button
            onClick={clearAll}
            className="flex items-center text-[#0084FF] text-sm cursor-pointer h-8 px-3"
          >
            Clear All
          </button>
        </div>

        <div className="w-full mt-4">
          <div className="flex justify-between pb-4 border-b border-[#CCCCCC]">
            <div className="w-1/4 text-[#666666] font-bold leading-6 text-base">
              Day
            </div>
            <div className="w-1/3 text-[#666666] font-bold leading-6 text-base">
              Opens at
            </div>
            <div className="w-1/3 text-[#666666] font-bold leading-6 text-base">
              Closes at
            </div>
            <div className="w-1/12"></div>
          </div>

          <div className={isAnyDayOpen ? "mt-[16px]" : "mt-[41px]"}>
            {isAnyDayOpen && (
              <div className="flex justify-end mr-14">
                <button
                  onClick={copyToAll}
                  className="flex items-center text-[#0084FF] text-sm cursor-pointer"
                >
                  <Image src={CopyIcon} alt="CopyIcon" />
                  Copy to all
                </button>
              </div>
            )}
            {days.map((day, dayIndex) => (
              <div key={day.name}>
                <div className="flex items-start py-4">
                  <div className="w-1/4 flex items-center sticky top-0">
                    <button
                      type="button"
                      onClick={() => toggleDay(dayIndex)}
                      className="focus:outline-none cursor-pointer"
                    >
                      {day.isOpen ? (
                        <div className="w-[40px] h-[24px] rounded-full bg-[#0084FF] relative">
                          <div className="absolute right-0 top-0 w-[24px] h-[24px] bg-white rounded-full shadow-sm"></div>
                        </div>
                      ) : (
                        <div className="w-[40px] h-[24px] rounded-full bg-[#E6E8EA] relative">
                          <div className="absolute left-0 top-0 w-[24px] h-[24px] bg-white rounded-full shadow-sm"></div>
                        </div>
                      )}
                    </button>
                    <span className="ml-4 text-[#666666] text-base">
                      {day.name}
                    </span>
                  </div>
                  {day.isOpen ? (
                    <div className="w-3/4">
                      {day.timeSlots.map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className={`flex flex-col ${
                            slotIndex > 0 ? "mt-6" : ""
                          }`}
                        >
                          <div className="flex w-full">
                            <div className="w-1/2 pr-2">
                              <OpenTimeOptionsDropdown
                                slot={slot}
                                dayIndex={dayIndex}
                                slotIndex={slotIndex}
                                updateOpenTime={updateOpenTime}
                                openTimeOptions={openTimeOptions}
                                getDisabledTimes={getDisabledTimes}
                                days={days}
                              />
                              {showValidationErrors &&
                                slot.open === "Select Time" && (
                                  <p className="text-red-500 text-xs mt-1">
                                    Open time is required
                                  </p>
                                )}
                            </div>
                            <div className="w-1/2 pr-2">
                              <CloseTimeOptionsDropdown
                                slot={slot}
                                dayIndex={dayIndex}
                                slotIndex={slotIndex}
                                updateCloseTime={updateCloseTime}
                                closeTimeOptions={closeTimeOptions}
                                getDisabledTimes={getDisabledTimes}
                                days={days}
                              />
                              {showValidationErrors &&
                                slot.close === "Select Time" && (
                                  <p className="text-red-500 text-xs mt-1">
                                    Close time is required
                                  </p>
                                )}
                            </div>
                            <div className="w-1/12 flex justify-end cursor-pointer">
                              {day.timeSlots.length > 1 &&
                                slotIndex === day.timeSlots.length - 1 && (
                                  <button
                                    className="text-[#F52A19] cursor-pointer"
                                    onClick={() =>
                                      removeTimeSlot(dayIndex, slotIndex)
                                    }
                                  >
                                    <Image src={DeleteIcon} alt="DeleteIcon" />
                                  </button>
                                )}
                            </div>
                          </div>
                          {slotIndex === day.timeSlots.length - 1 &&
                            (() => {
                              const isMaxTimeSlotsReached =
                                day.timeSlots.length >= 2 || isFullDaySlot(day);

                              return (
                                <div className="mt-2">
                                  <button
                                    onClick={() => addTimeSlot(dayIndex)}
                                    className={`flex items-center cursor-pointer ${
                                      isMaxTimeSlotsReached
                                        ? "cursor-not-allowed text-[#999999]"
                                        : "text-[#0084FF]"
                                    }`}
                                    disabled={isMaxTimeSlotsReached}
                                  >
                                    <Image
                                      src={
                                        isMaxTimeSlotsReached
                                          ? RoundPulseHide
                                          : RoundPulsIcon
                                      }
                                      alt={
                                        isMaxTimeSlotsReached
                                          ? "RoundPulsIcon"
                                          : "RoundPulseHide"
                                      }
                                    />
                                    Add time slot
                                  </button>
                                </div>
                              );
                            })()}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="w-2/3 text-[#666666] text-base">
                        Closed
                      </div>
                      <div className="w-1/12"></div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4 my-[50px]">
        <button
          onClick={handleCancel}
          className="px-5 py-2.5 border border-[#666666] rounded-lg hover:bg-gray-50 text-[#666666] text-base cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className={`px-5 py-2.5 rounded-lg text-base cursor-pointer ${
            hasEmptyTimeSlots()
              ? "bg-[#0084FF] text-white hover:bg-blue-600"
              : "bg-[#0084FF] text-white hover:bg-blue-600"
          }`}
        >
          Save
        </button>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelModal}
      />
    </>
  );
}
