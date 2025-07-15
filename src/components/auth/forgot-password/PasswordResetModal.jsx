"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
import api from "@/lib/api";
import Success from "../../../../public/image/Success.svg";
import CloseEyeIcon from "../../../../public/image/CloseEyeIcon.svg";
import OpenEyeIcon from "../../../../public/image/OpenEyeIcon.svg";

const PasswordResetModal = ({ email, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const cardRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (
      name === "password" &&
      formData.confirmPassword &&
      value === formData.confirmPassword
    ) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const isPasswordValid = (password) => {
    return (
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!isPasswordValid(formData.password)) {
      newErrors.password = "Password does not meet requirements";
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    setIsSubmitting(true);

    try {
      const response = await api.post("/api/auth/forgot-password/reset", {
        email: email,
        newPassword: formData.password,
      });

      if (response.data.success) {
        setVerificationSuccess(true);
      } else {
        setErrors({
          ...errors,
          password: response.data.message || "Failed to reset password",
        });
      }
    } catch (error) {
      setErrors({
        ...errors,
        password: error.response?.data?.message || "Failed to reset password",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    onClose();
    if (onSwitchToLogin) {
      onSwitchToLogin();
    }
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-[#00000066] transition-opacity flex items-center justify-center z-50 px-4 sm:px-0">
        <div className="relative bg-white rounded-lg p-6 w-full sm:px-14 sm:py-10 max-w-[492PX] mx-auto my-8 sm:my-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#666666] hover:text-[#929292] cursor-pointer"
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
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
                Congratulations! Your password has been changed successfully
              </p>
              <button
                onClick={handleBackToLogin}
                className="w-full bg-[#0084ff] text-white py-2 sm:py-3 rounded-lg hover:bg-[#0084ff]/90 transition text-sm sm:text-base cursor-pointer"
              >
                Back to login
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 sm:mb-8 sm:mt-3">
                <h2 className="text-lg sm:text-xl font-medium text-center text-[#4D4D4D]">
                  Password Reset
                </h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4 sm:space-y-8">
                  <div className="relative">
                    <div>
                      <div>
                        <input
                          type={passwordVisible ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={() => setShowValidation(true)}
                          ref={inputRef}
                          className={`block px-3.5 py-3.5 w-full text-sm bg-transparent rounded-md border appearance-none focus:outline-none focus:ring-0 peer ${
                            errors.password
                              ? "border-[#FA0707]"
                              : "border-[#999999]"
                          }`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="password"
                          className={`absolute text-sm text-[#999999] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3${
                            errors.password
                              ? "text-[#FA0707]"
                              : "text-[#999999]"
                          }`}
                        >
                          New Password *
                        </label>
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999999]"
                        >
                          {passwordVisible ? (
                            <Image src={OpenEyeIcon} alt="OpenEyeIcon" />
                          ) : (
                            <Image src={CloseEyeIcon} alt="CloseEyeIcon" />
                          )}
                        </button>
                      </div>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.password}
                      </p>
                    )}

                    {showValidation && !isPasswordValid(formData.password) && (
                      <div
                        ref={cardRef}
                        className="absolute z-[1060] top-[px] w-full bg-white border border-[#666666] rounded-md p-2 sm:p-[22px] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]"
                      >
                        <div className="flex items-center mb-1 sm:mb-[14px] text-xs sm:text-sm text-[#929292] font-medium">
                          {/[A-Z]/.test(formData.password) ? (
                            <FaRegCheckCircle className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-[#25AE71]" />
                          ) : (
                            <IoMdCloseCircleOutline className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-[#FA0707]" />
                          )}
                          Uppercase Character
                        </div>
                        <div className="flex items-center mb-1 sm:mb-[14px] text-xs sm:text-sm text-[#929292]">
                          {/[a-z]/.test(formData.password) ? (
                            <FaRegCheckCircle className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-[#25AE71]" />
                          ) : (
                            <IoMdCloseCircleOutline className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-[#FA0707]" />
                          )}
                          Lowercase Character
                        </div>
                        <div className="flex items-center mb-1 sm:mb-[14px] text-xs sm:text-sm text-[#929292]">
                          {/\d/.test(formData.password) ? (
                            <FaRegCheckCircle className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-[#25AE71]" />
                          ) : (
                            <IoMdCloseCircleOutline className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-[#FA0707]" />
                          )}
                          Number
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-[#929292]">
                          {formData.password.length >= 6 ? (
                            <FaRegCheckCircle className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-[#25AE71]" />
                          ) : (
                            <IoMdCloseCircleOutline className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-[#FA0707]" />
                          )}
                          6 Characters
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`block px-3.5 py-3.5 w-full text-sm bg-transparent rounded-md border appearance-none focus:outline-none focus:ring-0 peer ${
                          errors.confirmPassword
                            ? "border-[#FA0707]"
                            : "border-[#999999]"
                        }`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="confirmPassword"
                        className={`absolute text-sm duration-300 text-[#999999] transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3 ${
                          errors.confirmPassword
                            ? "text-[#FA0707]"
                            : "text-[#999999]"
                        }`}
                      >
                        Confirm Password *
                      </label>
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999999]"
                      >
                        {confirmPasswordVisible ? (
                          <Image src={OpenEyeIcon} alt="OpenEyeIcon" />
                        ) : (
                          <Image src={CloseEyeIcon} alt="CloseEyeIcon" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-[#999999] mt-2">
                  Minimum 6 characters (Mix of uppercase, lowercase and number)
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-[#0084FF] text-white py-2.5 px-4 rounded-lg hover:bg-[#0084FF]/80 transition-colors font-medium mt-2 sm:mt-8 text-sm sm:text-base cursor-pointer ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </form>

              <div className="mt-3 sm:mt-8 text-strat text-base sm:text-sm text-[#666666]">
                Already have an account?
                <button
                  onClick={onClose}
                  className="text-[#0084FF] hover:text-[#0084FF]/80 text-xs sm:text-sm font-medium ml-1"
                >
                  Log In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PasswordResetModal;
