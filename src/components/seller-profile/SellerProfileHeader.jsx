// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { useState, useRef, useEffect } from "react";
// import { FaBars, FaTimes } from "react-icons/fa";
// import { signOut, useSession } from "next-auth/react";
// import Email from "../../../public/image/Email.svg";
// import NotificationBell from "../../../public/image/NotificationBell.svg";
// import Profile from "../../../public/image/Profile.svg";
// import Location from "../../../public/image/Location.svg";
// import LocationDetail from "../layout/LocationDetail";
// import Signup from "../auth/signup/Signup";
// import Login from "../auth/login/Login";

// export default function SellerProfileHeader() {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showLocation, setShowLocation] = useState(false);
//   const [showMobileLocation, setShowMobileLocation] = useState(false);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [isSignupOpen, setIsSignupOpen] = useState(false);
//   const [isLoginOpen, setIsLoginOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const { data: session } = useSession();
//   const isUserSeller = session?.user?.role?.includes("seller") ? true : false;
//   const locationRef = useRef(null);
//   const locationWrapperRef = useRef(null);
//   const locationRefMobile = useRef(null);
//   const locationWrapperRefMobile = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         showLocation &&
//         locationRef.current &&
//         locationWrapperRef.current &&
//         !locationRef.current.contains(event.target) &&
//         !locationWrapperRef.current.contains(event.target)
//       ) {
//         setShowLocation(false);
//       }

//       // Handle mobile location dropdown
//       if (
//         showMobileLocation &&
//         locationRefMobile.current &&
//         locationWrapperRefMobile.current &&
//         !locationRefMobile.current.contains(event.target) &&
//         !locationWrapperRefMobile.current.contains(event.target)
//       ) {
//         setShowMobileLocation(false);
//       }

//       // Handle profile dropdown
//       if (
//         isDropdownOpen &&
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [showLocation, showMobileLocation, isDropdownOpen]);

