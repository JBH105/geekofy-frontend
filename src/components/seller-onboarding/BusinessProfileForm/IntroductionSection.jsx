"use client";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { useState, useRef, useEffect } from "react";

export default function IntroductionSection({
  setIntroductionSection,
  introductionData,
  saveBusinessDetails,
}) {
  const [paragraphText, setParagraphText] = useState(introductionData || "");
  const [isEditing, setIsEditing] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (paragraphText !== introductionData) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [paragraphText, introductionData]);

  const handleTextChange = (e) => {
    setParagraphText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setIsModalOpen(true);
    } else {
      setIntroductionSection((prev) => ({ ...prev, show: false }));
    }
  };

  const handleConfirmExit = () => {
    setIsModalOpen(false);
    setIntroductionSection((prev) => ({ ...prev, show: false }));
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        if (isEditing) {
          setIsEditing(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  const handleSave = () => {
    setIntroductionSection((prev) => ({
      ...prev,
      show: false,
      data: paragraphText,
    }));
    if (paragraphText) {
      saveBusinessDetails({ introDescription: paragraphText });
    }
    setHasChanges(false);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="bg-white rounded-2xl p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]"
      >
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-lg font-semibold text-[#666666] leading-5 mb-2">
              Introduction
            </h1>
            <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-8"></div>
          </div>

          <div
            className={`border-2 rounded-lg p-4 transition-all duration-200 ${
              isEditing ? "border-[#CCCCCC]" : "border-transparent"
            }`}
            onClick={() => setIsEditing(true)}
          >
            <textarea
              ref={textareaRef}
              value={paragraphText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              maxLength={300}
              placeholder="Intro Paragraph"
              className="w-full min-h-[200px] p-2 text-[#333333] border-none focus:outline-none resize-none bg-transparent text-sm"
            />
            <div className="text-right text-sm text-gray-500 mb-1">
              {paragraphText.length}/300
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-[50px]">
        <button
          onClick={handleCancel}
          className="px-5 py-2.5 border border-[#666666] rounded-lg hover:bg-gray-50 text-[#666666] text-base cursor-pointer"
        >
          Cancel
        </button>
        <button
          className="px-5 py-2.5 bg-[#0084FF] text-white rounded-lg hover:bg-blue-600 text-base cursor-pointer"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelModal}
      />
    </>
  );
}
