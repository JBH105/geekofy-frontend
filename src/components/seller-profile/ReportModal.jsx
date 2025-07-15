"use client";

import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const ReportModal = ({ isOpen, onClose }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Static options for now - can be made dynamic later
  const reportReasons = [
    { value: "", label: "Select" },
    { value: "inappropriate-content", label: "Inappropriate Content" },
    { value: "spam", label: "Spam" },
    { value: "fake-listing", label: "Fake Listing" },
    { value: "misleading-info", label: "Misleading Information" },
    { value: "copyright", label: "Copyright Violation" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReason) return;

    setIsSubmitting(true);

    // Simulate API call - replace with actual implementation later
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Report submitted:", selectedReason);

      // Reset form and close modal
      setSelectedReason("");
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#00000066] transition-opacity flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[700px] mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-[#F6472C] px-1 py-2 flex items-center justify-end">
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-1 cursor-pointer"
            aria-label="Close modal"
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="font-bold text-base leading-6">Report an Issue</p>
            {/* Dropdown Select */}
            <div className="relative">
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none appearance-none bg-white text-gray-700 cursor-pointer"
                required
              >
                {reportReasons.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!selectedReason || isSubmitting}
                className="px-24 py-3 rounded-md border border-[#CCCCCC] text-[#333333] text-sm disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
