"use client";
import React, { useState } from "react";
import SidebarHeader from "./sidebar-header";
import SidebarRatingSelector from "./sidebar-rating-selector";
import { usePathname } from "next/navigation";
import RadioInput from "./radioButton";
import CustomDropdown from "../customDropdown";

const FilterSidebar = () => {
  // State for Reviews
  const [selectedRating, setSelectedRating] = useState(4);

  // State for Availability checkboxes
  const [availability, setAvailability] = useState([]);

  // State for Pricing
  const [pricingOptions, setPricingOptions] = useState([]);
  const [priceRanges, setPriceRanges] = useState({
    "Flat Fee": "",
    "Hourly Fee": "",
    "Starts At": "",
  });
  const [minPrices, setMinPrices] = useState({
    "Flat Fee": "",
    "Hourly Fee": "",
    "Starts At": "",
  });
  const [maxPrices, setMaxPrices] = useState({
    "Flat Fee": "",
    "Hourly Fee": "",
    "Starts At": "",
  });

  // State for Support Type checkboxes
  const [supportType, setSupportType] = useState([]);

  // State for Usage Type checkboxes
  const [usageType, setUsageType] = useState([]);

  // State for Payment Method checkboxes
  const [paymentMethod, setPaymentMethod] = useState([]);

  // State for Employee Strength checkboxes
  const [employeeStrength, setEmployeeStrength] = useState([]);

  // State for Years in Business
  const [yearsInBusiness, setYearsInBusiness] = useState(12);
  const yearsOptions = Array.from({ length: 20 }, (_, i) => (i + 1).toString());

  // Handler for Availability checkboxes
  const handleAvailabilityChange = (event) => {
    const value = event.target.value;
    setAvailability((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Handler for Pricing checkboxes
  const handlePricingChange = (event) => {
    const value = event.target.value;
    setPricingOptions((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Handler for Price Range radio buttons
  const handlePriceRangeChange = (pricingOption, range) => {
    setPriceRanges((prev) => ({
      ...prev,
      [pricingOption]: range,
    }));
    if (range !== "Custom") {
      setMinPrices((prev) => ({ ...prev, [pricingOption]: "" }));
      setMaxPrices((prev) => ({ ...prev, [pricingOption]: "" }));
    }
  };

  // Handlers for Min/Max inputs with validation
  const handleMinPriceChange = (pricingOption, value) => {
    // Allow only positive numbers or empty string
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setMinPrices((prev) => ({ ...prev, [pricingOption]: value }));
      setPriceRanges((prev) => ({ ...prev, [pricingOption]: "Custom" }));
    }
  };

  const handleMaxPriceChange = (pricingOption, value) => {
    // Allow only positive numbers or empty string
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setMaxPrices((prev) => ({ ...prev, [pricingOption]: value }));
      setPriceRanges((prev) => ({ ...prev, [pricingOption]: "Custom" }));
    }
  };

  // Validate and handle Go button click
  const handleGoClick = (pricingOption) => {
    const min = parseInt(minPrices[pricingOption]) || 0;
    const max = parseInt(maxPrices[pricingOption]) || 0;

    if (min > max) {
      alert("Minimum price cannot be greater than maximum price.");
      return;
    }

    if (min >= 0 && max > 0) {
      console.log(
        `Applying custom range for ${pricingOption}: Min $${min} - Max $${max}`
      );
    }
  };

  // Check if Go button should be active
  const isGoButtonActive = (pricingOption) => {
    const min = minPrices[pricingOption];
    const max = maxPrices[pricingOption];
    return (
      priceRanges[pricingOption] === "Custom" &&
      min !== "" &&
      max !== "" &&
      parseInt(min) >= 0 &&
      parseInt(max) > 0 &&
      parseInt(min) <= parseInt(max)
    );
  };

  // Handler for Support Type checkboxes
  const handleSupportTypeChange = (event) => {
    const value = event.target.value;
    setSupportType((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Handler for Usage Type checkboxes
  const handleUsageTypeChange = (event) => {
    const value = event.target.value;
    setUsageType((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Handler for Payment Method checkboxes
  const handlePaymentMethodChange = (event) => {
    const value = event.target.value;
    setPaymentMethod((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Handler for Employee Strength checkboxes
  const handleEmployeeStrengthChange = (event) => {
    const value = event.target.value;
    setEmployeeStrength((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Handler for Years in Business
  const handleYearsChange = (selectedMonth) => {
    setYearsInBusiness(selectedMonth);
  };

  // Clear handlers for each section
  const handleClearReviews = () => {
    setSelectedRating(4);
  };

  const handleClearAvailability = () => {
    setAvailability([]);
  };

  const handleClearPricing = () => {
    setPricingOptions([]);
    setPriceRanges({
      "Flat Fee": "",
      "Hourly Fee": "",
      "Starts At": "",
    });
    setMinPrices({
      "Flat Fee": "",
      "Hourly Fee": "",
      "Starts At": "",
    });
    setMaxPrices({
      "Flat Fee": "",
      "Hourly Fee": "",
      "Starts At": "",
    });
  };

  const handleClearSupportType = () => {
    setSupportType([]);
  };

  const handleClearUsageType = () => {
    setUsageType([]);
  };

  const handleClearPaymentMethod = () => {
    setPaymentMethod([]);
  };

  const handleClearEmployeeStrength = () => {
    setEmployeeStrength([]);
  };

  const handleClearYearsInBusiness = () => {
    setYearsInBusiness(12);
  };

  const pathname = usePathname();
  const hiddenRoutes = ["/"];

  if (hiddenRoutes.includes(pathname)) return null;

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
  };

  return (
    <div className="hidden lg:flex flex-col items-start gap-[16px] w-[262px] px-[30px] py-[12px] rounded-[15px] bg-white shadow-[1px_1px_25px_rgba(0,0,0,0.05),_-1px_-1px_25px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col m-0 p-0 gap-y-4 w-full">
        {/* Availability Section */}
        <div className="flex flex-col items-start gap-[8px]">
          <SidebarHeader
            text="Availability"
            handleClear={handleClearAvailability}
            showClear={availability.length > 0}
          />
          <div className="">
            {["Open Now", "By Appointment", "24/7 open"].map((label) => (
              <RadioInput
                key={label}
                type="checkbox"
                name="availability"
                value={label.replace(/\s/g, "")}
                label={label}
                onChange={handleAvailabilityChange}
                checked={availability.includes(label.replace(/\s/g, ""))}
              />
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <SidebarHeader
            text="Reviews"
            handleClear={handleClearReviews}
            showClear={selectedRating !== 4}
          />
          <SidebarRatingSelector
            selectedRating={selectedRating}
            handleStarClick={handleStarClick}
          />
        </div>

        {/* Pricing Section */}
        <div>
          <SidebarHeader
            text="Pricing"
            handleClear={handleClearPricing}
            showClear={
              pricingOptions.length > 0 ||
              Object.values(priceRanges).some((range) => range !== "") ||
              Object.values(minPrices).some((value) => value !== "") ||
              Object.values(maxPrices).some((value) => value !== "")
            }
          />
          <div className="mt-2 space-y-2">
            {["Flat Fee", "Hourly Fee", "Starts At", "Contact For Pricing"].map(
              (label) => (
                <div key={label} className="mt-[0px] mb-1">
                  <RadioInput
                    type="checkbox"
                    name="pricing"
                    value={label}
                    label={label}
                    onChange={handlePricingChange}
                    checked={pricingOptions.includes(label)}
                  />
                  {pricingOptions.includes(label) &&
                    label !== "Contact For Pricing" && (
                      <div className="ml-6 mt-[0px] mb-[0px] space-y-2 w-[180px]">
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
                              checked={priceRanges[label] === range}
                            />
                          )
                        )}
                        <div className="flex items-center gap-2">
                          {/* Custom Radio with Min/Max Inputs & Go Button */}
                          <div className="flex items-center gap-2">
                            <RadioInput
                              type="radio"
                              name={`priceRange-${label}`}
                              value="Custom"
                              label=""
                              onChange={() =>
                                handlePriceRangeChange(label, "Custom")
                              }
                              checked={priceRanges[label] === "Custom"}
                            />
                            <div className="flex items-center gap-1">
                              {/* Min Input */}
                              <div
                                className={`flex items-center px-1 py-[2px] gap-[4px] border border-[#CCC] rounded ${
                                  priceRanges[label] !== "Custom"
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
                                  value={minPrices[label]}
                                  onChange={(e) =>
                                    handleMinPriceChange(label, e.target.value)
                                  }
                                  disabled={priceRanges[label] !== "Custom"}
                                  className="w-[35px] text-[14px] leading-6 font-normal text-[#999] text-left bg-transparent focus:outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                  min="0"
                                />
                              </div>

                              {/* Max Input */}
                              <div
                                className={`flex items-center px-1 py-[2px] gap-[4px] border border-[#CCC] rounded ${
                                  priceRanges[label] !== "Custom"
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
                                  value={maxPrices[label]}
                                  onChange={(e) =>
                                    handleMaxPriceChange(label, e.target.value)
                                  }
                                  disabled={priceRanges[label] !== "Custom"}
                                  className="w-[39px] text-[14px] leading-6 font-normal text-[#999] text-left bg-transparent focus:outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                  min="0"
                                />
                              </div>

                              {/* Go Button */}
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
                      </div>
                    )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Support Type Section */}
        <div>
          <SidebarHeader
            text="Support Type"
            handleClear={handleClearSupportType}
            showClear={supportType.length > 0}
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
                name="support"
                value={label.replace(/\s/g, "")}
                label={label}
                onChange={handleSupportTypeChange}
                checked={supportType.includes(label.replace(/\s/g, ""))}
              />
            ))}
          </div>
        </div>

        {/* Usage Type Section */}
        <div>
          <SidebarHeader
            text="Usage Type"
            handleClear={handleClearUsageType}
            showClear={usageType.length > 0}
          />
          <div className="mt-2 space-y-2">
            {["Personal Use", "Business Use"].map((label) => (
              <RadioInput
                key={label}
                type="checkbox"
                name="usage"
                value={label.replace(/\s/g, "")}
                label={label}
                onChange={handleUsageTypeChange}
                checked={usageType.includes(label.replace(/\s/g, ""))}
              />
            ))}
          </div>
        </div>

        {/* Payment Method Section */}
        <div>
          <SidebarHeader
            text="Payment Method"
            handleClear={handleClearPaymentMethod}
            showClear={paymentMethod.length > 0}
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
                onChange={handlePaymentMethodChange}
                checked={paymentMethod.includes(label.replace(/\s/g, ""))}
              />
            ))}
          </div>
        </div>

        {/* Employee Strength Section */}
        <div>
          <SidebarHeader
            text="Employee Strength"
            handleClear={handleClearEmployeeStrength}
            showClear={employeeStrength.length > 0}
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
                  onChange={handleEmployeeStrengthChange}
                  checked={employeeStrength.includes(label.replace(/\s/g, ""))}
                />
              )
            )}
          </div>
        </div>

        {/* Years in Business Section */}
        <div>
          <SidebarHeader
            text="Years in Business"
            handleClear={handleClearYearsInBusiness}
            showClear={yearsInBusiness !== 12}
          />
          <div className="mt-3 flex items-center gap-2">
            <CustomDropdown
              options={yearsOptions}
              defaultValue={yearsInBusiness}
              onChange={handleYearsChange}
              customStyle="py-[10px] px-[20px]"
            />
            <span className="text-[#666] font-helvetica text-[14px] font-normal leading-6">
              Years
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
