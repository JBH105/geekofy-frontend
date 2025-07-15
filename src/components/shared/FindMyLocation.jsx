"use client";
import Image from "next/image";
import Location from "../../../public/image/Location.svg";
import { useEffect, useRef, useState } from "react";
import LocationDetail from "../layout/LocationDetail";

const getInitialLocation = () => {
    const location = window.localStorage.getItem("location");
    if(location === null || location === undefined){
        return null;
    }
    return JSON.parse(location);
}

const FindMyLocation = ({ variant = "secondary" }) => {
  
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showMobileLocation, setShowMobileLocation] = useState(false);

  const [showLocation, setShowLocation] = useState(false);
  const locationRef = useRef(null);
  const locationWrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showLocation &&
        locationRef.current &&
        locationWrapperRef.current &&
        !locationRef.current.contains(event.target) &&
        !locationWrapperRef.current.contains(event.target)
      ) {
        setShowLocation(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showLocation]);

  useEffect(() => {
    setCurrentLocation(getInitialLocation());
  }, [])

  const handleLocationClick = (e) => {
    e.stopPropagation();
    setShowLocation((prev) => !prev);
  };

  const handleLocationSelect = (location) => {
    setCurrentLocation(location);
    window.localStorage.setItem("location", JSON.stringify(location));
    setShowLocation(false);
    setShowMobileLocation(false);
  };

  return (
    <>
      {variant == "main" ? (
        <Image src={Location} alt="Location" width={18} height={28} />
      ) : (
        <Image src={Location} alt="Location" className="mr-2" />
      )}
      <button
        onClick={handleLocationClick}
        className="text-[#666666] font-['Helvetica'] cursor-pointer text-[13px] leading-[24px] tracking-[0.28px] truncate max-w-[104px]"
        title={currentLocation?.simplifiedAddress || "Find My Location"}
      >
        {currentLocation?.simplifiedAddress || "Find My Location"}
      </button>
      {showLocation && (
        <div
          ref={locationWrapperRef}
          className="absolute left-0 top-full mt-2 z-50"
        >
          {variant == "main" ? (
            <div ref={locationRef} className={`absolute top-[-32px]`}>
              <LocationDetail onLocationSelect={handleLocationSelect} />
            </div>
          ) : (
            <div ref={locationRef}>
              <LocationDetail onLocationSelect={handleLocationSelect} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FindMyLocation;
