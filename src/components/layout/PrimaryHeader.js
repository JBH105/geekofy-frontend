"use client";
import Link from "next/link";
import { useState } from "react";
import Login from "../auth/login/Login";
import Signup from "../auth/signup/Signup";
import Image from "next/image";
import Geekofy from "../../../public/image/Geekofy.svg";

export default function PrimaryHeader({ isUserLogIn }) {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <header className="relative z-10 py-4">
        <div className="layout_container flex justify-between items-center px-4 sm:px-0">
          <Link
            href="/"
            className="flex items-center space-x-4 ml-0 sm:ml-[20px]"
          >
            <Image
              src={Geekofy}
              alt="Geekofy Logo"
              width={180}
              height={32}
              className="object-contain w-[140px] sm:w-[180px]"
            />
          </Link>

          {isUserLogIn && (
            <div className="flex gap-2 sm:gap-4 mr-0 sm:mr-[20px]">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="border border-white text-white w-[80px] sm:w-[114px] h-[32px] sm:h-[36px] px-2 sm:px-[20px] gap-1 rounded-[8px] hover:bg-white/10 transition text-xs sm:text-sm cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => setIsSignupOpen(true)}
                className="bg-[#0084ff] text-white px-3 sm:px-10 py-1.5 sm:py-2 w-[120px] sm:w-[180px] h-[32px] sm:h-[36px] gap-1 rounded-[8px] hover:bg-[#0084ff]/90 transition text-xs sm:text-sm cursor-pointer"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </header>

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
