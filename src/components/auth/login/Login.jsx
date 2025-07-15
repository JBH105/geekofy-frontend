// "use client";
// import Image from "next/image";
// import { useState, useRef, useEffect } from "react";
// import { FcGoogle } from "react-icons/fc";
// import ForgotPasswordModal from "../forgot-password/ForgotPassword";
// import { getSession, signIn } from "next-auth/react";
// import { AiOutlineClose } from "react-icons/ai";
// import Email from "../../../../public/image/Email.svg";
// import CloseEyeIcon from "../../../../public/image/CloseEyeIcon.svg";
// import OpenEyeIcon from "../../../../public/image/OpenEyeIcon.svg";

// export default function Login({ onClose, onSwitchToSignup, onSwitchToLogin }) {
//   // Form state
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     agreeToTerms: false,
//   });

//   // UI state
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [showValidation, setShowValidation] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Error state
//   const [errors, setErrors] = useState({
//     email: "",
//     password: "",
//     form: "",
//     agreeToTerms: "",
//   });

//   // Refs
//   const inputRef = useRef(null);
//   const cardRef = useRef(null);
//   const modalRef = useRef(null);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });

//     // Clear error when user types
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   // Toggle password visibility
//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   };

//   // Validate password
//   const isPasswordValid = (password) => {
//     return (
//       password.length >= 6 &&
//       /[A-Z]/.test(password) &&
//       /[a-z]/.test(password) &&
//       /\d/.test(password)
//     );
//   };

//   // Validate form
//   const validateForm = () => {
//     let valid = true;
//     const newErrors = { email: "", password: "", agreeToTerms: "", form: "" };

//     if (!formData.email) {
//       newErrors.email = "Email is required";
//       valid = false;
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//       valid = false;
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//       valid = false;
//     } else if (!isPasswordValid(formData.password)) {
//       newErrors.password = "Password you entered is incorrect";
//       valid = false;
//     }

//     if (!formData.agreeToTerms) {
//       newErrors.agreeToTerms = "You must agree to the terms";
//       valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };

//   useEffect(() => {
//     const loadRecaptcha = () => {
//       const script = document.createElement("script");
//       script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
//       script.async = true;
//       script.defer = true;
//       document.body.appendChild(script);
//     };

//     loadRecaptcha();
//   }, []);

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const isValid = validateForm();
//     if (!isValid) return;
//     setIsSubmitting(true);

//     try {
//       // Get reCAPTCHA token
//       const token = await new Promise((resolve) => {
//         window.grecaptcha.ready(() => {
//           window.grecaptcha
//             .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
//               action: "submit",
//             })
//             .then(resolve);
//         });
//       });

//       const result = await signIn("credentials", {
//         email: formData.email,
//         password: formData.password,
//         recaptchaToken: token, // Add recaptchaToken
//         redirect: false,
//       });

//       if (result.error) {
//         const newErrors = { email: "", password: "", form: null };
//         if (result.error.includes("User Not Found")) {
//           newErrors.email = "User account not found. Sign up instead";
//         } else if (result.error.includes("Invalid Email and password")) {
//           newErrors.password =
//             "Incorrect Email and password. Please try again.";
//         }

//         setErrors(newErrors);
//         return;
//       }

//       const session = await getSession();
//       const role = session?.user?.role?.includes("admin") ? "admin" : session?.user?.role?.includes("seller") ? "seller" : "buyer";
//       const redirectUrlMap = {
//         seller: "/",
//         admin: "/admin",
//         buyer: "/"
//       };

//       window.location.href = redirectUrlMap[role];
//     } catch (error) {
//       setErrors((prev) => ({
//         ...prev,
//         form: "An unexpected error occurred. Please try again.",
//       }));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         inputRef.current &&
//         cardRef.current &&
//         !inputRef.current.contains(event.target) &&
//         !cardRef.current.contains(event.target)
//       ) {
//         setShowValidation(false);
//       }
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [onClose]);

//   const handleGoogleLogin = async () => {
//     await signIn("google", {
//       callbackUrl: "/",
//     });
//   };

//   const isFormValid = () => {
//     return (
//       formData.email.trim() && formData.password.trim() && formData.agreeToTerms
//     );
//   };

//   return (
//     <>
//       {!isModalOpen && (
//         <div className="fixed inset-0 bg-[#00000066] transition-opacity flex items-center justify-center z-50 p-4">
//           <div
//             ref={modalRef}
//             className="bg-white rounded-2xl p-6 sm:px-[60px] sm:py-10 w-full max-w-[492px] relative mx-auto my-8"
//           >
//             <button
//               onClick={onClose}
//               className="absolute top-4 right-4 text-[#666666] hover:text-[#929292] cursor-pointer"
//               aria-label="Close signup modal"
//             >
//               <AiOutlineClose className="w-6 h-6" />
//             </button>

//             <h2 className="text-xl sm:text-2xl font-medium text-center mb-4 sm:mb-6 text-[#4D4D4D]">
//               Hi, Welcome Back! 👋
//             </h2>

