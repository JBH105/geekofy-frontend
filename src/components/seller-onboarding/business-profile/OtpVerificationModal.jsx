// "use client";

// import { useEffect, useState, useRef } from "react";
// import Image from "next/image";
// import { AiOutlineClose } from "react-icons/ai";
// import MobileOtpImage from "../../../../public/image/MobileOtpImage.svg";
// import { sendOTP, verifyOTP } from "@/lib/firebase";
// import { toast } from "react-toastify";

// const OtpVerificationModal = ({
//   phoneNumber,
//   onVerificationSuccess,
//   onClose,
//   setIsPhoneNumberVerified,
//   appVerifier,
// }) => {
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [confirmationResult, setConfirmationResult] = useState(null);
//   const [resendDisabled, setResendDisabled] = useState(true);
//   const [resendTimer, setResendTimer] = useState(30);

//   const inputRefs = useRef([]);

//   const cleanedNumber = phoneNumber.replace(/\s+/g, "");
//   const maskedPhone =
//     cleanedNumber.length > 13
//       ? `${cleanedNumber.substring(0, 3)} ${cleanedNumber.substring(3, 13)}`
//       : `${cleanedNumber.substring(0, 3)} ${cleanedNumber.substring(3)}`;

//   useEffect(() => {
//     handleSendOTP();
//   }, []);

//   useEffect(() => {
//     if (resendDisabled && resendTimer > 0 && confirmationResult) {
//       const interval = setInterval(() => {
//         setResendTimer((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(interval);
//     } else if (resendTimer === 0) {
//       setResendDisabled(false);
//     }
//   }, [resendDisabled, resendTimer, confirmationResult]);

//   const handleSendOTP = async () => {
//     try {
//       const result = await sendOTP(phoneNumber, appVerifier);
//       setConfirmationResult(result);
//       setResendDisabled(true);
//       setResendTimer(30);
//     } catch (err) {
//       onClose();
//       toast.error("Failed to send OTP. Please try again.");
//     }
//   };

//   const handleAutoSubmit = async (otp) => {
//     setError("");
//     setIsSubmitting(true);

//     const code = otp.join("");

//     if (code.length !== 6) {
//       setError("Please enter a valid 6-digit OTP.");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       await verifyOTP(confirmationResult, code);
//       setIsPhoneNumberVerified(true);
//       onVerificationSuccess(phoneNumber);
//     } catch (err) {
//       setError(err?.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleChange = (e, index) => {
//     const value = e.target.value;
//     if (/^[0-9]?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//       setError("");

//       if (value && index < 5) {
//         inputRefs.current[index + 1]?.focus();
//       }

