"use client";

import { useState } from "react";
import Image from "next/image";
import PhotoModal from "./PhotoModal";
import { AnimatePresence } from "framer-motion";
import { useBusinessStore } from "@/stores/businessStore";

export default function PhotosTab({ business, isLoading }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const {
    data: { headerData },
  } = useBusinessStore();

  const openModal = (index) => {
    setSelectedPhotoIndex(index);
    setCurrentPhotoIndex(index);
  };

  const closeModal = () => {
    setSelectedPhotoIndex(null);
  };

  const goToNext = () => {
    if (currentPhotoIndex < (business?.photos?.length || 0) - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  if (isLoading || !business || !headerData) {
    return (
      <div className="fixed inset-0 bg-[#00000066] flex items-center justify-center z-50">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 ml-5 md:ml-5">
      {/* Desktop Grid - Original Design */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-[36px]">
        {business?.photos?.map((photo, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => openModal(index)}
          >
            <div
              className="border border-[#CCCCCC] rounded-lg flex flex-col"
              key={index}
            >
              <Image
                src={photo?.url || "/placeholder.svg"}
                alt={`Uploaded image ${index + 1}`}
                width={240}
                height={180}
                className="w-[240px] h-[180px] object-scale-down"
              />
              <div className="p-[10px] rounded-[4px] rounded-tl-none rounded-tr-none">
                <p
                  className={`font-sans text-sm font-normal not-italic leading-6 tracking-[0.28px] ${
                    photo?.text ? "text-[#333333]" : "text-[#F52A19]"
                  }`}
                >
                  {photo?.text || "No Caption"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Grid - New Responsive Design */}
      <div className="block sm:hidden">
        <div className="grid grid-cols-2 gap-3">
          {business?.photos?.map((photo, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => openModal(index)}
            >
              <div className="border border-[#CCCCCC] rounded-lg flex flex-col overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={photo?.url || "/placeholder.svg"}
                    alt={`Uploaded image ${index + 1}`}
                    fill
                    className="object-scale-down"
                  />
                </div>
                <div className="p-2">
                  <p
                    className={`font-sans text-xs font-normal leading-4 line-clamp-2 ${
                      photo?.text ? "text-[#333333]" : "text-[#F52A19]"
                    }`}
                  >
                    {photo?.text || "No Caption"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <PhotoModal
            photo={business?.photos?.[currentPhotoIndex]}
            businessName={headerData?.name}
            date={
              business?.photos?.[currentPhotoIndex]?.date || "April 27th 2025"
            }
            onClose={closeModal}
            onNext={goToNext}
            onPrev={goToPrev}
            hasNext={currentPhotoIndex < (business?.photos?.length || 0) - 1}
            hasPrev={currentPhotoIndex > 0}
            photos={business?.photos || []}
            currentIndex={currentPhotoIndex}
            setCurrentIndex={setCurrentPhotoIndex}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
