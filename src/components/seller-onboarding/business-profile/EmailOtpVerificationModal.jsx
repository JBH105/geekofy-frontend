// "use client";

// import { useEffect, useState, useRef } from "react";
// import Image from "next/image";
// import { AiOutlineClose } from "react-icons/ai";
// import OtpImage from "../../../../public/image/otpmessage.svg"; 
// import { toast } from "react-toastify";
// import api from "@/lib/api";

// const EmailOtpVerificationModal = ({
//   email,
//   onVerificationSuccess,
//   onClose,
// }) => {
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [resendDisabled, setResendDisabled] = useState(true);
//   const [resendTimer, setResendTimer] = useState(30);
//   const [isSendingOtp, setIsSendingOtp] = useState(false);

//   const inputRefs = useRef([]);

//   const maskedEmail = (email) => {
//     const [name, domain] = email.split("@");
//     const maskedName =
//       name.length > 2
//         ? name.substring(0, 2) + "*".repeat(name.length - 2)
//         : name.charAt(0) + "*";
//     return `${maskedName}@${domain}`;
//   };

//   useEffect(() => {
//     handleSendOTP();
//   }, []);

//   useEffect(() => {
//     if (resendDisabled && resendTimer > 0) {
//       const interval = setInterval(() => {
//         setResendTimer((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(interval);
//     } else if (resendTimer === 0) {
//       setResendDisabled(false);
//     }
//   }, [resendDisabled, resendTimer]);

//    const handleSendOTP = async () => {
//     try {
//       setIsSendingOtp(true);
//       setError("");
      
//       await api.post("/api/business/info/sendOTP", {
//         email: email,
//       });
      
//       setResendDisabled(true);
//       setResendTimer(30);
//     //   toast.success("OTP sent to your email!");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
//     //   toast.error("Failed to send OTP. Please try again.");
//     } finally {
//       setIsSendingOtp(false);
//     }
//   };

//   const verifyOTP = async (otpCode) => {
//     try {
//       setIsSubmitting(true);
//       setError("");

//       const response = await api.post("/api/business/info/verifyOTP", {
//         email: email,
//         otp: otpCode,
//       });

