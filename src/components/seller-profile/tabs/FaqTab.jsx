"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function FaqTab({ business, isLoading }) {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (id) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  if (isLoading || !business) {
    return (
      <div className="space-y-4 ml-5 mt-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton
              width="60%"
              height={18}
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />
            <Skeleton
              width="80%"
              height={14}
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
              count={2}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="my-6 sm:ml-5">
      <div className="space-y-5">
        {business?.faqs?.map((faq) => (
          <div
            key={faq.id}
            className="border border-gray-200 rounded-lg bg-white relative"
          >
            <button
              onClick={() => toggleItem(faq.id)}
              className="w-full px-7 pt-4 pb-4 text-left transition-colors cursor-pointer"
            >
              <span
                className={`text-sm leading-6 whitespace-pre-line pr-8 block ${
                  openItem === faq.id
                    ? "text-[#0084FF] font-bold"
                    : "text-[#666666]"
                }`}
              >
                {faq.question}
              </span>
            </button>
            <div className="absolute top-4 right-7">
              {openItem === faq.id ? (
                <FiChevronUp className="w-5 h-5 text-[#0084FF] cursor-pointer" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-gray-500 cursor-pointer" />
              )}
            </div>
            {openItem === faq.id && (
              <div className="px-7 pb-4">
                <p className="text-[#666666] font-normal text-sm leading-6 whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