//             <div className="space-y-4 sm:space-y-6">
//               <button
//                 type="button"
//                 onClick={handleGoogleLogin}
//                 className="w-full flex items-center justify-center gap-8 border text-[#666666] rounded-md p-3 hover:bg-gray-50 transition text-[14px] font-medium cursor-pointer"
//                 style={{
//                   boxShadow: " 0px 2px 2px 0px #0000000D",
//                   border: "1px solid var(--20-line, #00000033)",
//                 }}
//               >
//                 <FcGoogle className="h-5 w-5 sm:h-6 sm:w-6" />
//                 Continue with Google
//               </button>

//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-[#CFCFCF]"></div>
//                 </div>
//                 <div className="relative flex justify-center">
//                   <span className="bg-white px-2 text-sm text-[#CFCFCF]">
//                     OR
//                   </span>
//                 </div>
//               </div>

//               <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
//                 <div>
//                   <div className="relative">
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       className={`block px-3.5 pb-2 pt-3 sm:pb-2.5 sm:pt-4 w-full text-sm bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 peer ${
//                         errors.email ? "border-[#FA0707]" : "border-[#999999]"
//                       }`}
//                       placeholder=" "
//                       autoComplete="off"
//                     />
//                     <label
//                       htmlFor="email"
//                       className={`absolute text-xs sm:text-sm duration-300 transform -translate-y-3 sm:-translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 sm:peer-focus:-translate-y-4 left-3 peer-focus:left-3 ${
//                         errors.email ? "text-[#FA0707]" : "text-[#999999]"
//                       }`}
//                     >
//                       Email *
//                     </label>
//                     <Image
//                       src={Email}
//                       alt="Email.svg"
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2"
//                     />
//                   </div>
//                   {errors.email && (
//                     <p className="mt-1 text-xs text-[#E82327] italic">
//                       {errors.email}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <div className="relative">
//                     <input
//                       type={passwordVisible ? "text" : "password"}
//                       id="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       onFocus={() => setShowValidation(true)}
//                       ref={inputRef}
//                       className={`block px-3.5 pb-2 pt-3 sm:pb-2.5 sm:pt-4 w-full text-sm bg-transparent  rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 peer ${
//                         errors.password
//                           ? "border-[#FA0707]"
//                           : "border-[#999999]"
//                       }`}
//                       placeholder=" "
//                     />
//                     <label
//                       htmlFor="password"
//                       className={`absolute text-xs sm:text-sm text-[#999999] duration-300 transform -translate-y-3 sm:-translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 sm:peer-focus:-translate-y-4 left-3 peer-focus:left-3${
//                         errors.password ? "text-[#FA0707]" : "text-[#999999]"
//                       }`}
//                     >
//                       Password *
//                     </label>
//                     <button
//                       type="button"
//                       onClick={togglePasswordVisibility}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999999] cursor-pointer"
//                     >
//                       {passwordVisible ? (
//                         <Image src={OpenEyeIcon} alt="OpenEyeIcon"/>
//                       ) : (
//                         <Image src={CloseEyeIcon} alt="CloseEyeIcon"/>
//                       )}
//                     </button>
//                   </div>
//                   {errors.password && (
//                     <p className="mt-1 text-xs text-[#E82327] italic">
//                       {errors.password}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex items-center justify-between mt-1 sm:mt-2">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="agreeToTerms"
//                       name="agreeToTerms"
//                       checked={formData.agreeToTerms}
//                       onChange={handleChange}
//                       className="h-3 w-3 sm:h-4 sm:w-4 text-[#0084ff] focus:ring-[#0084ff] border-[#666666] rounded"
//                     />
//                     <label
//                       htmlFor="agreeToTerms"
//                       className="ml-2 block text-sm sm:text-sm text-[#666666]"
//                     >
//                       Remember me
//                     </label>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => setIsModalOpen(true)}
//                     className="text-xs sm:text-xs text-[#E82327] hover:text-[#E82327]/80 font-medium italic cursor-pointer"
//                   >
//                     Forgot Password?
//                   </button>
//                 </div>
//                 {errors.agreeToTerms && (
//                   <p className="mt-1 text-xs text-[#E82327] italic">
//                     {errors.agreeToTerms}
//                   </p>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={!isFormValid() || isSubmitting}
//                   className={`w-full py-3 rounded-lg transition cursor-pointer mt-2 ${
//                     !isFormValid()
//                       ? "bg-[#0000004D] text-white cursor-not-allowed"
//                       : "bg-[#0084ff] text-white hover:bg-[#0084ff]/90"
//                   } ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
//                 >
//                   {isSubmitting ? "Login..." : "Login"}
//                 </button>
//               </form>

//               <p className="text-start text-base sm:text-sm text-[#666666] mt-8">
//                 Don't have an account?
//                 <button
//                   type="button"
//                   className="text-[#0084ff] hover:text-[#0084ff]/80 font-medium ml-1 cursor-pointer"
//                   onClick={onSwitchToSignup}
//                 >
//                   Sign up
//                 </button>
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       <ForgotPasswordModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSwitchToLogin={onSwitchToLogin}
//       />
//     </>
//   );
// }


