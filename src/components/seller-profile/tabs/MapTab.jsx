"use client";

import { Loader } from "@googlemaps/js-api-loader";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import MapNavigationIcon from "../../../../public/image/ProfileIcon/MapNavigationIcon.svg";
import { useBusinessStore } from "@/stores/businessStore";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places"],
});

export default function MapTab({ business, isLoading }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [hideExactAddress, setHideExactAddress] = useState();

  useEffect(() => {
    setHideExactAddress(business?.location?.hideExactAddress);
  }, [business]);


  const {
    data: { headerData },
  } = useBusinessStore();

  useEffect(() => {
    if (!business?.location?.locationLat || !business?.location?.locationLng)
      return;
    const lat = parseFloat(business.location.locationLat);
    const lng = parseFloat(business.location.locationLng);
    if (isNaN(lat) || isNaN(lng)) return;

    loader.load().then(() => {
      const initialPosition = { lat, lng };
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: initialPosition,
        zoom: 18,
        mapId: "business_map",
        cameraControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        keyboardShortcuts: true,
      });
      mapInstanceRef.current = mapInstance;
      new window.google.maps.Marker({
        position: initialPosition,
        map: mapInstance,
        title: headerData?.name,
      });

      // Get address components using Geocoding API
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: initialPosition }, (results, status) => {
        if (status === "OK" && results[0]) {
          const addressComponents = results[0].address_components;
          
          const countryComp = addressComponents.find((c) =>
            c.types.includes("country")
          );
          const isUS = countryComp?.short_name === "US";

          // Only process if it's a US address
          if (isUS) {
            const streetNumber =
              addressComponents.find((c) => c.types.includes("street_number"))
                ?.long_name || "";
            const route =
              addressComponents.find((c) => c.types.includes("route"))
                ?.long_name || "";
            const locality =
              addressComponents.find((c) => c.types.includes("locality"))
                ?.long_name || "";
            const administrativeArea =
              addressComponents.find((c) =>
                c.types.includes("administrative_area_level_1")
              )?.short_name || "";
            const postalCode =
              addressComponents.find((c) => c.types.includes("postal_code"))
                ?.long_name || "";

            // Format the address in standard US formatq
            const streetAddress = `${route}`.trim();
            let cleanedFullAddress ="";
            if (hideExactAddress) cleanedFullAddress = streetAddress;
            
            if (locality) {
              cleanedFullAddress += `${locality}`;
            }
           
            if (administrativeArea) {
              cleanedFullAddress += `, ${administrativeArea}`;
            }
           
            if (postalCode) {
              cleanedFullAddress += ` ${postalCode}`;
            }
            
           
            setFormattedAddress(cleanedFullAddress);
          } else {
            // For non-US addresses, you might want to handle differently or set a default
            setFormattedAddress(results[0].formatted_address);
          }
        }
      });
    });
  }, [
    business?.location?.locationLat,
    business?.location?.locationLng,
    headerData?.name,
  ]);

  // Rest of the component remains exactly the same...
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(currentZoom - 1);
    }
  };

  const handleGetDirections = () => {
    if (business?.location?.locationLat && business?.location?.locationLng) {
      const lat = parseFloat(business.location.locationLat);
      const lng = parseFloat(business.location.locationLng);
      if (!isNaN(lat) && !isNaN(lng)) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, "_blank");
      }
    }
  };

  if (isLoading || !business || !headerData) {
    return (
      <div className="space-y-6 py-6 ml-5">
        {/* Address Section Skeleton */}
        <div className="flex items-start gap-3">
          <Skeleton squre width={48} height={48} />
          <div className="w-full">
            <Skeleton width={200} height={20} />
          </div>
        </div>

        {/* Address Text Skeleton */}
        <div>
          <Skeleton width={500} height={18} />
        </div>

        {/* Map Container Skeleton */}
        <div className="relative">
          <Skeleton
            width="100%"
            height={399}
            className="border border-[#999999] rounded-2xl"
          />

          {/* Get Directions Button Skeleton */}
          <div className="absolute top-6 left-6 z-10">
            <Skeleton width={120} height={40} />
          </div>

          {/* Zoom Controls Skeleton */}
          <div className="absolute bottom-6 right-4 z-10 flex flex-col bg-white rounded-md shadow-md w-10">
            <Skeleton width={40} height={32} className="rounded-t-sm" />
            <div className="w-8 h-px bg-gray-300 mx-auto" />
            <Skeleton width={40} height={32} className="rounded-b-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 sm:ml-5">
      <div className="flex items-start gap-3">
        <Image src={MapNavigationIcon} alt="MapNavigationIcon" />
        <div>
          <p className="text-[#666] mt-3">     
            {business?.location?.hideExactAddress ? "" : `${business?.location?.address} ,`} {formattedAddress}
          </p>
        </div>
      </div>
      <div>
        {business?.location?.hideExactAddress ? (
          <p className="italic">
            "Approximate location only—this business doesn’t have a place you
            can visit in person."
          </p>
        ) : (
          <></>
        )}
      </div>
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-[399px] border border-[#999999] rounded-2xl"
        />
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={handleGetDirections}
            className="bg-[#0084FF] text-white text-sm font-normal py-[10px] px-5 rounded-md cursor-pointer"
          >
            Get Directions
          </button>
        </div>
        <div className="absolute bottom-6 right-4 z-10 flex flex-col bg-white rounded-md shadow-md w-10">
          <button
            onClick={handleZoomIn}
            className="text-[#666] text-2xl font-bold w-full h-8 flex items-center justify-center rounded-t-sm cursor-pointer transition"
          >
            +
          </button>
          <div className="w-8 h-px bg-gray-300 mx-auto" />
          <button
            onClick={handleZoomOut}
            className="text-[#666] text-2xl font-bold w-full h-8 flex items-center justify-center rounded-b-sm cursor-pointer transition"
          >
            −
          </button>
        </div>
      </div>
    </div>
  );
}
