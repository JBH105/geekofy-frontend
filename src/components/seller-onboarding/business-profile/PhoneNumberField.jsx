"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import OtpVerificationModal from "./OtpVerificationModal";
import CountryFlags from "../../../../public/image/CountryFlags.svg";
import VerifiedIcon from "../../../../public/image/VerifiedIcon.svg";
import { setupRecaptcha } from "@/lib/firebase";
import api from "@/lib/api";
import Loader from "@/components/shared/Loader";

const PhoneNumberField = ({ formData, setFormData, bussinessInfo }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [appVerifier, setAppVerifier] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [phoneNumberToVerify, setPhoneNumberToVerify] = useState("");
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState(
    formData?.ownerPhone || ""
  );
  const [formattedValue, setFormattedValue] = useState(
    formData?.ownerPhone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2 - $3") || ""
  );

  // Reset reCAPTCHA when needed
  const resetRecaptcha = useCallback(async () => {
    // Clear existing recaptcha container
    const container = document.getElementById("recaptcha-container-1");
    if (container) {
      container.innerHTML = "";
    }

    // Setup new recaptcha
    const newVerifier = setupRecaptcha("recaptcha-container-1");
    setAppVerifier(newVerifier);
    return newVerifier;
  }, []);

  useEffect(() => {
    resetRecaptcha();
  }, [resetRecaptcha]);

  const handleCloseModal = useCallback(() => {
    setShowVerificationModal(false);
  }, []);

  const handleOpenModal = useCallback(async () => {
    // Reset recaptcha before opening modal
    await resetRecaptcha();
    setShowVerificationModal(true);
  }, [resetRecaptcha]);

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <div
            className="relative flex px-2.5 py-3 text-sm bg-transparent rounded-xl
            shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] text-[#333333] border
            border-[#e8e8e8]"
          >
            <div className="flex items-center space-x-2">
              <Image
                src={CountryFlags}
                alt="CountryFlags"
                height={26}
                width={26}
              />
              <p className="text-[#333333] text-sm mt-1 font-medium">+1</p>
            </div>
          </div>
          <div className="relative flex-1">
            <input
              type="tel"
              id="ownerPhone"
              name="ownerPhone"
              value={formattedValue}
              onChange={async (e) => {
                const numericValue = e?.target?.value?.replace(/\D/g, "");
                let formatted = "";

                if (numericValue?.length > 0) {
                  formatted = `(${numericValue?.substring(0, 3)}`;
                  if (numericValue?.length > 3) {
                    formatted += `) ${numericValue?.substring(3, 6)}`;
                  }
                  if (numericValue?.length > 6) {
                    formatted += ` - ${numericValue?.substring(6, 10)}`;
                  }
                }

                setFormattedValue(formatted);
                setPhoneError(""); // reset any previous error
                setFormData({
                  ...formData,
                  ownerPhone: numericValue,
                });

                if (numericValue.length === 10) {
                  if (
                    bussinessInfo?.ownerPhone === numericValue ||
                    verifiedPhoneNumber === numericValue
                  ) {
                    setFormData((prev) => ({
                      ...prev,
                      mobileNumberVerified: true,
                    }));
                    return;
                  }

                  setIsVerifying(true);
                  try {
                    const res = await api.post(
                      "/api/business/info/verifyBusinessNumber",
                      {
                        number: numericValue,
                      }
                    );

                    if (res.data.success) {
                      setFormData((prev) => ({
                        ...prev,
                        mobileNumberVerified: false,
                      }));
                      setPhoneNumberToVerify(numericValue);
                      handleOpenModal();
                    } else {
                      setPhoneError(
                        "This number is already associated with another business account. Please use a different number."
                      );
                      setFormData((prev) => ({
                        ...prev,
                        mobileNumberVerified: false,
                      }));
                    }
                  } catch (err) {
                    console.error("Verification failed", err);
                    setPhoneError(
                      "Something went wrong while verifying the number."
                    );
                  } finally {
                    setIsVerifying(false);
                  }
                }
              }}
              className="block px-3.5 pb-3 pt-4 w-full text-sm bg-transparent rounded-xl shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] text-[#333333] border border-[#e8e8e8] appearance-none focus:outline-none focus:ring-0 peer focus:border-[#999999] transition-colors duration-300"
              placeholder="(___) ___ - ____"
              autoComplete="new-contactNumber"
              maxLength={16}
            />
            <label
              htmlFor="ownerPhone"
              className="absolute text-sm text-[#9C9C9C] duration-12 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 left-3 
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
              Phone number *
            </label>
            {formData?.ownerPhone?.length == 10 && (
              <>
                {formData?.mobileNumberVerified && (
                  <div className="absolute mt-1 right-6 top-1/2 transform -translate-y-1/2 flex items-center text-[#00900E]">
                    <Image
                      src={VerifiedIcon}
                      alt="VerifiedIcon"
                      className="mr-1.5 mb-2"
                    />
                    <span
                      className="text-sm font-medium italic leading-5 mb-2"
                      style={{ letterSpacing: "0.2px" }}
                    >
                      Verified
                    </span>
                  </div>
                )}
                {phoneNumberToVerify && !formData?.mobileNumberVerified && (
                  <>
                    {showVerificationModal ? (
                      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex gap-1 items-center">
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                        <p className="text-[#0084FF]">Verifying</p>
                      </div>
                    ) : (
                      !isVerifying && (
                        <button
                          onClick={handleOpenModal}
                          className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center text-[#0084FF] cursor-pointer"
                        >
                          Verify
                        </button>
                      )
                    )}
                  </>
                )}
                {isVerifying && (
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                    <Loader isLoading={true} size={5} fullscreen={false} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {phoneError && (
          <p className="mt-1 ml-20 text-sm text-red-500 font-medium">
            {phoneError}
          </p>
        )}
        <div id="recaptcha-container-1"></div>

        {showVerificationModal && (
          <OtpVerificationModal
            key={phoneNumberToVerify}
            appVerifier={appVerifier}
            phoneNumber={`+91${phoneNumberToVerify}`}
            onClose={handleCloseModal}
            setIsPhoneNumberVerified={(verified) =>
              setFormData((prev) => ({
                ...prev,
                mobileNumberVerified: verified,
              }))
            }
            onVerificationSuccess={(verifiedPhone) => {
              setFormData((prev) => ({
                ...prev,
                ownerPhone: verifiedPhone?.substr?.(verifiedPhone?.length - 10),
              }));
              setShowVerificationModal(false);
              setVerifiedPhoneNumber(
                verifiedPhone?.substr?.(verifiedPhone?.length - 10)
              );
            }}
          />
        )}
      </div>
    </>
  );
};

export default PhoneNumberField;