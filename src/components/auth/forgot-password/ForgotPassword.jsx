"use client";
import Image from "next/image";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import PasswordResetModal from "./PasswordResetModal";
import OtpVerificationModal from "../signup/OtpVerificationModal";
import Email from "../../../../public/image/Email.svg";
import api from "@/lib/api";

const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/forgot-password", {
        email: formData.email,
      });

      if (response.data.success) {
        setIsSubmitted(true);
        setShowOtpModal(true);
      } else {
        setErrors({
          ...errors,
          email: "User account not found. Sign up instead",
        });
      }
    } catch (error) {
      setErrors({
        ...errors,
        email: "User account not found. Sign up instead",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (otp) => {
    try {
      const response = await api.post("/api/auth/verifyOTP", {
        email: formData.email,
        otp: otp,
      });

      if (response.data.success) {
        return true;
      } else {
        return response.data.message || "Invalid OTP. Please try again.";
      }
    } catch (error) {
      return (
        error.response?.data?.message ||
        "Failed to verify OTP. Please try again."
      );
    }
  };

  const handleOtpModalClose = () => {
    setShowOtpModal(false);
  };

  const handleResendOtp = async () => {
    try {
      const response = await api.post("/api/auth/resendOTP", {
        email: formData.email,
      });

      if (response.data.success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      return false;
    }
  };

  const handlePasswordResetClose = () => {
    setShowPasswordResetModal(false);
    onClose();
  };

  const openPasswordResetModal = () => {
    setShowOtpModal(false);
    setShowPasswordResetModal(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#00000066] transition-opacity flex items-center justify-center z-50 p-4">
        <div className="relative bg-white rounded-2xl p-6 sm:px-[60px] sm:py-10 w-full max-w-[492px]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#666666] hover:text-[#666666] cursor-pointer"
          >
            <AiOutlineClose className="h-6 w-6" />
          </button>
          <div className="">
            <h1 className="text-xl text-center font-medium text-[#4D4D4D] mb-[32px]">
              Forgot Password
            </h1>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="">
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block px-3.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 peer ${
                      errors.email ? "border-[#F52A19]" : "border-[#CCCCCC]"
                    }`}
                    placeholder=" "
                    autoComplete="off"
                  />
                  <label
                    htmlFor="email"
                    className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3 ${
                      errors.email ? "text-[#F52A19]" : "text-[#999999]"
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
                  <p className="mt-2 text-xs text-[#D13030] italic">
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#0084FF] hover:bg-[#0084FF]/80 text-white font-medium py-3 px-4 rounded-lg transition duration-200 cursor-pointer ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Sending..." : "Send Email OTP"}
              </button>
            </form>
            <div className="mt-[32px] text-start tex-base ">
              <p className="text-sm text-[#666666]">
                Already have an account?{" "}
                <button
                  onClick={onClose}
                  className="text-[#0084ff] hover:text-[#0084ff]/80 font-medium cursor-pointer ml-1"
                >
                  Log In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}

      {showOtpModal && (
        <OtpVerificationModal
          email={formData.email}
          onVerify={handleOtpVerify}
          onClose={handleOtpModalClose}
          onResend={handleResendOtp}
          isForgotPasswordModal={true}
          onContinue={openPasswordResetModal}
        />
      )}
      {showPasswordResetModal && (
        <PasswordResetModal
          email={formData.email}
          onClose={handlePasswordResetClose}
          onSwitchToLogin={onSwitchToLogin}
        />
      )}
    </>
  );
};

export default ForgotPasswordModal;
