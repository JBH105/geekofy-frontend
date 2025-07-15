"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { useBusinessStore } from "@/stores/businessStore";
import { TbPhoto } from "react-icons/tb";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function PhotoModal({
  photo,
  businessName,
  date,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  photos = [],
  currentIndex,
  setCurrentIndex,
}) {
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [filter, setFilter] = useState("All");
  const thumbnailsPerView = 5;
  const thumbnailWidth = 207;
  const thumbnailGap = 8;
  const totalThumbnailWidth = thumbnailWidth + thumbnailGap;

  const {
    data: { headerData },
  } = useBusinessStore();

  const modalRef = useRef(null);
  const desktopModalRef = useRef(null);
  const mobileModalRef = useRef(null);
  const swiperRef = useRef(null);
  const mobileSwiperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both desktop and mobile modals
      if (
        desktopModalRef.current &&
        !desktopModalRef.current.contains(event.target) &&
        mobileModalRef.current &&
        !mobileModalRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (hasPrev) {
            handlePrev();
          }
          break;
        case "ArrowRight":
          if (hasNext) {
            handleNext();
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, hasNext, hasPrev]);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(currentIndex);
    }
    if (mobileSwiperRef.current && mobileSwiperRef.current.swiper) {
      mobileSwiperRef.current.swiper.slideTo(currentIndex);
    }
  }, [currentIndex]);

  const handleThumbnailNext = () => {
    if (thumbnailStartIndex + thumbnailsPerView < photos?.length) {
      setThumbnailStartIndex(thumbnailStartIndex + 1);
    }
  };

  const handleThumbnailPrev = () => {
    if (thumbnailStartIndex > 0) {
      setThumbnailStartIndex(thumbnailStartIndex - 1);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const imageVariants = {
    initial: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.3 },
    }),
  };

  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    onNext?.();
  };

  const handlePrev = () => {
    setDirection(-1);
    onPrev?.();
  };

  const handleThumbnailClick = (idx) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex?.(idx);
    const newStartIndex = Math.max(
      0,
      Math.min(
        idx - Math.floor(thumbnailsPerView / 2),
        photos?.length - thumbnailsPerView
      )
    );
    setThumbnailStartIndex(newStartIndex);
  };

  const filters = [
    { id: "all", label: "All" },
    { id: "owner", label: "By Owner" },
    { id: "verified", label: "By Verified Clients" },
  ];

  const filteredPhotos = filter === "All" ? photos : photos;

  if (!photo || !businessName) {
    return null;
  }
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="dialog"
      aria-labelledby="photo-modal-title"
    >
      {/* Desktop Modal - Original Design */}
      <motion.div
        ref={desktopModalRef}
        className="hidden md:flex w-full max-w-[1154px] bg-white rounded-lg overflow-hidden shadow-xl flex-col max-h-[90vh] px-8 py-[20px]"
      >
        {/* Modal Header */}
        <div className="px-4 flex justify-between items-center">
          <div className="flex space-x-3">
            {filters.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilter(label)}
                className={`px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium bg-white transition-colors duration-200 cursor-pointer ${
                  filter === label ? "bg-gray-100" : "hover:bg-gray-100"
                }`}
                aria-pressed={filter === label}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-pointer"
            aria-label="Close photo modal"
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex flex-1 overflow-hidden p-4">
          {/* Main Photo Section */}
          <div className="flex-1 flex flex-col">
            <div className="relative w-full h-[500px] overflow-hidden border border-r-0 rounded-lg rounded-r-[0px] border-[#cccccc]">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={imageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0"
              >
                <Image
                  src={photo?.url || "/placeholder.svg"}
                  alt={photo?.text || "Business photo"}
                  fill
                  className="object-scale-down"
                  priority
                />
              </motion.div>

              {/* Navigation Arrows for Main Image */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className={`p-2 rounded-full shadow-md transition-all duration-200 cursor-pointer ${
                    hasPrev
                      ? "bg-black bg-opacity-50 hover:bg-opacity-70"
                      : "bg-black bg-opacity-30 cursor-not-allowed"
                  }`}
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  disabled={!hasNext}
                  className={`p-2 rounded-full shadow-md transition-all duration-200 cursor-pointer ${
                    hasNext
                      ? "bg-black bg-opacity-50 hover:bg-opacity-70"
                      : "bg-black bg-opacity-30 cursor-not-allowed"
                  }`}
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar with Business Info */}
          <div className="w-80 p-6 flex flex-col border rounded-lg rounded-l-[0px] border-[#cccccc]">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-[60px] h-[60px] flex items-center justify-center flex-shrink-0 bg-white overflow-hidden border border-gray-200 rounded-md">
                {headerData?.logo ? (
                  <Image
                    src={headerData.logo || "/placeholder.svg"}
                    alt={`${headerData?.name} logo`}
                    width={100}
                    height={100}
                    className="object-scale-down height_revert"
                  />
                ) : (
                  <TbPhoto className="w-[100px] h-[100px]" />
                )}
              </div>
              <div>
                <h3
                  id="photo-modal-title"
                  className="text-base font-bold text-[#666666] leading-6"
                >
                  {businessName}
                </h3>
                <p className="text-xs text-[#666666] leading-6">
                  {date || "Date not available"}
                </p>
              </div>
            </div>
            <div className="pt-4">
              <p className="text-[#666666] text-sm">
                {photo?.text || "No caption available."}
              </p>
            </div>
          </div>
        </div>

        {/* Thumbnail Carousel */}
        <div className="relative">
          <div className="flex items-center justify-center space-x-4 px-4">
            <button
              onClick={handleThumbnailPrev}
              disabled={thumbnailStartIndex === 0}
              className={`w-8 h-8 flex items-center justify-center rounded-full border border-[#999999] bg-white transition-all duration-200 cursor-pointer ${
                thumbnailStartIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              aria-label="Previous thumbnails"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#999999]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div
              className="relative overflow-hidden"
              style={{
                width: `${
                  thumbnailsPerView * totalThumbnailWidth - thumbnailGap
                }px`,
              }}
            >
              <motion.div
                className="flex"
                style={{ gap: `${thumbnailGap}px` }}
                animate={{ x: -thumbnailStartIndex * totalThumbnailWidth }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.4,
                }}
              >
                {filteredPhotos.map((thumb, idx) => (
                  <div
                    key={idx}
                    className={`flex-shrink-0 w-[207px] h-[99px] rounded overflow-hidden cursor-pointer ${
                      idx === currentIndex
                        ? "ring-2 ring-blue-500"
                        : "border-transparent"
                    }`}
                    onClick={() => handleThumbnailClick(idx)}
                  >
                    <Image
                      src={thumb?.url || "/placeholder.svg"}
                      alt={thumb?.text || "Thumbnail"}
                      width={207}
                      height={99}
                      className="object-scale-down w-full h-full hover:opacity-90 transition-opacity duration-200"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
            <button
              onClick={handleThumbnailNext}
              disabled={
                thumbnailStartIndex + thumbnailsPerView >= photos?.length
              }
              className={`w-8 h-8 flex items-center justify-center rounded-full border border-[#999999] bg-white transition-all duration-200 cursor-pointer ${
                thumbnailStartIndex + thumbnailsPerView >= photos?.length
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              aria-label="Next thumbnails"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#999999]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>

     

      {/* Mobile Modal - New Responsive Design */}
      <motion.div
        ref={mobileModalRef}
        className="flex md:hidden w-full h-full bg-white flex-col"
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Photos</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Close photo modal"
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Filter Buttons */}
        <div className="flex space-x-2 p-4 border-b overflow-x-auto">
          {filters.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(label)}
              className={`px-3 py-1.5 rounded-full border border-gray-300 text-sm font-medium bg-white transition-colors duration-200 whitespace-nowrap ${
                filter === label ? "bg-gray-100" : "hover:bg-gray-100"
              }`}
              aria-pressed={filter === label}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mobile Main Photo */}
        <div className="flex-1 relative bg-black">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
          >
            <Image
              src={photo?.url || "/placeholder.svg"}
              alt={photo?.text || "Business photo"}
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Mobile Navigation Arrows */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              className={`ml-4 p-3 rounded-full shadow-lg transition-all duration-200 ${
                hasPrev
                  ? "bg-black bg-opacity-50 hover:bg-opacity-70"
                  : "bg-black bg-opacity-30 cursor-not-allowed"
              }`}
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className={`mr-4 p-3 rounded-full shadow-lg transition-all duration-200 ${
                hasNext
                  ? "bg-black bg-opacity-50 hover:bg-opacity-70"
                  : "bg-black bg-opacity-30 cursor-not-allowed"
              }`}
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Photo Counter */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {photos?.length}
          </div>
        </div>

        {/* Mobile Business Info */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-start space-x-3 mb-3">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-white overflow-hidden border border-gray-200 rounded-md">
              {headerData?.logo ? (
                <Image
                  src={headerData.logo || "/placeholder.svg"}
                  alt={`${headerData?.name} logo`}
                  width={48}
                  height={48}
                  className="object-scale-down height_revert"
                />
              ) : (
                <TbPhoto className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-[#666666] leading-5">
                {businessName}
              </h3>
              <p className="text-xs text-[#666666] leading-4">
                {date || "Date not available"}
              </p>
            </div>
          </div>
          <p className="text-[#666666] text-sm leading-5">
            {photo?.text || "No caption available."}
          </p>
        </div>

        {/* Mobile Thumbnail Strip - Now using Swiper */}
        <div className="p-4 border-t bg-gray-50">
          <Swiper
            ref={swiperRef}
            modules={[Navigation]}
            spaceBetween={8}
            slidesPerView={"auto"}
            centeredSlides={false}
            slideToClickedSlide={true}
            onSlideChange={(swiper) => {
              setCurrentIndex?.(swiper.activeIndex);
            }}
            className="!pb-2"
          >
            {filteredPhotos.map((thumb, idx) => (
              <SwiperSlide
                key={idx}
                className={`!w-16 !h-16 rounded overflow-hidden cursor-pointer ${
                  idx === currentIndex
                    ? "border-2 border-blue-500"
                    : "border-2 border-transparent"
                }`}
              >
                <Image
                  src={thumb?.url || "/placeholder.svg"}
                  alt={thumb?.text || "Thumbnail"}
                  width={64}
                  height={64}
                  className="object-scale-down"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.div>
    </motion.div>
  );
}

 {/* Mobile Modal */}
//  <motion.div
//  ref={mobileModalRef}
//  className="md:hidden w-full h-full bg-white flex flex-col"
//  variants={modalVariants}
//  initial="hidden"
//  animate="visible"
//  exit="exit"
// >
//  {/* Mobile Header */}
//  <div className="flex justify-between items-center p-4 border-b border-gray-200">
//    <button
//      onClick={onClose}
//      className="text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-pointer"
//      aria-label="Close photo modal"
//    >
//      <AiOutlineClose className="w-6 h-6" />
//    </button>
//    <h3 className="text-lg font-medium text-gray-900">
//      {businessName}
//    </h3>
//    <div className="w-6" /> 
//  </div>

//  {/* Mobile Main Image */}
//  <div className="flex-1 relative bg-black">
//    <motion.div
//      key={currentIndex}
//      custom={direction}
//      variants={imageVariants}
//      initial="initial"
//      animate="animate"
//      exit="exit"
//      className="absolute inset-0 flex items-center justify-center"
//    >
//      <Image
//        src={photo?.url || "/placeholder.svg"}
//        alt={photo?.text || "Business photo"}
//        width={800}
//        height={600}
//        className="object-contain w-full h-full"
//        priority
//      />
//    </motion.div>

//    {/* Mobile Navigation Arrows */}
//    <div className="absolute inset-0 flex items-center justify-between px-2">
//      <button
//        onClick={handlePrev}
//        disabled={!hasPrev}
//        className={`p-2 rounded-full shadow-md transition-all duration-200 cursor-pointer ${
//          hasPrev
//            ? "bg-black bg-opacity-50 hover:bg-opacity-70"
//            : "bg-black bg-opacity-30 cursor-not-allowed"
//        }`}
//        aria-label="Previous image"
//      >
//        <svg
//          xmlns="http://www.w3.org/2000/svg"
//          className="h-6 w-6 text-white"
//          fill="none"
//          viewBox="0 0 24 24"
//          stroke="currentColor"
//        >
//          <path
//            strokeLinecap="round"
//            strokeLinejoin="round"
//            strokeWidth={2}
//            d="M15 19l-7-7 7-7"
//          />
//        </svg>
//      </button>
//      <button
//        onClick={handleNext}
//        disabled={!hasNext}
//        className={`p-2 rounded-full shadow-md transition-all duration-200 cursor-pointer ${
//          hasNext
//            ? "bg-black bg-opacity-50 hover:bg-opacity-70"
//            : "bg-black bg-opacity-30 cursor-not-allowed"
//        }`}
//        aria-label="Next image"
//      >
//        <svg
//          xmlns="http://www.w3.org/2000/svg"
//          className="h-6 w-6 text-white"
//          fill="none"
//          viewBox="0 0 24 24"
//          stroke="currentColor"
//        >
//          <path
//            strokeLinecap="round"
//            strokeLinejoin="round"
//            strokeWidth={2}
//            d="M9 5l7 7-7 7"
//          />
//        </svg>
//      </button>
//    </div>
//  </div>

//  {/* Mobile Info Section */}
//  <div className="p-4 border-t border-gray-200">
//    <div className="flex items-center space-x-2 mb-2">
//      <TbPhoto className="text-gray-500" />
//      <span className="text-sm text-gray-500">
//        {date || "Date not available"}
//      </span>
//    </div>
//    <p className="text-gray-700">
//      {photo?.text || "No caption available."}
//    </p>
//  </div>

//  {/* Mobile Thumbnail Strip with Swiper */}
//  <div className="p-4 border-t border-gray-200">
//    <Swiper
//      ref={mobileSwiperRef}
//      slidesPerView={"auto"}
//      spaceBetween={8}
//      centeredSlides={true}
//      slideToClickedSlide={true}
//      navigation={{
//        nextEl: ".swiper-button-next",
//        prevEl: ".swiper-button-prev",
//      }}
//      modules={[Navigation]}
//      onSlideChange={(swiper) => {
//        setCurrentIndex?.(swiper.activeIndex);
//        setDirection(swiper.activeIndex > currentIndex ? 1 : -1);
//      }}
//      className="!pb-6"
//    >
//      {filteredPhotos.map((thumb, idx) => (
//        <SwiperSlide
//          key={idx}
//          className="!w-[80px] !h-[60px]"
//          onClick={() => handleThumbnailClick(idx)}
//        >
//          <div
//            className={`w-full h-full rounded overflow-hidden cursor-pointer ${
//              idx === currentIndex
//                ? "ring-2 ring-blue-500"
//                : "border border-gray-200"
//            }`}
//          >
//            <Image
//              src={thumb?.url || "/placeholder.svg"}
//              alt={thumb?.text || "Thumbnail"}
//              width={80}
//              height={60}
//              className="object-cover w-full h-full"
//            />
//          </div>
//        </SwiperSlide>
//      ))}
//    </Swiper>
//  </div>
// </motion.div>