//   const toggleDropdown = (e) => {
//     e?.preventDefault?.();
//     e?.stopPropagation?.();
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const handleLogout = () => {
//     signOut({ callbackUrl: "/" });
//   };

//   const handleLocationClick = (e) => {
//     e.stopPropagation();
//     setShowLocation((prev) => !prev);
//   };

//   const handleLocationClickMobile = (e) => {
//     e.stopPropagation();
//     setShowMobileLocation((prev) => !prev);
//   };

//   const getUserInitials = (name) => {
//     if (!name) return "";

//     const names = name.split(" ");
//     let initials = names[0].substring(0, 1).toUpperCase();

//     return initials;
//   };

//   const handleLocationSelect = (location) => {
//     setCurrentLocation(location);
//     setShowLocation(false);
//     setShowMobileLocation(false);
//   };

//   return (
//     <>
//       <header className="bg-white py-3 border-b border-gray-200 sticky top-0 z-50">
//         <div className="layout_container">
//           <div className="mx-[20px] sm:mx-[40px] lg:mx-[80px]">
//             {/* Desktop Header */}
//             <div className="hidden lg:flex items-center justify-between gap-[32px]">
//               {/* Left: Logo */}
//               <Link
//                 href="/"
//                 className="text-[32px] font-[800] text-[#666666] cursor-pointer seconday_header"
//               >
//                 Geekofy
//               </Link>

//               {/* Middle: Search and location */}
//               <div className="flex items-center flex-grow max-w-4xl relative">
//                 <div className="flex items-center border border-[#B3B3B3] rounded-[8px] w-full px-4 py-3 focus-within:outline-2 focus-within:outline-[#0084FF] focus-within:border-transparent">
//                   <Image src={Location} alt="Location" className="mr-2" />
//                   <button
//                     onClick={handleLocationClick}
//                     className="text-[#666666] font-['Helvetica'] cursor-pointer text-[13px] leading-[24px] tracking-[0.28px] truncate max-w-[150px]"
//                     title={
//                       currentLocation?.simplifiedAddress || "Find My Location"
//                     }
//                   >
//                     {currentLocation?.simplifiedAddress || "Find My Location"}
//                   </button>
//                   <span className="text-[#808080] mx-4 text-sm font-normal">
//                     |
//                   </span>
//                   <input
//                     type="text"
//                     placeholder="Search for Service/Business"
//                     className="bg-transparent flex-grow outline-none text-[13px]"
//                   />
//                 </div>
//                 {showLocation && (
//                   <div
//                     ref={locationWrapperRef}
//                     className="absolute left-0 top-full mt-2 z-50"
//                   >
//                     <div ref={locationRef}>
//                       <LocationDetail onLocationSelect={handleLocationSelect} />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Right: Action icons */}
//               <div className="flex items-center gap-[27px]">
//                 <Link
//                   href={`${
//                     isUserSeller
//                       ? "/seller-onboarding/business-info"
//                       : "/list-your-business"
//                   }`}
//                 >
//                   <span className="text-[#666666] text-[14px] font-medium leading-[24px] tracking-[0.28px] font-['Helvetica'] cursor-pointer">
//                     List Your Business
//                   </span>
//                 </Link>
//                 {session?.user && (
//                   <>
//                     <Image
//                       src={Email}
//                       alt="Mail Icon"
//                       width={30}
//                       height={30}
//                       className="w-[30px] h-[30px] flex-shrink-0 cursor-pointer"
//                     />
//                     <Image
//                       src={NotificationBell}
//                       alt="Bell Icon"
//                       width={30}
//                       height={30}
//                       className="w-[30px] h-[30px] flex-shrink-0 cursor-pointer"
//                     />
//                   </>
//                 )}

//                 {session?.user ? (
//                   <div className="relative" ref={dropdownRef}>
//                     <button
//                       onClick={toggleDropdown}
//                       className="focus:outline-none cursor-pointer"
//                     >
//                       <div className="w-8 h-8 rounded-full bg-[#b3b3b3] flex items-center justify-center text-[#fff] font-semibold">
//                         {getUserInitials(session.user.name)}
//                       </div>
//                     </button>
//                     {isDropdownOpen && (
//                       <div className="absolute right-0 mt-4 w-fit bg-white rounded-[10px] shadow-lg p-4 space-y-4 z-[9999] border-1 border-[#CCCCCC]">
//                         <Link
//                           href="/buyer-profile"
//                           className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
//                         >
//                           My Profile
//                         </Link>
//                         {isUserSeller ? (
//                           <Link
//                             href="#"
//                             className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer text-nowrap"
//                           >
//                             Dashboard
//                           </Link>
//                         ) : (
//                           <Link
//                             href="/list-your-business"
//                             className="block text-base text-[#666666] font-normal leading-[20px] cursor-pointer text-nowrap"
//                           >
//                             Upgrade to Seller
//                           </Link>
//                         )}
//                         <button
//                           onClick={(e) => {
//                             e.preventDefault();
//                             e.stopPropagation();
//                             handleLogout(e);
//                           }}
//                           className="w-full text-left text-base text-[#666666] font-normal leading-[20px] cursor-pointer"
//                         >
//                           Logout
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() => setIsSignupOpen(true)}
//                     className="focus:outline-none cursor-pointer w-8 h-8"
//                   >
//                     <Image
//                       src={Profile}
//                       alt="User Icon"
//                       className="mt-1 w-8 h-8"
//                     />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Mobile and Tablet Header */}
//             <div className="flex lg:hidden items-center justify-between">
//               {/* Mobile Menu Button */}
//               <button
//                 onClick={toggleMobileMenu}
//                 className="text-gray-700 cursor-pointer"
//               >
//                 {isMobileMenuOpen ? (
//                   <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
//                 ) : (
//                   <FaBars className="w-5 h-5 sm:w-6 sm:h-6" />
//                 )}
//               </button>

//               {/* Logo - Centered on mobile */}
//               <Link
//                 href="/"
//                 className="text-2xl sm:text-[28px] font-[800] text-[#666666] cursor-pointer"
//               >
//                 Geekofy
//               </Link>

