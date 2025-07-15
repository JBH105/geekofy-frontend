"use client";
import React, { useEffect, useState } from "react";
import { setupRecaptcha } from "@/lib/firebase";
import Image from "next/image";
import OtpVerificationModal from "./OtpVerificationModal";
import CountryFlags from "../../../../public/image/CountryFlags.svg";
import VerifiedIcon from "../../../../public/image/VerifiedIcon.svg";
import api from "@/lib/api";
import Loader from "@/components/shared/Loader";


const BusinessContactNumberField = ({
  formData,
  setFormData,
  bussinessInfo,
  handleChange,
}) => {
  const [appVerifier, setAppVerifier] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [phoneNumberToVerify, setPhoneNumberToVerify] = useState("");
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState(
    formData?.contactNumber || ""
  );
  const [formattedValue, setFormattedValue] = useState(
    formData?.contactNumber?.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2 - $3") ||
      ""
  );
  const [isCheckingNumber, setIsCheckingNumber] = useState(false);
  const [numberError, setNumberError] = useState("");

  useEffect(() => {
    const appVerifier = setupRecaptcha("recaptcha-container");
    setAppVerifier(appVerifier);
  }, []);

  const checkPhoneNumberAvailability = async (number) => {
    setIsCheckingNumber(true);
    setNumberError("");
    try {
      const response = await api.post("/api/business/info/verifyBusinessNumber", {
        number,
      });
      if (response.data.success) {
        setShowVerificationModal(true);
        setPhoneNumberToVerify(number);
      } else {
        setNumberError(
          "This number is already associated with another business account. Please use a different number."
        );
        setFormData((prev) => ({
          ...prev,
          contactNumberVerified: false,
        }));
      }
    } catch (error) {
      setNumberError(
        "Error checking phone number availability. Please try again."
      );
      setFormData((prev) => ({
        ...prev,
        contactNumberVerified: false,
      }));
    } finally {
      setIsCheckingNumber(false);
    }
  };

  const handleCloseModal = () => {
    setShowVerificationModal(false);
  };

  return (
    <>
      <div
        className="bg-white p-8 rounded-2xl shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]"
        style={{
          boxShadow:
            "1px 1px 25px 0px rgba(0, 0, 0, 0.05), -1px -1px 25px 0px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="relative">
          <div className="flex justify-between items-center mb-1">
            <h2
              className="text-lg font-semibold text-[#666666] leading-5 mb-2"
              style={{ letterSpacing: "0.2px" }}
            >
              Business Contact Number
            </h2>
          </div>
          <div className="border-t-5 rounded-full border-[#0084FF] w-24 mb-8"></div>
        </div>

        <div className="mb-4">
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              name="sameAsOwner"
              checked={formData?.sameAsOwner}
              onChange={(e) => {
                const isChecked = e?.target?.checked;

                const ownerPhone = formData?.ownerPhone || "";
                // Clean ownerPhone to ensure only digits
                const numericOwnerPhone = ownerPhone.replace(/\D/g, "");
                // Format only if ownerPhone is exactly 10 digits
                const formattedOwnerPhone =
                  numericOwnerPhone.length === 10
                    ? numericOwnerPhone.replace(
                        /(\d{3})(\d{3})(\d{4})/,
                        "($1) $2 - $3"
                      )
                    : "";

                // Clean current contactNumber to check its length
                const numericContactNumber = (
                  formData?.contactNumber || ""
                ).replace(/\D/g, "");

                if (isChecked) {
                  if (numericOwnerPhone.length === 10) {
                    // If contactNumber is partial (less than 10 digits) or different from ownerPhone,
                    // overwrite with ownerPhone
                    if (
                      numericContactNumber.length < 10 ||
                      numericContactNumber !== numericOwnerPhone
                    ) {
                      setFormData((prev) => ({
                        ...prev,
                        sameAsOwner: true,
                        contactNumber: numericOwnerPhone,
                        contactNumberVerified:
                          prev.mobileNumberVerified || false,
                      }));
                      setFormattedValue(formattedOwnerPhone);
                    } else {
                      // If contactNumber is a complete 10-digit number and matches ownerPhone,
                      // just set sameAsOwner to true
                      setFormData((prev) => ({
                        ...prev,
                        sameAsOwner: true,
                      }));
                    }
                  } else {
                    // If ownerPhone is invalid, reset to empty
                    setFormData((prev) => ({
                      ...prev,
                      sameAsOwner: true,
                      contactNumber: "",
                      contactNumberVerified: false,
                    }));
                    setFormattedValue("");
                  }
                } else {
                  const shouldClear = formattedValue === formattedOwnerPhone;

                  setFormData((prev) => ({
                    ...prev,
                    sameAsOwner: false,
                    ...(shouldClear && {
                      contactNumber: "",
                      contactNumberVerified: false,
                    }),
                  }));

                  if (shouldClear) {
                    setFormattedValue("");
                  }
                }
              }}
              className="w-4 h-4 text-blue-600 border-[#999999] rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-[#666666]">
              Same as owner's number
            </span>
          </label>
        </div>

        {!formData.sameAsOwner && (
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
                  id="contactNumber"
                  name="contactNumber"
                  value={formattedValue}
                  onChange={(e) => {
                    const numericValue = e?.target?.value?.replace(/\D/g, "");
                    let formattedValue = "";

                    if (numericValue?.length > 0) {
                      formattedValue = `(${numericValue?.substring(0, 3)}`;
                      if (numericValue?.length > 3) {
                        formattedValue += `) ${numericValue?.substring(3, 6)}`;
                      }
                      if (numericValue?.length > 6) {
                        formattedValue += ` - ${numericValue?.substring(
                          6,
                          10
                        )}`;
                      }
                    }
                    setFormattedValue(formattedValue);

                    setFormData((prev) => ({
                      ...prev,
                      contactNumber: numericValue,
                    }));

                    setNumberError(""); // Clear error on input change

                    if (numericValue.length === 10) {
                      if (bussinessInfo?.contactNumber === numericValue) {
                        setFormData((prev) => ({
                          ...prev,
                          contactNumberVerified: true,
                        }));
                        return;
                      }
                      if (verifiedPhoneNumber === numericValue) {
                        setFormData((prev) => ({
                          ...prev,
                          contactNumberVerified: true,
                        }));
                        return;
                      }
                      if (formData?.ownerPhone == numericValue) {
                        setFormData((prev) => ({
                          ...prev,
                          contactNumberVerified: prev.mobileNumberVerified,
                        }));
                        return;
                      }
                      // Call API to check number availability
                      checkPhoneNumberAvailability(numericValue);
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        contactNumberVerified: false,
                      }));
                    }
                  }}
                  className="block px-3.5 pb-3 pt-4 w-full text-sm bg-transparent rounded-xl shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] text-[#333333] border border-[#e8e8e8] appearance-none focus:outline-none focus:ring-0 peer focus:border-[#999999] transition-colors duration-300"
                  placeholder="(___) ___ - ____"
                  autoComplete="new-contactNumber"
                  maxLength={16}
                />
                <label
                  htmlFor="contactNumber"
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
                  Phone Number
                </label>
                {formData?.contactNumber?.length === 10 && (
                  <>
                    {formData?.contactNumberVerified && (
                      <div className="absolute mt-1 right-6 top-1/2 transform -translate-y-1/2 flex items-center text-[#00900E]">
                        <Image
                          src={VerifiedIcon}
                          alt="VerifiedIcon"
                          className="mr-1.5 mb-2"
                        />
                        <span className="text-sm font-medium italic leading-5 mb-2">
                          Verified
                        </span>
                      </div>
                    )}
                    {phoneNumberToVerify &&
                      !formData?.contactNumberVerified &&
                      !isCheckingNumber && (
                        <>
                          {showVerificationModal ? (
                            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex gap-1 items-center">
                              <p className="text-[#0084FF]">Verifying</p>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowVerificationModal(true)}
                              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-sm flex items-center text-[#0084FF] cursor-pointer"
                            >
                              Verify
                            </button>
                          )}
                        </>
                      )}
                    {isCheckingNumber && (
                      <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                        <Loader isLoading={true} size={5} fullscreen={false} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {numberError && (
              <p className="mt-1 ml-20 text-sm text-red-500 font-medium">
                {numberError}
              </p>
            )}
          </div>
        )}
      </div>
      <div id="recaptcha-container"></div>

      {showVerificationModal && (
        <OtpVerificationModal
          key={"BusinessContactNumberField"}
          appVerifier={appVerifier}
          phoneNumber={`+91${phoneNumberToVerify}`}
          onClose={handleCloseModal}
          setIsPhoneNumberVerified={(verified) =>
            setFormData((prev) => ({
              ...prev,
              contactNumberVerified: verified,
            }))
          }
          onVerificationSuccess={(verifiedPhone) => {
            setFormData((prev) => ({
              ...prev,
              contactNumber: verifiedPhone?.substr?.(
                verifiedPhone?.length - 10
              ),
            }));
            setShowVerificationModal(false);
            setVerifiedPhoneNumber(
              verifiedPhone?.substr?.(verifiedPhone?.length - 10)
            );
          }}
        />
      )}
    </>
  );
};

export default BusinessContactNumberField;