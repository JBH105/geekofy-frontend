"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import DropDownIcon from "../../../public/image/landingPage/dropdownIcon.svg";

const CustomDropdown = ({
  options = [],
  defaultValue = "",
  onChange,
  label = "",
  showLabel = true,
  customStyle = "",
  largeDropdown = false,
  hideOnMobile = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const [selected, setSelected] = useState(defaultValue || options[0] || "");
  const [dropDirection, setDropDirection] = useState("down");
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  const handleSelect = (value) => {
    setSelected(value);
    onChange?.(value);
    closeDropdown();
  };

  const closeDropdown = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setIsOpen(false);
      setAnimateOut(false);
    }, 200);
  };

  const handlePosition = () => {
    if (!dropdownRef.current || !menuRef.current) return;

    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - dropdownRect.bottom;
    const spaceAbove = dropdownRect.top;

    const dropdownHeight = menuRef.current.offsetHeight;

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropDirection("up");
    } else {
      setDropDirection("down");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handlePosition);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handlePosition);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      handlePosition();
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          hideOnMobile ? "hidden sm:flex" : "flex"
        } justify-end items-center gap-[8px] sm:gap-[10px] lg:gap-[12px] rounded-[8px] sm:rounded-[10px] bg-[rgba(0,0,0,0.05)] ${
          customStyle ? customStyle : "p-[8px] sm:p-[10px]"
        }`}
      >
        {showLabel && (
          <span className="text-[#666666] text-justify font-sans text-[12px] sm:text-[13px] lg:text-[14px] font-normal leading-[20px] sm:leading-[22px] lg:leading-[24px]">
            {label} {selected}
          </span>
        )}
        {!showLabel && (
          <span className="text-[#666666] text-justify font-sans text-[12px] sm:text-[13px] lg:text-[14px] font-normal leading-[20px] sm:leading-[22px] lg:leading-[24px] ">
            {selected}
          </span>
        )}
        <Image
          src={DropDownIcon}
          alt="Dropdown Icon"
          className={`w-[6px] h-[3px] sm:w-[7px] sm:h-[3.5px] lg:w-[8px] lg:h-[4px] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {(isOpen || animateOut) && (
        <div
          ref={menuRef}
          className={`
      absolute ${
        dropDirection === "up" ? "bottom-full mb-1 sm:mb-2" : "mt-1 sm:mt-2"
      }
            sm:right-[-8px] lg:right-[-8px] 
            ${
              largeDropdown
                ? "w-[80px] sm:w-[100px] lg:w-[200px]"
                : "w-[80px] sm:w-[100px] lg:w-[100px]"
            }
            bg-white border border-gray-200 rounded-[6px] sm:rounded-[8px] lg:rounded-lg shadow-lg z-10
            transition-all duration-300 ease-out origin-top
      ${
        isOpen && !animateOut
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
      }
    `}
          style={{ maxHeight: "180px", overflowY: "auto" }}
        >
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-3 sm:px-4 py-1 sm:py-2 cursor-pointer hover:bg-gray-100 text-xs sm:text-sm lg:text-sm text-[#333] ${
                selected === option ? "font-semibold text-[#000]" : ""
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
