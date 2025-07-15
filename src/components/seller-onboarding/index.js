"use client";

import { useState, useRef, useEffect } from "react";
import BusinessInfoTab from "./business-profile/BusinessInfoTab";
import BusinessProfileSidebar from "./business-profile/BusinessProfileSidebar";
import BusinessProfileForm from "./BusinessProfileForm";
import SecondaryHeader from "../layout/SecondaryHeader";
import SidebarTip from "./BusinessProfileForm/SidebarTip";
import api from "@/lib/api";
import { toast } from "react-toastify";
import Reviews from "./reviews/Reviews";
import Services from "./services/Services";
import { getSession, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

export default function SellerOnboarding() {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerFirstName: "",
    ownerLastName: "",
    ownerEmail: "",
    ownerPhone: "",
    contactNumber: "",
    mobileNumberVerified: false,
    contactNumberVerified: false,
    isEmailVerifying: false,
    sameAsOwner: false,
    hideExactAddress: false,
    address: "",
    zipCode: "",
    city: "",
    state: "",
    country: "",
    businessSlug: "",
    locationLat: null,
    locationLng: null,
    initialDataLoaded: false,
    neighborhood: "",
  });

  const { tab } = useParams();
  const activeTab = tab || "business-info";
  const router = useRouter();
  const setActiveTab = (tab) => {
    router.push("/seller-onboarding/" + tab);
  };
  const { data: userSession } = useSession();

  const [bussinessInfo, setBussinessInfo] = useState({});
  const [isBusinessIdAvailable, setIsBusinessIdAvailable] = useState(false);
  const [city, setCity] = useState("Miami");
  const [state, setState] = useState("Florida");
  const [zipCode, setZipCode] = useState("33135");
  const [fullAddress, setFullAddress] = useState("Miami");
  const [area, setArea] = useState("Miami");
  const [isLoading, setIsLoading] = useState(true);
  const searchInputRef = useRef(null);
  const [currentSideBar, setCurrentSideBar] = useState("bussiness_info");
  const [showEmailVerificationModal, setShowEmailVerificationModal] =
    useState(false);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      let data = {};
      try {
        setIsLoading(true);
        const session = await getSession();
        const response = await api.get("/api/business/info", {
          params: { sellerId: session?.user?.id },
        });
        data = response?.data?.data;
      } catch (error) {
        console.error("Error fetching business info:", error);
      } finally {
        const session = await getSession();

        const nameParts = session.user.name.trim().split(" ");
        const sessionData = {
          ownerFirstName: nameParts[0] || "",
          ownerLastName: nameParts.slice(1).join(" ") || "",
          ownerEmail: session.user.email || "",
          initialDataLoaded: true,
        };

        const businessInfo = {
          id: data?.id || "",
          businessName: data?.businessName || "",
          ownerFirstName:
            data?.ownerFirstName || sessionData.ownerFirstName || "",
          ownerLastName: data?.ownerLastName || sessionData.ownerLastName || "",
          ownerEmail: data?.ownerEmail || sessionData.ownerEmail || "",
          ownerPhone: data?.ownerPhone || "",
          contactNumber: data?.contactNumber || "",
          mobileNumberVerified: data?.mobileNumberVerified || false,
          contactNumberVerified: data?.contactNumberVerified || false,
          isEmailVerifying:
            data?.isEmailVerifying === null ||
            data?.isEmailVerifying === undefined ||
            data?.ownerEmail == sessionData.ownerEmail
              ? true
              : data?.isEmailVerifying,
          sameAsOwner: data?.ownerPhone === data?.contactNumber,
          hideExactAddress: data?.hideExactAddress || false,
          address: data?.address || "",
          zipCode: data?.zipCode ? String(data.zipCode) : "",
          city: data?.city || "",
          state: data?.state || "",
          country: data?.country || "",
          businessSlug: data?.businessSlug || "",
          locationLat: data?.locationLat || null,
          locationLng: data?.locationLng || null,
          neighborhood: data?.neighborhood || null,
          initialDataLoaded: data?.ownerEmail
            ? true
            : sessionData.initialDataLoaded || false,
        };

        if (businessInfo?.businessSlug) {
          setIsBusinessIdAvailable(true);
        }

        setFormData(businessInfo);
        setBussinessInfo(businessInfo);
        setCity(data?.city || "Miami");
        setState(data?.state || "Florida");
        setZipCode(data?.zipCode ? String(data.zipCode) : "33135");
        setFullAddress(`${data?.city || "Miami"}, ${data?.state || "Florida"}`);
        setArea(data?.city || "Miami");
        setIsLoading(false);
      }
    };

    // if (activeTab == "business-info" || activeTab == "business-details") {
      fetchBusinessInfo();
    // }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;

    const parts = email.split("@");
    const domain = parts[1];

    if (
      domain.includes("..") ||
      domain.startsWith(".") ||
      domain.endsWith(".") ||
      domain.includes("_") ||
      domain.startsWith("-") ||
      domain.endsWith("-")
    ) {
      return false;
    }

    const tld = domain.split(".").pop();
    if (tld.length < 2) return false;

    return true;
  };

  const validateFormData = (formData) => {
    const isTenDigits = (phone) => /^\d{10}$/.test(phone);

    return (
      formData.businessName.trim() !== "" &&
      formData.ownerFirstName.trim() !== "" &&
      formData.ownerLastName.trim() !== "" &&
      validateEmail(formData?.ownerEmail) &&
      isTenDigits(formData.ownerPhone.trim()) &&
      isTenDigits(formData.contactNumber.trim()) &&
      formData.zipCode.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.state.trim() !== "" &&
      formData.businessSlug.trim() !== "" &&
      (formData.address.trim() !== "" || formData.hideExactAddress) &&
      isBusinessIdAvailable
    );
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
        ...(name === "sameAsOwner" && checked
          ? { contactNumber: formData?.ownerPhone, contactNumberVerified: true }
          : {}),
      });
      return;
    }

    if (name === "businessSlug") {
      let newValue = value;
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      await checkBusinessIdAvailability(value);
      return;
    }

    let newValue = value;

    if (name === "ownerFirstName" || name === "ownerLastName") {
      if (/^[a-zA-Z ]*$/.test(value) || value === "") {
        newValue = value;
      } else {
        return;
      }
    } else if (
      name === "ownerPhone" ||
      (name === "contactNumber" && !formData.sameAsOwner)
    ) {
      const numericValue = value.replace(/\D/g, "");
      let formattedValue = "";

      if (numericValue.length > 0) {
        formattedValue = `(${numericValue.substring(0, 3)}`;
        if (numericValue.length > 3) {
          formattedValue += `) ${numericValue.substring(3, 6)}`;
        }
        if (numericValue.length > 6) {
          formattedValue += ` - ${numericValue.substring(6, 10)}`;
        }
      }

      newValue = formattedValue;
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const checkBusinessIdAvailability = async (id) => {
    try {
      if (id.length < 3) {
        setIsBusinessIdAvailable(false);
        return;
      }

      const response = await api.post("/api/business/info/verifyBusinessSlug", {
        slug: id,
      });

      setIsBusinessIdAvailable(response?.data?.success);
    } catch (error) {
      console.error("Error checking business ID availability:", error);
      setIsBusinessIdAvailable(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.post("/api/business/info", formData);
      setBussinessInfo(formData);
      toast.success("Business information saved successfully!");
      return true; 
    } catch (error) {
      toast.error("Failed to save business information. Please try again.");
      return false; 
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyerUpgrade = async () => {
    const userRoles = userSession?.user?.role || [];
    const isSeller = userRoles.includes("seller");

    if (isSeller) return; 

    try {
      setIsLoading(true);
      const sellerPayload = { role: ["seller"] };

      const response = await api.put(
        `/api/auth/${userSession.user.id}`,
        sellerPayload
      );

      if (response?.data?.success) {
        toast.success("Role upgraded to seller successfully!");
      } else {
        toast.error("Failed to upgrade role.");
      }
    } catch (e) {
      toast.error("Error upgrading role.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (!validateFormData(formData)) {
      toast.error("Please complete all required fields.");
      return;
    }

    const saved = await handleSave();
    if (!saved) return; 

    await handleBuyerUpgrade(); 

    setActiveTab("business-details");
  };

  return (
    <>
      <SecondaryHeader />
      <div className="w-full bg-[#FCFCFC] min-h-full relative">
        {isLoading && (
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
        )}
        <div className="layout_container flex flex-col md:flex-row justify-center items-start gap-6 w-full py-7 md:px-20">
          {currentSideBar == "bussiness_info" && (
            <BusinessProfileSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              validateFormData={validateFormData}
              formData={formData}
            />
          )}
          {currentSideBar == "tip_sidebar" && <SidebarTip />}

          <div className="w-full md:max-w-[834px] space-y-8">
            {activeTab === "business-info" && (
              <BusinessInfoTab
                formData={formData}
                bussinessInfo={bussinessInfo}
                key={formData?.id}
                validateFormData={validateFormData}
                handleChange={handleChange}
                searchInputRef={searchInputRef}
                isBusinessIdAvailable={isBusinessIdAvailable}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                city={city}
                state={state}
                zipCode={zipCode}
                fullAddress={fullAddress}
                area={area}
                setFormData={setFormData}
                validateEmail={validateEmail}
                handleNext={handleNext}
                showEmailVerificationModal={showEmailVerificationModal}
                setShowEmailVerificationModal={setShowEmailVerificationModal}
              />
            )}
            {activeTab === "business-details" && (
              <BusinessProfileForm
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setCurrentSideBar={setCurrentSideBar}
                setIsLoading={setIsLoading}
                businessSlug={formData?.businessSlug}
                businessName={formData?.businessName}
                zipCode={formData?.zipCode}
              />
            )}
            {activeTab === "business-reviews" && (
              <Reviews
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                businessName={formData?.businessName}
              />
            )}
            {activeTab === "business-services" && (
              <Services setIsLoading={setIsLoading} isLoading={isLoading} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
