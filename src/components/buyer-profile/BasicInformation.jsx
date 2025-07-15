"use client";

import { useState } from "react";
import CountryFlags from "../../../public/image/CountryFlags.svg";
import Image from "next/image";
import api from "@/lib/api";

export default function BasicInformation({
  profileData,
  setProfileData,
  loading,
}) {
  const [editableData, setEditableData] = useState({
    phone: profileData.phone || "",
    dateOfBirth: profileData.dateOfBirth || "",
    gender: profileData.gender || "",
  });

  const handleInputChange = (e) => {
    setEditableData({
      ...editableData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ownerPhone: editableData.phone,
        dob: editableData.dateOfBirth,
        gender: editableData.gender,
      };

      await api.post("/api/profile", payload);
      setProfileData({
        ...profileData,
        phone: editableData.phone,
        dateOfBirth: editableData.dateOfBirth,
        gender: editableData.gender,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#00000066] flex items-center justify-center z-50">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <form onSubmit={handleSubmit}>
        <div className="shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] bg-white flex rounded-[15px] w-[830px] p-10">
          <div className="flex flex-col gap-10 w-full">
            {/* First row - First name and Last name (non-editable) */}
            <div className="flex items-center gap-[50px] w-full">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    value={profileData?.firstName}
                    className="block px-3.5 pb-2.5 pt-[16.4px] bg-white w-full text-sm rounded-lg border-1 border-[#999999] appearance-none focus:outline-none focus:ring-0 peer"
                    readOnly
                  />
                  <label
                    htmlFor="firstName"
                    className="absolute text-sm text-[#999999] bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-1 left-3"
                  >
                    First name
                  </label>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    id="lastName"
                    value={profileData.lastName}
                    className="block px-3.5 pb-2.5 pt-[16.4px] w-full bg-white text-sm rounded-lg border-1 border-[#999999] appearance-none focus:outline-none focus:ring-0 peer"
                    readOnly
                  />
                  <label
                    htmlFor="lastName"
                    className="absolute text-sm text-[#999999] bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-1 left-3"
                  >
                    Last name
                  </label>
                </div>
              </div>
            </div>

            {/* Second row - Phone number (editable) and Email (non-editable) */}
            <div className="flex items-center gap-[50px] w-full">
              <div className="flex-1 flex items-center gap-2">
                <div className="relative flex w-[85px] px-[12px] py-[10.2px] text-sm rounded-lg shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] bg-white text-[#333333] border border-[#999999]">
                  <div className="flex items-center gap-[15px]">
                    <Image
                      src={CountryFlags}
                      alt="CountryFlags"
                      height={20}
                      width={20}
                    />
                    <p className="text-[#333333] text-base font-normal leading-6 mt-1">
                      +1
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={editableData.phone}
                      onChange={handleInputChange}
                      className="block px-3.5 pb-2.5 pt-[16.4px] w-full text-sm bg-white rounded-lg border-1 border-[#999999] appearance-none focus:outline-none focus:ring-0 peer"
                      placeholder=" "
                      autoComplete="off"
                    />
                    <label
                      htmlFor="phone"
                      className="absolute text-sm text-[#999999] bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3"
                    >
                      Phone Number
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={profileData.email}
                    className="block px-3.5 pb-2.5 pt-[16.4px] w-full text-sm bg-white rounded-lg border-1 border-[#999999] appearance-none focus:outline-none focus:ring-0 peer"
                    readOnly
                  />
                  <label
                    htmlFor="email"
                    className="absolute text-sm text-[#999999] bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-1 left-3"
                  >
                    Email
                  </label>
                </div>
              </div>
            </div>

            {/* Third row - Date of birth and Gender (both editable) */}
            <div className="flex items-center gap-[50px] w-full">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formatDateForInput(editableData.dateOfBirth)}
                    onChange={handleInputChange}
                    className="block px-3.5 pb-2.5 pt-[16.4px] w-full text-sm bg-white rounded-lg border-1 border-[#999999] appearance-none focus:outline-none focus:ring-0 peer"
                    autoComplete="off"
                  />
                  <label
                    htmlFor="dateOfBirth"
                    className="absolute text-sm text-[#999999] bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3 cursor-pointer"
                  >
                    Date of birth
                  </label>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <select
                    id="gender"
                    name="gender"
                    value={editableData.gender}
                    onChange={handleInputChange}
                    className="block px-3.5 pb-2.5 pt-[16.4px] w-full text-sm bg-white rounded-lg border-1 border-[#999999] appearance-none focus:outline-none focus:ring-0 peer"
                    autoComplete="off"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <label
                    htmlFor="gender"
                    className="absolute text-sm text-[#999999] bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium delineator-y-4 left-3"
                  >
                    Gender
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-12">
          <button
            type="submit"
            className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
