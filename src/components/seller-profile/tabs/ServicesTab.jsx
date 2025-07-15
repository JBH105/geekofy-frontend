"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ComputersIcon from "../../../../public/image/ProfileIcon/ComputersIcon.svg";
import PrintersIcon from "../../../../public/image/ProfileIcon/PrintersIcon.svg";
import WiFiNetworkingIcon from "../../../../public/image/ProfileIcon/WiFiNetworkingIcon.svg";
import MobilesTabletsIcon from "../../../../public/image/ProfileIcon/MobilesTabletsIcon.svg";
import CheckRoundIcon from "../../../../public/image/ProfileIcon/CheckRoundIcon.svg";

export default function ServicesTab({ business, isLoading }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRefs = useRef({});
  const scrollContainerRef = useRef(null);
  const sidebarRef = useRef(null);
  const mobileCategoriesRef = useRef(null);

  const categories = [
    { name: "Computers", icon: ComputersIcon },
    { name: "Printers", icon: PrintersIcon },
    { name: "WiFi & Networking", icon: WiFiNetworkingIcon },
    { name: "Mobiles & Tablets", icon: MobilesTabletsIcon },
    { name: "Smart Watches", icon: MobilesTabletsIcon },
    { name: "Drone", icon: MobilesTabletsIcon },
  ];

  const groupedServices = categories.reduce((acc, category) => {
    acc[category.name] =
      business?.services?.serviceCategories
        ?.flatMap((sc) => sc?.items || [])
        ?.filter((item) => item?.serviceType === category.name) || [];
    return acc;
  }, {});
  const filteredCategories = categories.filter(
    (category) => groupedServices[category.name]?.length > 0
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (filteredCategories.length > 0 && !activeCategory) {
      setActiveCategory(filteredCategories[0].name);
    }
  }, [filteredCategories, activeCategory]);

  const handleCategoryClick = (categoryName) => {
    const section = sectionRefs.current?.[categoryName];
    if (section) {
      if (isMobile) {
        // For mobile, just scroll the section into view
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (scrollContainerRef?.current) {
        // Original desktop behavior
        const scrollTop =
          section?.offsetTop - scrollContainerRef?.current?.offsetTop;
        scrollContainerRef?.current?.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
      setActiveCategory(categoryName);
    }
  };

  // Dynamic height for scroll container (desktop only)
  useEffect(() => {
    if (
      !isMobile &&
      scrollContainerRef.current &&
      sectionRefs.current[activeCategory]
    ) {
      const contentHeight = sectionRefs.current[activeCategory].offsetHeight;
      scrollContainerRef.current.style.height = `${contentHeight}px`;
    }
  }, [activeCategory, groupedServices, isMobile]);

  // Scroll handler for active category detection (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const containerTop = container.getBoundingClientRect().top;
        let currentCategory = activeCategory;
        Object.entries(sectionRefs.current).forEach(([category, section]) => {
          if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top - containerTop <= 80) {
              currentCategory = category;
            }
          }
        });
        if (currentCategory && currentCategory !== activeCategory) {
          setActiveCategory(currentCategory);
        }
      }, 50);
    };

    const initialCheck = setTimeout(() => {
      handleScroll();
    }, 100);

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(scrollTimeout);
      clearTimeout(initialCheck);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [activeCategory, isMobile]);

  if (isLoading || !business) {
    return (
      <div className="flex space-x-3 py-6 ml-5">
        {/* Sidebar Skeleton */}
        <div className="w-1/4 pr-4 border-r border-gray-200 sticky top-4 self-start">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex flex-col mb-4">
              <div className="flex items-center space-x-4 ">
                <Skeleton circle width={24} height={24} />
                <Skeleton width={120} height={18} />
              </div>
              <Skeleton height={5} width={56} className="ml-10" />
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="w-3/4">
          {[1, 2].map((category) => (
            <div key={category} className="mb-10 min-h-[20px]">
              <div className="sticky top-0 z-10 py-1 bg-white px-3 rounded-lg">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Skeleton width={120} height={16} />
                  </div>
                  <Skeleton height={5} width={56} />
                </div>
              </div>

              <div className="space-y-2 mt-2">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <Skeleton circle width={20} height={20} />
                    <div className="flex flex-col w-full">
                      <Skeleton width={150} height={15} className="mb-1" />
                      <Skeleton width={120} height={15} className="mb-1" />
                      <Skeleton width="100%" height={15} count={2} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Mobile view
  if (isMobile) {
    return (
      <div className="py-4 px-4">
        {/* Horizontal scrollable categories */}
        <div
          ref={mobileCategoriesRef}
          className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {filteredCategories?.map((category) => (
            <div
              key={category?.name}
              onClick={() => handleCategoryClick(category?.name)}
              className="flex flex-col items-center shrink-0 cursor-pointer"
            >
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg">
                <Image
                  src={category?.icon}
                  alt={`${category?.name} Icon`}
                  width={20}
                  height={20}
                />
                <div
                  className={`text-sm tracking-[0.32px] font-bold leading-6 whitespace-nowrap ${
                    activeCategory === category?.name
                      ? "text-[#0084FF]"
                      : "text-[#666666]"
                  }`}
                >
                  {category?.name}
                </div>
              </div>
              <div
                className={`border-t-5 rounded-full w-20 ml-8 ${
                  activeCategory === category?.name
                    ? "border-[#0084FF]"
                    : "border-transparent"
                }`}
              ></div>
            </div>
          ))}
        </div>

        {/* Services content */}
        <div className="mt-4">
          {filteredCategories?.map((category) => (
            <div
              key={category?.name}
              ref={(el) => (sectionRefs.current[category?.name] = el)}
              data-category={category?.name}
              className="mb-8 p-4 rounded-lg"
            >
              <div className="mb-4">
                <div className="text-sm tracking-[0.32px] font-bold text-[#666666]">
                  {category?.name}
                </div>
                <div className="border-t-5 rounded-full border-[#0084FF] w-14 mt-1"></div>
              </div>
              {groupedServices?.[category?.name]?.length > 0 ? (
                <ul className="space-y-4">
                  {groupedServices?.[category?.name]?.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Image
                        src={CheckRoundIcon}
                        alt="CheckRoundIcon"
                        width={20}
                        height={20}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm tracking-[0.32px] text-[#666666]">
                          {item?.name}
                        </span>
                        <span className="text-sm tracking-[0.32px] font-bold text-[#0084FF]">
                          {item?.amountType} ${item?.amount}
                        </span>
                        <p className="text-sm tracking-[0.32px] text-[#666666]">
                          {item?.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 text-sm">
                  No services available for this category.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Original desktop view
  return (
    <div className="flex space-x-3 py-6 ml-5">
      <div
        className="w-1/4 pr-4 border-r border-gray-200 sticky top-4 self-start"
        ref={sidebarRef}
      >
        {filteredCategories?.map((category) => (
          <div
            key={category?.name}
            onClick={() => handleCategoryClick(category?.name)}
            className="flex flex-col mb-8 cursor-pointer"
          >
            <div className="flex items-center space-x-4 mb-[2px]">
              <Image src={category?.icon} alt={`${category?.name} Icon`} />
              <div
                className={`text-sm tracking-[0.32px] font-bold leading-6 ${
                  activeCategory === category?.name
                    ? "text-[#0084FF]"
                    : "text-[#666666]"
                }`}
              >
                {category?.name}
              </div>
            </div>
            <div
              className={`border-t-5 rounded-full w-14 ml-9 ${
                activeCategory === category?.name
                  ? "border-[#0084FF]"
                  : "border-transparent"
              }`}
            ></div>
          </div>
        ))}
      </div>
      <div
        ref={scrollContainerRef}
        className="w-3/4 overflow-y-auto scroll-smooth"
        style={{ minHeight: "200px" }}
      >
        {filteredCategories?.map((category) => (
          <div
            key={category?.name}
            ref={(el) => (sectionRefs.current[category?.name] = el)}
            data-category={category?.name}
            className="mb-10"
          >
            <div className="sticky top-0 z-10 py-3 bg-white px-3 rounded-lg">
              <div className="flex flex-col">
                <div className="flex items-center space-x-4 mb-[2px]">
                  <div className="text-sm tracking-[0.32px] font-bold text-[#666666]">
                    {category?.name}
                  </div>
                </div>
                <div className="border-t-5 rounded-full border-[#0084FF] w-14"></div>
              </div>
            </div>
            {groupedServices?.[category?.name]?.length > 0 ? (
              <ul className="space-y-4 mt-4">
                {groupedServices?.[category?.name]?.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Image src={CheckRoundIcon} alt="CheckRoundIcon" />
                    <div className="flex flex-col">
                      <span className="text-sm tracking-[0.32px] text-[#666666]">
                        {item?.name}
                      </span>
                      <span className="text-sm tracking-[0.32px] font-bold text-[#0084FF]">
                        {item?.amountType} ${item?.amount}
                      </span>
                      <p className="text-sm tracking-[0.32px] text-[#666666]">
                        {item?.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400 text-sm mt-4">
                No services available for this category.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
