"use client";

import { useState, useEffect } from "react";
import StarFillIcon from "../../../public/image/StarFillIcon.svg";
import StarEmptyIcon from "../../../public/image/StarEmptyIcon.svg";
import ThumspIcon from "../../../public/image/ThumspIcon.svg";
import ThumspLikeIcon from "../../../public/image/ThumspLikeIcon.svg";
import ChateReplayIcon from "../../../public/image/ChateReplayIcon.svg";
import Profile from "../../../public/image/Profile.svg";
import DropDownArrow from "../../../public/image/DropDownArrow.svg";
import Image from "next/image";
import { getSession } from "next-auth/react";
import api from "@/lib/api";


export default function Reviews() {
  const [sortBy, setSortBy] = useState("Most Recent");
  const [filterBy, setFilterBy] = useState("None");
  const [isDropdownOpenSort, setIsDropdownOpenSort] = useState(false);
  const [isDropdownOpenFilter, setIsDropdownOpenFilter] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSortChange = (option) => {
    setSortBy(option);
    setIsDropdownOpenSort(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpenSort(!isDropdownOpenSort);
  };

  const toggleDropdownFilter = () => {
    setIsDropdownOpenFilter(!isDropdownOpenFilter);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const session = await getSession();
        const response = await api.get("/api/business/review", {
          params: {
            page: currentPage,
            limit: 10,
            sellerId: session?.user?.id,
            sort:
              sortBy === "Most Recent"
                ? "createdAt:desc"
                : sortBy === "Most Liked"
                ? "likesCount:desc"
                : sortBy === "Oldest"
                ? "createdAt:asc"
                : "",
            rating:
              filterBy === "None"
                ? ""
                : filterBy === "5 Stars"
                ? 5
                : filterBy === "4 Stars"
                ? 4
                : filterBy === "3 Stars"
                ? 3
                : filterBy === "2 Stars"
                ? 2
                : filterBy === "1 Stars"
                ? 1
                : filterBy === "Like"
                ? "hasLiked"
                : "",
          },
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
  }, [currentPage, sortBy, filterBy]);

  const handleHelpfulClick = (reviewId) => {
    // Implement API call to update like status
    // This is a placeholder for the actual implementation
    console.log(`Toggled helpful for review ${reviewId}`);
  };

  const handleReplayApiCall = (reviewId) => {
    // Implement API call to handle reply
    // This is a placeholder for the actual implementation
    console.log(`Reply clicked for review ${reviewId}`);
  };

  const handleShowReplyInput = (reviewId) => {
    // Implement reply input toggle
    // This is a placeholder for the actual implementation
    console.log(`Show reply input for review ${reviewId}`);
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="w-[834px]">
          <div className="rounded-lg">
            <div className="flex items-center justify-end mb-8">
              <div className="flex items-center space-x-6">
                <div className="flex gap-[15px] items-center">
                  <p className="text-[#000] text-[16px] not-italic font-normal leading-[24px]">
                    Sort by:
                  </p>
                  <div className="relative">
                    <button
                      onClick={toggleDropdown}
                      className="flex gap-[15px] items-center cursor-pointer"
                    >
                      <p className="text-[#333333] text-[16px] not-italic font-bold leading-normal">
                        {sortBy}
                      </p>
                      <div>
                        <Image src={DropDownArrow} alt="DropDownArrow" />
                      </div>
                    </button>
                    {isDropdownOpenSort && (
                      <div className="absolute right-0 w-[120px] bg-white rounded-[10px] shadow-lg py-4 px-3 space-y-4 z-50 border-1 border-[#CCCCCC]">
                        <button
                          onClick={() => handleSortChange("Most Recent")}
                          className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                        >
                          Latest
                        </button>
                        <button
                          onClick={() => handleSortChange("Most Liked")}
                          className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                        >
                          Most Liked
                        </button>
                        <button
                          onClick={() => handleSortChange("Oldest")}
                          className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                        >
                          Oldest
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-[15px] items-center">
                  <p className="text-[#000] text-[16px] not-italic font-normal leading-[24px]">
                    Filter:
                  </p>
                  <div className="relative">
                    <button
                      onClick={toggleDropdownFilter}
                      className="flex gap-[15px] items-center cursor-pointer"
                    >
                      <p className="text-[#333333] text-[16px] not-italic font-bold leading-normal">
                        {filterBy}
                      </p>
                      <div>
                        <Image src={DropDownArrow} alt="DropDownArrow" />
                      </div>
                    </button>
                    {isDropdownOpenFilter && (
                      <div className="absolute right-0 w-[120px] bg-white rounded-[10px] shadow-lg py-4 px-3 space-y-4 z-50 border-1 border-[#CCCCCC]">
                        <button
                          onClick={() => setFilterBy("None")}
                          className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                        >
                          None
                        </button>
                        <button
                          onClick={() => setFilterBy("5 Stars")}
                          className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                        >
                          5 Stars
                        </button>
                        <button
                          onClick={() => setFilterBy("4 Stars")}
                          className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                        >
                          4 Stars
                        </button>
                        <button
                          onClick={() => setFilterBy("3 Stars")}
                          className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                        >
                          3 Stars
                        </button>
                        <button
                          onClick={() => setFilterBy("2 Stars")}
                          className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                        >
                          2 Stars
                        </button>
                        <button
                          onClick={() => setFilterBy("1 Stars")}
                          className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                        >
                          1 Stars
                        </button>
                        <button
                          onClick={() => setFilterBy("Like")}
                          className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                        >
                          Like
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="">
              {isLoading ? (
                <p className="text-[#808080] text-[16px] not-italic font-normal leading-[24px]">
                  Loading reviews...
                </p>
              ) : error ? (
                <p className="text-[#808080] text-[16px] not-italic font-normal leading-[24px]">
                  {error}
                </p>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="flex flex-col gap-6">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col gap-2 justify-start">
                        <p className="overflow-hidden text-[#0084FF] text-ellipsis whitespace-nowrap text-[20px] not-italic font-bold leading-[22px] uppercase">
                          {review.customerName}
                        </p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, starIndex) => {
                            const starValue = starIndex + 1;
                            return (
                              <Image
                                key={starIndex}
                                src={
                                  starValue <= review.rating
                                    ? StarFillIcon
                                    : StarEmptyIcon
                                }
                                alt={
                                  starValue <= review.rating
                                    ? "Filled star"
                                    : "Empty star"
                                }
                              />
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex gap-1 items-center">
                        <p className="text-[#808080] text-[16px] not-italic font-normal leading-[24px]">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#808080] text-[16px] not-italic font-normal leading-[24px]">
                        {review.comment}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#808080] text-[16px] not-italic font-normal leading-[24px]">
                        {review.likesCount} Vote
                        {review.likesCount !== 1 ? "s" : ""} for helpful
                      </p>
                    </div>
                    <div className="flex gap-9 items-center">
                      <button
                        onClick={() => handleHelpfulClick(review.id)}
                        className="flex gap-3 items-center cursor-pointer"
                      >
                        <div>
                          {review.hasLiked ? (
                            <Image src={ThumspLikeIcon} alt="ThumspLikeIcon" />
                          ) : (
                            <Image src={ThumspIcon} alt="ThumspIcon" />
                          )}
                        </div>
                        <p className="pt-1 text-[#808080] text-[16px] not-italic font-normal leading-[24px]">
                          Helpful
                        </p>
                      </button>

                      {/* <div className="flex gap-3 items-center">
                        <button
                          onClick={() => handleReplayApiCall(review.id)}
                          className="flex items-center cursor-pointer"
                        >
                          <Image src={ChateReplayIcon} alt="ChateReplayIcon" />
                        </button>
                        <button
                          onClick={() => handleShowReplyInput(review.id)}
                          className="text-[#808080] text-[16px] not-italic font-normal leading-[24px] cursor-pointer pl-1"
                        >
                          Comment
                        </button>
                      </div> */}
                    </div>
                    <div className="mb-6 h-[2px] bg-[#E6E6E6]"></div>
                  </div>
                ))
              ) : (
                <p className="text-[#808080] text-[16px] not-italic font-normal leading-[24px]">
                  No reviews available.
                </p>
              )}
            </div>
            <div className="flex justify-end mt-12">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors cursor-pointer disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="ml-4 px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors cursor-pointer disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2 my-8">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-700 hover:bg-gray-100 ${
                currentPage === index + 1 ? "bg-gray-200" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
