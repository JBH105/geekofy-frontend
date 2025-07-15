"use client";
import React, { useEffect, useState } from "react";

const mapPricingTypeToEnum = (type) => {
  switch (type.toLowerCase()) {
    case "flat fee":
      return "Flat Fee";
    case "hourly fee":
      return "Hourly Fee";
    case "starts at":
      return "Starts At";
    case "contact for pricing":
      return "Contact For Pricing";
    default:
      return "";
  }
};

const mapEnumToPricingLabel = (type) => {
  switch (type) {
    case "Flat Fee":
      return "Flat Fee";
    case "Hourly Fee":
      return "Hourly Fee";
    case "Starts At":
      return "Starts At";
    case "Contact For Pricing":
      return "Contact For Pricing";
    default:
      return "";
  }
};

const AddServiceForm = ({
  handleFormSubmit,
  initialData,
  onCancel,
  isLoading,
  isEditing,
}) => {
  const [serviceName, setServiceName] = useState("");
  const [pricingType, setPricingType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [focusedPriceInput, setFocusedPriceInput] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (initialData) {
      setServiceName(initialData?.serviceName || "");
      setDescription(initialData?.description || "");
      setPricingType(mapEnumToPricingLabel(initialData?.pricing?.type));
      setPrice(
        initialData?.pricing?.amount
          ? initialData.pricing.amount.toString()
          : ""
      );
      setIsSaved(true);
      setIsAddingNew(false);
      setShowForm(true);
    } else {
      setServiceName("");
      setPricingType("");
      setPrice("");
      setDescription("");
      setIsSaved(false);
      setShowForm(false);
    }
  }, [initialData]);

  const resetForm = () => {
    setServiceName("");
    setPricingType("");
    setPrice("");
    setDescription("");
    setIsSaved(false);
    setShowNewForm(false);
    setIsAddingNew(true); 
  };

  const handleSubmit = (e, saveAndAddNew = false) => {
    e.preventDefault();
    if (!serviceName || !pricingType) {
      alert("Please fill required fields");
      return;
    }

    handleFormSubmit({
      serviceName,
      description,
      pricing: {
        type: mapPricingTypeToEnum(pricingType),
        amount: pricingType === "Contact for Pricing" ? null : price,
      },
    });

    if (saveAndAddNew) {
      resetForm();
      setShowForm(true); 
      setIsSaved(false); 
    } else {
      setIsSaved(true);
      setIsAddingNew(false);
      setShowForm(false); 
    }
  };

  const handlePricingOptionClick = (type) => {
    setPricingType(type);
    if (type === "Contact for Pricing") {
      setPrice("");
    }
  };

  const handleAddNewService = () => {
    resetForm();
    setShowForm(true);
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
    setShowForm(false);
    setIsAddingNew(false);
  };

  const capitalizeServiceName = (input) => {
    return input
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleServiceNameChange = (e) => {
    const input = e.target.value;
    if (input.length > serviceName.length) {
      setServiceName(capitalizeServiceName(input));
    } else {
      setServiceName(input);
    }
  };

  const handlePriceChange = (e, type) => {
    const value = e.target.value;

    if (type === "Contact for Pricing") {
      setPrice("");
    } else {
      const regex = /^(\d{0,4}|\.\d{0,2}|\d{0,4}\.\d{0,2})$/;

      if (value === "" || regex.test(value)) {
        setPrice(value);
      }
    }
  };
  
  if (showNewForm) {
    return (
      <div>
        <AddServiceForm
          handleFormSubmit={handleFormSubmit}
          initialData={null}
          onCancel={onCancel}
          isLoading={isLoading}
          isEditing={false}
        />
      </div>
    );
  }

  return (
    <div>
      {showForm && (!isSaved || isEditing || isAddingNew) && (
        <div className="py-4 px-8 rounded-[10px] bg-[#FFFFFF] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),_-1px_-1px_25px_0px_rgba(0,0,0,0.05)] flex flex-col justify-start gap-4">
          {/* Service Name Input */}
          <div className="relative">
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              className="block px-3.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 peer border-[#999999]"
              placeholder=" "
              value={serviceName}
              onChange={handleServiceNameChange}
              autoComplete="off"
            />
            <label
              htmlFor="serviceName"
              className="absolute text-sm text-[#999999] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3"
            >
              Service name
            </label>
          </div>

          <div className="w-full flex flex-wrap gap-[30px] justify-start items-center">
            {["Flat Fee", "Hourly Fee", "Starts At", "Contact for Pricing"].map(
              (type, idx) => (
                <div key={idx} className="flex flex-wrap gap-3 items-center">
                  <label className="cursor-pointer flex items-center gap-3">
                    <input
                      className="h-[15px] w-[15px] border border-[#808080] text-[#808080] focus:ring-0"
                      type="radio"
                      name="pricing"
                      checked={pricingType === type}
                      onChange={() => handlePricingOptionClick(type)}
                    />
                    {type !== "Contact for Pricing" ? (
                      <div
                        className="relative"
                        onClick={(e) => {
                          if (e.target.tagName !== "INPUT") {
                            handlePricingOptionClick(type);
                          }
                        }}
                      >
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 mt-1">
                          {(focusedPriceInput === idx || price) && "$"}
                        </div>
                        <input
                          type="text"
                          id={`price-${idx}`}
                          name={`price-${idx}`}
                          className="block px-3.5 pl-6 pb-2.5 pt-4 w-[120px] text-sm bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 peer border-[#999999] cursor-pointer"
                          placeholder=" "
                          value={pricingType === type ? price : ""}
                          onChange={(e) => handlePriceChange(e, type)}
                          disabled={pricingType !== type}
                          autoComplete="off"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFocusedPriceInput(idx);
                          }}
                          onFocus={() => setFocusedPriceInput(idx)}
                          onBlur={() => setFocusedPriceInput(null)}
                        />
                        <label
                          htmlFor={`price-${idx}`}
                          className="absolute text-sm text-[#999999] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3 cursor-pointer"
                        >
                          {type}
                        </label>
                      </div>
                    ) : (
                      <span
                        className="text-[#666666] text-sm font-normal font-helvetica leading-6 not-italic"
                        onClick={() => handlePricingOptionClick(type)}
                      >
                        {type}
                      </span>
                    )}
                  </label>
                </div>
              )
            )}
          </div>

          {/* Description Input */}
          <div className="relative mb-4">
            <input
              type="text"
              id="description"
              name="description"
              className="block px-3.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 peer border-[#999999]"
              placeholder=" "
              value={description}
              onChange={(e) => setDescription(e?.target?.value)}
              autoComplete="off"
            />
            <label
              htmlFor="description"
              className="absolute text-sm text-[#999999] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3"
            >
              Add description (optional)
            </label>
          </div>
        </div>
      )}
      <div className="mt-8 flex gap-4">
        {isEditing ? (
          <div className="flex justify-end gap-4 flex-1">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="py-[15px] px-[30px] rounded-[8px] bg-[rgba(213,232,255,0.5)] flex justify-end items-center text-center text-[#4D4D4D] text-base font-bold font-helvetica leading-6 not-italic cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="py-[15px] px-[30px] rounded-[8px] bg-gray-200 flex justify-end items-center text-center text-[#4D4D4D] text-base font-bold font-helvetica leading-6 not-italic cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : showForm && (isAddingNew || !isSaved) ? (
          <div className="flex justify-between flex-1">
            <button
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading}
              className="py-[15px] px-[30px] rounded-[8px] bg-[rgba(213,232,255,0.5)] flex items-center text-center text-[#4D4D4D] text-base font-bold font-helvetica leading-6 not-italic cursor-pointer"
            >
              Save & Add New Service
            </button>
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="py-[15px] px-[30px] rounded-[8px] bg-[rgba(213,232,255,0.5)] flex items-center text-center text-[#4D4D4D] text-base font-bold font-helvetica leading-6 not-italic cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="py-[15px] px-[30px] rounded-[8px] bg-gray-200 flex items-center text-center text-[#4D4D4D] text-base font-bold font-helvetica leading-6 not-italic cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : !showForm && isSaved ? (
          <>
            <button
              onClick={handleAddNewService}
              className="py-[15px] px-[30px] rounded-[8px] bg-[rgba(213,232,255,0.5)] flex justify-end items-center text-center text-[#4D4D4D] text-base font-bold font-helvetica leading-6 not-italic cursor-pointer"
            >
              Add New Service
            </button>
            <button
              className="ml-auto py-[15px] px-[30px] rounded-[8px] bg-gray-200 flex justify-end items-center text-center text-[#4D4D4D] text-base font-bold font-helvetica leading-6 not-italic cursor-pointer"
              disabled
            >
              Saved
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleAddNewService}
              className="py-[15px] px-[30px] rounded-[8px] bg-[rgba(213,232,255,0.5)] flex justify-end items-center text-center text-[#4D4D4D] text-base font-bold font-helvetica leading-6 not-italic cursor-pointer"
            >
              Add New Service
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddServiceForm;
