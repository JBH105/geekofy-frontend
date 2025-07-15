"use client";

import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import OverviewTab from "./tabs/OverviewTab";
import ServicesTab from "./tabs/ServicesTab";
import ReviewsTab from "./tabs/ReviewsTab";
import PhotosTab from "./tabs/PhotosTab";
import FaqTab from "./tabs/FaqTab";
import MapTab from "./tabs/MapTab";
import { useBusinessStore } from "@/stores/businessStore";
import { useParams, useRouter } from "next/navigation";

const slugify = (str) => {
  return (str || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const extractUrlComponents = (businessIdWithZip) => {
  const parts = businessIdWithZip?.split("-") || [];
  const zipCodeRegex = /^[0-9]{5,6}(?:-[0-9]{4})?$/;

  const zipCode = parts[parts?.length - 1];
  const isValidZip = zipCodeRegex?.test(zipCode);
  const remainingParts = isValidZip ? parts?.slice(0, -1) : parts;

  const placeIndex = remainingParts?.indexOf("place");
  let businessSlug = "";
  let neighborhood = null;

  if (placeIndex !== -1) {
    businessSlug = remainingParts?.slice(0, placeIndex)?.join("-") || "";
    neighborhood = remainingParts?.slice(placeIndex + 1)?.join("-") || null;
  } else {
    businessSlug = remainingParts?.join("-") || "";
  }

  return {
    businessSlug: businessSlug || "",
    zipCode: isValidZip ? zipCode : null,
    neighborhood,
  };
};

export const tabs = [
  { id: "overview", label: "Overview" },
  { id: "services", label: "Services" },
  { id: "reviews", label: "Reviews" },
  { id: "photos", label: "Photos" },
  { id: "faq", label: "FAQ" },
  { id: "map", label: "Map" },
];

export default function BusinessTabs({
  activeTab: initialTab,
  isParentLoading,
}) {
  const router = useRouter();

  const { tab, businessIdWithZip, city } = useParams();
  
  const [components, setComponents] = useState(() => extractUrlComponents(businessIdWithZip));

  const { businessSlug, zipCode, neighborhood } = components;

  const [activeTab, setActiveTab] = useState(tab || initialTab || "overview");

  const {
    data: {
      overviewData,
      servicesData,
      reviewsData,
      photosData,
      faqsData,
      mapData,
      headerData,
    },
    isLoading: {
      overview: isOverviewLoading,
      services: isServicesLoading,
      reviews: isReviewsLoading,
      photos: isPhotosLoading,
      faqs: isFaqsLoading,
      map: isMapLoading,
    },
    fetchOverviewData,
    fetchServicesData,
    fetchReviewsData,
    fetchPhotosData,
    fetchFaqsData,
    fetchMapData,
  } = useBusinessStore();

  useEffect(() => {
    if (tab && tab !== activeTab && tabs?.some((t) => t?.id === tab)) {
      console.log("Syncing activeTab with URL tab:", tab);
      setActiveTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    if (isParentLoading) {
      return;
    }

    // Fetch data only for the active tab
    switch (activeTab) {
      case "overview":
        if (!overviewData && !isOverviewLoading) {
          console.log("Fetching overview data");
          fetchOverviewData(businessSlug);
        }
        break;
      case "services":
        if (!servicesData && !isServicesLoading) {
          console.log("Fetching services data");
          fetchServicesData(businessSlug);
        }
        break;
      case "reviews":
        if (!reviewsData && !isReviewsLoading) {
          console.log("Fetching reviews data");
          fetchReviewsData(businessSlug);
        }
        break;
      case "photos":
        if (!photosData && !isPhotosLoading) {
          console.log("Fetching photos data");
          fetchPhotosData(businessSlug);
        }
        break;
      case "faq":
        if (!faqsData && !isFaqsLoading) {
          console.log("Fetching FAQs data");
          fetchFaqsData(businessSlug);
        }
        break;
      case "map":
        if (!mapData && !isMapLoading) {
          console.log("Fetching map data");
          fetchMapData(businessSlug);
        }
        break;
      default:
        if (!overviewData && !isOverviewLoading) {
          console.log("Fetching default overview data");
          fetchOverviewData(businessSlug);
        }
    }
  }, [
    activeTab,
    isParentLoading,
    overviewData,
    servicesData,
    reviewsData,
    photosData,
    faqsData,
    mapData,
    isOverviewLoading,
    isServicesLoading,
    isReviewsLoading,
    isPhotosLoading,
    isFaqsLoading,
    isMapLoading,
    fetchOverviewData,
    fetchServicesData,
    fetchReviewsData,
    fetchPhotosData,
    fetchFaqsData,
    fetchMapData,
    businessSlug,
    city,
    zipCode,
  ]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const encodedCity = slugify(city);
    const encodedBusinessSlug = slugify(businessSlug);
    const encodedZipCode = zipCode || "";
    const encodedNeighborhood = neighborhood ? slugify(neighborhood) : null;

    const combinedSlug = encodedNeighborhood ? `${encodedBusinessSlug}-place-${encodedNeighborhood}-${encodedZipCode}` : `${encodedBusinessSlug}-${encodedZipCode}`;

    const newPath = `/${encodedCity}/${combinedSlug}/${tabId}`;
    router?.push(newPath);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            business={overviewData}
            isLoading={isOverviewLoading || isParentLoading}
          />
        );
      case "services":
        return (
          <ServicesTab business={servicesData} isLoading={isServicesLoading} />
        );
      case "reviews":
        return (
          <ReviewsTab business={reviewsData} isLoading={isReviewsLoading} />
        );
      case "photos":
        return <PhotosTab business={photosData} isLoading={isPhotosLoading} />;
      case "faq":
        return (
          <FaqTab
            business={faqsData}
            isLoading={isFaqsLoading || isParentLoading}
          />
        );
      case "map":
        return <MapTab business={mapData} isLoading={isMapLoading} />;
      default:
        return (
          <OverviewTab
            business={overviewData}
            isLoading={isOverviewLoading || isParentLoading}
          />
        );
    }
  };

  return (
    <div>
      {isParentLoading ? (
        <div className="pt-2 border-b border-[#999999]">
          {/* Skeleton for Tabs */}
          <nav className="flex space-x-3 overflow-x-auto whitespace-nowrap">
            {tabs.map((_, index) => (
              <Skeleton
                key={index}
                width={80}
                height={36}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
                className="rounded-md"
              />
            ))}
          </nav>
          {/* 2 for OverviewTab Content (default) */}
          <div className="space-y-6 ml-5 mt-6">
            <Skeleton
              count={3}
              height={14}
              width="80%"
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />
            <div className="flex items-start space-x-4">
              <Skeleton
                width={24}
                height={24}
                circle
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
              <Skeleton
                width={170}
                height={18}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
              <Skeleton
                width={100}
                height={18}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
            </div>
            <div className="flex items-start space-x-4">
              <Skeleton
                width={24}
                height={24}
                circle
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
              <Skeleton
                width={170}
                height={18}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
              <Skeleton
                width={100}
                height={18}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
            </div>
            <div className="flex items-start space-x-4">
              <Skeleton
                width={24}
                height={24}
                circle
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
              <Skeleton
                width={170}
                height={18}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
              <div className="grid grid-cols-3 gap-y-2 gap-x-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Skeleton
                      width={16}
                      height={16}
                      circle
                      baseColor="#e5e7eb"
                      highlightColor="#f3f4f6"
                    />
                    <Skeleton
                      width={100}
                      height={18}
                      baseColor="#e5e7eb"
                      highlightColor="#f3f4f6"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Skeleton
                width={24}
                height={24}
                circle
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
              <Skeleton
                width={170}
                height={18}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
              <div className="grid grid-cols-3 gap-y-2 gap-x-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Skeleton
                      width={16}
                      height={16}
                      circle
                      baseColor="#e5e7eb"
                      highlightColor="#f3f4f6"
                    />
                    <Skeleton
                      width={122}
                      height={18}
                      baseColor="#e5e7eb"
                      highlightColor="#f3f4f6"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Skeleton
                width={24}
                height={24}
                circle
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
              <Skeleton
                width={170}
                height={18}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
              <div className="grid grid-cols-3 gap-y-2 gap-x-6">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Skeleton
                      width={16}
                      height={16}
                      circle
                      baseColor="#e5e7eb"
                      highlightColor="#f3f4f6"
                    />
                    <Skeleton
                      width={124}
                      height={18}
                      baseColor="#e5e7eb"
                      highlightColor="#f3f4f6"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="border-b border-[#999999]">
            <nav className="flex space-x-3 overflow-x-auto scrollbar-hide whitespace-nowrap border-t border-[#999999] sm:border-none">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative px-5 py-[10px] font-medium text-sm leading-6 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "text-gray-800"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[61px] h-[6px] bg-[#0084FF] rounded-full"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>
          <div>{renderTabContent()}</div>
        </>
      )}
    </div>
  );
}
