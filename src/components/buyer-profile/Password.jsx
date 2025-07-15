"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import CloseEyeIcon from "../../../public/image/CloseEyeIcon.svg";
import OpenEyeIcon from "../../../public/image/OpenEyeIcon.svg";
import Image from "next/image";
import { toast } from "react-toastify";

export default function Password() {
  const { data: session } = useSession();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleInputChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      setError("User not authenticated");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const payload = {
        currentPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      };

      const response = await api.put(
        `/api/auth/password/${session?.user?.id}`,
        payload
      );

      toast.success("Password changed successfully!");
      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] flex rounded-[15px] w-[830px] p-10">
          <div className="space-y-[40px] w-full">
            <div>
              <div className="relative">
                <input
                  type={showPassword.oldPassword ? "text" : "password"}
                  id="oldPassword"
                  name="oldPassword"
                  value={passwords.oldPassword}
                  onChange={handleInputChange}
                  className={`block px-3.5 pb-2.5 pt-[16.4px] w-full text-sm bg-white rounded-lg border-1 border-[#999999] appearance-none focus:outline-none focus:ring-0 peer`}
                  placeholder=" "
                  autoComplete="off"
                />
                <label
                  htmlFor="oldPassword"
                  className={`absolute text-sm text-[#999999] bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3`}
                >
                  Old Password
                </label>
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => togglePasswordVisibility("oldPassword")}
                >
                  <Image
                    src={showPassword.oldPassword ? OpenEyeIcon : CloseEyeIcon}
                    alt={
                      showPassword.oldPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    width={20}
                    height={20}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[50px]">
              <div className="relative">
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleInputChange}
                  className={`block px-3.5 pb-2.5 pt-[16.4px] w-full text-sm bg-white rounded-lg border-1 border-[#999999] appearance-none focus:outline-none focus:ring-0 peer`}
                  placeholder=" "
                  autoComplete="off"
                />
                <label
                  htmlFor="newPassword"
                  className={`absolute text-sm text-[#999999] bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3`}
                >
                  New Password
                </label>
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => togglePasswordVisibility("newPassword")}
                >
                  <Image
                    src={showPassword.newPassword ? OpenEyeIcon : CloseEyeIcon}
                    alt={
                      showPassword.newPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="relative">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleInputChange}
                  className={`block px-3.5 pb-2.5 pt-[16.4px] w-full text-sm bg-white rounded-lg border-1 border-[#999999] appearance-none focus:outline-none focus:ring-0 peer`}
                  placeholder=" "
                  autoComplete="off"
                />
                <label
                  htmlFor="confirmPassword"
                  className={`absolute text-sm text-[#999999] bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-1 peer-focus:px-1 peer-focus:text-[#999999] peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 peer-focus:left-3`}
                >
                  Confirm New Password
                </label>
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  <Image
                    src={
                      showPassword.confirmPassword ? OpenEyeIcon : CloseEyeIcon
                    }
                    alt={
                      showPassword.confirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    width={20}
                    height={20}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}
