"use client";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import SearchResultCard from "@/components/search-results/search-result-card";
import FiltersDrawer from "@/components/search-results/filters-drawer";
import FilterSidebar from "@/components/search-results/sidebar/filter-sidebar";
import CloseIcon from "../../../public/image/landingPage/closeIcon.svg";
import Image from "next/image";
import CustomDropdown from "@/components/search-results/customDropdown";
import FilterIcon from "../../../public/image/landingPage/filterIcon.svg";
import SortingIcon from "../../../public/image/landingPage/sortingIcon.svg";
import SortByDrawer from "@/components/search-results/SortByDrawer";
import SellerProfileHeader from "@/components/seller-profile/SellerProfileHeader";

const options = [
  "Relevance",
  "Newest First",
  "Price: Low to High",
  "Price: High to Low",
];

const Page = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("Relevance");
  const [showSortBy, setShowSortBy] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("");

  const handleSortChange = (value) => {
    console.log("Selected sort option:", value);
    setSortBy(value);
  };

  const array = [...Array(2)];

  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showFilters]);

  return (
    <React.Fragment>
      <SellerProfileHeader />
      <div className="layout_container mx-auto mb-2 px-3 sm:px-4 lg:px-20">
        <div className="flex flex-col sm:flex-row py-1 sm:py-2 justify-between items-start sm:items-center gap-3 sm:gap-4">
          <h5 className="text-[#666666] text-justify font-sans text-xs sm:text-[13px] lg:text-[14px] font-normal leading-5 sm:leading-6">
            Showing Results For: Search term comes here
          </h5>
          <CustomDropdown
            options={options}
            defaultValue={sortBy}
            label="Sort by:"
            showLabel={true}
            onChange={handleSortChange}
            customStyle="p-1 sm:p-2 lg:p-3"
            largeDropdown={true}
            hideOnMobile={true}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
          <div className="flex flex-col items-center justify-center gap-1">
            <FilterSidebar />
            <button className="my-4 sm:my-5 w-[262px] hidden lg:inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 lg:px-6 py-2 sm:py-3 rounded-md border border-[#CCC]">
              <Image
                src={CloseIcon}
                alt="Close Icon"
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2 lg:h-2 aspect-square fill-[#808080]"
              />
              <span className="text-[#808080] text-sm sm:text-base lg:text-base leading-5 sm:leading-6 font-normal">
                Clear All Filters
              </span>
            </button>
          </div>
          <div className="flex-1">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {array.map((_, i) => (
                <SearchResultCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-10 w-full bg-white border-y border-gray-100 lg:hidden">
        <div className="flex divide-x divide-gray-300">
          {/* Filters Button */}
          <button
            className="flex items-center gap-2 flex-1 px-4 py-2 bg-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            {/* Filter Icon */}
            <Image src={FilterIcon} alt="Filter Icon" width={20} height={20} />

            {/* Text Content */}
            <div className="flex flex-col items-start">
              <span className="text-blue-600 font-semibold text-sm sm:text-base">
                Filters
              </span>
              <span className="text-gray-500 text-xs sm:text-sm">
                No Filters Applied
              </span>
            </div>
          </button>

          {/* Sort By Button */}
          <button
            className="flex items-center gap-2 flex-1 px-4 py-2 bg-white"
            onClick={() => setShowSortBy(!showSortBy)} 
          >
            <Image
              src={SortingIcon}
              alt="sorting Icon"
              width={20}
              height={20}
            />

            {/* Text Content */}
            <div className="flex flex-col items-start">
              <span className="text-blue-600 font-semibold text-sm sm:text-base">
                Sort By
              </span>
              <span className="text-gray-500 text-xs sm:text-sm">
                {selectedSortOption || "No Filters Applied"}{" "}
                {/* Show selected option or default text */}
              </span>
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {showFilters && <FiltersDrawer setShowFilters={setShowFilters} />}
        <SortByDrawer
          showSortBy={showSortBy}
          setShowSortBy={setShowSortBy}
          selectedSortOption={selectedSortOption}
          setSelectedSortOption={setSelectedSortOption}
        />
      </AnimatePresence>
    </React.Fragment>
  );
};

export default Page;
