"use client";

import { useEffect, useRef } from "react";

export default function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirm",
  message = "You have unsaved changes. Are you sure you want to leave this page?",
  confirmText = "Leave",
  cancelText = "Stay",
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onCancel]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000066] transition-opacity flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-[#FAFAFA] rounded-[15px] w-full max-w-[504px] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        {/* Blue Header */}
        <div className="bg-[#0084FF] px-8 py-3">
          <h2 className="text-sm font-medium text-white">{title}</h2>
        </div>

        {/* Content Body */}
        <div className="bg-[#F5F5F5] px-8 py-8">
          <p className="text-sm text-[#333333] mb-2 leading-[24px]">
            {message}
          </p>
          <p className="text-sm text-[#333333] leading-[]">
            Your changes will be lost if you don't save them.
          </p>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-8 flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-10 py-[10px] border border-[#CCCCCC] bg-white shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] rounded-lg hover:bg-gray-50 text-[#333333] text-base font-medium min-w-[100px] cursor-pointer
            "
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-10 py-[10px] border border-[#CCCCCC] bg-white shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] rounded-lg hover:bg-gray-50 text-[#333333] text-base font-medium min-w-[100px] cursor-pointer
            "
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
