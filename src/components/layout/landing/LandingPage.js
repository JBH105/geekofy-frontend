"use client";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";
import PrimaryHeader from "../PrimaryHeader";
import HomePageImage from "../../../../public/image/landing.png";
import Signup from "@/components/auth/signup/Signup";
import Login from "@/components/auth/login/Login";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/shared/Loader";
import Link from "next/link";

export default function LandingPage() {
  const { data: session } = useSession();
  const isUserLogIn = session !== null ? false : true;
  const isUserSeller = session
    ? session?.user?.role?.includes("seller")
      ? true
      : false
    : true;

  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyerUpgrade = async () => {
    window.location.href = "/seller-onboarding/business-info";
  };
  return (
    <>
      <div className="relative">
        {/* Hero Background */}
        <Loader isLoading={isLoading} size={12} />
        <div className="min-h-[500px] md:min-h-[550px] bg-[#1e263b] bg-gradient-to-br from-[#1e263b] to-[#181f31] relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={HomePageImage}
              alt="Background pattern"
              fill
              className="opacity-10 object-cover"
              priority
            />
          </div>

          {/* Header */}
          <PrimaryHeader isUserLogIn={isUserLogIn} />

          {/* Hero Section */}
          <div className="relative z-10 layout_container">
            <section className="py-10 md:py-14 lg:py-16 flex flex-col items-center justify-center text-center px-4 md:px-6 lg:px-0">
              <h1 className="w-full max-w-[90%] md:w-[600px] lg:w-[717px] text-[24px] md:text-[28px] lg:text-[32px] leading-[120%] lg:leading-[100%] font-bold text-white text-center font-helvetica">
                The Ultimate Place for{" "}
                <span className="text-[#f8b84e]">Geeks</span> to Attract
                Clients.
              </h1>

              {isUserSeller ? (
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 justify-center items-center w-full mt-6 md:mt-7 lg:mt-8">
                  <button
                    onClick={() => setIsSignupOpen(true)}
                    className="bg-[#0084ff] text-white w-full md:w-[250px] lg:max-w-[300px] px-6 py-3 rounded-[8px] text-sm md:text-[15px] lg:text-base font-medium hover:bg-[#0084ff]/90 transition text-center cursor-pointer"
                  >
                    Register your Business
                  </button>
                  <Link
                    href="/"
                    className="bg-[#0084ff] text-white w-full md:w-[250px] lg:max-w-[300px] px-6 py-3 rounded-[8px] text-sm md:text-[15px] lg:text-base font-medium hover:bg-[#0084ff]/90 transition text-center cursor-pointer"
                  >
                    Go to Home Page
                  </Link>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="border border-[#0084ff] text-white w-full md:w-[270px] lg:max-w-[300px] px-6 py-3 rounded-[8px] text-sm md:text-[15px] lg:text-base font-medium hover:bg-[#0084ff]/10 transition text-center cursor-pointer"
                  >
                    Already Listed? Login now
                  </button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 justify-center items-center w-full mt-6 md:mt-7 lg:mt-8">
                  <button
                    onClick={() => handleBuyerUpgrade()}
                    className="bg-[#0084ff] text-white w-full md:w-[350px] lg:max-w-[300px] px-6 py-3 rounded-[8px] text-sm md:text-[15px] lg:text-base font-medium hover:bg-[#0084ff]/90 transition text-center cursor-pointer"
                  >
                    You want to become a Seller ?
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative z-20 layout_container">
          <div
            className="bg-white rounded-lg px-4 md:px-8 lg:px-28 py-6 md:py-10 lg:py-12 max-w-[400px] sm:max-w-[928px] mx-auto -mt-20 md:-mt-32 lg:-mt-48 border border-[#CCCCCC]"
            style={{
              boxShadow:
                "-1px -1px 25px 0px #0000000D, 1px 1px 25px 0px #0000000D",
            }}
          >
            <h2 className="text-2xl md:text-2xl lg:text-3xl font-normal leading-10 text-center mb-6 md:mb-7 lg:mb-[28px] text-black">
              Get started with online discovery
            </h2>

            <div className="">
              <div className="border-t border-[#00000033] my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-6 lg:gap-y-8 gap-x-[50px] md:gap-x-[80px] lg:gap-x-[100px] pt-4 md:pt-5 lg:pt-6 pb-2">
                {/* Feature Columns */}
                {[
                  "Never pay for leads again",
                  "Free Listing",
                  "No Card On File",
                  "Live Chat",
                  "Reach Targeted Customers",
                  "Free Call To Action",
                  "Free SEO",
                  "Only Verified Reviews",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 md:gap-6 lg:gap-8"
                  >
                    <FaCheck className="text-[#F8B84E] text-lg md:text-xl lg:text-xl flex-shrink-0 mt-1" />
                    <span className="text-base md:text-[17px] lg:text-xl text-[#000000CC] leading-[24px] md:leading-[26px] lg:leading-[28px]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Signup Modal */}
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
          isSeller={true}
        />
      )}

      {/* Login Modal */}
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
