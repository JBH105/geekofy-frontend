"use client";

import StoreLocationMapSection from "./StoreLocationMapSection ";
import BusinessContactNumberField from "./BusinessContactNumberField";
import Image from "next/image";
import VerifiedIcon from "../../../../public/image/VerifiedIcon.svg";
import PhoneNumberField from "./PhoneNumberField";
import EmailOtpVerificationModal from "./EmailOtpVerificationModal";

const BusinessInfoTab = ({
  formData,
  handleChange,
  validateFormData,
  isBusinessIdAvailable,
  setFormData,
  validateEmail,
  handleNext,
  bussinessInfo,
  showEmailVerificationModal,
  setShowEmailVerificationModal,
}) => {

  const handleInput = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
    if (value !== sanitizedValue) {
      e.target.value = sanitizedValue;
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    }
  };

  return (
    <>
      {/* Business Name */}
      <div
        className="p-8 rounded-2xl shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] bg-white"
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
              Business Name
            </h2>
          </div>

          <div className="border-t-5 rounded-full border-[#0084FF] w-24 mb-8"></div>

          <div className="relative mb-4">
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              onInput={handleInput}
              className="block px-3.5 pb-3 pt-4 w-full text-sm bg-transparent rounded-xl shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] text-[#333333] border border-[#e8e8e8] appearance-none focus:outline-none focus:ring-0 peer focus:border-[#999999] transition-colors duration-300"
              placeholder=" "
              autoComplete="off"
            />
            <label
              htmlFor="businessName"
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
              Business name *
            </label>
          </div>
        </div>
      </div>

      {/* Owner Details */}

      <div
        className="p-8 rounded-2xl shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] bg-white"
        style={{
          boxShadow:
            "1px 1px 25px 0px rgba(0, 0, 0, 0.05), -1px -1px 25px 0px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="relative">
          <div className="flex items-center gap-[4px] mb-2">
            <h2 className="text-lg font-semibold text-[#666666] leading-5">
              Owner Details
            </h2>
            <p className="text-xs font-medium text-[#6A6A6A] italic leading-5">
              (Geekofy use these details for all business communications and
              updates)
            </p>
          </div>
          <div className="border-t-5 rounded-full border-[#0084FF] w-24 mb-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
          <div className="relative">
            <input
              type="text"
              id="ownerFirstName"
              name="ownerFirstName"
              value={formData.ownerFirstName}
              onChange={handleChange}
              className="block px-3.5 pb-3 pt-4 w-full text-sm bg-transparent rounded-xl shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] text-[#333333] border border-[#e8e8e8] appearance-none focus:outline-none focus:ring-0 peer focus:border-[#999999] transition-colors duration-300"
              placeholder=" "
              autoComplete="off"
              pattern="[A-Za-z ]*"
              title="Only alphabets are allowed"
            />
            <label
              htmlFor="ownerFirstName"
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
              First name *
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              id="ownerLastName"
              name="ownerLastName"
              value={formData.ownerLastName}
              onChange={handleChange}
              className="block px-3.5 pb-3 pt-4 w-full text-sm bg-transparent rounded-xl shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] text-[#333333] border border-[#e8e8e8] appearance-none focus:outline-none focus:ring-0 peer focus:border-[#999999] transition-colors duration-300"
              placeholder=" "
              autoComplete="off"
              pattern="[A-Za-z ]*"
              title="Only alphabets are allowed"
            />
            <label
              htmlFor="ownerLastName"
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
              Last name *
            </label>
          </div>
        </div>

        <div className="relative mb-4">
          <input
            type="email"
            id="ownerEmail"
            name="ownerEmail"
            value={formData.ownerEmail}
            onChange={(e) => {
              handleChange(e);
              if (!validateEmail(e?.target?.value)) {
                setFormData((prev) => ({
                  ...prev,
                  isEmailVerifying: false,
                }));
              }
                setFormData((prev) => ({
                  ...prev,
                  isEmailVerifying: bussinessInfo?.ownerEmail == e?.target?.value?.trim?.() ? true : false,
                }));
                
            }}
            className={`block px-3.5 pb-3 pt-4 w-full text-sm bg-transparent rounded-xl shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] text-[#333333] border border-[#e8e8e8] appearance-none focus:outline-none focus:ring-0 peer focus:border-[#999999] transition-colors duration-300 ${
              formData.ownerEmail && !validateEmail(formData.ownerEmail)
                ? "border-red-500"
                : "border-[#999999]"
            }`}
            placeholder=" "
            autoComplete="off"
          />
          <label
            htmlFor="ownerEmail"
            className={`absolute text-sm ${
              formData.ownerEmail && !validateEmail(formData.ownerEmail)
                ? "text-red-500"
                : "text-[#9C9C9C]"
            }  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 left-3 
                 peer-placeholder-shown:scale-100 
                 peer-placeholder-shown:-translate-y-1/2 
                 peer-placeholder-shown:top-1/2 
                 peer-focus:top-2 
                 peer-focus:scale-75 
                 peer-focus:-translate-y-4 
                 peer-focus:left-3 
                 peer-focus:text-[#333333] 
                 peer-focus:font-medium`}
          >
            Owner email *
          </label>
          {formData.ownerEmail && !validateEmail(formData.ownerEmail) && (
            <p className="mt-1 text-xs text-red-500">
              Please enter a valid email address
            </p>
          )}

          {formData.ownerEmail && validateEmail(formData.ownerEmail) && (
            <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
              {showEmailVerificationModal ? (
                <div className="flex gap-1 items-center">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-5 h-5 text-gray-200 animate-spin fill-blue-600"
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
              ) : formData?.isEmailVerifying ? (
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
              ) : (
                <button
                  onClick={() => {
                    setShowEmailVerificationModal(true);
                  }}
                  className="flex items-center text-[#0084FF] cursor-pointer mr-1"
                >
                  Verify
                </button>
              )}
            </div>
          )}
        </div>

        {showEmailVerificationModal && (
          <EmailOtpVerificationModal
            email={formData.ownerEmail}
            onVerificationSuccess={(verifiedEmail) => {
              setFormData((prev) => ({
                ...prev,
                isEmailVerifying: true,
                ownerEmail: verifiedEmail,
              }));
              setShowEmailVerificationModal(false);
            }}
            onClose={() => {
              setShowEmailVerificationModal(false);
            }}
          />
        )}

        <PhoneNumberField
          formData={formData}
          setFormData={(arg) => {
            setFormData(arg);
            setFormData((prev) => {
              if (prev?.sameAsOwner) {
                return {
                  ...prev,
                  contactNumber: prev?.ownerPhone,
                  contactNumberVerified: prev?.mobileNumberVerified,
                };
              } else {
                return prev;
              }
            });
          }}
        />
      </div>

      {/* Business Contact Number */}
      <BusinessContactNumberField
        formData={formData}
        setFormData={setFormData}
        bussinessInfo={bussinessInfo}
        handleChange={handleChange}
      />

      {/* Locate On Map */}
      <div className="bg-white p-8 rounded-2xl shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
        <div className="relative">
          <div className="flex justify-between items-center mb-1">
            <h2
              className="text-lg font-semibold text-[#666666] leading-5 mb-2"
              style={{ letterSpacing: "0.2px" }}
            >
              Locate On Map
            </h2>
          </div>
          <StoreLocationMapSection
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      </div>

      {/* Unique Business Id. */}
      <div
        className="bg-white p-8 rounded-2xl shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] mb-24"
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
              Unique Business Id.
            </h2>
          </div>
          <div className="h-1 w-24 rounded-full bg-[#0084FF] mb-8"></div>

          <div className="mb-6">
            <label
              htmlFor="businessSlug"
              className="block text-sm font-medium text-[#444444] mb-1"
            >
              Your Business id{" "}
              <span className="text-xs font-medium text-[#6A8A6A] italic">
                (Preferably your brand name to create a unique URL)
              </span>
            </label>

            <div className="flex gap-6 items-start mt-5 mb-2">
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    id="businessSlug"
                    name="businessSlug"
                    value={formData.businessSlug}
                    onChange={handleChange}
                    className={`block px-3.5 pb-3 pt-4 w-[384px] h-[48px] text-sm bg-transparent rounded-xl shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] text-[#333333] border border-[#e8e8e8] appearance-none focus:outline-none focus:ring-0 peer focus:border-[#999999] transition-colors duration-300 ${
                      bussinessInfo?.businessSlug
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder=""
                    autoComplete="off"
                    disabled={!!bussinessInfo?.businessSlug}
                    readOnly={!!bussinessInfo?.businessSlug}
                  />
                  <label
                    htmlFor="businessSlug"
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
                    Business-id
                  </label>
                </div>
              </div>

              {formData.businessSlug && (
                <div className="flex items-center gap-2 mt-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[#333333] ${
                      isBusinessIdAvailable || bussinessInfo?.businessSlug
                        ? "bg-green-500"
                        : "bg-red-500"
                    } text-white`}
                  >
                    {isBusinessIdAvailable || bussinessInfo?.businessSlug ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {bussinessInfo?.businessSlug
                      ? "Assigned"
                      : isBusinessIdAvailable
                      ? "Available"
                      : "Not Available"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-1">
              <div className="text-xs text-[#666666]">
                Only characters, numbers or - (hyphen special character is
                allowed)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end items-center gap-8 my-[103px]">
        <button
          className={`flex items-center justify-center self-stretch w-[134px] py-[12px] rounded-[8px] ${
            validateFormData(formData)
              ? "bg-[#1C273B] cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={!validateFormData(formData)}
        >
          <span className="text-white text-center font-helvetica text-[16px] font-normal leading-[24px]">
            Next
          </span>
        </button>
      </div>
    </>
  );
};

export default BusinessInfoTab;