//               {/* Profile Icon on mobile */}
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   onClick={toggleDropdown}
//                   className="focus:outline-none cursor-pointer"
//                 >
//                   {session?.user?.name ? (
//                     <div className="w-8 h-8 rounded-full bg-[#b3b3b3] flex items-center justify-center text-[#fff] font-semibold">
//                       {getUserInitials(session.user.name)}
//                     </div>
//                   ) : (
//                     <Image src={Profile} alt="Profile" className="mt-1" />
//                   )}
//                 </button>
//                 {isDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-md shadow-lg py-1 z-50 border-1 border-[#666666]">
//                     <Link
//                       href="/buyer-profile"
//                       className="block px-3 sm:px-4 py-2 text-sm text-[#666666] hover:bg-gray-100 cursor-pointer"
//                     >
//                       My Profile
//                     </Link>
//                     <button className="block w-full text-left px-3 sm:px-4 py-2 text-sm text-[#666666] hover:bg-gray-100 cursor-pointer">
//                       Dashboard
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         handleLogout(e);
//                       }}
//                       className="block w-full text-left px-3 sm:px-4 py-2 text-sm text-[#666666] hover:bg-gray-100 cursor-pointer"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Mobile and Tablet Menu Content */}
//             {isMobileMenuOpen && (
//               <div className="lg:hidden mt-3 sm:mt-4 pb-3 sm:pb-4">
//                 <div
//                   className="flex items-center border-1 border-[#B3B3B3] rounded-[8px] w-full px-3 sm:px-4 py-2 mb-3 sm:mb-4 relative"
//                   ref={locationWrapperRefMobile}
//                 >
//                   <Image
//                     src={Location}
//                     alt="Location"
//                     className="mr-2 w-4 h-4 sm:w-5 sm:h-5"
//                   />
//                   <button
//                     onClick={handleLocationClickMobile}
//                     className="text-[#666666] text-xs sm:text-sm mr-2 sm:mr-3 whitespace-nowrap focus:outline-none"
//                   >
//                     Find My Location
//                   </button>
//                   <span className="text-[#666666] mx-1 sm:mx-2 text-xs sm:text-sm">
//                     |
//                   </span>
//                   <input
//                     type="text"
//                     placeholder="Search for Service/Business"
//                     className="bg-transparent flex-grow outline-none text-xs sm:text-sm text-[#666666]"
//                   />
//                   {showMobileLocation && (
//                     <div
//                       ref={locationRefMobile}
//                       className="absolute top-full mt-1 left-0 w-full z-50"
//                     >
//                       <LocationDetail />
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex flex-col space-y-2 sm:space-y-3">
//                   <div className="flex items-center space-x-3 sm:space-x-4 cursor-pointer">
//                     <Image
//                       src={Email}
//                       alt="Email"
//                       className="w-4 h-4 sm:w-5 sm:h-5"
//                     />
//                     <span className="text-[#666666] text-base sm:text-lg">
//                       Messages
//                     </span>
//                   </div>
//                   <div className="flex items-center space-x-3 sm:space-x-4 cursor-pointer">
//                     <Image
//                       src={NotificationBell}
//                       alt="NotificationBell"
//                       className="w-4 h-4 sm:w-5 sm:h-5"
//                     />
//                     <span className="text-[#666666] text-base sm:text-lg">
//                       Notifications
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>
//       {isSignupOpen && (
//         <Signup
//           onClose={() => setIsSignupOpen(false)}
//           onSignupSuccess={(userData) => {
//             console.log("User signed up:", userData);
//           }}
//           onSwitchToLogin={() => {
//             setIsSignupOpen(false);
//             setIsLoginOpen(true);
//           }}
//           isSeller={false}
//         />
//       )}

//       {isLoginOpen && (
//         <Login
//           onClose={() => setIsLoginOpen(false)}
//           onSwitchToSignup={() => {
//             setIsLoginOpen(false);
//             setIsSignupOpen(true);
//           }}
//           onSwitchToLogin={() => {
//             setIsSignupOpen(false);
//             setIsLoginOpen(true);
//           }}
//         />
//       )}
//     </>
//   );
// }

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import MailIcon from "../../../public/image/landingPage/home-mail-icon.svg";
import BellIcon from "../../../public/image/landingPage/home-bell-icon.svg";
import Profile from "../../../public/image/Profile.svg";
import Location from "../../../public/image/Location.svg";
import LocationDetail from "../layout/LocationDetail";
import Signup from "../auth/signup/Signup";
import Login from "../auth/login/Login";
import FindMyLocation from "../shared/FindMyLocation";
import { useRouter } from "next/navigation";

