"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import computerIcon from "../../public/image/landingPage/computer.svg";
import printerIcon from "../../public/image/landingPage/printerIcon.svg";
import routerIcon from "../../public/image/landingPage/router.svg";
import mobileIcon from "../../public/image/landingPage/mobileIcon.svg";
import UserIcon from "../../public/image/landingPage/userLogin.svg";
import MailIcon from "../../public/image/landingPage/home-mail-icon.svg";
import BellIcon from "../../public/image/landingPage/home-bell-icon.svg";
import Location from "../../public/image/Location.svg";
import { useRouter } from "next/navigation";
import Link from "next/link";
import localFont from "next/font/local";
import { signOut, useSession } from "next-auth/react";
import Login from "@/components/auth/login/Login";
import Signup from "@/components/auth/signup/Signup";
import LocationDetail from "@/components/layout/LocationDetail";
import FindMyLocation from "@/components/shared/FindMyLocation";
 
const Baloo2 = localFont({
  src: [
    {
      path: "../../public/fonts/Baloo_2/Baloo2-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Baloo_2/Baloo2-Bold.ttf",
      weight: "700",
      style: "bold",
    },
  ],
  display: "swap",
});

export default function Page() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMailDropdownOpen, setIsMailDropdownOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { data: session } = useSession();
  const isUserSeller = session?.user?.role?.includes("seller") ? true : false;
  const isUserBuyer = session?.user?.role?.includes("buyer") ? true : false;
  const dropdownRef = useRef(null);
  const mailDropdownRef = useRef(null);
  const [showLocation, setShowLocation] = useState(false);
  const [showMobileLocation, setShowMobileLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const locationRef = useRef(null);
  const locationWrapperRef = useRef(null);
  const locationRefMobile = useRef(null);
  const locationWrapperRefMobile = useRef(null);
  const data = [
    {
      id: 1,
      img: computerIcon,
      text: "Computer\nRepair",
    },
    {
      id: 2,
      img: printerIcon,
      text: "Printer\nSupport",
    },
    {
      id: 3,
      img: routerIcon,
      text: "WiFi &\nNetworking",
    },
    {
      id: 4,
      img: mobileIcon,
      text: "Mobiles &\nTablets",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showLocation &&
        locationRef.current &&
        locationWrapperRef.current &&
        !locationRef.current.contains(event.target) &&
        !locationWrapperRef.current.contains(event.target)
      ) {
        setShowLocation(false);
      }

      // Handle mobile location dropdown
      if (
        showMobileLocation &&
        locationRefMobile.current &&
        locationWrapperRefMobile.current &&
        !locationRefMobile.current.contains(event.target) &&
        !locationWrapperRefMobile.current.contains(event.target)
      ) {
        setShowMobileLocation(false);
      }

      // Handle profile dropdown
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }

      // Handle mail dropdown
      if (
        isMailDropdownOpen &&
        mailDropdownRef.current &&
        !mailDropdownRef.current.contains(event.target)
      ) {
        setIsMailDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showLocation, showMobileLocation, isDropdownOpen, isMailDropdownOpen]);

  const handleLocationSelect = (location) => {
    setCurrentLocation(location);
    setShowLocation(false);
    setShowMobileLocation(false); 
  };

  const toggleMailDropdown = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (isUserBuyer) {
      router.push("/chat-buyer");
      return;
    }

    setIsMailDropdownOpen(!isMailDropdownOpen);
    if (!isMailDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  const toggleDropdown = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setIsDropdownOpen(!isDropdownOpen);
    // Close mail dropdown when opening this one
    if (!isDropdownOpen) {
      setIsMailDropdownOpen(false);
    }
  };

  const getUserInitials = (name) => {
    if (!name) return "";

    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();
    return initials;
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleGoClick = () => {
    console.log("sdyfu");
    router.replace("/search-results");
  };

  const handleLocationClick = (e) => {
    e.stopPropagation();
    setShowLocation((prev) => !prev);
  };

  const handleLocationClickMobile = (e) => {
    e.stopPropagation();
    setShowMobileLocation((prev) => !prev);
  };

  return (
    <>
      {/* Original Header (hidden on mobile) */}
      <div className="flex items-center justify-end gap-[32px] py-[16px] mr-10">
        <Link
          href={`${
            isUserSeller ? "/seller-onboarding/business-info" : "/list-your-business"
          }`}
        >
          <span className="text-[#666666] text-[14px] font-medium leading-[24px] tracking-[0.28px] font-['Helvetica'] cursor-pointer">
            List Your Business
          </span>
        </Link>

        <div className="flex items-center gap-[15px]">
          {session?.user && (
            <>
              <div className="relative" ref={mailDropdownRef}>
                <Image
                  src={MailIcon}
                  alt="Mail Icon"
                  width={30}
                  height={30}
                  className="w-[30px] h-[30px] flex-shrink-0 cursor-pointer"
                  onClick={toggleMailDropdown}
                />
                {isMailDropdownOpen && isUserSeller && (
                  <div className="absolute right-0 mt-2 w-[112px] bg-white rounded-[10px] shadow-lg p-4 space-y-4 z-[9999] border-1 border-[#CCCCCC]">
                    <Link href="/chat-seller">
                      <div className="text-[#666666] text-[14px] font-medium leading-[24px] tracking-[0.28px] cursor-pointer hover:text-[#333333]">
                        Chat Seller
                      </div>
                    </Link>
                    <Link href="/chat-buyer">
                      <div className="text-[#666666] text-[14px] font-medium leading-[24px] tracking-[0.28px] cursor-pointer hover:text-[#333333]">
                        Chat Buyer
                      </div>
                    </Link>
                  </div>
                )}
              </div>
              <Image
                src={BellIcon}
                alt="Bell Icon"
                width={30}
                height={30}
                className="w-[30px] h-[30px] flex-shrink-0 cursor-pointer"
              />
            </>
          )}

          {session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="focus:outline-none cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#b3b3b3] flex items-center justify-center text-[#fff] font-semibold">
                  {getUserInitials(session?.user?.name)}
                </div>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-4 w-fit bg-white rounded-[10px] shadow-lg p-4 space-y-4 z-[9999] border-1 border-[#CCCCCC]">
                  <div className="text-[#666666] text-xs font-medium leading-[10px]">
                    {session?.user?.email}
                  </div>
                  <Link
                    href="/buyer-profile"
                    className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                  >
                    My Profile
                  </Link>
                  {isUserSeller ? (
                    <Link
                      href="/seller-onboarding/business-info"
                      className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer text-nowrap"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/list-your-business"
                      className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer text-nowrap"
                    >
                      Upgrade to Seller
                    </Link>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout(e);
                    }}
                    className="w-full text-left text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsSignupOpen(true)}
              className="focus:outline-none cursor-pointer w-8 h-8"
            >
              <Image src={UserIcon} alt="User Icon" className="w-8 h-8" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden header-mobile">
        <h1
          className={`logo text-[24px] font-bold text-[#0084ff] ${Baloo2.className} `}
        >
          Geekofy
        </h1>
        <div className="icons">
          <Link
            href={`${
              isUserSeller ? "/seller-onboarding/business-info" : "/list-your-business"
            }`}
          >
            <span className="text-[#666666] text-[14px] font-medium leading-[24px] tracking-[0.28px] font-['Helvetica'] cursor-pointer">
              List Your Business
            </span>
          </Link>
          {session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="focus:outline-none cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#b3b3b3] flex items-center justify-center text-[#fff] font-semibold user-icon">
                  {getUserInitials(session.user.name)}
                </div>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-4 w-fit bg-white rounded-[10px] shadow-lg p-4 space-y-4 z-[9999] border-1 border-[#CCCCCC]">
                  <Link
                    href="/buyer-profile"
                    className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                  >
                    My Profile
                  </Link>
                  {isUserSeller ? (
                    <Link
                      href="/seller-onboarding/business-info"
                      className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer text-nowrap"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/list-your-business"
                      className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer text-nowrap"
                    >
                      Upgrade to Seller
                    </Link>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout(e);
                    }}
                    className="w-full text-left text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsSignupOpen(true)}
              className="focus:outline-none cursor-pointer w-8 h-8"
            >
              <Image src={UserIcon} alt="User Icon" className="mt-1 w-8 h-8 user-icon" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-[55vh] sticky top-0 z-50">
        {/* Logo and Buttons Section */}
        <div className="flex justify-center items-center w-full px-4 sm:px-8 mb-4">
          <h1
            className={`text-center text-[50px] hidden md:block sm:text-[72px] font-bold font-Baloo_2 text-[#0084ff] ${Baloo2.className}`}
          >
            Geekofy
          </h1>
        </div>

        {/* Search Bar Section - Desktop */}
        <div className="hidden md:flex flex-col items-end justify-end relative">
          <div className="w-[600px] h-[48px] flex items-center gap-4 px-5 py-[10px] rounded-[8px] border border-[#B3B3B3] bg-white shadow-md">
            <FindMyLocation variant="main" />
            <span className="w-[2px] h-[20px] bg-[#B3B3B3] inline-block"></span>
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGoClick();
                }
              }}
              placeholder="Search for Service/Business"
              className="bg-transparent outline-none flex-grow text-[#999999] font-['Helvetica'] text-[13px] leading-[24px] tracking-[0.28px]"
            />
          </div>

          <div className="text-[#808080] text-sm leading-6 mt-2 font-normal font-helvetica">
            computer repair, outlook help, printer support, mobile repair, etc
          </div>
        </div>

        {/* Search Bar Section - Mobile */}
        <div className="md:hidden flex flex-col w-full px-4 gap-2">
          {/* Location Input */}
          <div className="w-full h-[48px] flex items-center gap-4 px-5 py-[10px] rounded-[8px] border border-[#B3B3B3] bg-white shadow-md">
            <Image src={Location} alt="Location" width={18} height={28} />
            <button
              onClick={handleLocationClick}
              className="text-[#666666] font-['Helvetica'] cursor-pointer text-[13px] leading-[24px] tracking-[0.28px] truncate flex-grow text-left"
              title={currentLocation?.simplifiedAddress || "Find My Location"}
            >
              {currentLocation?.simplifiedAddress || "Find My Location"}
            </button>
          </div>
          {showLocation && (
            <div ref={locationWrapperRef} className="relative z-50">
              <div className="absolute top-0 w-full">
                <LocationDetail onLocationSelect={handleLocationSelect} />
              </div>
            </div>
          )}

          {/* Search Input */}
          <div className="w-full h-[48px] flex items-center gap-4 px-5 py-[10px] rounded-[8px] border border-[#B3B3B3] bg-white shadow-md">
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGoClick();
                }
              }}
              placeholder="Search for Service/Business"
              className="bg-transparent outline-none flex-grow text-[#999999] font-['Helvetica'] text-[13px] leading-[24px] tracking-[0.28px]"
            />
          </div>

          <div className="text-[#808080] text-sm leading-6 mt-2 font-normal font-helvetica text-center">
            computer repair, outlook help, printer support, mobile repair, etc
          </div>
        </div>

        {/* Icons Section - Desktop Only */}
        <div className="hidden md:inline-flex items-center justify-center gap-[60px] flex-wrap mt-[64px]">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center gap-[16px] w-[61px]"
            >
              <Image
                src={item.img}
                alt={item.text}
                width={item.id === 4 ? 30 : 44}
                height={item.id === 4 ? 44 : 44}
                className={
                  item.id === 4 ? "w-[30px] h-[44px]" : "w-[44px] h-[44px]"
                }
              />
              <p className="text-[rgba(0,0,0,0.55)] text-[12px] font-['Helvetica'] font-normal leading-[18px] tracking-[0.24px] text-center whitespace-pre-line">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {isSignupOpen && (
        <Signup
          onClose={() => setIsSignupOpen(false)}
          onSignupSuccess={(userData) => {
            console.log("User signed up:", userData);
          }}
          onSwitchToLogin={() => {
            setIsSignupOpen(false);
            setIsLoginOpen(true);
          }}
          isSeller={false}
        />
      )}

      {isLoginOpen && (
        <Login
          onClose={() => setIsLoginOpen(false)}
          onSwitchToSignup={() => {
            setIsLoginOpen(false);
            setIsSignupOpen(true);
          }}
          onSwitchToLogin={() => {
            setIsSignupOpen(false);
            setIsLoginOpen(true);
          }}
        />
      )}
    </>
  );
}

