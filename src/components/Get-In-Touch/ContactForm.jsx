"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import SellerProfileHeader from "../seller-profile/SellerProfileHeader";
import Image from "next/image";
import CountryFlags from "../../../public/image/CountryFlags.svg";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
    agreeToTerms: false,
  });

  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    flag: "🇺🇸",
    name: "US",
  });

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  const countries = [
    { code: "+1", flag: "🇺🇸", name: "US" },
    { code: "+44", flag: "🇬🇧", name: "UK" },
    { code: "+91", flag: "🇮🇳", name: "IN" },
    { code: "+49", flag: "🇩🇪", name: "DE" },
    { code: "+33", flag: "🇫🇷", name: "FR" },
  ];

  const subjects = [
    "Suggestion",
    "Feedback",
    "Bug",
    "Error",
    "Investor Relationship",
    "Job",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  return (
    <>
      <SellerProfileHeader />

      <div className="min-h-screen py-5 px-4 lg:px-8">
        <div className="max-w-[550px] mx-auto">
          <div className="text-center mb-7">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0084FF] leading-11 mb-[10px]">
              Get in Touch
            </h1>
            <p className="text-[#667085] text-xl leading-7">
              We'd love to hear from you. Please fill out this form.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-[20px]">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`block px-3.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 border-[#999999]  appearance-none focus:outline-none focus:ring-0 peer`}
                    placeholder=" "
                    autoComplete="off"
                  />
                  <label
                    htmlFor="firstName"
                    className={`absolute text-sm text-[#999999] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3`}
                  >
                    First name *
                  </label>
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`block px-3.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 border-[#999999]  appearance-none focus:outline-none focus:ring-0 peer`}
                    placeholder=" "
                    autoComplete="off"
                  />
                  <label
                    htmlFor="lastName"
                    className={`absolute text-sm text-[#999999] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3`}
                  >
                    Last name *
                  </label>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="mb-[20px]">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block px-3.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 border-[#999999] appearance-none focus:outline-none focus:ring-0 peer`}
                  placeholder=" "
                  autoComplete="off"
                />
                <label
                  htmlFor="email"
                  className={`absolute text-sm text-[#999999] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3`}
                >
                  Email *
                </label>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center space-x-2 mb-[20px]">
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
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="block px-3.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 border-[#999999]  appearance-none focus:outline-none focus:ring-0 peer"
                  placeholder="(___) ___ - ____"
                  autoComplete="off"
                  maxLength={16}
                />
                <label
                  htmlFor="phoneNumber"
                  className="absolute text-sm text-[#999999] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3"
                >
                  Phone number *
                </label>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-[20px]">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left outline-none transition-all flex items-center justify-between"
                >
                  <span
                    className={
                      formData.subject ? "text-[#999999]" : "text-gray-500"
                    }
                  >
                    {formData.subject || "Subject *"}
                  </span>
                  <FaChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showSubjectDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {subjects.map((subject) => (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, subject }));
                          setShowSubjectDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left  hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition-colors"
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                )}

                <label
                  htmlFor="year"
                  className="absolute text-sm text-[#999999] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3"
                >
                  Subject *
                </label>
              </div>
            </div>

            {/* Message */}
            <div className="mb-[20px]">
              <div className="relative">
                <textarea
                  type="message"
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`block px-3.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 border-[#999999] appearance-none focus:outline-none focus:ring-0 peer`}
                  placeholder=" "
                  autoComplete="off"
                  rows={6}
                />
                <label
                  htmlFor="message"
                  className={`absolute text-sm text-[#999999] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3`}
                >
                  Message *
                </label>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="mb-8">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <span className="text-sm text-gray-600">
                  I agree with{" "}
                  <a
                    href="#"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    privacy policy
                  </a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-[212px] bg-[#0084FF] text-white py-[14px] px-[50px] rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none transition-all cursor-pointer block mx-auto"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
