"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MdMyLocation } from "react-icons/md";
import Image from "next/image";
import CountryFlags from "../../../../public/image/CountryFlags.svg";
import SearchIcon from "../../../../public/image/SearchIcon.svg";
import GoogleMapNavigationIcon from "../../../../public/image/GoogleMapNavigationIcon.svg";
import ClickAwayListener from "@/components/shared/ClickAwayListener";

const StoreLocationMapSection = ({ formData, setFormData }) => {
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [map, setMap] = useState(null);
  const [area, setArea] = useState(formData.area || "");
  const [fullAddress, setFullAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allComponents, setAllComponents] = useState([]);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const suppressIdleRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService();
    }
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchQuery(input);

    if (autocompleteServiceRef.current && input) {
      autocompleteServiceRef.current.getPlacePredictions(
        { input },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(predictions || []);
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion.description);
    setSuggestions([]);

    if (!placesServiceRef.current && map) {
      placesServiceRef.current = new window.google.maps.places.PlacesService(
        map
      );
    }
    suppressIdleRef.current = true;

    placesServiceRef.current.getDetails(
      {
        placeId: suggestion.place_id,
        fields: [
          "geometry",
          "formatted_address",
          "address_components",
          "name",
          "place_id",
        ],
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          if (place.geometry) {
            map.setCenter(place.geometry.location);

            if (place.address_components) {
              const loc = extractLocation(
                place.address_components,
                place.formatted_address
              );
              setAllComponents(loc.allComponents);
              setFormData((prev) => ({
                ...prev,
                locationLat: place.geometry.location.lat(),
                locationLng: place.geometry.location.lng(),
              }));
            }
          }
        }
      }
    );
  };

  const extractLocation = (components, formattedAddress = "") => {
    const countryComp = components.find((c) => c.types.includes("country"));
    const isUS = countryComp?.short_name === "US";
    const isIndia = countryComp?.short_name === "IN";

    const premiseComp = components.find((c) => c.types.includes("premise"));
    const routeComp = components.find((c) => c.types.includes("route"));
    const sublocalityComp =
      components.find((c) => c.types.includes("sublocality")) ||
      components.find((c) => c.types.includes("sublocality_level_1"));
    const cityComp =
      components.find((c) => c.types.includes("locality")) ||
      components.find((c) => c.types.includes("administrative_area_level_2"));
    const stateComp = components.find((c) =>
      c.types.includes("administrative_area_level_1")
    );
    const zipCodeComp = components.find((c) => c.types.includes("postal_code"));
    const neighborhoodComp = components.find((c) =>
      c.types.includes("neighborhood")
    );

    const premiseName = premiseComp?.long_name || "";
    const routeName = routeComp?.long_name || "";
    const sublocalityName = sublocalityComp?.long_name || "";
    const cityVal = cityComp?.long_name || "";
    const stateVal = stateComp?.long_name || "";
    const zipCodeVal = zipCodeComp?.long_name || "";
    const countryVal = countryComp?.long_name || "";
    const neighborhoodName = neighborhoodComp?.long_name || ""; 

    let areaVal = "";
    let cleanedFullAddress = "";

    if (isIndia) {
      areaVal = premiseName || sublocalityName || cityVal;

      if (sublocalityName && sublocalityName !== areaVal) {
        cleanedFullAddress = [sublocalityName, cityVal]
          .filter(Boolean)
          .join(", ");
      } else if (cityVal && cityVal !== areaVal) {
        cleanedFullAddress = cityVal;
      } else {
        cleanedFullAddress = cityVal || areaVal;
      }

      if (premiseName && sublocalityName && premiseName !== sublocalityName) {
        cleanedFullAddress = [sublocalityName, cityVal]
          .filter(Boolean)
          .join(", ");
      }
    } else if (isUS) {
      const streetAddress = `${
        components.find((c) => c.types.includes("street_number"))?.long_name ||
        ""
      } ${routeName}`.trim();
      const neighborhood = neighborhoodName;
      const routeFirstWord = routeName.split(" ")[0];

      areaVal = routeName || neighborhood || routeFirstWord || cityVal;

      cleanedFullAddress = [neighborhood || cityVal, stateVal]
        .filter(Boolean)
        .join(", ");
    } else {
      areaVal = premiseName || sublocalityName || cityVal;
      cleanedFullAddress = [sublocalityName, cityVal]
        .filter(Boolean)
        .join(", ");
    }

    if (cleanedFullAddress.startsWith(`${areaVal}, `)) {
      cleanedFullAddress = cleanedFullAddress.replace(`${areaVal}, `, "");
    }

    let allComponentsDisplay = [];
    if (cityComp) {
      allComponentsDisplay = [
        `${cityComp.types.join(", ")}: ${cityComp.long_name} (${
          cityComp.short_name
        })`,
      ];
    }

    setFormData((prevData) => ({
      ...prevData,
      city: cityVal,
      state: stateVal,
      zipCode: zipCodeVal,
      country: countryVal,
      neighborhood: neighborhoodName || null,
    }));

    setFullAddress(cleanedFullAddress);
    setArea(areaVal);

    setAllComponents(allComponentsDisplay); 

    return {
      city: cityVal,
      state: stateVal,
      zipCode: zipCodeVal,
      address: cleanedFullAddress,
      area: areaVal,
      country: countryVal,
      allComponents: allComponentsDisplay,
    };
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      const initialPosition = {
        lat: formData.locationLat || 25.7617,
        lng: formData.locationLng || -80.1918,
      };

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

      setMap(mapInstance);

      // Initialize Autocomplete with explicit binding
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        searchInputRef.current,
        {
          fields: [
            "geometry",
            "formatted_address",
            "address_components",
            "name",
            "place_id",
          ],
        }
      );

      // Safari-specific focus fix
      searchInputRef.current.addEventListener("focus", () => {
        searchInputRef.current.value = searchQuery;
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry) return;
        mapInstance.setCenter(place.geometry.location);

        if (place.address_components) {
          const loc = extractLocation(
            place.address_components,
            place.formatted_address
          );
          setAllComponents(loc.allComponents);
          setFormData((prev) => ({
            ...prev,
            locationLat: place.geometry.location.lat(),
            locationLng: place.geometry.location.lng(),
          }));
        }
      });

      mapInstance.addListener("idle", () => {
        const center = mapInstance.getCenter();
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: center.toJSON() }, (results, status) => {
          if (status === "OK" && results[0]?.address_components) {
            if (suppressIdleRef.current) {
              suppressIdleRef.current = false;
              return;
            }
            const loc = extractLocation(
              results[0].address_components,
              results[0].formatted_address
            );
            setAllComponents(loc.allComponents);
            setFormData((prev) => ({
              ...prev,
              locationLat: center.lat(),
              locationLng: center.lng(),
            }));
          }
        });
      });
    });

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [mapRef?.current]);

  const handleUseCurrentLocation = () => {
    if (!map) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          map.setCenter(pos);

          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: pos }, (results, status) => {
            if (status === "OK" && results[0]?.address_components) {
              const loc = extractLocation(
                results[0].address_components,
                results[0].formatted_address
              );
              setAllComponents(loc.allComponents);
              setFormData((prev) => ({
                ...prev,
                locationLat: pos.lat,
                locationLng: pos.lng,
              }));
            }
          });
        },
        () => {
          alert("Error: The Geolocation service failed.");
        }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  };

  const handleZoomIn = () => {
    if (map) map.setZoom(map.getZoom() + 1);
  };

  const handleZoomOut = () => {
    if (map) map.setZoom(map.getZoom() - 1);
  };

  return (
    <>
      <div className="border-t-5 rounded-full border-[#0084FF] w-24 mb-8"></div>

      <p className="text-sm font-medium text-[#666666] mb-4">
        If it’s a residential address then on map place the pointer to any
        nearby public location.
      </p>

      <div
        className="relative w-full h-[400px]
        mb-4 border border-[#999] rounded-2xl overflow-hidden"
      >
        <div ref={mapRef} className="w-full h-[315px]" />

        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="relative bg-white rounded-lg py-3.5 px-3 flex items-center shadow-lg">
            <Image src={SearchIcon} alt="Search Icon" width={20} height={20} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search for area, street name"
              className="ml-2 outline-none text-sm w-full bg-transparent hidden"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search for area, street name"
              className="ml-2 outline-none text-sm w-full bg-transparent"
            />
          </div>

          {suggestions.length > 0 && (
            <ClickAwayListener
              onClickAway={() => {
                setSuggestions([]);
                setSearchQuery("");
              }}
            >
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl z-30 max-h-[300px] overflow-y-auto border border-gray-100">
                {suggestions.map((suggestion, index) => {
                  const [primary, ...secondary] =
                    suggestion.description.split(", ");
                  return (
                    <div
                      key={suggestion.place_id}
                      className="py-2 px-4 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <div className="text-sm font-medium text-[#333]">
                        {primary}
                      </div>
                      <div className="text-xs text-[#666]">
                        {secondary.join(", ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ClickAwayListener>
          )}
        </div>

        <div className="absolute top-[150px] left-1/2 -translate-x-1/2 -translate-y-full z-10">
          <Image
            src={GoogleMapNavigationIcon}
            alt="Center Pin"
            width={25}
            height={25}
          />
        </div>

        <div className="absolute top-32 right-4 z-10 flex flex-col bg-white rounded-lg shadow-md w-12">
          <button
            onClick={handleZoomIn}
            className="text-[#666] text-3xl font-bold w-full h-10 flex items-center justify-center rounded-t-sm cursor-pointer transition"
          >
            +
          </button>
          <div className="w-8 h-px bg-gray-300 mx-auto" />
          <button
            onClick={handleZoomOut}
            className="text-[#666] text-3xl font-bold w-full h-10 flex items-center justify-center rounded-b-sm cursor-pointer transition"
          >
            −
          </button>
        </div>

        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={handleUseCurrentLocation}
            className="bg-white rounded-full px-4 py-2 text-sm shadow-md flex items-center text-[#007BEE] border border-[#0084FF] hover:bg-[#f0f8ff] cursor-pointer transition"
          >
            <MdMyLocation className="w-4 h-4 mr-2" />
            Use current location
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white py-4 px-6 text-sm text-[#666] flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-black text-lg">{area}</div>
            <div className="text-[#666]">{fullAddress}</div>
            {/* <div className="text-[#666] mt-2">
              <div className="font-semibold">All Address Components:</div>
              {allComponents.map((component, index) => (
                <div key={index} className="text-[#666]">
                  {component}
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-base font-bold text-[#333333] mb-1">
          Store address details
        </h3>
        <p className="text-sm font-medium text-[#666666] mb-4">
          Address details are based on the store location mentioned above.
        </p>

        <label className="flex items-center mb-4 mt-8">
          <input
            type="checkbox"
            name="hideExactAddress"
            checked={formData.hideExactAddress}
            onChange={(e) =>
              setFormData({
                ...formData,
                hideExactAddress: e.target.checked,
              })
            }
            className="w-4 h-4 text-blue-600 border-[#999999] rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-[#666666]">
            Hide my street address because I/we don’t have an address where
            customers can visit
          </span>
        </label>

        <div className="relative mb-4">
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: e.target.value,
              })
            }
            className={`block px-3.5 pb-3 pt-3 w-full text-sm rounded-xl shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] border appearance-none focus:outline-none focus:ring-0 peer focus:border-[#999999] transition-colors duration-300 ${
              formData.hideExactAddress
                ? "bg-[#9C9C9C] text-white text-sm border-[#9C9C9C] placeholder-white disabled:opacity-100"
                : "bg-transparent text-[#333333] border-[#e8e8e8]"
            }`}
            placeholder={
              formData.hideExactAddress ? "Street address (Optional)" : " "
            }
            autoComplete="off"
            disabled={formData.hideExactAddress}
          />
          {!formData.hideExactAddress && (
            <label
              htmlFor="address"
              className="absolute text-sm text-[#9C9C9C] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 left-3 
            peer-placeholder-shown:scale-100 
            peer-placeholder-shown:-translate-y-1/2 
            peer-placeholder-shown:top-1/2 
            peer-focus:top-2 
            peer-focus:scale-75 
            peer-focus:-translate-y-4 
            peer-focus:left-3 
            peer-focus:text-[#333333] 
            peer-focus:font-medium"
            >
              Street address (Optional)
            </label>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData?.zipCode}
              readOnly
              className="block px-3.5 pb-3 pt-4 w-full text-sm bg-transparent rounded-xl shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] text-[#333333] border border-[#e8e8e8] appearance-none focus:outline-none focus:ring-0 peer focus:border-[#999999] transition-colors duration-300"
              placeholder=" "
              autoComplete="off"
            />
            <label
              htmlFor="zipCode"
              className="absolute text-sm text-[#9C9C9C] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 left-3 
                peer-placeholder-shown:scale-100 
                peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 
                peer-focus:top-2 
                peer-focus:scale-75 
                peer-focus:-translate-y-4 
                peer-focus:left-3 
                peer-focus:text-[#333333] 
                peer-focus:font-medium"
            >
              Zip Code
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              id="city"
              name="city"
              value={formData?.city}
              readOnly
              className="block px-3.5 pb-3 pt-4 w-full text-sm bg-transparent rounded-xl shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] text-[#333333] border border-[#e8e8e8] appearance-none focus:outline-none focus:ring-0 peer focus:border-[#999999] transition-colors duration-300"
              placeholder=" "
              autoComplete="off"
            />
            <label
              htmlFor="city"
              className="absolute text-sm text-[#9C9C9C] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 left-3 
                peer-placeholder-shown:scale-100 
                peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 
                peer-focus:top-2 
                peer-focus:scale-75 
                peer-focus:-translate-y-4 
                peer-focus:left-3 
                peer-focus:text-[#333333] 
                peer-focus:font-medium"
            >
              City
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              id="state"
              name="state"
              value={formData?.state}
              readOnly
              className="block px-3.5 pb-3 pt-4 w-full text-sm bg-transparent rounded-xl shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] text-[#333333] border border-[#e8e8e8] appearance-none focus:outline-none focus:ring-0 peer focus:border-[#999999] transition-colors duration-300"
              placeholder=" "
              autoComplete="off"
            />
            <label
              htmlFor="state"
              className="absolute text-sm text-[#9C9C9C] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 left-3 
                peer-placeholder-shown:scale-100 
                peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 
                peer-focus:top-2 
                peer-focus:scale-75 
                peer-focus:-translate-y-4 
                peer-focus:left-3 
                peer-focus:text-[#333333] 
                peer-focus:font-medium"
            >
              State
            </label>
          </div>
          <div
            className="flex px-3.5 pb-3 pt-4 w-full text-sm bg-transparent rounded-xl
            shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] text-[#333333] border
            border-[#e8e8e8]"
          >
            <Image
              src={CountryFlags}
              alt="CountryFlags"
              height={26}
              width={26}
            />
            <span className="ml-2 text-sm text-[#333333]">
              {"United States"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreLocationMapSection;
