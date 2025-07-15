"use client";
import React, { useRef, useState, useEffect } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { FaArrowCircleLeft } from "react-icons/fa";

const ServicesOptions = ({ selectedTab, onTabChange }) => {
  const tabsContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const allTabs = [
    "Computers",
    "Printers",
    "WiFi & Networking",
    "Mobiles & Tablets",
    "Smart Watches",
    "Drone",
  ];

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === "right" ? 800 : -800;
      tabsContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const checkScrollPosition = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      const tolerance = 5; // Small tolerance for floating point calculations

      // Show/hide left arrow
      setShowLeftArrow(scrollLeft > tolerance);

      // Show/hide right arrow - check if we've reached the end
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - tolerance);
    }
  };

  useEffect(() => {
    const container = tabsContainerRef.current;
    if (container) {
      // Initial check
      checkScrollPosition();

      // Add event listener for scroll
      container.addEventListener("scroll", checkScrollPosition);

      // Cleanup
      return () => {
        container.removeEventListener("scroll", checkScrollPosition);
      };
    }
  }, []);

  return (
    <div className="py-3 px-[18px] rounded-tl-[10px] rounded-tr-[10px] bg-[#FFFFFF] shadow-[1px_1px_25px_rgba(0,0,0,0.05),_-1px_-1px_25px_rgba(0,0,0,0.05)] relative">
      <div className="flex items-center gap-2">
        {showLeftArrow && (
          <button
            onClick={() => scrollTabs("left")}
            className="cursor-pointer p-1 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 bg-opacity-20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        <div
          ref={tabsContainerRef}
          className="flex flex-1 flex-nowrap overflow-x-auto scrollbar-hide gap-2 items-center"
          onScroll={checkScrollPosition}
        >
          {allTabs?.map((tab, index) => (
            <React.Fragment key={tab}>
              <button
                onClick={() => onTabChange(tab)}
                className={`relative py-4 px-5 rounded-[10px] flex-shrink-0 flex justify-center items-center text-base font-helvetica leading-6 not-italic outline-none ${
                  selectedTab === tab
                    ? "cursor-default font-normal text-[#000000]"
                    : "cursor-pointer text-[#666666]"
                }`}
              >
                <span>{tab}</span>
                {selectedTab === tab && (
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[90px] h-[6px] bg-[#0084FF] rounded-full"></span>
                )}
              </button>
              {index < allTabs?.length - 1 && (
                <p className="text-[#666666] text-[22px] font-normal font-helvetica leading-[28px] not-italic flex-shrink-0">
                  |
                </p>
              )}
            </React.Fragment>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scrollTabs("right")}
            className="cursor-pointer p-1 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 bg-opacity-20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ServicesOptions;
