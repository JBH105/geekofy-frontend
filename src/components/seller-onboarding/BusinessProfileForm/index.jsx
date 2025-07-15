"use client";
import Image from "next/image";
import api from "@/lib/api";
import { toast } from "react-toastify";
import FAQSeletion from "./FAQSection";
import { useEffect, useRef, useState } from "react";
import UploadImage from "../../../../public/image/UploadImage.svg";
import TrueIcon from "../../../../public/image/TrueIcon.svg";
import CloseIcon from "../../../../public/image/CloseIcon.svg";
import SupportTypeSelection, { supportTypes } from "./SupportTypeSection";
import HighlightsSeletion, { highlights } from "./HighlightSection";
import IntroductionSelection from "./IntroductionSection";
import BusinessHoursSeletion from "./BusinessHoursSection";
import PhotoUploadSelection from "./PhotoUploadSection";
import PaymentMethodSelection, { paymentMethods } from "./PaymentMethodSection";
import ProfileImageSection from "./ProfileImageSection";
import { getSession } from "next-auth/react";
import YearDropdown from "./YearDropdown";
import EmployeeStrengthDropdown from "./EmployeeStrengthDropdown";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
export default function BusinessProfileForm({
  setActiveTab,
  setCurrentSideBar,
  setIsLoading,
  businessSlug,
  businessName,
  zipCode,
}) {
  const [showAllFAQs, setShowAllFAQs] = useState(false);
  const [yearFounded, setYearFounded] = useState("");
  
  const [employeeStrength, setEmployeeStrength] = useState("");
  const [profileImageSection, setProfileImageSection] = useState({
    show: false,
    data: null,
    ref: useRef(null),
  });

  const [highlightSection, setHighlightSection] = useState({
    show: false,
    data: null,
    ref: useRef(null),
  });

  const [supportTypeSection, setSupportTypeSection] = useState({
    show: false,
    data: null,
    ref: useRef(null),
  });

  const [paymentMethodSection, setPaymentMethodSection] = useState({
    show: false,
    data: null,
    ref: useRef(null),
  });

  const [businessHoursSection, setBusinessHoursSection] = useState({
    show: false,
    data: null,
    ref: useRef(null),
  });

  const [photoUploadSection, setPhotoUploadSection] = useState({
    show: false,
    data: null,
    ref: useRef(null),
  });

  const [introductionSection, setIntroductionSection] = useState({
    show: false,
    data: null,
    ref: useRef(null),
  });

  const [faqSection, setFAQSection] = useState({
    show: false,
    data: null,
    ref: useRef(null),
  });

  const saveBusinessDetails = async (payload) => {
    try {
      const response = await api.post("/api/business/details", payload);
    } catch (error) {
      console.error(error);
    }
  };

  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      setIsLoading(true);
      try {
        const session = await getSession();
        const response = await api.get("/api/business/details", {
          params: { sellerId: session?.user?.id },
        });
        const data = response?.data?.data;
        let imageUrl = null;
        let responseArray = null;

        if (data?.profileImage) {
          imageUrl = await api.get("/api/s3", {
            params: { key: data?.profileImage },
          });
        }

        if (data?.galleryImages?.length > 0) {
          responseArray = await api.get("/api/s3", {
            params: {
              keys: JSON.stringify(
                data?.galleryImages?.map((data) => data.image)
              ),
            },
          });
        }

        const urlWithCaption =
          responseArray?.data?.data?.urls?.map?.((url, index) => ({
            url: url,
            key: data?.galleryImages?.[index]?.image,
            text: data?.galleryImages?.[index]?.text,
          })) || [];

        setPhotoUploadSection((prev) => ({
          ...prev,
          data: urlWithCaption,
        }));
        setProfileImageSection((prev) => ({
          ...prev,
          data: imageUrl?.data?.data?.url || null,
        }));
        setYearFounded(data.yearFounded?.toString() || "");
        setEmployeeStrength(data.employeeStrength || "");
        setHighlightSection((prev) => ({
          ...prev,
          data: data.highlights,
        }));
        setSupportTypeSection((prev) => ({
          ...prev,
          data: data.supportTypes,
        }));
        setPaymentMethodSection((prev) => ({
          ...prev,
          data: data.paymentMethods,
        }));
        setBusinessHoursSection((prev) => ({
          ...prev,
          data: data.businessHours,
        }));
        setIntroductionSection((prev) => ({
          ...prev,
          data: data.introDescription,
        }));
        setFAQSection((prev) => ({
          ...prev,
          data: data.faqs,
        }));
      } catch (error) {
        console.log("🚀 ~ fetchBusinessDetails ~ error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessDetails();
  }, []);

  if (profileImageSection?.show) {
    return (
      <ProfileImageSection
        profileImageSection={profileImageSection.data}
        saveBusinessDetails={saveBusinessDetails}
        businessSlug={businessSlug}
        businessName={businessName}
        setProfileImageSection={(arg) => {
          setProfileImageSection(arg);
          setCurrentSideBar("bussiness_info");
          setTimeout(() => {
            const scrollPosition = scrollPositionRef.current - 90 || 0;
            window.scrollTo({ top: scrollPosition, behavior: "smooth" });
          }, 0);
        }}
      />
    );
  }

  if (paymentMethodSection?.show) {
    return (
      <PaymentMethodSelection
        saveBusinessDetails={saveBusinessDetails}
        paymentMethodData={paymentMethodSection.data}
        setPaymentMethodSection={(arg) => {
          setPaymentMethodSection(arg);
          setCurrentSideBar("bussiness_info");
          setTimeout(() => {
            const scrollPosition = scrollPositionRef.current - 90 || 0;
            window.scrollTo({ top: scrollPosition, behavior: "smooth" });
          }, 0);
        }}
      />
    );
  }

  if (supportTypeSection?.show) {
    return (
      <SupportTypeSelection
        saveBusinessDetails={saveBusinessDetails}
        supportTypeData={supportTypeSection.data}
        setSupportTypeSection={(arg) => {
          setSupportTypeSection(arg);
          setCurrentSideBar("bussiness_info");
          setTimeout(() => {
            const scrollPosition = scrollPositionRef.current - 90 || 0;
            window.scrollTo({ top: scrollPosition, behavior: "smooth" });
          }, 0);
        }}
      />
    );
  }

  if (highlightSection?.show) {
    return (
      <HighlightsSeletion
        saveBusinessDetails={saveBusinessDetails}
        highlightData={highlightSection.data}
        setHighlightSection={(arg) => {
          setHighlightSection(arg);
          setCurrentSideBar("bussiness_info");
          setTimeout(() => {
            const scrollPosition = scrollPositionRef.current - 90 || 0;
            window.scrollTo({ top: scrollPosition, behavior: "smooth" });
          }, 0);
        }}
      />
    );
  }

  if (businessHoursSection?.show) {
    return (
      <BusinessHoursSeletion
        saveBusinessDetails={saveBusinessDetails}
        zipCode={zipCode}
        businessHoursData={businessHoursSection.data}
        setBusinessHoursSection={(arg) => {
          setBusinessHoursSection(arg);
          setCurrentSideBar("bussiness_info");
          setTimeout(() => {
            const scrollPosition = scrollPositionRef.current - 90 || 0;
            window.scrollTo({ top: scrollPosition, behavior: "smooth" });
          }, 0);
        }}
      />
    );
  }

  if (photoUploadSection?.show) {
    return (
      <PhotoUploadSelection
        saveBusinessDetails={saveBusinessDetails}
        photoUploadData={photoUploadSection.data}
        businessSlug={businessSlug}
        businessName={businessName}
        setPhotoUploadSection={(arg) => {
          setPhotoUploadSection(arg);
          setCurrentSideBar("bussiness_info");
          setTimeout(() => {
            const scrollPosition = scrollPositionRef.current - 90 || 0;
            window.scrollTo({ top: scrollPosition, behavior: "smooth" });
          }, 0);
        }}
      />
    );
  }

  if (introductionSection?.show) {
    return (
      <IntroductionSelection
        saveBusinessDetails={saveBusinessDetails}
        introductionData={introductionSection.data}
        setIntroductionSection={(arg) => {
          setIntroductionSection(arg);
          setCurrentSideBar("bussiness_info");
          setTimeout(() => {
            const scrollPosition = scrollPositionRef.current - 90 || 0;
            window.scrollTo({ top: scrollPosition, behavior: "smooth" });
          }, 0);
        }}
      />
    );
  }

  if (faqSection?.show) {
    return (
      <FAQSeletion
        saveBusinessDetails={saveBusinessDetails}
        faqData={faqSection.data}
        setFAQSection={(arg) => {
          setFAQSection(arg);
          setCurrentSideBar("bussiness_info");
          setTimeout(() => {
            const scrollPosition = scrollPositionRef.current - 90 || 0;
            window.scrollTo({ top: scrollPosition, behavior: "smooth" });
          }, 0);
        }}
      />
    );
  }

  const handleImageUploadClick = () => {
    scrollPositionRef.current = profileImageSection?.ref?.current
      ? profileImageSection?.ref?.current?.getBoundingClientRect()?.top +
        window?.pageYOffset
      : window?.pageYOffset;
    setCurrentSideBar("tip_sidebar");
    setProfileImageSection((prev) => ({ ...prev, show: true }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hendleSelectHighlight = () => {
    scrollPositionRef.current = highlightSection?.ref?.current
      ? highlightSection?.ref?.current?.getBoundingClientRect()?.top +
        window?.pageYOffset
      : window?.pageYOffset;
    setCurrentSideBar("tip_sidebar");
    setHighlightSection((prev) => ({ ...prev, show: true }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hendleShowSuppotType = () => {
    scrollPositionRef.current = supportTypeSection?.ref?.current
      ? supportTypeSection?.ref?.current.getBoundingClientRect()?.top +
        window?.pageYOffset
      : window?.pageYOffset;
    setCurrentSideBar("tip_sidebar");
    setSupportTypeSection((prev) => ({ ...prev, show: true }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hendleShowPaymentMethod = () => {
    scrollPositionRef.current = paymentMethodSection?.ref?.current
      ? paymentMethodSection?.ref?.current.getBoundingClientRect()?.top +
        window?.pageYOffset
      : window?.pageYOffset;
    setCurrentSideBar("tip_sidebar");
    setPaymentMethodSection((prev) => ({ ...prev, show: true }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hendleShowBusinessHours = () => {
    scrollPositionRef.current = businessHoursSection?.ref?.current
      ? businessHoursSection?.ref?.current.getBoundingClientRect()?.top +
        window?.pageYOffset
      : window?.pageYOffset;
    setCurrentSideBar("tip_sidebar");
    setBusinessHoursSection((prev) => ({ ...prev, show: true }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hendleShowPhotoUpload = () => {
    scrollPositionRef.current = photoUploadSection?.ref?.current
      ? photoUploadSection?.ref?.current.getBoundingClientRect()?.top +
        window?.pageYOffset
      : window?.pageYOffset;
    setCurrentSideBar("tip_sidebar");
    setPhotoUploadSection((prev) => ({ ...prev, show: true }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hendleShowIntroductionSection = () => {
    scrollPositionRef.current = introductionSection?.ref?.current
      ? introductionSection?.ref?.current.getBoundingClientRect()?.top +
        window?.pageYOffset
      : window?.pageYOffset;
    setCurrentSideBar("tip_sidebar");
    setIntroductionSection((prev) => ({ ...prev, show: true }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hendleShowFAQSection = () => {
    scrollPositionRef.current = faqSection?.ref?.current
      ? faqSection?.ref?.current?.getBoundingClientRect()?.top +
        window?.pageYOffset
      : window?.pageYOffset;
    setCurrentSideBar("tip_sidebar");
    setFAQSection((prev) => ({ ...prev, show: true }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = async () => {
    if (!isFormValid()) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    const payload = {
      yearFounded: +yearFounded,
      employeeStrength,
      highlights: highlightSection?.data,
      supportTypes: supportTypeSection?.data,
      paymentMethods: paymentMethodSection?.data,
      businessHours: businessHoursSection?.data,
      introDescription: introductionSection?.data,
      faqs: faqSection?.data,
      // profileImage: profileImageSection?.data,
      // galleryImages: photoUploadSection?.data,
    };

    try {
      const response = await api.post("/api/business/details", payload);
      // setProfileImageSection((prev) => ({ ...prev,}));
      setHighlightSection((prev) => ({
        ...prev,
      }));
      setSupportTypeSection((prev) => ({
        ...prev,
      }));
      setPaymentMethodSection((prev) => ({
        ...prev,
      }));
      setBusinessHoursSection((prev) => ({
        ...prev,
      }));
      // setPhotoUploadSection((prev) => ({
      //   ...prev,
      // }));
      setIntroductionSection((prev) => ({ ...prev }));
      setFAQSection((prev) => ({ ...prev }));
      setActiveTab("business-reviews");
    } catch (error) {
      toast.error("Error Saving Business Details");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    const isYearFoundedValid = !!yearFounded;
    const isEmployeeStrengthValid = !!employeeStrength;
    const isHighlightsValid = highlightSection?.data?.length > 0;
    const isSupportTypeValid = supportTypeSection?.data?.length > 0;
    const isPaymentMethodValid = paymentMethodSection?.data?.length > 0;
    const isBusinessHoursValid = businessHoursSection?.data?.some(
      (day) => day?.isOpen
    );
    const isIntroValid = !!introductionSection?.data;
    const isFAQValid = faqSection?.data?.length > 0;

    return (
      isYearFoundedValid &&
      isEmployeeStrengthValid &&
      isHighlightsValid &&
      isSupportTypeValid &&
      isPaymentMethodValid &&
      isBusinessHoursValid &&
      isIntroValid &&
      isFAQValid
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* Year Founded */}
        <div>
          <YearDropdown
            yearFounded={yearFounded}
            setYearFounded={setYearFounded}
            saveBusinessDetails={saveBusinessDetails}
          />
        </div>

        {/* Employee Strength */}
        <div>
          <EmployeeStrengthDropdown
            employeeStrength={employeeStrength}
            setEmployeeStrength={setEmployeeStrength}
            saveBusinessDetails={saveBusinessDetails}
          />
        </div>

        {/* Profile Image / Business Logo */}
        <div
          className="bg-white rounded-2xl p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]"
          style={{
            boxShadow:
              "1px 1px 25px 0px rgba(0, 0, 0, 0.05), -1px -1px 25px 0px rgba(0, 0, 0, 0.05)",
          }}
          ref={profileImageSection.ref}
        >
          <div className="flex justify-between items-center mb-1">
            <div
              className="text-lg font-semibold text-[#666666] leading-5 mb-2"
              style={{ letterSpacing: "0.2px" }}
            >
              Profile Image / Business Logo
            </div>
            {profileImageSection?.data?.length > 0 && (
              <button
                onClick={handleImageUploadClick}
                className="text-[#0084FF] text-sm cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>
          <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-8"></div>

          {!profileImageSection?.data?.length > 0 ? (
            <>
              <p
                className="text-base text-[#666666] mb-[22px] leading-6"
                style={{ letterSpacing: "0.32px" }}
              >
                Upload your picture, business logo, storefront image or any
                image that represents your business.
              </p>
              <div
                onClick={handleImageUploadClick}
                className="border border-dashed border-[#0084FF] rounded-md p-6 bg-[#D5E8FF80] flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="flex items-center justify-center mb-2">
                  <Image src={UploadImage} alt="UploadImage" />
                </div>
                <p
                  className="text-[#0084FF] font-bold text-sm mb-1 leading-5"
                  style={{ letterSpacing: "0.14px" }}
                >
                  Add Profile Image / Business Logo
                </p>
                <p className="text-xs text-[#333333]">
                  jpeg, png or jpg format (up to 5MB)
                </p>
              </div>
            </>
          ) : (
            <div className="mt-[22px] flex gap-[100px] justify-start items-center">
              <p className="w-[341px] text-[#666666] font-[Helvetica] text-base not-italic font-normal leading-6 tracking-[0.32px]">
                Your picture, business logo, storefront image or any image that
                represents your business.
              </p>
              <div className=" w-[125px] h-[125px] flex items-center justify-center overflow-hidden border border-gray-200 rounded-md">
                <Image
                  src={profileImageSection.data}
                  alt="Business logo"
                  width={125}
                  height={125}
                  className="object-scale-down height_revert "
                />
              </div>
            </div>
          )}
        </div>

        {/* Highlights */}
        <div
          ref={highlightSection?.ref}
          className="bg-white rounded-lg p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]"
          style={{
            boxShadow:
              "1px 1px 25px 0px rgba(0, 0, 0, 0.05), -1px -1px 25px 0px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="flex justify-between items-center mb-1">
            <div
              className="text-lg font-semibold text-[#666666] leading-5 mb-2"
              style={{ letterSpacing: "0.2px" }}
            >
              Highlights
            </div>
            {highlightSection.data?.length > 0 && (
              <button
                onClick={hendleSelectHighlight}
                className="text-[#0084FF] text-sm cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>
          <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-8"></div>

          {!highlightSection.data || highlightSection.data?.length == 0 ? (
            <>
              <p
                className="text-base text-[#666666] mb-[22px] leading-6"
                style={{ letterSpacing: "0.32px" }}
              >
                Highlight up to 6 standout features to attract prospective
                clients.
              </p>

              <div className="flex justify-center">
                <button
                  onClick={hendleSelectHighlight}
                  className="w-[400px] px-[100px] py-[12px] font-medium text-[#666666] tracking-[0.84px] rounded-[6px] bg-[#E9E9E9] text-base leading-6 cursor-pointer"
                >
                  Select Highlights
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-base text-[#666666] leading-6 tracking-[0.32px]">
                Highlights selected by you to showcase the top features of your
                business.
              </p>
              <div className="mt-6 w-full grid grid-cols-[repeat(3,33%)] justify-between gap-y-6 gap-x-[10px] items-center">
                {highlightSection?.data?.map((item) => (
                  <div key={item} className="flex gap-2 items-center">
                    <div>
                      <Image
                        src={
                          highlights
                            ?.map((item) => item?.highlights)
                            ?.flat()
                            ?.find?.((data) => data?.name == item)?.icon
                        }
                        alt={item}
                        width={21}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    <p className="text-[#666666] text-base not-italic font-normal leading-6">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Support Type */}
        <div
          ref={supportTypeSection?.ref}
          className="bg-white rounded-lg p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]"
          style={{
            boxShadow:
              "1px 1px 25px 0px rgba(0, 0, 0, 0.05), -1px -1px 25px 0px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="flex justify-between items-center mb-1">
            <div
              className="text-lg font-semibold text-[#666666] leading-5 mb-2"
              style={{ letterSpacing: "0.2px" }}
            >
              Support Type
            </div>
            {supportTypeSection.data?.length > 0 && (
              <button
                onClick={hendleShowSuppotType}
                className="text-[#0084FF] text-sm cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>
          <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-8"></div>

          {!supportTypeSection.data || supportTypeSection.data?.length == 0 ? (
            <>
              <p
                className="text-base text-[#666666] mb-[22px] leading-6"
                style={{ letterSpacing: "0.32px" }}
              >
                Identify the support offerings of your business to ensure it
                appears in relevant search queries.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={hendleShowSuppotType}
                  className="w-[400px] px-[100px] py-[12px] font-medium text-[#666666] tracking-[0.84px] rounded-[6px] bg-[#E9E9E9] text-base leading-6 cursor-pointer"
                >
                  Select Support Type
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-base text-[#666666] leading-6 tracking-[0.32px]">
                Support types offered by your business
              </p>
              <div className="mt-6 w-full grid grid-cols-[repeat(3,33%)] gap-y-6 gap-x-[50px] items-center">
                {supportTypes?.map((item) => (
                  <div key={item?.id} className="flex gap-[11px] items-center">
                    <div>
                      {supportTypeSection.data?.find(
                        (data) => data == item?.id
                      ) ? (
                        <Image src={TrueIcon} alt="TrueIcon" />
                      ) : (
                        <Image src={CloseIcon} alt="CloseIcon" />
                      )}
                    </div>
                    <p className="text-[#666666] text-justify  text-base not-italic font-normal leading-6">
                      {item?.label}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Payment Method */}
        <div
          ref={paymentMethodSection?.ref}
          className="bg-white rounded-lg p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]"
          style={{
            boxShadow:
              "1px 1px 25px 0px rgba(0, 0, 0, 0.05), -1px -1px 25px 0px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="flex justify-between items-center mb-1">
            <div
              className="text-lg font-semibold text-[#666666] leading-5 mb-2"
              style={{ letterSpacing: "0.2px" }}
            >
              Payment Method
            </div>
            {paymentMethodSection.data?.length > 0 && (
              <button
                onClick={hendleShowPaymentMethod}
                className="text-[#0084FF] text-sm cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>
          <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-8"></div>

          {!paymentMethodSection.data ||
          paymentMethodSection.data?.length == 0 ? (
            <>
              <p
                className="text-base text-[#666666] mb-[22px] leading-6"
                style={{ letterSpacing: "0.32px" }}
              >
                Pick one or more of the payment methods your business supports.
              </p>

              <div className="flex justify-center">
                <button
                  onClick={hendleShowPaymentMethod}
                  className="w-[400px] px-[100px] py-[12px] font-medium text-[#666666] tracking-[0.84px] rounded-[6px] bg-[#E9E9E9] text-base leading-6 cursor-pointer"
                >
                  Select Payment Method
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-base text-[#666666] leading-6 tracking-[0.32px]">
                  Support types offered by your business
                </p>
                <div className="mt-6 w-full grid grid-cols-[repeat(3,33%)] gap-y-6 gap-x-[50px] items-center">
                  {paymentMethods?.map((item) => (
                    <div
                      key={item?.id}
                      className="flex gap-[11px] items-center"
                    >
                      <div>
                        {paymentMethodSection.data?.find(
                          (data) => data == item?.label
                        ) ? (
                          <Image src={TrueIcon} alt="TrueIcon" />
                        ) : (
                          <Image src={CloseIcon} alt="CloseIcon" />
                        )}
                      </div>
                      <p className="text-[#666666] text-justify  text-base not-italic font-normal leading-6">
                        {item?.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Business Hours And Opening Days */}
        <div
          ref={businessHoursSection?.ref}
          className="bg-white rounded-lg p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]"
          style={{
            boxShadow:
              "1px 1px 25px 0px rgba(0, 0, 0, 0.05), -1px -1px 25px 0px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="flex justify-between items-center mb-1">
            <div
              className="text-lg font-semibold text-[#666666] leading-5 mb-2"
              style={{ letterSpacing: "0.2px" }}
            >
              Business Hours And Opening Days
            </div>
            {businessHoursSection.data?.length > 0 && (
              <button
                onClick={hendleShowBusinessHours}
                className="text-[#0084FF] text-sm cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>
          <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-8"></div>

          {!businessHoursSection.data ||
          businessHoursSection.data?.length == 0 ? (
            <>
              <p
                className="text-base text-[#666666] mb-[22px] leading-6"
                style={{ letterSpacing: "0.32px" }}
              >
                Please provide an introduction to yourself or your business,
                including relevant work experience, certifications, and
                professional credentials.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={hendleShowBusinessHours}
                  className="w-[400px] px-[100px] py-[12px] font-medium text-[#666666] tracking-[0.84px] rounded-[6px] bg-[#E9E9E9] text-base leading-6 cursor-pointer"
                >
                  Add Hours of Operations
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-base text-[#666666] mb-[22px] leading-6">
                Please provide an introduction to yourself or your business,
                including relevant work experience, certifications, and
                professional credentials.
              </p>
              <div className="w-fit py-3 px-4 bg-[#FFFFFF] border border-[#666666] rounded-[10px] flex flex-col gap-2 justify-start items-start">
                <div className="w-full flex justify-between items-center">
                  <p className="text-[#666666]  text-base not-italic font-bold leading-6">
                    Business hours
                  </p>
                </div>
                {businessHoursSection?.data?.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-10 justify-start items-center"
                  >
                    <p className="w-[100px] text-[#666666]  text-base not-italic font-normal leading-[22px] tracking-[0.32px]">
                      {item?.name}
                    </p>
                    {item?.isOpen ? (
                      <p className="flex-1 text-[#666666]  text-base not-italic font-normal leading-[22px] tracking-[0.32px]">
                        {item?.timeSlots?.map((slot, index) => {
                          return `${slot?.open
                            ?.split?.(" ")
                            ?.join("")}\u00A0\u00A0-\u00A0\u00A0${slot?.close
                            ?.split?.(" ")
                            ?.join("")}${
                            index === item?.timeSlots?.length - 1
                              ? ""
                              : "\u00A0\u00A0\u00A0\u00A0&\u00A0\u00A0\u00A0\u00A0"
                          }`;
                        })}
                      </p>
                    ) : (
                      <p className="flex-1 text-[#FF5C34]  text-base not-italic font-normal leading-6">
                        Closed
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Photos */}
        <div
          ref={photoUploadSection?.ref}
          className="bg-white rounded-lg p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]"
          style={{
            boxShadow:
              "1px 1px 25px 0px rgba(0, 0, 0, 0.05), -1px -1px 25px 0px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="flex justify-between items-center mb-1">
            <div
              className="text-lg font-semibold text-[#666666] leading-5 mb-2"
              style={{ letterSpacing: "0.2px" }}
            >
              Photos
            </div>
            {photoUploadSection.data?.length > 0 && (
              <button
                onClick={hendleShowPhotoUpload}
                className="text-[#0084FF] text-sm cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>
          <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-8"></div>

          {!photoUploadSection.data?.length > 0 ? (
            <>
              <p
                className="text-base text-[#666666] mb-[22px] leading-6"
                style={{ letterSpacing: "0.32px" }}
              >
                Upload images that showcase your business, such as your
                storefront, before-and-after shots, or examples of completed
                work.
              </p>
              <div
                onClick={hendleShowPhotoUpload}
                className="border border-dashed border-blue-300 rounded-md p-6 bg-blue-50 flex flex-col items-center justify-center cursor-pointer"
              >
                <Image src={UploadImage} alt="UploadImage" />
                <p className="text-[#0084FF] font-semibold text-sm mb-1">
                  Upload photos that highlight your business.
                </p>
                <p className="text-xs text-[#000000CC]">
                  jpeg, png or jpg format (up to 5MB)
                </p>
              </div>
            </>
          ) : (
            <div className="relative">
              <p
                className="text-base text-[#666666] mb-4 leading-6"
                style={{ letterSpacing: "0.32px" }}
              >
                Upload images that showcase your business, such as your
                storefront, before-and-after shots, or examples of completed
                work
              </p>
              <div className="flex items-center justify-between">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-[#999999] bg-white transition-all duration-200 cursor-pointer swiper-button-prev"
                  disabled={photoUploadSection.data.length <= 3}
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
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={20}
                  slidesPerView={2}
                  navigation={{
                    prevEl: ".swiper-button-prev",
                    nextEl: ".swiper-button-next",
                    disabledClass: "opacity-50 cursor-not-allowed",
                  }}
                  className="w-full max-w-[900px]"
                >
                  {photoUploadSection.data.map((data, index) => (
                    <SwiperSlide key={index}>
                      <div className="border border-[#CCCCCC] rounded-lg flex flex-col flex-shrink-0 w-[300px]">
                        <Image
                          src={data?.url}
                          alt={`Uploaded image ${index + 1}`}
                          width={300}
                          height={200}
                          className="w-[300px] h-[200px] object-scale-down"
                        />
                        <div className="p-[10px] rounded-[4px] rounded-tl-none rounded-tr-none">
                          <p
                            className={`font-sans text-sm font-normal not-italic leading-6 tracking-[0.28px] ${
                              data?.text ? "text-[#333333]" : "text-[#F52A19]"
                            }`}
                          >
                            {data?.text || "No Caption"}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-[#999999] bg-white transition-all duration-200 cursor-pointer swiper-button-next"
                  disabled={photoUploadSection.data.length <= 3}
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
          )}
        </div>

        {/* Intro */}
        <div
          ref={introductionSection?.ref}
          className="bg-white rounded-lg p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]"
          style={{
            boxShadow:
              "1px 1px 25px 0px rgba(0, 0, 0, 0.05), -1px -1px 25px 0px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="flex justify-between items-center mb-1">
            <div
              className="text-lg font-semibold text-[#666666] leading-5 mb-2"
              style={{ letterSpacing: "0.2px" }}
            >
              Intro
            </div>
            {introductionSection.data && (
              <button
                onClick={hendleShowIntroductionSection}
                className="text-[#0084FF] text-sm cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>
          <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-8"></div>

          {!introductionSection.data ||
          introductionSection.data?.length == 0 ? (
            <>
              <p className="text-base text-[#666666] mb-[22px] leading-5 tracking-[0.21px]">
                Please provide an introduction to yourself or your business,
                including relevant work experience, certifications, and
                professional credentials.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={hendleShowIntroductionSection}
                  className="w-[400px] px-[100px] py-[12px] font-medium text-[#666666] tracking-[0.84px] rounded-[6px] bg-[#E9E9E9] text-sm leading-6 cursor-pointer"
                >
                  Write Introduction
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-[#666666]  text-sm not-italic font-normal leading-6">
                {introductionSection.data}
              </p>
            </>
          )}
        </div>

        {/* Frequently Asked Questions */}
        <div
          ref={faqSection?.ref}
          className="bg-white rounded-lg p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]"
          style={{
            boxShadow:
              "1px 1px 25px 0px rgba(0, 0, 0, 0.05), -1px -1px 25px 0px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="flex justify-between items-center mb-1">
            <div
              className="text-lg font-semibold text-[#666666] leading-5 mb-2"
              style={{ letterSpacing: "0.2px" }}
            >
              Frequently Asked Questions
            </div>
            {faqSection.data?.length > 0 && (
              <button
                onClick={hendleShowFAQSection}
                className="text-[#0084FF] text-sm cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>
          <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-8"></div>

          {!faqSection.data || faqSection.data?.length == 0 ? (
            <>
              <p
                className="text-base text-[#666666] mb-[22px] leading-6"
                style={{ letterSpacing: "0.32px" }}
              >
                Please provide an introduction to yourself or your business,
                including relevant work experience, certifications, and
                professional credentials.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={hendleShowFAQSection}
                  className="w-[400px] px-[100px] py-[12px] font-medium text-[#666666] tracking-[0.84px] rounded-[6px] bg-[#E9E9E9] text-base leading-6 cursor-pointer"
                >
                  Add F.A.Q.
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {/* Show only first 2 FAQs initially, or all if showAllFAQs is true */}
                {faqSection?.data
                  ?.slice(0, showAllFAQs ? faqSection.data.length : 2)
                  .map((item) => (
                    <div
                      key={item?.id}
                      className="py-4 px-6 border border-[#CCCCCC] rounded-[8px] flex flex-col gap-2 justify-start"
                    >
                      <div className="flex gap-5">
                        <p className="text-[#666666] text-lg font-bold leading-normal text-center text-nowrap">
                          Q :
                        </p>
                        <p className="text-[#0084FF] mt-1 text-base font-medium leading-[22px] whitespace-pre-line">
                          {item?.question}
                        </p>
                      </div>
                      <div className="flex gap-5">
                        <p className="text-[#666666] text-lg font-bold  leading-normal text-center text-nowrap">
                          A :
                        </p>
                        <p className="text-[#666666] mt-1 text-base font-normal leading-[22px] whitespace-pre-line">
                          {item?.answer}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              {/* Show "View more" button if there are more than 2 FAQs and not all are shown */}
              {faqSection.data?.length > 2 && !showAllFAQs && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowAllFAQs(true)}
                    className="text-[#666666] text-sm cursor-pointer"
                  >
                    View more
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end items-center gap-8 my-[103px]">
          {/* Previous Button */}
          <button
            className="flex items-center justify-center self-stretch px-[36px] py-[12px] rounded-[8px] border border-[#666666] bg-[#E6E6E6] cursor-pointer"
            onClick={() => setActiveTab("business-info")}
          >
            <span className="text-center text-black font-helvetica text-[16px] font-normal leading-[24px]">
              Previous
            </span>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!isFormValid()}
            className={`flex items-center justify-center self-stretch w-[134px] py-[12px] rounded-[8px] bg-[#1C273B] cursor-pointer ${
              !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="text-white text-center font-helvetica text-[16px] font-normal leading-[24px]">
              Next
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
