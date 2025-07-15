"use client";

import { useState, useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import OtpImage from "../../../../public/image/otpmessage.svg";
import Success from "../../../../public/image/Success.svg";

export default function OtpVerificationModal({
  email,  
  onVerify,
  onClose,
  onResend,
  resendDelay = 30,
  isForgotPasswordModal = false,
  onContinue,
  onSwitchToLogin,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(resendDelay);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [error, setError] = useState(null);
  const inputRefs = useRef(Array(6).fill(null));

  useEffect(() => {
    if (resendDisabled) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return resendDelay;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendDisabled, resendDelay]);

  useEffect(() => {
    // Auto submit when 6th digit is entered
    if (otp[5] !== "") {
      const enteredOtp = otp.join("");
      if (enteredOtp.length === 6) {
        handleSubmitAutomatically(enteredOtp);
      }
    }
  }, [otp]);

  useEffect(() => {
    // Focus the first input when the component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError(null);

    if (value && index < 5) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }

    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text/plain")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasteData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      if (i < 6) {
        newOtp[i] = pasteData[i];
      }
    }
    setOtp(newOtp);
    setError(null);

    const lastFilledIndex = Math.min(pasteData.length - 1, 5);
    const lastInput = inputRefs.current[lastFilledIndex];
    if (lastInput) {
      lastInput.focus();
    }
  };

  const handleSubmitAutomatically = async (enteredOtp) => {
    setIsSubmitting(true);
    try {
      const result = await onVerify(enteredOtp);
      if (typeof result === "string") {
        setError(result);
      } else {
        setVerificationSuccess(true);
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setError(error.message || "Wrong code, please try again.");
      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }
    await handleSubmitAutomatically(enteredOtp);
  };

  const handleResend = async () => {
    const result = await onResend();
    if (result?.error) {
      setError(result.error);
    } else {
      setResendDisabled(true);
      setResendTimer(resendDelay);
      setError(null);
      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  };

const handleContinue = () => {
  if (onContinue) {
    onContinue();
  }
  if (isForgotPasswordModal) {
    if (onContinue) {
      onContinue();
    }
  } else {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    }
  }
};

  const maskedEmail = email
    ? `${email.substring(0, 1)}********${email.substring(
        email.indexOf("@") - 1
      )}`
    : "";

  return (
    <div className="fixed inset-0 bg-[#00000066] transition-opacity flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 sm:px-[60px] sm:py-10 w-full max-w-[492px] relative mx-auto">
        {!verificationSuccess && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#666666] hover:text-[#929292] cursor-pointer"
            aria-label="Close verification modal"
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        )}

        {verificationSuccess ? (
          <div className="text-center">
            <Image
              src={Success}
              alt="Success"
              width={80}
              height={80}
              className="mx-auto mb-4 sm:mb-10"
            />
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#333333]">
              Success!
            </h2>
            <p className="text-[#666666] mb-4 sm:mb-[72px] px-8 text-sm sm:text-base">
              {isForgotPasswordModal
                ? "Congratulations! You have been successfully authenticated"
                : "Congratulations! You have been successfully authenticated"}
            </p>
            <button
              onClick={handleContinue}
              className="w-full bg-[#0084ff] text-white py-2 sm:py-3 rounded-lg hover:bg-[#0084ff]/90 transition text-sm sm:text-base cursor-pointer"
            >
              {isForgotPasswordModal ? "Continue" : "Continue"}
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-start">
              <div className="text-start flex items-center gap-2 sm:gap-4">
                <Image
                  src={OtpImage}
                  alt="OTP Message"
                  height={125}
                  width={125}
                  className="mb-2 sm:mb-5"
                />
              </div>

              <div className="text-start text-[#666666]">
                <h2 className="text-xl sm:text-2xl font-medium my-1 sm:my-3">
                  Enter verification code
                </h2>
                <p className="text-[#666666] my-2 sm:my-5 text-sm sm:text-sm">
                  6 digit OTP has been sent to {maskedEmail}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="w-full space-y-4 sm:space-y-6"
              >
                <div className="flex justify-start space-x-1 sm:space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      ref={(el) => (inputRefs.current[index] = el)}
                      maxLength={1}
                      className={`w-10 h-10 sm:w-12 sm:h-14 border rounded-[10px] text-center text-lg sm:text-xl focus:outline-none ${
                        error ? "border-[#FA0707]" : "border-[#00000033]"
                      }`}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-[#FA0707] text-xs sm:text-sm text-start">
                    {error}
                  </p>
                )}

                <div className="text-start mt-2 sm:mt-4 text-xs sm:text-sm text-[#666666] w-full">
                  <p className="flex items-center flex-wrap gap-3">
                    <span className={`${resendDisabled ? "hidden" : "inline"}`}>
                      Didn't receive the code?
                    </span>
                    <span>
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendDisabled}
                        className={`font-medium cursor-pointer ${
                          resendDisabled
                            ? "text-[#666666] opacity-100 cursor-default"
                            : "text-[#0084ff] hover:text-[#0084ff]/80"
                        }`}
                      >
                        {resendDisabled
                          ? `Resend OTP in (${resendTimer}) seconds`
                          : "Resend now"}
                      </button>
                    </span>
                  </p>
                </div>

                <div className="border-1 border-[#00000033]"></div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-[#0084ff] text-white py-2 sm:py-3 rounded-lg hover:bg-[#0084ff]/90 transition text-sm sm:text-base ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Verifying..." : "Verify"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
