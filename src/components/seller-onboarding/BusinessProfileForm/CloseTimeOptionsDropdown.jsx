import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const CloseTimeOptionsDropdown = ({
  slot,
  dayIndex,
  slotIndex,
  updateCloseTime,
  closeTimeOptions,
  getDisabledTimes,
  days,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (time) => {
    if (!getDisabledTimes(dayIndex, slotIndex, days).includes(time)) {
      updateCloseTime(dayIndex, slotIndex, time);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full p-[10px_16px] rounded-lg border border-[#999999] bg-white text-[#333333] text-base flex justify-between items-center cursor-pointer outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{slot.close}</span>
        <FaChevronDown className="w-5 h-5 text-gray-400" />
      </div>
      {isOpen && (
        <div className="absolute z-20 scrollbar-hide mt-1 w-full max-h-[370px] overflow-auto rounded-xl shadow-lg bg-white border border-[#e8e8e8]">
          {closeTimeOptions.map((time) => (
            <div
              key={time}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                slot.close === time
                  ? "bg-blue-50 text-blue-600"
                  : getDisabledTimes(dayIndex, slotIndex, days).includes(time)
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#333333]"
              }`}
              onClick={() => handleSelect(time)}
            >
              {time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CloseTimeOptionsDropdown;
