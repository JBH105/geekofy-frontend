"use client";
import Image from "next/image";
import DropDownArrow from "../../../../public/image/DropDownArrow.svg";
import ThumspIcon from "../../../../public/image/ThumspIcon.svg";
import ThumspLikeIcon from "../../../../public/image/ThumspLikeIcon.svg";
import ChateReplayIcon from "../../../../public/image/ChateReplayIcon.svg";
import Profile from "../../../../public/image/Profile.svg";
import StarFillIcon from "../../../../public/image/StarFillIcon.svg";
import StarEmptyIcon from "../../../../public/image/StarEmptyIcon.svg";
import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";

const AllReviews = ({
  reviews = [],
  isDropdownOpen,
  toggleDropdown,
  handleCloseDropdown,
  dropdownRef,
  currentPage,
  totalPages,
  handlePageChange,
  businessName,
}) => {
  const [sortOption, setSortOption] = useState("Most Recent");
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const [isHelpfulClicked, setIsHelpfulClicked] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [replyText, setReplyText] = useState({});
  const [savedReplies, setSavedReplies] = useState({});
  const [commentsCount, setCommentsCount] = useState({});
  const inputRefs = useRef({});

  // Initialize like states
  useEffect(() => {
    const votes = {};
    const liked = {};
    const comments = {};

    for (const review of reviews) {
      votes[review.id] = parseInt(review.likesCount, 10) || 0;
      liked[review.id] = review.hasLiked || false;
      comments[review.id] = parseInt(review.commentsCount, 10) || 0;

      handleReplayApiCall(review.id);
    }

    setHelpfulVotes(votes);
    setIsHelpfulClicked(liked);
    setCommentsCount(comments);
  }, [reviews]);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === "Most Recent") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === "Oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOption === "Most Liked") {
      return (helpfulVotes[b.id] || 0) - (helpfulVotes[a.id] || 0);
    }
    return 0;
  });

  const handleSortChange = (option) => {
    setSortOption(option);
    handleCloseDropdown();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";
    return `${month}/${day}/${year} at ${hours}:${minutes}${ampm}`;
  };

  const handleHelpfulClick = async (reviewId) => {
    try {
      const response = await api.post("/api/business/review/toggle-like", {
        reviewId,
      });
      if (response.data.success) {
        setHelpfulVotes((prev) => ({
          ...prev,
          [reviewId]: response.data.count,
        }));
        setIsHelpfulClicked((prev) => ({
          ...prev,
          [reviewId]: response.data.data.message === "Liked",
        }));
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleShowReplyInput = (reviewId) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [reviewId]: true,
    }));
  };

  const handleReplayApiCall = async (reviewId) => {
    try {
      if (savedReplies[reviewId]) {
        setSavedReplies((prev) => {
          const newReplies = { ...prev };
          delete newReplies[reviewId];
          return newReplies;
        });
      } else {
        const response = await api.get(
          `/api/business/review/${reviewId}/details`
        );
        if (response.data.success && response.data.data.length > 0) {
          setSavedReplies((prev) => ({
            ...prev,
            [reviewId]: response.data.data[0].replyText,
          }));
        }
      }
    } catch (err) {
      console.error(`Error fetching details for review ${reviewId}:`, err);
    }
  };

  const handleReplyTextChange = (reviewId, value) => {
    setReplyText((prev) => ({
      ...prev,
      [reviewId]: value,
    }));
  };

  const handleCommitReply = async (reviewId) => {
    if (replyText[reviewId]?.trim()) {
      try {
        const response = await api.post("/api/business/review/reply", {
          reviewId,
          replyText: replyText[reviewId].trim(),
        });
        if (response.data.success) {
          setSavedReplies((prev) => ({
            ...prev,
            [reviewId]: replyText[reviewId].trim(),
          }));
          setReplyText((prev) => ({
            ...prev,
            [reviewId]: "",
          }));
          setShowReplyInput((prev) => ({
            ...prev,
            [reviewId]: false,
          }));
        }
      } catch (err) {
        console.error("Error submitting reply:", err);
      }
    }
  };

  const handleDeleteReply = async (reviewId) => {
    try {
      setSavedReplies((prev) => ({
        ...prev,
        [reviewId]: "",
      }));
      setReplyText((prev) => ({
        ...prev,
        [reviewId]: "",
      }));
    } catch (err) {
      console.error("Error deleting reply:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(inputRefs.current).forEach((reviewId) => {
        if (
          showReplyInput[reviewId] &&
          inputRefs.current[reviewId] &&
          !inputRefs.current[reviewId].contains(event.target)
        ) {
          setShowReplyInput((prev) => ({
            ...prev,
            [reviewId]: false,
          }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReplyInput]);

  return (
    <>
      <div className="mb-[30px] flex justify-between items-center">
        <p className="text-[#666666] text-[20px] not-italic font-bold leading-normal">
          All Reviews
        </p>
        <div className="flex gap-[15px] items-center">
          <p className="text-[#000] text-[16px] not-italic font-normal leading-[24px]">
            Sort by:
          </p>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex gap-[15px] items-center cursor-pointer"
            >
              <p className="text-[#666666] text-[16px] not-italic font-bold leading-normal">
                {sortOption}
              </p>
              <div>
                <Image src={DropDownArrow} alt="DropDownArrow" />
              </div>
            </button>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 w-[120px] bg-white rounded-[10px] shadow-lg py-4 px-3 space-y-4 z-50 border-1 border-[#CCCCCC]"
              >
                <button
                  onClick={() => handleSortChange("Most Recent")}
                  className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                >
                  Most Recent
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
      </div>
      {sortedReviews.length > 0 ? (
        sortedReviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-2 justify-start">
                <p className="overflow-hidden text-[#0084FF] text-ellipsis whitespace-nowrap text-[20px] not-italic font-bold leading-[22px]">
                  {review.customerName
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
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
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[#808080] text-[16px] not-italic font-normal leading-[24px] whitespace-pre-line">
                {review.comment}
              </p>
            </div>
            <div>
              <p className="text-[#808080] text-[16px] not-italic font-normal leading-[24px]">
                {helpfulVotes[review.id] || 0} Vote
                {helpfulVotes[review.id] !== 1 ? "s" : ""} for helpful
              </p>
            </div>
            <div className="flex gap-9 items-center">
              <button
                onClick={() => handleHelpfulClick(review.id)}
                className="flex gap-3 items-center cursor-pointer"
              >
                <div>
                  {isHelpfulClicked[review.id] ? (
                    <Image src={ThumspLikeIcon} alt="ThumspLikeIcon" />
                  ) : (
                    <Image src={ThumspIcon} alt="ThumspIcon" />
                  )}
                </div>
                <p className="pt-1 text-[#808080] text-[16px] not-italic font-normal leading-[24px]">
                  Helpful
                </p>
              </button>

              <div className="flex gap-3 items-center">
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
              </div>
            </div>
            {showReplyInput[review.id] && (
              <div
                ref={(el) => (inputRefs.current[review.id] = el)}
                className="flex gap-[10px] items-start"
              >
                <div className="mt-2.5">
                  <Image src={Profile} width={30} height={30} alt="Profile" />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <textarea
                    className="w-full min-h-[48px] max-h-[120px] pt-[13px] px-[15px] pb-[11px] border border-[#999999] rounded-[6px] text-[#666666] text-base font-normal font-helvetica leading-6 not-italic resize-none overflow-y-auto"
                    placeholder="Write your reply"
                    value={replyText[review.id] || ""}
                    onChange={(e) => {
                      handleReplyTextChange(review.id, e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = `${Math.min(
                        e.target.scrollHeight,
                        120
                      )}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.shiftKey) {
                        return;
                      }
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleCommitReply(review.id);
                      }
                    }}
                    autoFocus
                    rows={1}
                  />
                  <button
                    onClick={() => handleCommitReply(review.id)}
                    className="self-end py-2 px-4 bg-[#0084FF] text-[#FFFFFF] rounded-[6px] text-base font-bold font-helvetica leading-6 not-italic cursor-pointer"
                    disabled={!replyText[review.id]?.trim()}
                  >
                    Commit
                  </button>
                </div>
              </div>
            )}
            {savedReplies[review.id] && !showReplyInput[review.id] && (
              <div className="flex gap-[10px] items-start">
                <div className="mt-2.5">
                  <Image src={Profile} width={30} height={30} alt="Profile" />
                </div>
                <div className="flex flex-col w-full">
                  <p className="pb-[3px] overflow-hidden text-[#0084FF] text-ellipsis whitespace-nowrap text-[16px] not-italic font-bold leading-[24px]">
                    {businessName
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </p>
                  <div className="pb-2 text-[#666666] text-base font-normal font-helvetica leading-6 not-italic whitespace-pre-line">
                    {savedReplies[review.id]}
                  </div>
                </div>
              </div>
            )}
            <div className="mb-6 h-[2px] bg-[#E6E6E6]"></div>
          </div>
        ))
      ) : (
        <p className="text-[#808080] text-[16px] not-italic font-normal leading-[24px]">
          No reviews available.
        </p>
      )}
      {sortedReviews.length > 10 && (
        <div className="mb-[24px] flex justify-center gap-3 items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-[#4D4D4D] text-xl font-normal font-helvetica leading-normal not-italic cursor-pointer"
          ></button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`text-[#4D4D4D] text-xl font-normal font-helvetica leading-normal ${
                currentPage === index + 1 ? "font-bold" : "cursor-pointer"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-[#4D4D4D] text-xl font-normal font-helvetica leading-normal not-italic cursor-pointer -mt-[3px]"
          ></button>
        </div>
      )}
    </>
  );
};

export default AllReviews;