//       if (response.data.success) {
//         onVerificationSuccess(email);
//         toast.success("Email verified successfully!");
//       } else {
//         throw new Error(response.data.message || "Verification failed");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid OTP. Please try again.");
//       throw err; 
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAutoSubmit = async (otp) => {
//     const code = otp.join("");

//     if (code.length !== 6) {
//       setError("Please enter a valid 6-digit OTP.");
//       return;
//     }

//     try {
//       await verifyOTP(code);
//     } catch (err) {
//       // Error is already set in verifyOTP
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
//     await handleAutoSubmit(otp);
//   };

//   return (
//     <div className="fixed inset-0 bg-[#00000066] transition-opacity flex items-center justify-center z-50 px-4">
//       <div className="bg-white rounded-2xl p-6 sm:px-[60px] sm:py-10 w-full max-w-[492px] relative mx-auto">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-[#666666] hover:text-[#929292] cursor-pointer"
//           aria-label="Close verification modal"
//         >
//           <AiOutlineClose className="w-5 h-5" />
//         </button>
//         <div className="flex flex-col items-start">
//           <div className="text-start flex items-center gap-2 sm:gap-4">
//             <Image
//               src={OtpImage}
//               alt="OTP Email"
//               height={125}
//               width={125}
//               className="mb-2 sm:mb-5"
//             />
//           </div>

//           <div className="text-start text-[#666666]">
//             <h2 className="text-xl sm:text-2xl font-medium my-1 sm:my-3">
//               Enter verification code
//             </h2>
//             <p className="text-[#666666] my-2 sm:my-5 text-sm sm:text-sm">
//               6 digit OTP has been sent to {maskedEmail(email)}
//             </p>
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="w-full space-y-4 sm:space-y-6"
//           >
//             <div className="flex justify-start space-x-1 sm:space-x-2">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   value={digit}
//                   onChange={(e) => handleChange(e, index)}
//                   onKeyDown={(e) => handleKeyDown(e, index)}
//                   onPaste={handlePaste}
//                   ref={(el) => (inputRefs.current[index] = el)}
//                   maxLength={1}
//                   className={`w-10 h-10 sm:w-12 sm:h-14 border rounded-[10px] text-center text-lg sm:text-xl focus:outline-none ${
//                     error ? "border-[#FA0707]" : "border-[#00000033]"
//                   }`}
//                   inputMode="numeric"
//                   autoComplete="one-time-code"
//                 />
//               ))}
//             </div>

//             {error && (
//               <p className="text-[#FA0707] text-xs sm:text-sm text-start">
//                 {error}
//               </p>
//             )}

//             <div className="text-start mt-2 sm:mt-4 text-xs sm:text-sm text-[#666666] w-full">
//               <p className="flex items-center flex-wrap gap-3">
//                 <span className={`${resendDisabled ? "hidden" : "inline"}`}>
//                   Didn't receive the code?
//                 </span>
//                 <span>
//                   <button
//                     type="button"
//                     onClick={handleSendOTP}
//                     disabled={resendDisabled || isSendingOtp}
//                     className={`font-medium cursor-pointer ${
//                       resendDisabled || isSendingOtp
//                         ? "text-[#666666] opacity-100 cursor-default"
//                         : "text-[#0084ff] hover:text-[#0084ff]/80"
//                     }`}
//                   >
//                     {isSendingOtp
//                       ? "Sending..."
//                       : resendDisabled
//                       ? `Resend OTP in (${resendTimer}) seconds`
//                       : "Resend now"}
//                   </button>
//                 </span>
//               </p>
//             </div>

//             <div className="border-1 border-[#00000033]"></div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full bg-[#0084ff] text-white py-2 sm:py-3 rounded-lg hover:bg-[#0084ff]/90 transition text-sm sm:text-base cursor-pointer ${
//                 isSubmitting ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             >
//               {isSubmitting ? "Verifying..." : "Verify"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailOtpVerificationModal;


"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import OtpImage from "../../../../public/image/otpmessage.svg"; 
import { toast } from "react-toastify";
import api from "@/lib/api";

const EmailOtpVerificationModal = ({
  email,
  onVerificationSuccess,
  onClose,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(30);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const inputRefs = useRef([]);

  const maskedEmail = (email) => {
    const [name, domain] = email.split("@");
    const maskedName =
      name.length > 2
        ? name.substring(0, 2) + "*".repeat(name.length - 2)
        : name.charAt(0) + "*";
    return `${maskedName}@${domain}`;
  };

  useEffect(() => {
    handleSendOTP();
    if(inputRefs.current[0]){
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (resendDisabled && resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
    }
  }, [resendDisabled, resendTimer]);

   const handleSendOTP = async () => {
    try {
      setIsSendingOtp(true);
      setError("");
      
      await api.post("/api/business/info/sendOTP", {
        email: email,
      });
      
      setResendDisabled(true);
      setResendTimer(30);
    //   toast.success("OTP sent to your email!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    //   toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOTP = async (otpCode) => {
    try {
      setIsSubmitting(true);
      setError("");

      const response = await api.post("/api/business/info/verifyOTP", {
        email: email,
        otp: otpCode,
      });

      if (response.data.success) {
        onVerificationSuccess(email);
        toast.success("Email verified successfully!");
      } else {
        throw new Error(response.data.message || "Verification failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      throw err; 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = async (otp) => {
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      await verifyOTP(code);
    } catch (err) {
      // Error is already set in verifyOTP
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
    await handleAutoSubmit(otp);
  };

  return (
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
              src={OtpImage}
              alt="OTP Email"
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
              6 digit OTP has been sent to {maskedEmail(email)}
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
                    onClick={handleSendOTP}
                    disabled={resendDisabled || isSendingOtp}
                    className={`font-medium cursor-pointer ${
                      resendDisabled || isSendingOtp
                        ? "text-[#666666] opacity-100 cursor-default"
                        : "text-[#0084ff] hover:text-[#0084ff]/80"
                    }`}
                  >
                    {isSendingOtp
                      ? "Sending..."
                      : resendDisabled
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
  );
};

export default EmailOtpVerificationModal;
