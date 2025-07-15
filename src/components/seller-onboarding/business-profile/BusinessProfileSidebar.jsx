"use client";
import api from "@/lib/api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const BusinessProfileSidebar = ({
  activeTab,
  setActiveTab,
  validateFormData,
  formData,
}) => {
  const [progress, setProgress] = useState({});
  const { data: session } = useSession();
  const sellerId = session?.user?.id;
  const businessSlug = formData?.businessSlug;
  const city = formData?.city;
  const zipCode = formData?.zipCode;
  const neighborhood = formData?.neighborhood || null;
  const [isBusinessInfoComplete, setIsBusinessInfoComplete] = useState(false);
  const RADIUS = 46;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const progressValue = progress?.progress || 0;
  const strokeOffset = CIRCUMFERENCE - (progressValue / 100) * CIRCUMFERENCE;
  const isComplete = validateFormData(formData);

  const tabs = [
    {
      id: "business-info",
      title: "Business Info",
      desc: "Business name, address, contact number and logo",
    },
    {
      id: "business-details",
      title: "Business Details",
      desc: "Year Founded, Employee Strength, Highlights, Support Type",
    },
    {
      id: "business-reviews",
      title: "Reviews",
      desc: "All Customer Reviews",
    },
    {
      id: "business-services",
      title: "Services",
      desc: "Add Services and Pricing",
    },
  ];

  useEffect(() => {
    async function fetchProgress() {
      try {
        if (sellerId) {
          const progressResponse = await api?.get?.("/api/business/progress", {
            params: { sellerId },
          });
          if (progressResponse?.data?.data) {
            setProgress(progressResponse.data?.data);
          }
        }
      } catch (error) {
        console.error("Error fetching business progress:", error);
      }
    }

    fetchProgress();
  }, [sellerId]);

  useEffect(() => {
    if (validateFormData && formData) {
      const isComplete = validateFormData(formData);
      setIsBusinessInfoComplete(isComplete);
    }
  }, [formData, validateFormData]);

  const handleTabChange = (tabId) => {
    // If trying to go to tab 2 from tab 1, validate first
    // if (
    //   activeTab === "business-info" &&
    //   tabId === "business-details" &&
    //   !validateFormData(formData)
    // ) {
    //   toast.error(
    //     "Please complete all required fields in Business Info before proceeding"
    //   );
    //   return;
    // }

    // For other tab changes or when validation passes
    setActiveTab(tabId);
  };

  const slugify = (str) => {
    return (str || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const getPreviewUrl = () => {
    const encodedCity = slugify(city);
    const encodedBusinessSlug = slugify(businessSlug);
    const encodedZipCode = encodeURIComponent(zipCode || "");
    const encodedNeighborhood = neighborhood ? slugify(neighborhood) : null;

    const combinedSlug = encodedNeighborhood ? `${encodedBusinessSlug}-place-${encodedNeighborhood}-${encodedZipCode}` : `${encodedBusinessSlug}-${encodedZipCode}`;

    return `/${encodedCity}/${combinedSlug}/overview`;
  };

  return (
    <div className="w-full md:max-w-[262px]">
      {/* Sidebar Section */}
      <div className="bg-white px-5 py-8 rounded-2xl shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] mb-4">
        <h2
          className="text-lg font-semibold text-[#666666] mb-2"
          style={{ letterSpacing: "0.2px" }}
        >
          Business Profile
        </h2>
        <div className="border-t-[5px] rounded-full border-[#0084FF] w-24 mb-6" />

        {/* Tab Navigation */}
        <div className="space-y-3">
          {tabs.map((tab, i) => (
            <div
              key={tab.id}
              className={`flex items-center gap-4 p-[8px] rounded-md cursor-pointer transition-all duration-200 ${
                activeTab === tab.id ? "bg-[#0084FF]" : "hover:bg-gray-50"
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {/* Circle Number */}
              <div
                className={`w-8 h-8 border-2 rounded-full flex items-center pt-[1px] justify-center text-sm font-semibold flex-shrink-0 ${
                  activeTab === tab.id
                    ? "border-white text-white"
                    : "border-[#666] text-[#666]"
                }`}
              >
                {i + 1}
              </div>

              {/* Text */}
              <div className="flex flex-col pt-[2px]">
                <h3
                  className={`text-base font-semibold leading-[20px] ${
                    activeTab === tab.id ? "text-white" : "text-[#666666]"
                  }`}
                >
                  {tab.title}
                </h3>
                <p
                  className={`text-sm leading-[18px] mt-1 ${
                    activeTab === tab.id ? "text-white" : "text-[#666]"
                  }`}
                >
                  {tab.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] flex justify-center mb-5">
        {isComplete ? (
          <Link href={getPreviewUrl()} legacyBehavior>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="block text-base text-[#666666] font-semibold leading-[20px] cursor-pointer hover:text-[#0084FF]"
            >
              Preview Business Profile
            </a>
          </Link>
        ) : (
          <span
            className="block text-base text-[#CCCCCC] font-semibold leading-[20px] cursor-not-allowed"
            title="Complete Business Info to enable preview"
          >
            Preview Business Profile
          </span>
        )}
      </div>

      {/* Progress Circle */}
      <div className="bg-white p-6 rounded-2xl shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] flex justify-center">
        <div className="relative">
          <svg className="w-[160px] h-[160px]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="49"
              fill="none"
              stroke="#C2C1C1"
              strokeWidth="1"
            />
            <circle
              cx="50"
              cy="50"
              r="43"
              fill="none"
              stroke="#C2C1C1"
              strokeWidth="1"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#0084FF"
              strokeWidth="5"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeOffset}
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[40px] text-[#333333] font-light">
              {progressValue}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileSidebar;