//       if (newOtp.every((digit) => digit !== "") && newOtp.length === 6) {
//         handleAutoSubmit(newOtp);
//       }
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handlePaste = (e) => {
//     const pasteData = e.clipboardData.getData("Text").slice(0, 6).split("");
//     const newOtp = [...otp];
//     pasteData.forEach((char, i) => {
//       if (i < 6 && /^[0-9]$/.test(char)) {
//         newOtp[i] = char;
//       }
//     });
//     setOtp(newOtp);
//     inputRefs.current[pasteData.length - 1]?.focus();

//     if (newOtp.every((digit) => digit !== "") && newOtp.length === 6) {
//       handleAutoSubmit(newOtp);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e?.preventDefault?.();
//     setError("");
//     setIsSubmitting(true);

//     const code = otp.join("");

//     if (code.length !== 6) {
//       setError("Please enter a valid 6-digit OTP.");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       await verifyOTP(confirmationResult, code);
//       setIsPhoneNumberVerified(true);
//       onVerificationSuccess(phoneNumber);
//     } catch (err) {
//       setError(err?.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <div className="fixed inset-0 bg-[#00000066] transition-opacity flex items-center justify-center z-50 px-4">
//         <div className="bg-white rounded-2xl p-6 sm:px-[60px] sm:py-10 w-full max-w-[492px] relative mx-auto">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-[#666666] hover:text-[#929292] cursor-pointer"
//             aria-label="Close verification modal"
//           >
//             <AiOutlineClose className="w-5 h-5" />
//           </button>
//           <div className="flex flex-col items-start">
//             <div className="text-start flex items-center gap-2 sm:gap-4">
//               <Image
//                 src={MobileOtpImage}
//                 alt="OTP Message"
//                 height={125}
//                 width={125}
//                 className="mb-2 sm:mb-5"
//               />
//             </div>

//             <div className="text-start text-[#666666]">
//               <h2 className="text-xl sm:text-2xl font-medium my-1 sm:my-3">
//                 Enter verification code
//               </h2>
//               <p className="text-[#666666] my-2 sm:my-5 text-sm sm:text-sm">
//                 6 digit OTP has been sent to {maskedPhone}
//               </p>
//             </div>

//             <form
//               onSubmit={handleSubmit}
//               className="w-full space-y-4 sm:space-y-6"
//             >
//               <div className="flex justify-start space-x-1 sm:space-x-2">
//                 {otp.map((digit, index) => (
//                   <input
//                     key={index}
//                     type="text"
//                     disabled={!confirmationResult}
//                     value={digit}
//                     onChange={(e) => handleChange(e, index)}
//                     onKeyDown={(e) => handleKeyDown(e, index)}
//                     onPaste={handlePaste}
//                     ref={(el) => (inputRefs.current[index] = el)}
//                     maxLength={1}
//                     className={`w-10 h-10 sm:w-12 sm:h-14 border rounded-[10px] text-center text-lg sm:text-xl focus:outline-none ${
//                       error ? "border-[#FA0707]" : "border-[#00000033]"
//                     }`}
//                     inputMode="numeric"
//                     autoComplete="one-time-code"
//                   />
//                 ))}
//               </div>

//               {error && (
//                 <p className="text-[#FA0707] text-xs sm:text-sm text-start">
//                   {error}
//                 </p>
//               )}

//               <div className="text-start mt-2 sm:mt-4 text-xs sm:text-sm text-[#666666] w-full">
//                 <p className="flex items-center flex-wrap gap-3">
//                   <span className={`${resendDisabled ? "hidden" : "inline"}`}>
//                     Didn't receive the code?
//                   </span>
//                   <span>
//                     <button
//                       type="button"
//                       onClick={handleSendOTP}
//                       disabled={resendDisabled}
//                       className={`font-medium cursor-pointer ${
//                         resendDisabled
//                           ? "text-[#666666] opacity-100 cursor-default"
//                           : "text-[#0084ff] hover:text-[#0084ff]/80"
//                       }`}
//                     >
//                       {resendDisabled
//                         ? `Resend OTP in (${resendTimer}) seconds`
//                         : "Resend now"}
//                     </button>
//                   </span>
//                 </p>
//               </div>

//               <div className="border-1 border-[#00000033]"></div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting || !confirmationResult}
//                 className={`w-full bg-[#0084ff] text-white py-2 sm:py-3 rounded-lg hover:bg-[#0084ff]/90 transition text-sm sm:text-base cursor-pointer ${
//                   isSubmitting ? "opacity-70 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isSubmitting ? "Verifying..." : "Verify"}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OtpVerificationModal;

// "use client";

// import { useEffect, useState, useRef } from "react";
// import Image from "next/image";
// import { AiOutlineClose } from "react-icons/ai";
// import MobileOtpImage from "../../../../public/image/MobileOtpImage.svg";
// import { sendOTP, verifyOTP } from "@/lib/firebase";
// import { toast } from "react-toastify";

// const OtpVerificationModal = ({
//   phoneNumber,
//   onVerificationSuccess,
//   onClose,
//   setIsPhoneNumberVerified,
//   appVerifier,
// }) => {
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [confirmationResult, setConfirmationResult] = useState(null);
//   const [resendDisabled, setResendDisabled] = useState(true);
//   const [resendTimer, setResendTimer] = useState(30);

//   const inputRefs = useRef([]);

//   const cleanedNumber = phoneNumber.replace(/\s+/g, "");
//   const maskedPhone =
//     cleanedNumber.length > 13
//       ? `${cleanedNumber.substring(0, 3)} ${cleanedNumber.substring(3, 13)}`
//       : `${cleanedNumber.substring(0, 3)} ${cleanedNumber.substring(3)}`;

//   useEffect(() => {
//     if (resendDisabled && resendTimer > 0 && confirmationResult) {
//       const interval = setInterval(() => {
//         setResendTimer((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(interval);
//     } else if (resendTimer === 0) {
//       setResendDisabled(false);
//     }
//   }, [resendDisabled, resendTimer, confirmationResult]);

//   const handleSendOTP = async () => {
//     try {
//       const result = await sendOTP(phoneNumber, appVerifier);
//       setConfirmationResult(result);
//       setResendDisabled(true);
//       setResendTimer(30);
//     } catch (err) {
//       onClose();
//       toast.error("Failed to send OTP. Please try again.");
//     }
//   };

//   useEffect(() => {
//     handleSendOTP();

//     const timer = setTimeout(() => {
//       if (inputRefs.current[0]) {
//         inputRefs.current[0].focus();
//       }
//     }, 100);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     const handleFocus = (e) => {
//       if (!inputRefs.current.some((ref) => ref && ref.contains(e.target))) {
//         inputRefs.current[0]?.focus();
//       }
//     };

//     document.addEventListener("focusin", handleFocus);
//     return () => document.removeEventListener("focusin", handleFocus);
//   }, []);


//   const handleAutoSubmit = async (otp) => {
//     setError("");
//     setIsSubmitting(true);

//     const code = otp.join("");

//     if (code.length !== 6) {
//       setError("Please enter a valid 6-digit OTP.");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       await verifyOTP(confirmationResult, code);
//       setIsPhoneNumberVerified(true);
//       onVerificationSuccess(phoneNumber);
//     } catch (err) {
//       setError(err?.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleChange = (e, index) => {
//     const value = e.target.value;
//     if (/^[0-9]?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//       setError("");

//       if (value && index < 5) {
//         inputRefs.current[index + 1]?.focus();
//       }

//       if (newOtp.every((digit) => digit !== "") && newOtp.length === 6) {
//         handleAutoSubmit(newOtp);
//       }
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handlePaste = (e) => {
//     const pasteData = e.clipboardData.getData("Text").slice(0, 6).split("");
//     const newOtp = [...otp];
//     pasteData.forEach((char, i) => {
//       if (i < 6 && /^[0-9]$/.test(char)) {
//         newOtp[i] = char;
//       }
//     });
//     setOtp(newOtp);
//     inputRefs.current[pasteData.length - 1]?.focus();

//     if (newOtp.every((digit) => digit !== "") && newOtp.length === 6) {
//       handleAutoSubmit(newOtp);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e?.preventDefault?.();
//     setError("");
//     setIsSubmitting(true);

//     const code = otp.join("");

//     if (code.length !== 6) {
//       setError("Please enter a valid 6-digit OTP.");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       await verifyOTP(confirmationResult, code);
//       setIsPhoneNumberVerified(true);
//       onVerificationSuccess(phoneNumber);
//     } catch (err) {
//       setError(err?.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <div className="fixed inset-0 bg-[#00000066] transition-opacity flex items-center justify-center z-50 px-4">
//         <div className="bg-white rounded-2xl p-6 sm:px-[60px] sm:py-10 w-full max-w-[492px] relative mx-auto">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-[#666666] hover:text-[#929292] cursor-pointer"
//             aria-label="Close verification modal"
//           >
//             <AiOutlineClose className="w-5 h-5" />
//           </button>
//           <div className="flex flex-col items-start">
//             <div className="text-start flex items-center gap-2 sm:gap-4">
//               <Image
//                 src={MobileOtpImage}
//                 alt="OTP Message"
//                 height={125}
//                 width={125}
//                 className="mb-2 sm:mb-5"
//               />
//             </div>

//             <div className="text-start text-[#666666]">
//               <h2 className="text-xl sm:text-2xl font-medium my-1 sm:my-3">
//                 Enter verification code
//               </h2>
//               <p className="text-[#666666] my-2 sm:my-5 text-sm sm:text-sm">
//                 6 digit OTP has been sent to {maskedPhone}
//               </p>
//             </div>

//             <form
//               onSubmit={handleSubmit}
//               className="w-full space-y-4 sm:space-y-6"
//             >
//               <div className="flex justify-start space-x-1 sm:space-x-2">
//                 {otp.map((digit, index) => (
//                   <input
//                     key={index}
//                     type="text"
//                     disabled={!confirmationResult}
//                     value={digit}
//                     onChange={(e) => handleChange(e, index)}
//                     onKeyDown={(e) => handleKeyDown(e, index)}
//                     onPaste={handlePaste}
//                     ref={(el) => (inputRefs.current[index] = el)}
//                     maxLength={1}
//                     className={`w-10 h-10 sm:w-12 sm:h-14 border rounded-[10px] text-center text-lg sm:text-xl focus:outline-none ${
//                       error ? "border-[#FA0707]" : "border-[#00000033]"
//                     }`}
//                     inputMode="numeric"
//                     autoComplete="one-time-code"
//                   />
//                 ))}
//               </div>

//               {error && (
//                 <p className="text-[#FA0707] text-xs sm:text-sm text-start">
//                   {error}
//                 </p>
//               )}

//               <div className="text-start mt-2 sm:mt-4 text-xs sm:text-sm text-[#666666] w-full">
//                 <p className="flex items-center flex-wrap gap-3">
//                   <span className={`${resendDisabled ? "hidden" : "inline"}`}>
//                     Didn't receive the code?
//                   </span>
//                   <span>
//                     <button
//                       type="button"
//                       onClick={handleSendOTP}
//                       disabled={resendDisabled}
//                       className={`font-medium cursor-pointer ${
//                         resendDisabled
//                           ? "text-[#666666] opacity-100 cursor-default"
//                           : "text-[#0084ff] hover:text-[#0084ff]/80"
//                       }`}
//                     >
//                       {resendDisabled
//                         ? `Resend OTP in (${resendTimer}) seconds`
//                         : "Resend now"}
//                     </button>
//                   </span>
//                 </p>
//               </div>

//               <div className="border-1 border-[#00000033]"></div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting || !confirmationResult}
//                 className={`w-full bg-[#0084ff] text-white py-2 sm:py-3 rounded-lg hover:bg-[#0084ff]/90 transition text-sm sm:text-base cursor-pointer ${
//                   isSubmitting ? "opacity-70 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isSubmitting ? "Verifying..." : "Verify"}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OtpVerificationModal;


"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import MobileOtpImage from "../../../../public/image/MobileOtpImage.svg";
import { sendOTP, verifyOTP } from "@/lib/firebase";
import { toast } from "react-toastify";

const OtpVerificationModal = ({
  phoneNumber,
  onVerificationSuccess,
  onClose,
  setIsPhoneNumberVerified,
  appVerifier,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(30);

  const inputRefs = useRef([]);

  const cleanedNumber = phoneNumber.replace(/\s+/g, "");
  const maskedPhone =
    cleanedNumber.length > 13
      ? `${cleanedNumber.substring(0, 3)} ${cleanedNumber.substring(3, 13)}`
      : `${cleanedNumber.substring(0, 3)} ${cleanedNumber.substring(3)}`;

  useEffect(() => {
    if (resendDisabled && resendTimer > 0 && confirmationResult) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
    }
  }, [resendDisabled, resendTimer, confirmationResult]);

  const handleSendOTP = async () => {
    try {
      const result = await sendOTP(phoneNumber, appVerifier);
      setConfirmationResult(result);
      setResendDisabled(true);
      setResendTimer(30);
    } catch (err) {
      onClose();
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  useEffect(() => {
    handleSendOTP();
  }, []);

  useEffect(() => {
    if (confirmationResult && inputRefs.current[0]) {
      const timer = setTimeout(() => {
        inputRefs.current[0].focus();
      }, 100); 
      return () => clearTimeout(timer);
    }
  }, [confirmationResult]);

  const handleAutoSubmit = async (otp) => {
    setError("");
    setIsSubmitting(true);

    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      setIsSubmitting(false);
      return;
    }

    try {
      await verifyOTP(confirmationResult, code);
      setIsPhoneNumberVerified(true);
      onVerificationSuccess(phoneNumber);
    } catch (err) {
      setError(err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newOtp.every((digit) => digit !== "") && newOtp.length === 6) {
        handleAutoSubmit(newOtp);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("Text").slice(0, 6).split("");
    const newOtp = [...otp];
    pasteData.forEach((char, i) => {
      if (i < 6 && /^[0-9]$/.test(char)) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);
    inputRefs.current[pasteData.length - 1]?.focus();

    if (newOtp.every((digit) => digit !== "") && newOtp.length === 6) {
      handleAutoSubmit(newOtp);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");
    setIsSubmitting(true);

    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      setIsSubmitting(false);
      return;
    }

    try {
      await verifyOTP(confirmationResult, code);
      setIsPhoneNumberVerified(true);
      onVerificationSuccess(phoneNumber);
    } catch (err) {
      setError(err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#00000066] transition-opacity flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl p-6 sm:px-[60px] sm:py-10 w-full max-w-[492px] relative mx-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#666666] hover:text-[#929292] cursor-pointer"
            aria-label="Close verification modal"
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-start">
            <div className="text-start flex items-center gap-2 sm:gap-4">
              <Image
                src={MobileOtpImage}
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
                6 digit OTP has been sent to {maskedPhone}
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
                    disabled={!confirmationResult}
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
                      onClick={handleSendOTP}
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
                disabled={isSubmitting || !confirmationResult}
                className={`w-full bg-[#0084ff] text-white py-2 sm:py-3 rounded-lg hover:bg-[#0084ff]/90 transition text-sm sm:text-base cursor-pointer ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpVerificationModal;