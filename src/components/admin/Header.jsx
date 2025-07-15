"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import Image from "next/image";
import Email from "../../../public/image/Email.svg";
import NotificationBell from "../../../public/image/NotificationBell.svg";
import Profile from "../../../public/image/Profile.svg";
import { signOut } from "next-auth/react";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const toggleDropdown = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white py-3 border-b border-gray-200 sticky top-0 z-50">
      <div className="layout_container">
        <div className="px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-[32px] font-[800] text-[#666666] cursor-pointer seconday_header"
              >
                Geekofy
              </Link>
            </div>

            <div className="flex-grow flex justify-center">
              <button className="text-[#666666] text-sm font-medium hover:underline cursor-pointer hover:text-[#0084FF]">
                List Your Business
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-[#666666] hover:text-gray-700 cursor-pointer">
                <Image src={Email} alt="Email" />
              </button>
              <button className="text-[#666666] hover:text-gray-700 cursor-pointer">
                <Image src={NotificationBell} alt="NotificationBell" />
              </button>
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="focus:outline-none cursor-pointer"
                >
                  <Image src={Profile} alt="Profile" className="mt-1" />
                </button>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-4 w-[113px] bg-white rounded-[10px] shadow-lg p-4 space-y-4 z-50 border-1 border-[#CCCCCC]"
                  >
                    <button className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer">
                      My Profile
                    </button>
                    <button className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer">
                      Dashboard
                    </button>
                    <button
                      onClick={(e) => {
                        e?.preventDefault?.();
                        e?.stopPropagation?.();
                        handleLogout(e);
                      }}
                      className="w-full text-left text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
