"use client";

import Image from "next/image";
import CompanyChatIcon from "../../../public/image/CompanyChatIcon.svg";
import PhoneChatIcon from "../../../public/image/PhoneChatIcon.svg";
import AddressChatIcon from "../../../public/image/AddressChatIcon.svg";
import mycomputerworks from "../../../public/image/mycomputerworks.svg";
import Email from "../../../public/image/Email.svg";
import StarFillIcon from "../../../public/image/StarFillIcon.svg";
import StarEmptyIcon from "../../../public/image/StarEmptyIcon.svg";

import { useState, useEffect, useRef } from "react";

export default function RightSidebar({ customerInfo }) {
  const [businessName, setBusinessName] = useState("Business name");
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const googleMapsRef = useRef(null);

  // Sample business data - replace with actual data
  const businessData = {
    address: "Street address, City, State, Zip code, State",
    rating: 4.9,
    reviewCount: 850,
    status: "Excellent",
    hours: "09:00am - 01:00pm",
    distance: "0.1 Miles",
    yearEstablished: "2009",
  };

  const handleGetDirections = () => {
    if (mapLoaded && window.google) {
      const destination = encodeURIComponent(businessData.address);
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${destination}`
      );
    }
  };

  const handleZoomIn = () => {
    if (googleMapsRef.current && mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (googleMapsRef.current && mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setZoom(currentZoom - 1);
    }
  };

  // Load Google Maps
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setMapLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map when loaded
  useEffect(() => {
    if (mapLoaded && window.google) {
      const mapElement = document.getElementById("google-map");
      if (mapElement) {
        googleMapsRef.current = window.google.maps;
        const map = new googleMapsRef.current.Map(mapElement, {
          center: { lat: 40.7128, lng: -74.006 },
          zoom: 18,
          libraries: ["places"],
          cameraControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
        });
        mapRef.current = map;

        // Add marker
        new googleMapsRef.current.Marker({
          position: { lat: 40.7128, lng: -74.006 },
          map: map,
          title: businessData.address,
        });
      }
    }
  }, [mapLoaded]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add filled stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Image
          key={`fill-${i}`}
          src={StarFillIcon}
          alt="Filled star"
          className="w-4 h-4"
        />
      );
    }

    // Add half star if needed (using empty star for half stars as per original)
    if (hasHalfStar) {
      stars.push(
        <Image
          key="half"
          src={StarEmptyIcon}
          alt="Half star"
          className="w-4 h-4 opacity-50"
        />
      );
    }

    // Add empty stars for remaining
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Image
          key={`empty-${i}`}
          src={StarEmptyIcon}
          alt="Empty star"
          className="w-4 h-4"
        />
      );
    }

    return stars;
  };

  return (
    <div className="w-[285px]">
      <div className="space-y-3">
        {/* Business Name */}
        <div className="bg-white px-[12px] py-[10px] rounded-[10px] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[12px]">
              <Image
                src={CompanyChatIcon || "/placeholder.svg"}
                alt="CompanyChatIcon"
              />
              <div
                className="text-sm font-normal text-[#666666] leading-6 cursor-pointer"
                onClick={() => setIsEditingBusinessName(true)}
              >
                {businessName}
              </div>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="bg-white px-[12px] py-[10px] rounded-[10px] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 flex items-center justify-center">
                <Image
                  src={PhoneChatIcon || "/placeholder.svg"}
                  alt="PhoneChatIcon"
                />
              </div>
              <div
                className="ml-3 cursor-pointer text-[#666666]"
                onClick={() => setIsEditingPhone(true)}
              >
                {"+1 (000) 000-0000"}
              </div>
            </div>
          </div>
        </div>

        {/* Address and Location */}
        <div className="bg-white px-[12px] py-[10px] rounded-[10px] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-start mb-2">
            <Image
              src={AddressChatIcon}
              alt="AddressChatIcon"
              className="mr-3 mt-1"
            />
            <div className="text-sm text-[#666666] leading-5">
              {businessData.address}
            </div>
          </div>
          <div>
            <button
              onClick={handleGetDirections}
              className="bg-[#0084FF] ml-8 text-white font-normal py-1 px-2 rounded-md cursor-pointer text-[10px]"
            >
              Get Directions
            </button>
          </div>
        </div>

        {/* Google Maps */}
        {/* <div className="bg-white p-[10px] rounded-[10px] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] overflow-hidden relative">
          <div
            id="google-map"
            className="w-full h-48"
            style={{ minHeight: "192px" }}
          >
          </div>

          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={handleGetDirections}
              className="bg-[#0084FF] text-white font-normal py-1 px-2 rounded-md cursor-pointer text-[10px]"
            >
              Get Directions
            </button>
          </div>
          <div className="absolute bottom-20 right-4 z-10 flex flex-col bg-white rounded-md shadow-md w-8">
            <button
              onClick={handleZoomIn}
              className="text-[#666] text-xl font-bold w-full h-8 flex items-center justify-center rounded-t-sm cursor-pointer transition hover:bg-gray-100"
            >
              +
            </button>
            <div className="w-6 h-px bg-gray-300 mx-auto" />
            <button
              onClick={handleZoomOut}
              className="text-[#666] text-xl font-bold w-full h-8 flex items-center justify-center rounded-b-sm cursor-pointer transition hover:bg-gray-100"
            >
              −
            </button>
          </div>
        </div> */}

        {/* Business Rating and Reviews */}
        <div className="bg-white px-[12px] py-[10px] rounded-[10px] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(businessData.rating)}
              </div>
              <span className="text-sm font-medium text-[#666666]">
                {businessData.rating} ({businessData.reviewCount})
              </span>
              <span className="text-base text-[#00900E] font-bold">
                {businessData.status}
              </span>
            </div>

            <div className="text-sm text-[#666666]">
              <span className="text-base text-[#00900E] leading-6">
                Open Now
              </span>
              <span className="ml-[21px]">{businessData.hours}</span>
            </div>

            <div className="flex justify-between text-sm text-[#666666]">
              <span>
                Distance :
                <span className="ml-[10px]">{businessData.distance}</span>
              </span>
            </div>
            <div className="text-sm justify-between text-[#666666]">
              Year Founded :
              <span className="ml-[10px]">{businessData.yearEstablished}</span>
            </div>
          </div>
        </div>

        {/* Company Logo */}
        {/* <div className="bg-white px-[12px] py-[10px] rounded-[10px] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
          <div className="flex justify-center px-[12px] py-[10px]">
            <Image
              src={mycomputerworks || "/placeholder.svg"}
              alt="mycomputerworks"
              width={175}
              height={175}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}
