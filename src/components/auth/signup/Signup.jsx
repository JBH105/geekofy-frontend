"use client";

import { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { isPasswordValid, validateForm } from "./validationForm";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import api from "@/lib/api";
import PasswordValidationCard from "../login/PasswordValidationCard";
import OtpVerificationModal from "./OtpVerificationModal";
import Email from "../../../../public/image/Email.svg";
import CloseEyeIcon from "../../../../public/image/CloseEyeIcon.svg";
import OpenEyeIcon from "../../../../public/image/OpenEyeIcon.svg";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";

export default function Signup({ onClose, onSwitchToLogin, isSeller }) {
  console.log("🚀 ~ Signup ~ isSeller:", isSeller)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [signupData, setSignupData] = useState(null);
  const pathname = usePathname();
  const inputRef = useRef(null);
  const cardRef = useRef(null);
  const modalRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        cardRef.current &&
        !inputRef.current.contains(event.target) &&
        !cardRef.current.contains(event.target)
      ) {
        setShowValidation(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const loadRecaptcha = () => {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadRecaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      // Get reCAPTCHA token
      const token = await new Promise((resolve) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
              action: "submit",
            })
            .then(resolve);
        });
      });

      // Include token in the signup request
      await api.post("/api/auth/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: isSeller ? "seller" : "buyer",
        recaptchaToken: token,
      });

      setSignupData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      setShowOtpModal(true);
    } catch (error) {
      setErrors({
        ...errors,
        email: "This user already exists. Try logging instead",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerify = async (otp) => {
    try {
      const response = await api.post("/api/auth/verifyOTP", {
        email: signupData.email,
        otp: otp,
      });

      if (response.data.success) {
        return true;
      } else {
        return "Invalid OTP. Please try again.";
      }
    } catch (error) {
      return "Wrong code, please try again";
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post("/api/auth/resendOTP", {
        email: signupData.email,
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      return {
        error: error.response?.data?.message || "Failed to resend OTP",
      };
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.password.trim() &&
      formData.agreeToTerms
    );
  };

  const handleGoogleSignIn = async () => {
    try {
      Cookies.set("auth_role", isSeller ? "seller" : "buyer", {
        sameSite: "lax",
        secure: false, 
        path: "/", 
        expires: 1 / 24, 
      });
      const result = await signIn("google", {
        callbackUrl: pathname || "/",
        redirect: false,
        prompt: "select_account",
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      onClose();
    } catch (error) {
      setErrors({
        ...errors,
        form: error.message || "Google sign-in failed",
      });
    }
  };

  const onContinue = async () => {
    try {
      // Get reCAPTCHA token
      const token = await new Promise((resolve) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
              action: "submit",
            })
            .then(resolve);
        });
      });

      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        recaptchaToken: token,
        redirect: true,
        callbackUrl: pathname || "/",
      });

    } catch (error) {
      console.log("🚀 ~ onContinue ~ error:", error)
    }
  }

  return (
    <>
      {!showOtpModal && (
        <div className="fixed inset-0 bg-[#00000066] transition-opacity flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl p-8 sm:px-[60px] sm:py-10 w-full max-w-[492px] relative mx-4 sm:mx-0"
            style={{ maxHeight: "90vh", overflowY: "auto" }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#666666] hover:text-[#929292] cursor-pointer"
              aria-label="Close signup modal"
            >
              <AiOutlineClose className="w-5 h-5" />
            </button>

            <h2 className="text-[28px] font-medium text-center mb-6 text-[#4D4D4D]">
              Create an account
            </h2>

            <div className="space-y-6">
              <button
                onClick={handleGoogleSignIn}
                type="button"
                className="w-full flex items-center justify-center gap-8 border text-[#666666] rounded-md p-3 hover:bg-gray-50 transition text-[14px] font-medium cursor-pointer"
                style={{
                  boxShadow: " 0px 2px 2px 0px #0000000D",
                  border: "1px solid var(--20-line, #00000033)",
                }}
              >
                <FcGoogle className="h-5 w-5 sm:h-6 sm:w-6" />
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#CFCFCF]"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-sm text-[#CFCFCF]">
                    OR
                  </span>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`block px-3.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 peer ${
                          errors.firstName
                            ? "border-[#FA0707]"
                            : "border-[#999999]"
                        }`}
                        placeholder=" "
                        autoComplete="off"
                      />
                      <label
                        htmlFor="firstName"
                        className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3 ${
                          errors.firstName ? "text-[#FA0707]" : "text-[#999999]"
                        }`}
                      >
                        First name *
                      </label>
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`block px-3.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 peer ${
                          errors.lastName
                            ? "border-[#FA0707]"
                            : "border-[#999999]"
                        }`}
                        placeholder=" "
                        autoComplete="off"
                      />
                      <label
                        htmlFor="lastName"
                        className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3 ${
                          errors.lastName ? "text-[#FA0707]" : "text-[#999999]"
                        }`}
                      >
                        Last name *
                      </label>
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-600 italic">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block px-3.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 peer ${
                        errors.email ? "border-[#FA0707]" : "border-[#999999]"
                      }`}
                      placeholder=" "
                      autoComplete="off"
                    />
                    <label
                      htmlFor="email"
                      className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3 ${
                        errors.email ? "text-[#FA0707]" : "text-[#999999]"
                      }`}
                    >
                      Email *
                    </label>
                    <Image
                      src={Email}
                      alt="Email.svg"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 italic">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div ref={cardRef}>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setShowValidation(true)}
                      ref={inputRef}
                      className={`block px-3.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 peer ${
                        errors.password
                          ? "border-[#FA0707]"
                          : "border-[#999999]"
                      }`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="password"
                      className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3 ${
                        errors.password ? "text-[#FA0707]" : "text-[#999999]"
                      }`}
                    >
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999999] cursor-pointer"
                    >
                      {passwordVisible ? (
                        <Image src={OpenEyeIcon} alt="OpenEyeIcon" />
                      ) : (
                        <Image src={CloseEyeIcon} alt="CloseEyeIcon" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 italic">
                      {errors.password}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-[#999999]">
                    Minimum 6 characters (Mix of Uppercase, Lowercase and
                    Number)
                  </p>

                  {showValidation && !isPasswordValid(formData.password) && (
                    <PasswordValidationCard password={formData.password} />
                  )}
                </div>
                <div className="flex items-start space-x-3.5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 text-[#0084ff] border-[#999999] rounded focus:ring-[#0084ff]"
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm text-[#666666]"
                  >
                    I agree with <span className="text-[#2E8CFF]">terms</span>{" "}
                    and <span className="text-[#2E8CFF]">privacy policy</span>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-xs text-red-600 italic">
                    {errors.agreeToTerms}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className={`w-full py-3 rounded-lg transition cursor-pointer mt-3 ${
                    !isFormValid()
                      ? "bg-[#0000004D] text-white cursor-not-allowed"
                      : "bg-[#0084ff] text-white hover:bg-[#0084ff]/90"
                  } ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? "Signing up..." : "Sign up"}
                </button>
              </form>

              <p className="text-start text-base sm:text-sm text-[#666666] mt-8">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-[#0084ff] hover:text-[#0084ff]/80 font-medium cursor-pointer ml-1"
                  onClick={onSwitchToLogin}
                >
                  Log In
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
      {showOtpModal && (
        <OtpVerificationModal
          email={signupData?.email}
          onVerify={handleOtpVerify}
          onClose={onClose}
          onResend={handleResendOtp}
          onContinue={onContinue}
        />
      )}
    </>
  );
}
