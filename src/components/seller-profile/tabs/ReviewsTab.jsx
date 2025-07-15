"use client";

import StarRating from "../StarRating";
import Profile from "../../../../public/image/Profile.svg";
import Image from "next/image";
import { useState } from "react";
import { useBusinessStore } from "@/stores/businessStore";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DoubleComaIcon from "../../../../public/image/DoubleComaIcon.svg";

export default function ReviewsTab({ business, isLoading }) {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const {
    data: { headerData },
  } = useBusinessStore();

  const calculateRatingDistribution = () => {
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    business?.reviews?.forEach((review) => {
      const roundedRating = Math.round(review?.rating || 0);
      if (roundedRating >= 1 && roundedRating <= 5) {
        ratingCounts[roundedRating]++;
      }
    });
    const totalReviews = business?.reviews?.length || 0;
    return [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: ratingCounts[rating],
      percentage:
        totalReviews > 0
          ? Math.round((ratingCounts[rating] / totalReviews) * 100)
          : 0,
      text: `${rating} star`,
    }));
  };

  const ratingDistribution = calculateRatingDistribution();

  const handleFilterChange = (rating) => {
    setSelectedFilters((prev) =>
      prev?.includes(rating)
        ? prev?.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
  };

  const filteredReviews =
    selectedFilters?.length > 0
      ? business?.reviews?.filter((review) =>
          selectedFilters?.includes(Math.round(review?.rating || 0))
        )
      : business?.reviews;

  if (isLoading || !business || !headerData) {
    return (
      <div className="space-y-6 ml-5">
      {/* Overall Rating Skeleton */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <div className="flex items-center space-x-2 mt-6">
            <Skeleton width={120} height={25} />
            <Skeleton width={198} height={20} />
          </div>
        </div>
      </div>

      {/* Rating Distribution Skeleton */}
      <div>
        <div className="flex flex-col justify-start">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex gap-5 items-center">
              <div className="flex gap-[5px] items-center">
                <Skeleton circle width={18} height={18} />
                <Skeleton width={60} height={16} />
              </div>
              <Skeleton width={136} height={12} />
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="border-b border-[#999999] pb-4 last:border-b-0"
          >
            <div className="flex flex-col mb-2">
              <div className="flex items-start space-x-4">
                <Skeleton circle width={40} height={40} />
                <div className="flex flex-col">
                  {/* Customer name and rating skeleton */}
                  <div className="flex gap-4 mb-2">
                    <Skeleton width={120} height={20} />
                    <Skeleton width={100} height={20} />
                  </div>
                  {/* Service text skeleton */}
                  <Skeleton width={150} height={16} className="mb-2" />
                  {/* Comment with SVGs skeleton */}
                  <div className="text-base mt-2 relative">
                    <span className="inline-block align-middle">
                      <Skeleton count={2} width={700} height={16} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  }

  return (
    <div className="space-y-6 ml-5">
      <div className="flex items-center justify-between">
        <div className="text-right">
          <div className="flex items-center space-x-2 mt-6">
            <StarRating rating={headerData?.rating} />
            <span className="text-sm text-[#666666]">
              {headerData?.rating} ({headerData?.reviewCount}) Overall
              Satisfaction Rating
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col justify-start">
          {ratingDistribution?.map((item) => (
            <div key={item?.rating} className="flex gap-5 items-center">
              <div className="flex gap-[5px] items-center">
                <input
                  type="checkbox"
                  className="mr-[2px] h-[18px] w-[14px] cursor-pointer"
                  checked={selectedFilters?.includes(item?.rating)}
                  onChange={() => handleFilterChange(item?.rating)}
                />
                <p className="text-[#666666] text-[14px] font-normal font-helvetica leading-6 tracking-[0.14px]">
                  {item?.text} ({item?.count})
                </p>
              </div>
              <div className="h-[10px] shrink-0 w-[136.919px] bg-[#D9D9D9] relative">
                <div
                  className="h-full bg-[#0084FF] absolute top-0 left-0"
                  style={{ width: `${item?.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        {selectedFilters?.length > 0 && (
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
      <div className="space-y-4">
        {filteredReviews?.map((review) => (
          <div
            key={review?.id}
            className="border-b border-[#999999] pb-4 last:border-b-0"
          >
            <div className="flex flex-col mb-2">
              <div className="flex items-start space-x-4">
                <Image src={Profile} alt="Profile" />
                <div className="flex flex-col">
                  {/*customer name and rating */}
                  <div className="flex gap-4 mb-2">
                    <span className="text-[#696969] font-bold text-lg">
                      {review?.customerName}{" "}
                    </span>
                    <span className="mt-1">
                      <StarRating rating={review?.rating} />
                    </span>
                  </div>
                  <h4>
                    <span className="font-semibold text-[#0084FF]">
                      Service:{" "}
                    </span>
                    <span className="text-[#696969]">Printer Support</span>
                    {/* comment */}
                  </h4>
                  <p className="text-[#666666] mb-2 w-fit text-base mt-2 font-normal relative">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      className="text-xl text-[#0084FF] absolute -top-2 -left-5"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4.58341 17.3211C3.55316 16.2274 3 15 3 13.0103C3 9.51086 5.45651 6.37366 9.03059 4.82318L9.92328 6.20079C6.58804 8.00539 5.93618 10.346 5.67564 11.822C6.21263 11.5443 6.91558 11.4466 7.60471 11.5105C9.40908 11.6778 10.8312 13.159 10.8312 15C10.8312 16.933 9.26416 18.5 7.33116 18.5C6.2581 18.5 5.23196 18.0095 4.58341 17.3211ZM14.5834 17.3211C13.5532 16.2274 13 15 13 13.0103C13 9.51086 15.4565 6.37366 19.0306 4.82318L19.9233 6.20079C16.588 8.00539 15.9362 10.346 15.6756 11.822C16.2126 11.5443 16.9156 11.4466 17.6047 11.5105C19.4091 11.6778 20.8312 13.159 20.8312 15C20.8312 16.933 19.2642 18.5 17.3312 18.5C16.2581 18.5 15.232 18.0095 14.5834 17.3211Z"></path>
                    </svg>
                    <span className="inline-block align-middle">
                    {review?.comment || "No content available"}
                    </span>
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      className="text-xl text-[#0084FF] absolute -top-2 -right-2 lg:-right-5"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19.4167 6.67891C20.4469 7.77257 21.0001 9 21.0001 10.9897C21.0001 14.4891 18.5436 17.6263 14.9695 19.1768L14.0768 17.7992C17.4121 15.9946 18.0639 13.6539 18.3245 12.178C17.7875 12.4557 17.0845 12.5533 16.3954 12.4895C14.591 12.3222 13.1689 10.8409 13.1689 9C13.1689 7.067 14.7359 5.5 16.6689 5.5C17.742 5.5 18.7681 5.99045 19.4167 6.67891ZM9.41669 6.67891C10.4469 7.77257 11.0001 9 11.0001 10.9897C11.0001 14.4891 8.54359 17.6263 4.96951 19.1768L4.07682 17.7992C7.41206 15.9946 8.06392 13.6539 8.32447 12.178C7.78747 12.4557 7.08452 12.5533 6.39539 12.4895C4.59102 12.3222 3.16895 10.8409 3.16895 9C3.16895 7.067 4.73595 5.5 6.66895 5.5C7.742 5.5 8.76814 5.99045 9.41669 6.67891Z"></path>
                    </svg>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