export default function SellerProfileHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMailDropdownOpen, setIsMailDropdownOpen] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showMobileLocation, setShowMobileLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: session } = useSession();
  const isUserSeller = session?.user?.role?.includes("seller") ? true : false;
  const isUserBuyer = session?.user?.role?.includes("buyer") ? true : false;
  const router = useRouter();
  const locationRef = useRef(null);
  const locationWrapperRef = useRef(null);
  const locationRefMobile = useRef(null);
  const mailDropdownRef = useRef(null);
  const locationWrapperRefMobile = useRef(null);
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/";

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

  const toggleDropdown = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!session?.user) {
      setIsLoginOpen(true);
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: currentPath });
  };

  const handleLocationClick = (e) => {
    e.stopPropagation();
    setShowLocation((prev) => !prev);
  };

  const handleGoClick = () => {
    console.log("sdyfu");
    router.replace("/search-results");
  };

  const handleLocationClickMobile = (e) => {
    e.stopPropagation();
    setShowMobileLocation((prev) => !prev);
  };

  const getUserInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();
    return initials;
  };

  const handleLocationSelect = (location) => {
    setCurrentLocation(location);
    setShowLocation(false);
    setShowMobileLocation(false);
  };

  return (
    <>
      <header className="bg-white py-3 border-b border-gray-200 sticky top-0 z-50">
        <div className="layout_container">
          <div className="mx-[20px] sm:mx-[40px] lg:mx-[80px]">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between gap-[32px]">
              <Link
                href="/"
                className="text-[32px] font-[800] text-[#666666] cursor-pointer seconday_header"
              >
                Geekofy
              </Link>
              <div className="flex items-center flex-grow max-w-4xl relative">
                <div className="flex items-center border border-[#B3B3B3] rounded-[8px] w-full px-4 py-3 focus-within:outline-2 focus-within:outline-[#0084FF] focus-within:border-transparent">
                  <FindMyLocation />
                  <span className="text-[#808080] mx-4 text-sm font-normal">
                    |
                  </span>
                  <input
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleGoClick();
                      }
                    }}
                    placeholder="Search for Service/Business"
                    className="bg-transparent flex-grow outline-none text-[13px]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-[27px]">
                {!isUserSeller && (
                  <Link href="/list-your-business">
                    <span className="text-[#666666] text-[14px] font-medium leading-[24px] tracking-[0.28px] font-['Helvetica'] cursor-pointer">
                      List Your Business
                    </span>
                  </Link>
                )}
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
                            <div className="text-[#666666] text-[14px] font-medium leading-[24px] tracking-[0.28px]  cursor-pointer hover:text-[#333333]">
                              Chat Seller
                            </div>
                          </Link>
                          <Link href="/chat-buyer">
                            <div className="text-[#666666] text-[14px] font-medium leading-[24px] tracking-[0.28px]  cursor-pointer hover:text-[#333333]">
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
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="focus:outline-none cursor-pointer"
                  >
                    {session?.user ? (
                      <div className="w-8 h-8 rounded-full bg-[#b3b3b3] flex items-center justify-center text-[#fff] font-semibold">
                        {getUserInitials(session.user.name)}
                      </div>
                    ) : (
                      <Image
                        src={Profile}
                        alt="User Icon"
                        className="mt-1 w-8 h-8"
                      />
                    )}
                  </button>
                  {isDropdownOpen && session?.user && (
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
              </div>
            </div>

            {/* Mobile and Tablet Header */}
            <div className="flex lg:hidden items-center justify-between">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 cursor-pointer"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <FaBars className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
              <Link
                href="/"
                className="text-2xl sm:text-[28px] font-[800] text-[#666666] cursor-pointer"
              >
                Geekofy
              </Link>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="focus:outline-none cursor-pointer"
                >
                  {session?.user?.name ? (
                    <div className="w-8 h-8 rounded-full bg-[#b3b3b3] flex items-center justify-center text-[#fff] font-semibold">
                      {getUserInitials(session.user.name)}
                    </div>
                  ) : (
                    <Image src={Profile} alt="Profile" className="mt-1" />
                  )}
                </button>
                {isDropdownOpen && session?.user && (
                  <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-md shadow-lg py-1 z-50 border-1 border-[#666666]">
                    <Link
                      href="/buyer-profile"
                      className="block px-3 sm:px-4 py-2 text-sm text-[#666666] hover:bg-gray-100 cursor-pointer"
                    >
                      My Profile
                    </Link>
                    <button className="block w-full text-left px-3 sm:px-4 py-2  text-sm text-[#666666] hover:bg-gray-100 cursor-pointer">
                      Dashboard
                    </button>
                    <button
                      onClick={(e) => {
                        handleLogout(e);
                      }}
                      className="block w-full text-left px-3 sm:px-4 py-2 text-sm text-[#666666] hover:bg-gray-100 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile and Tablet Menu Content */}
            {isMobileMenuOpen && (
              <div className="lg:hidden mt-3 sm:mt-4 pb-3 sm:pb-4">
                <div
                  className="flex items-center border-1 border-[#B3B3B3] rounded-[8px] w-full px-3 sm:px-4 py-2 mb-3 sm:mb-4 relative"
                  ref={locationWrapperRefMobile}
                >
                  <Image
                    src={Location}
                    alt="Location"
                    className="mr-2 w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <button
                    onClick={handleLocationClickMobile}
                    className="text-[#666666] text-xs sm:text-sm mr-2 sm:mr-3 whitespace-nowrap focus:outline-none"
                  >
                    Find My Location
                  </button>
                  <span className="text-[#666666] mx-1 sm:mx-2 text-xs sm:text-sm">
                    |
                  </span>
                  <input
                    type="text"
                    placeholder="Search for Service/Business"
                    className="bg-transparent flex-grow outline-none text-xs sm:text-sm text-[#666666]"
                  />
                  {showMobileLocation && (
                    <div
                      ref={locationRefMobile}
                      className="absolute top-full mt-1 left-0 w-full z-50"
                    >
                      <LocationDetail />
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-3 sm:space-x-4 cursor-pointer">
                    <Image
                      src={MailIcon}
                      alt="Email"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <span className="text-[#666666] text-base sm:text-lg">
                      Messages
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4 cursor-pointer">
                    <Image
                      src={BellIcon}
                      alt="NotificationBell"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <span className="text-[#666666] text-base sm:text-lg">
                      Notifications
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
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
          callbackUrl={currentPath}
        />
      )}
    </>
  );
}
