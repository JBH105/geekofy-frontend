import React, { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

const SidebarRatingSelector = ({
  selectedRating,
  handleStarClick,
}) => {


  return (
    <div className="flex justify-between items-center mt-2 gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleStarClick(star)}
            className="focus:outline-none"
          >
            {star <= selectedRating ? (
              <FaStar className="text-yellow-500" size={20} />
            ) : (
              <FaRegStar className="text-yellow-500" size={20} />
            )}
          </button>
        ))}
        {selectedRating > 0 && selectedRating < 5 && (
          <span className="text-[#666666] text-[14px] font-normal leading-[24px] font-helvetica ml-1 mt-1">
            & Up
          </span>
        )}
      </div>
    </div>
  );
};

export default SidebarRatingSelector;
