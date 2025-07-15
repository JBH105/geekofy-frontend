"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import locationArrowIcon from "../../../public/image/landingPage/locationArrowIcon.svg";
import { Loader } from "@googlemaps/js-api-loader";

const LocationDetail = ({ onLocationSelect }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const simplifyAddress = (address, place) => {
    if (!address) return "";

    const parts = address.split(",").map((part) => part.trim());

    const isUSAddress =
      address.includes("USA") ||
      place?.address_components?.some(
        (comp) => comp.types.includes("country") && comp.short_name === "US"
      ) ||
      /\d{5}(-\d{4})?$/.test(address);

    if (isUSAddress) {
      const selectedParts = [];

      if (parts.length > 0) {
        selectedParts.push(parts[0]);
      }

      if (parts.length > 1) {
        const cityPart = parts[parts.length - 3] || parts[1];
        if (cityPart !== parts[0]) {
          selectedParts.push(cityPart);
        }
      }

      if (parts.length > 2) {
        selectedParts.push(parts.slice(-2).join(" "));
      }

      return selectedParts.filter((part) => part).join(", ");
    } else {
      const selectedParts = [];

      if (parts.length > 0) {
        selectedParts.push(parts[0]);
      }

      if (parts.length > 3) {
        selectedParts.push(parts[3]);
      }

      if (parts.length > 4) {
        selectedParts.push(parts[4]);
      }

      if (selectedParts.length < 3 && parts.length > 2) {
        selectedParts.push(parts[parts.length - 2]); 
        selectedParts.push(parts[parts.length - 1]); 
      }

      return selectedParts.filter((part) => part).join(", ");
    }
  };
  
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      libraries: ["places"],
      version: "weekly",
    });

    loader.load().then(() => {
      if (inputRef.current) {
        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["geocode", "establishment"],
            componentRestrictions: { country: ["in", "us"] },
            fields: [
              "geometry",
              "formatted_address",
              "name",
              "address_components",
            ],
          }
        );

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          if (place && place.geometry?.location) {
            const newLocation = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              address: place.formatted_address,
              simplifiedAddress: simplifyAddress(
                place.formatted_address,
                place
              ),
            };
            setLocation(newLocation);
            setInputValue(place.formatted_address || "");
            onLocationSelect(newLocation);
          }
        });
      }
    });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onLocationSelect]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const geocoder = new google.maps.Geocoder();
          const response = await geocoder.geocode({
            location: { lat: latitude, lng: longitude },
          });

          if (response.results[0]) {
            const newLocation = {
              lat: latitude,
              lng: longitude,
              address: response.results[0].formatted_address,
              simplifiedAddress: simplifyAddress(
                response.results[0].formatted_address,
                response.results[0]
              ),
            };
            setLocation(newLocation);
            setInputValue(response.results[0].formatted_address);
            onLocationSelect(newLocation);
          } else {
            const newLocation = {
              lat: latitude,
              lng: longitude,
              simplifiedAddress: `${latitude.toFixed(6)}, ${longitude.toFixed(
                6
              )}`,
            };
            setLocation(newLocation);
            setInputValue(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            onLocationSelect(newLocation);
          }
        } catch (err) {
          setError("Failed to get address for your location");
          console.error("Geocoding error:", err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (!e.target.value) {
      setLocation(null);
      onLocationSelect(null);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-[320px] rounded-md shadow-md border border-[#DCDCDC] bg-white z-50">
      <div className="flex justify-between items-center px-4 pt-4">
        <h2 className="text-[#666666] text-sm font-medium">Current Location</h2>
        <button
          onClick={detectLocation}
          disabled={loading}
          className="flex items-center text-[#007BFF] text-sm font-medium hover:underline disabled:opacity-50"
        >
          {loading ? "Detecting..." : "Detect Using GPS"}
          <Image
            src={locationArrowIcon}
            alt="Arrow"
            className={`ml-1 w-3 h-3 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter locality/zip code"
          className="w-full px-3 py-2 text-sm placeholder:text-[#999] text-[#333] bg-[#F5F5F5] border border-[#DCDCDC] rounded-md outline-none focus:ring-2 focus:ring-[#007BFF]"
        />
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        {location && (
          <div className="mt-2 text-xs text-gray-500">
            {location.simplifiedAddress && <p> {location.simplifiedAddress}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDetail;
