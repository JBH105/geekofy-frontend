"use client";
import React, { useEffect, useRef, useState } from "react";
import CollectAndReplyToReviewForm from "./CollectAndReplyToReviewForm";

const Reviews = ({
  handleShowRateBusinessStep,
  setIsLoading,
  isLoading,
  businessName,
  activeTab,
  setActiveTab,
}) => {
  const [openAskForReviewModal, setOpenAskForReviewModal] = useState(false);
  const [seeAllCustomerReviews, setSeeAllCustomerReviews] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOpenAskForReviewModal = () => {
    setOpenAskForReviewModal(true);
  };

  const handleCloseAskForReviewModal = () => {
    setOpenAskForReviewModal(false);
  };

  const handleSeeAllCustomerReviews = () => {
    setSeeAllCustomerReviews(true);
  };

  const toggleDropdown = (e) => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <CollectAndReplyToReviewForm
        handleShowRateBusinessStep={handleShowRateBusinessStep}
        openAskForReviewModal={openAskForReviewModal}
        handleOpenAskForReviewModal={handleOpenAskForReviewModal}
        handleCloseAskForReviewModal={handleCloseAskForReviewModal}
        seeAllCustomerReviews={seeAllCustomerReviews}
        handleSeeAllCustomerReviews={handleSeeAllCustomerReviews}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
        handleCloseDropdown={handleCloseDropdown}
        dropdownRef={dropdownRef}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        businessName={businessName}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
    </>
  );
};

export default Reviews;