"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import ForgotPasswordModal from "../forgot-password/ForgotPassword";
import { signIn } from "next-auth/react";
import { AiOutlineClose } from "react-icons/ai";
import Email from "../../../../public/image/Email.svg";
import CloseEyeIcon from "../../../../public/image/CloseEyeIcon.svg";
import OpenEyeIcon from "../../../../public/image/OpenEyeIcon.svg";

export default function Login({ onClose, onSwitchToSignup, onSwitchToLogin, callbackUrl }) {
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    agreeToTerms: false,
  });

  // UI state
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Error state
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
    agreeToTerms: "",
  });

  // Refs
  const inputRef = useRef(null);
  const cardRef = useRef(null);
  const modalRef = useRef(null);

  // Log callbackUrl for debugging
  useEffect(() => {
  }, [callbackUrl]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Validate password
  const isPasswordValid = (password) => {
    return (
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password)
    );
  };

  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "", agreeToTerms: "", form: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!isPasswordValid(formData.password)) {
      newErrors.password = "Password you entered is incorrect";
      valid = false;
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;
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

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        recaptchaToken: token,
        redirect: true,
        callbackUrl: callbackUrl || "/",
      });

      if (result?.error) {
        const newErrors = { email: "", password: "", form: null };
        if (result.error.includes("User Not Found")) {
          newErrors.email = "User account not found. Sign up instead";
        } else if (result.error.includes("Invalid Email and password")) {
          newErrors.password =
            "Incorrect Email and password. Please try again.";
        }

        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: "An unexpected error occurred. Please try again.",
      }));
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", {
      callbackUrl: callbackUrl || "/",
    });
  };

  const isFormValid = () => {
    return (
      formData.email.trim() && formData.password.trim() && formData.agreeToTerms
    );
  };

  return (
    <>
      {!isModalOpen && (
        <div className="fixed inset-0 bg-[#00000066] transition-opacity flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl p-6 sm:px-[60px] sm:py-10 w-full max-w-[492px] relative mx-auto my-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#666666] hover:text-[#929292] cursor-pointer"
              aria-label="Close signup modal"
            >
              <AiOutlineClose className="w-6 h-6" />
            </button>

            <h2 className="text-xl sm:text-2xl font-medium text-center mb-4 sm:mb-6 text-[#4D4D4D]">
              Hi, Welcome Back! 👋
            </h2>

            <div className="space-y-4 sm:space-y-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
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

              <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                <div>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block px-3.5 pb-2 pt-3 sm:pb-2.5 sm:pt-4 w-full text-sm bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 peer ${
                        errors.email ? "border-[#FA0707]" : "border-[#999999]"
                      }`}
                      placeholder=" "
                      autoComplete="off"
                    />
                    <label
                      htmlFor="email"
                      className={`absolute text-xs sm:text-sm duration-300 transform -translate-y-3 sm:-translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 sm:peer-focus:-translate-y-4 left-3 peer-focus:left-3 ${
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
                    <p className="mt-1 text-xs text-[#E82327] italic">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setShowValidation(true)}
                      ref={inputRef}
                      className={`block px-3.5 pb-2 pt-3 sm:pb-2.5 sm:pt-4 w-full text-sm bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 peer ${
                        errors.password
                          ? "border-[#FA0707]"
                          : "border-[#999999]"
                      }`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="password"
                      className={`absolute text-xs sm:text-sm text-[#999999] duration-300 transform -translate-y-3 sm:-translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 sm:peer-focus:-translate-y-4 left-3 peer-focus:left-3${
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
                    <p className="mt-1 text-xs text-[#E82327] italic">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-1 sm:mt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="h-3 w-3 sm:h-4 sm:w-4 text-[#0084ff] focus:ring-[#0084ff] border-[#666666] rounded"
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="ml-2 block text-sm sm:text-sm text-[#666666]"
                    >
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs sm:text-xs text-[#E82327] hover:text-[#E82327]/80 font-medium italic cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-xs text-[#E82327] italic">
                    {errors.agreeToTerms}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className={`w-full py-3 rounded-lg transition cursor-pointer mt-2 ${
                    !isFormValid()
                      ? "bg-[#0000004D] text-white cursor-not-allowed"
                      : "bg-[#0084ff] text-white hover:bg-[#0084ff]/90"
                  } ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? "Login..." : "Login"}
                </button>
              </form>

              <p className="text-start text-base sm:text-sm text-[#666666] mt-8">
                Don't have an account?
                <button
                  type="button"
                  className="text-[#0084ff] hover:text-[#0084ff]/80 font-medium ml-1 cursor-pointer"
                  onClick={onSwitchToSignup}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      <ForgotPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSwitchToLogin={onSwitchToLogin}
      />
    </>
  );
}