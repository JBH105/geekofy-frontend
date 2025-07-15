"use client";
import React, { useState, useEffect } from "react";
import AskForReviewsModal from "./AskForReviewsModal";
import AllReviews from "./AllReviews";
import StarFillIcon from "../../../../public/image/StarFillIcon.svg";
import StarEmptyIcon from "../../../../public/image/StarEmptyIcon.svg";
import api from "@/lib/api";
import Image from "next/image";
import { getSession } from "next-auth/react";

const selectReviewStars = [
  { id: 1, text: "5 Star", value: 5 },
  { id: 2, text: "4 Star", value: 4 },
  { id: 3, text: "3 Star", value: 3 },
  { id: 4, text: "2 Star", value: 2 },
  { id: 5, text: "1 Star", value: 1 },
];

const CollectAndReplyToReviewForm = ({
  isDropdownOpen,
  toggleDropdown,
  handleCloseDropdown,
  dropdownRef,
  openAskForReviewModal,
  handleOpenAskForReviewModal,
  handleCloseAskForReviewModal,
  seeAllCustomerReviews,
  handleSeeAllCustomerReviews,
  isLoading,
  setIsLoading,
  businessName,
  setActiveTab,
  activeTab,
}) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const session = await getSession();
        const response = await api.get("/api/business/review", {
          params: { page: currentPage, limit: 10 },
          params: { sellerId: session?.user?.id },
        });
        if (response.data.success) {
          setReviews(
            Array.isArray(response.data.data.data)
              ? response.data.data.data
              : []
          );
          setCurrentPage(response.data.data.currentPage || 1);
          setTotalPages(response.data.data.totalPages || 1);
          setTotalCount(response.data.data.totalCount || 0);
        } else {
          setError("Failed to fetch reviews");
          setReviews([]);
        }
      } catch (err) {
        setError("Error fetching reviews");
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [currentPage, setIsLoading]);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const session = await getSession();
        const response = await api.get("/api/business/review/rating", {
          params: { sellerId: session?.user?.id },
        });
        if (response.data.success) {
          setAverageRating(response.data.data.averageRating || 0);
          setTotalReviews(response.data.data.totalReviews || 0);
          setRatingDistribution(
            Array.isArray(response.data.data.ratings)
              ? response.data.data.ratings
              : []
          );
        } else {
          setError("Failed to fetch average rating");
        }
      } catch (err) {
        setError("Error fetching average rating");
      }
    };
    fetchAverageRating();
  }, []);

  const handleFilterChange = (id) => {
    if (selectedFilters.includes(id)) {
      setSelectedFilters(selectedFilters.filter((filterId) => filterId !== id));
    } else {
      setSelectedFilters([...selectedFilters, id]);
    }
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredReviews = selectedFilters.length
    ? Array.isArray(reviews)
      ? reviews.filter((review) =>
          selectedFilters.includes(
            selectReviewStars.find((star) => star.value === review.rating)?.id
          )
        )
      : []
    : reviews;

  return (
    <>
      <div
        className="bg-white rounded-2xl p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]"
        style={{
          boxShadow:
            "1px 1px 25px 0px rgba(0, 0, 0, 0.05), -1px -1px 25px 0px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="flex justify-between items-center mb-1">
          <div
            className="text-lg font-semibold text-[#666666] leading-5 mb-2"
            style={{ letterSpacing: "0.2px" }}
          >
            Collect & Reply to Review
          </div>
        </div>
        <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-8"></div>
        <div className="mb-8 flex justify-start flex-col gap-7">
          <p className="text-[#666666] text-base font-normal leading-6 font-helvetica text-start">
            Ask past customers to leave review for your business on Geekofy
          </p>
          <p className="text-[#666666] text-base font-normal leading-6 font-helvetica text-start">
            Get more reviews and get better exposure
          </p>
          <button
            onClick={handleOpenAskForReviewModal}
            disabled={totalReviews >= 5}
            className={`w-full max-w-max rounded-[8px] ${
              totalReviews >= 5 ? "bg-[#B3B3B3]" : "bg-[#0084FF]"
            } py-3 px-6 flex justify-center items-center text-[#FFFFFF] text-[14px] font-normal font-helvetica leading-6 tracking-[0.14px] ${
              totalReviews >= 5 ? "cursor-default" : "cursor-pointer"
            }`}
          >
            Ask for reviews
          </button>
        </div>
        <div>
          <div className="mb-[30px] flex gap-[10px] items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <Image
                    key={index}
                    src={
                      starValue <= Math.round(averageRating)
                        ? StarFillIcon
                        : StarEmptyIcon
                    }
                    alt={
                      starValue <= Math.round(averageRating)
                        ? "Filled star"
                        : "Empty star"
                    }
                  />
                );
              })}
            </div>
            <p className="text-[#666666] text-base font-normal font-helvetica">
              {totalReviews > 0
                ? `${averageRating.toFixed(1)} (${totalReviews} Review${
                    totalReviews !== 1 ? "s" : ""
                  }) Overall Satisfaction Rating`
                : "No Reviews"}
            </p>
          </div>
          <div>
            <div className="flex flex-col justify-start">
              {selectReviewStars?.map((item) => {
                const rating = ratingDistribution.find(
                  (r) => r.rating === item.value
                );
                const reviewCount = rating ? rating.count : 0;
                const percentage = rating ? rating.percentage : 0;
                return (
                  <div key={item?.id} className="flex gap-5 items-center">
                    <div className="flex gap-[5px] items-center">
                      <input
                        type="checkbox"
                        className="mr-[2px] h-[18px] w-[14px] cursor-pointer"
                        checked={selectedFilters.includes(item.id)}
                        onChange={() => handleFilterChange(item.id)}
                      />
                      <p className="text-[#808080] text-[14px] font-normal font-helvetica leading-6 tracking-[0.14px]">
                        {item?.text} ({reviewCount})
                      </p>
                    </div>
                    <div className="h-[10px] shrink-0 w-[136.919px] bg-[#D9D9D9] relative">
                      <div
                        className="h-full bg-[#0084FF] absolute top-0 left-0"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedFilters.length > 0 && (
              <button
                onClick={handleClearFilters}
                className="mt-4 py-[5px] px-[10px] bg-[#F7F7F7] rounded-[6px] border border-[#999999] inline-flex gap-[5px] items-center cursor-pointer"
              >
                <p className="flex w-[10px] h-[16.344px] rotate-[-45deg] flex-col justify-center text-[#666666] text-xl font-medium leading-normal">
                  +
                </p>
                <p className="text-[#666666] text-[14px] font-normal font-helvetica leading-5">
                  Clear Filters
                </p>
              </button>
            )}
          </div>
        </div>
        {!seeAllCustomerReviews && (
          <button
            onClick={handleSeeAllCustomerReviews}
            className="mt-8 text-[#0084FF] text-base font-normal font-helvetica leading-6 cursor-pointer"
          >
            See all customer reviews
          </button>
        )}
        {seeAllCustomerReviews && (
          <div className="mt-[80px]">
            {isLoading ? (
              <p>Loading reviews...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <AllReviews
                reviews={filteredReviews}
                isDropdownOpen={isDropdownOpen}
                toggleDropdown={toggleDropdown}
                handleCloseDropdown={handleCloseDropdown}
                dropdownRef={dropdownRef}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                businessName={businessName}
              />
            )}
          </div>
        )}
      </div>
      {!seeAllCustomerReviews && (
        <div className="mt-[100px] flex gap-8 justify-end items-center">
          <button
            onClick={() => setActiveTab("business-details")}
            className={`flex items-center justify-center self-stretch px-[36px] py-[12px] rounded-[8px] border border-[#666666] bg-[#E6E6E6] cursor-pointer`}
          >
            <span className="text-center text-black font-helvetica text-[16px] font-normal leading-[24px]">
              Previous
            </span>
          </button>
          <button
            onClick={() => setActiveTab("business-services")}
            className={`flex items-center justify-center self-stretch w-[134px] py-[12px] rounded-[8px] bg-[#1C273B] cursor-pointer`}
          >
            <span className="text-white text-center font-helvetica text-[16px] font-normal leading-[24px]">
              Next
            </span>
          </button>
        </div>
      )}
      {openAskForReviewModal && (
        <AskForReviewsModal
          onClose={handleCloseAskForReviewModal}
          businessName={businessName}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
};

export default CollectAndReplyToReviewForm;
