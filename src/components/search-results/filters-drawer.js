"use client";
import { motion } from "framer-motion";
import SidebarHeader from "./sidebar/sidebar-header";
import SidebarRatingSelector from "./sidebar/sidebar-rating-selector";
import RadioInput from "./sidebar/radioButton";
import { useState } from "react";
import CustomDropdown from "./customDropdown";

const FiltersDrawer = ({ setShowFilters }) => {
  // Consolidated filter state
  const [selectedFilters, setSelectedFilters] = useState({
    availability: [],
    customerReviews: 4,
    pricing: [],
    priceRanges: { "Flat Fee": "", "Hourly Fee": "", "Starts At": "" },
    minPrices: { "Flat Fee": "", "Hourly Fee": "", "Starts At": "" },
    maxPrices: { "Flat Fee": "", "Hourly Fee": "", "Starts At": "" },
    usage: [],
    payment: [],
    employee: [],
    years: "12",
    supportType: [],
  });

  const yearsOptions = Array.from({ length: 20 }, (_, i) => (i + 1).toString());

  // Handlers for filter changes
  const handleRadioChange = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const handleStarClick = (rating) => {
    setSelectedFilters((prev) => ({ ...prev, customerReviews: rating }));
  };

  const handleYearsChange = (value) => {
    setSelectedFilters((prev) => ({ ...prev, years: value }));
  };

  const handlePriceRangeChange = (pricingOption, range) => {
    setSelectedFilters((prev) => ({
      ...prev,
      priceRanges: { ...prev.priceRanges, [pricingOption]: range },
      ...(range !== "Custom" && {
        minPrices: { ...prev.minPrices, [pricingOption]: "" },
        maxPrices: { ...prev.maxPrices, [pricingOption]: "" },
      }),
    }));
  };

  const handleMinPriceChange = (pricingOption, value) => {
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setSelectedFilters((prev) => ({
        ...prev,
        minPrices: { ...prev.minPrices, [pricingOption]: value },
        priceRanges: { ...prev.priceRanges, [pricingOption]: "Custom" },
      }));
    }
  };

  const handleMaxPriceChange = (pricingOption, value) => {
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setSelectedFilters((prev) => ({
        ...prev,
        maxPrices: { ...prev.maxPrices, [pricingOption]: value },
        priceRanges: { ...prev.priceRanges, [pricingOption]: "Custom" },
      }));
    }
  };

  const handleClearSupportType = () => {
    setSelectedFilters((prev) => ({ ...prev, supportType: [] }));
  };


  const isGoButtonActive = (pricingOption) => {
    const min = selectedFilters.minPrices[pricingOption];
    const max = selectedFilters.maxPrices[pricingOption];
    return (
      selectedFilters.priceRanges[pricingOption] === "Custom" &&
      min !== "" &&
      max !== "" &&
      parseInt(min) >= 0 &&
      parseInt(max) > 0 &&
      parseInt(min) <= parseInt(max)
    );
  };

  const handleGoClick = (pricingOption) => {
    const min = parseInt(selectedFilters.minPrices[pricingOption]) || 0;
    const max = parseInt(selectedFilters.maxPrices[pricingOption]) || 0;
    if (min > max) {
      alert("Minimum price cannot be greater than maximum price.");
      return;
    }
    console.log(`Applying custom range for ${pricingOption}: Min $${min} - Max $${max}`);
  };

  // Clear handlers
  const handleClearAvailability = () => {
    setSelectedFilters((prev) => ({ ...prev, availability: [] }));
  };

  const handleClearReviews = () => {
    setSelectedFilters((prev) => ({ ...prev, customerReviews: 4 }));
  };

  const handleClearPricing = () => {
    setSelectedFilters((prev) => ({
      ...prev,
      pricing: [],
      priceRanges: { "Flat Fee": "", "Hourly Fee": "", "Starts At": "" },
      minPrices: { "Flat Fee": "", "Hourly Fee": "", "Starts At": "" },
      maxPrices: { "Flat Fee": "", "Hourly Fee": "", "Starts At": "" },
    }));
  };

  const handleClearUsage = () => {
    setSelectedFilters((prev) => ({ ...prev, usage: [] }));
  };

  const handleClearPayment = () => {
    setSelectedFilters((prev) => ({ ...prev, payment: [] }));
  };

  const handleClearEmployee = () => {
    setSelectedFilters((prev) => ({ ...prev, employee: [] }));
  };

  const handleClearYears = () => {
    setSelectedFilters((prev) => ({ ...prev, years: "12" }));
  };

  const handleApplyFilters = () => {
    console.log("Applied Filters:", selectedFilters);
    setShowFilters(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex bg-black bg-opacity-30 backdrop-blur-sm lg:hidden"
      onClick={() => setShowFilters(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.25 }}
        className="w-full sm:w-4/5 max-w-sm h-full bg-white overflow-y-auto sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-blue-600 text-white p-3 sm:p-4 flex items-center justify-between">
          <button
            className="flex items-center gap-2"
            onClick={() => setShowFilters(false)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-semibold text-base sm:text-lg">Back</span>
          </button>
          <button
            onClick={handleApplyFilters}
            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-md text-sm sm:text-base"
          >
            Apply Filters
          </button>
        </div>
        <div className="space-y-6 mt-4 sm:mt-6 px-4">
          {/* Availability */}
          <div>
            <SidebarHeader
              text="Availability"
              handleClear={handleClearAvailability}
              showClear={selectedFilters.availability.length > 0}
            />
            <div className="mt-2 space-y-2">
              {["Open Now", "By Appointment", "24/7 open"].map((label) => (
                <RadioInput
                  key={label}
                  type="checkbox"
                  name="availability"
                  value={label.replace(/\s/g, "")}
                  label={label}
                  onChange={() =>
                    handleRadioChange("availability", label.replace(/\s/g, ""))
                  }
                  checked={selectedFilters.availability.includes(
                    label.replace(/\s/g, "")
                  )}
                />
              ))}
            </div>
          </div>

          {/* Customer Reviews */}
          <div>
            <SidebarHeader
              text="Reviews"
              handleClear={handleClearReviews}
              showClear={selectedFilters.customerReviews !== 4}
            />
            <SidebarRatingSelector
              selectedRating={selectedFilters.customerReviews}
              handleStarClick={handleStarClick}
            />
          </div>

          {/* Pricing */}
          <div>
            <SidebarHeader
              text="Pricing"
              handleClear={handleClearPricing}
              showClear={
                selectedFilters.pricing.length > 0 ||
                Object.values(selectedFilters.priceRanges).some(
                  (range) => range !== ""
                ) ||
                Object.values(selectedFilters.minPrices).some(
                  (value) => value !== ""
                ) ||
                Object.values(selectedFilters.maxPrices).some(
                  (value) => value !== ""
                )
              }
            />
            <div className="mt-2 space-y-2">
              {[
                "Flat Fee",
                "Hourly Fee",
                "Starts At",
                "Contact For Pricing",
              ].map((label) => (
                <div key={label} className="mb-2">
                  <RadioInput
                    type="checkbox"
                    name="pricing"
                    value={label}
                    label={label}
                    onChange={() => handleRadioChange("pricing", label)}
                    checked={selectedFilters.pricing.includes(label)}
                  />
                  {selectedFilters.pricing.includes(label) &&
                    label !== "Contact For Pricing" && (
                      <div className="ml-6 mt-2 space-y-2">
                        {["Under $70", "$70 - $100", "Above $100"].map(
                          (range) => (
                            <RadioInput
                              key={range}
                              type="radio"
                              name={`priceRange-${label}`}
                              value={range}
                              label={range}
                              onChange={() =>
                                handlePriceRangeChange(label, range)
                              }
                              checked={
                                selectedFilters.priceRanges[label] === range
                              }
                            />
                          )
                        )}
                        <div className="flex items-center gap-2">
                          <RadioInput
                            type="radio"
                            name={`priceRange-${label}`}
                            value="Custom"
                            label=""
                            onChange={() =>
                              handlePriceRangeChange(label, "Custom")
                            }
                            checked={
                              selectedFilters.priceRanges[label] === "Custom"
                            }
                          />
                          <div className="flex items-center gap-1">
                            <div
                              className={`flex items-center px-1 py-[2px] gap-[4px] border border-[#CCC] rounded ${
                                selectedFilters.priceRanges[label] !== "Custom"
                                  ? "bg-gray-100"
                                  : ""
                              }`}
                            >
                              <span className="text-[#666] text-[14px] leading-6 font-normal">
                                $
                              </span>
                              <input
                                type="number"
                                placeholder="Min"
                                value={selectedFilters.minPrices[label]}
                                onChange={(e) =>
                                  handleMinPriceChange(label, e.target.value)
                                }
                                disabled={
                                  selectedFilters.priceRanges[label] !==
                                  "Custom"
                                }
                                className="w-[35px] text-[14px] leading-6 font-normal text-[#999] bg-transparent focus:outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                min="0"
                              />
                            </div>
                            <div
                              className={`flex items-center px-1 py-[2px] gap-[4px] border border-[#CCC] rounded ${
                                selectedFilters.priceRanges[label] !== "Custom"
                                  ? "bg-gray-100"
                                  : ""
                              }`}
                            >
                              <span className="text-[#666] text-[14px] leading-6 font-normal">
                                $
                              </span>
                              <input
                                type="number"
                                placeholder="Max"
                                value={selectedFilters.maxPrices[label]}
                                onChange={(e) =>
                                  handleMaxPriceChange(label, e.target.value)
                                }
                                disabled={
                                  selectedFilters.priceRanges[label] !==
                                  "Custom"
                                }
                                className="w-[39px] text-[14px] leading-6 font-normal text-[#999] bg-transparent focus:outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                min="0"
                              />
                            </div>
                            <button
                              onClick={() => handleGoClick(label)}
                              disabled={!isGoButtonActive(label)}
                              className={`flex items-center justify-center gap-1 px-1 py-[2px] border rounded text-[14px] leading-6 font-normal transition-colors duration-200 ${
                                isGoButtonActive(label)
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "text-[#666] border-[#CCC] disabled:text-gray-400 disabled:bg-gray-100"
                              }`}
                            >
                              Go
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* Support Type - New Section */}
          <div>
            <SidebarHeader
              text="Support Type"
              handleClear={handleClearSupportType}
              showClear={selectedFilters.supportType.length > 0}
            />
            <div className="mt-2 space-y-2">
              {[
                "House Call",
                "Pick & Drop",
                "Remote Support",
                "Local Instore Support",
              ].map((label) => (
                <RadioInput
                  key={label}
                  type="checkbox"
                  name="supportType"
                  value={label.replace(/\s/g, "")}
                  label={label}
                  onChange={() =>
                    handleRadioChange("supportType", label.replace(/\s/g, ""))
                  }
                  checked={selectedFilters.supportType.includes(
                    label.replace(/\s/g, "")
                  )}
                />
              ))}
            </div>
          </div>

          {/* Usage Type */}
          <div>
            <SidebarHeader
              text="Usage Type"
              handleClear={handleClearUsage}
              showClear={selectedFilters.usage.length > 0}
            />
            <div className="mt-2 space-y-2">
              {["Personal Use", "Business Use"].map((label) => (
                <RadioInput
                  key={label}
                  type="checkbox"
                  name="usage"
                  value={label.replace(/\s/g, "")}
                  label={label}
                  onChange={() =>
                    handleRadioChange("usage", label.replace(/\s/g, ""))
                  }
                  checked={selectedFilters.usage.includes(
                    label.replace(/\s/g, "")
                  )}
                />
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <SidebarHeader
              text="Payment Method"
              handleClear={handleClearPayment}
              showClear={selectedFilters.payment.length > 0}
            />
            <div className="mt-2 space-y-2">
              {[
                "Cash",
                "Credit Card",
                "PayPal",
                "Apple Pay",
                "Google Pay",
                "Zelle Pay",
                "Klarna",
                "Cryptocurrency",
              ].map((label) => (
                <RadioInput
                  key={label}
                  type="checkbox"
                  name="payment"
                  value={label.replace(/\s/g, "")}
                  label={label}
                  onChange={() =>
                    handleRadioChange("payment", label.replace(/\s/g, ""))
                  }
                  checked={selectedFilters.payment.includes(
                    label.replace(/\s/g, "")
                  )}
                />
              ))}
            </div>
          </div>

          {/* Employee Strength */}
          <div>
            <SidebarHeader
              text="Employee Strength"
              handleClear={handleClearEmployee}
              showClear={selectedFilters.employee.length > 0}
            />
            <div className="mt-2 space-y-2">
              {["Solo", "2 - 5", "6 - 10", "11 - 20", "20 - 50", "50+"].map(
                (label) => (
                  <RadioInput
                    key={label}
                    type="checkbox"
                    name="employee"
                    value={label.replace(/\s/g, "")}
                    label={label}
                    onChange={() =>
                      handleRadioChange("employee", label.replace(/\s/g, ""))
                    }
                    checked={selectedFilters.employee.includes(
                      label.replace(/\s/g, "")
                    )}
                  />
                )
              )}
            </div>
          </div>

          {/* Years in Business */}
          <div>
            <SidebarHeader
              text="Years in Business"
              handleClear={handleClearYears}
              showClear={selectedFilters.years !== "12"}
            />
            <div className="my-3 flex items-center gap-2">
              <CustomDropdown
                options={yearsOptions}
                defaultValue={selectedFilters.years}
                onChange={handleYearsChange}
                customStyle="py-[10px] px-[20px] h-10 w-20 border border-gray-300 rounded-md text-gray-600 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-[#666] font-helvetica text-[14px] font-normal leading-6">
                Years
              </span>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md text-sm sm:text-base"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FiltersDrawer;