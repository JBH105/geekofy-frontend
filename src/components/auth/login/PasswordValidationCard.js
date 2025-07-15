"use client";

import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";

export default function PasswordValidationCard({ password }) {
  return (
    <div className="absolute z-10 w-[295px] sm:w-[380px] bg-white border  border-gray-300 rounded-md p-3 sm:p-4 shadow-md -mt-10 sm:mt-[-24px]">
      <div className="flex items-center mb-1 sm:mb-2 text-sm sm:text-base text-[#929292]">
        {/[A-Z]/.test(password) ? (
          <FaRegCheckCircle className="w-3 h-3 sm:w-5 sm:h-5 mr-2 text-[#25AE71]" />
        ) : (
          <IoMdCloseCircleOutline className="w-3 h-3 sm:w-5 sm:h-5 mr-2 text-[#FA0707]" />
        )}
        Uppercase Character
      </div>
      <div className="flex items-center mb-1 sm:mb-2 text-sm sm:text-base text-[#929292]">
        {/[a-z]/.test(password) ? (
          <FaRegCheckCircle className="w-3 h-3 sm:w-5 sm:h-5 mr-2 text-[#25AE71]" />
        ) : (
          <IoMdCloseCircleOutline className="w-3 h-3 sm:w-5 sm:h-5 mr-2 text-[#FA0707]" />
        )}
        Lowercase Character
      </div>
      <div className="flex items-center mb-1 sm:mb-2 text-sm sm:text-base text-[#929292]">
        {/\d/.test(password) ? (
          <FaRegCheckCircle className="w-3 h-3 sm:w-5 sm:h-5 mr-2 text-[#25AE71]" />
        ) : (
          <IoMdCloseCircleOutline className="w-3 h-3 sm:w-5 sm:h-5 mr-2 text-[#FA0707]" />
        )}
        Number
      </div>
      <div className="flex items-center text-sm sm:text-base text-[#929292]">
        {password.length >= 6 ? (
          <FaRegCheckCircle className="w-3 h-3 sm:w-5 sm:h-5 mr-2 text-[#25AE71]" />
        ) : (
          <IoMdCloseCircleOutline className="w-3 h-3 sm:w-5 sm:h-5 mr-2 text-[#FA0707]" />
        )}
        6 Characters
      </div>
    </div>
  );
}
