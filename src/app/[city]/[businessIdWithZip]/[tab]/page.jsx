import React from "react";
import BusinessListing from "@/components/seller-profile/BusinessListing";
import api from "@/lib/api";

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

export async function generateMetadata({ params }) {
  const { businessIdWithZip, city } = await params; 

  const components =  extractUrlComponents(businessIdWithZip);

  const { businessSlug, zipCode, neighborhood } = components;

  try {
    const response = await api.get("/api/business/info", {
      params: { businessSlug },
    });

    const businessName = response?.data?.data?.businessName || "Business";

    return {
      title: `${businessName} in ${city} (${zipCode}) – Trusted Experts on Geekofy`,
    };
  } catch (error) {
    console.error("Error fetching business info:", error);
    return {
      title: `Business in ${city} (${zipCode}) – Trusted Experts on Geekofy`,
    };
  }
}

function SellerProfile() {
  return <BusinessListing />;
}

export default SellerProfile;
