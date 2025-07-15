"use client";

import { useState } from "react";
import FacebookIcon from "../../../public/image/FacebookIcon.svg";
import TwitterIcon from "../../../public/image/TwitterIcon.svg";
import WhatsappIcon from "../../../public/image/WhatsappIcon.svg";
import EmailBlackIcon from "../../../public/image/EmailBlackIcon.svg";

import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";

export default function ShareModal({
  isOpen,
  onClose,
  city = "",
  businessSlug = "",
  zipCode = "",
  neighborhood = "",
  tab = "overview",
  title = "Share it with friends",
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Construct the share URL in exact required format
  const constructShareUrl = () => {
    // Base URL with city
    let url = `https://geekofy.com/${city.toLowerCase()}/`;

    // Add business slug (e.g. "jbh-47")
    url += businessSlug;

    // Add neighborhood if exists (format: "-place-{neighborhood}")
    if (neighborhood) {
      url += `-place-${neighborhood}`;
    }

    // Add zip code if exists (format: "-{zipCode}")
    if (zipCode) {
      url += `-${zipCode}`;
    }

    // Add tab (defaults to "overview")
    url += `/${tab}`;

    return url;
  };

  const shareUrl = constructShareUrl();

  /* REST OF THE COMPONENT REMAINS EXACTLY THE SAME */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent("Check this out!");
    const body = encodeURIComponent(
      `I thought you might be interested in this: ${shareUrl}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent("Check this out!")}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `Check this out: ${shareUrl}`
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-[#00000066] transition-opacity flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-[700px] mx-auto shadow-xl">
        {/* Header */}
        <div className="bg-gray-200 rounded-t-lg px-4 py-3 flex justify-between items-center">
          <div></div>
          <button
            onClick={onClose}
            className="p-1 rounded-full transition-colors cursor-pointer"
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-[50px] py-[30px]">
          <h2 className="text-base font-semibold text-start mb-8 text-gray-900">
            {title}
          </h2>

          {/* Social Share Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={handleEmailShare}
              className="w-[90px] h-[90px] rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Image src={EmailBlackIcon} alt="Email" />
            </button>

            <button
              onClick={handleFacebookShare}
              className="w-[90px] h-[90px] rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Image src={FacebookIcon} alt="Facebook" />
            </button>

            <button
              onClick={handleTwitterShare}
              className="w-[90px] h-[90px] rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Image src={TwitterIcon} alt="Twitter" />
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="w-[90px] h-[90px] rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Image src={WhatsappIcon} alt="WhatsApp" />
            </button>
          </div>

          {/* URL Copy Section */}
          <div className="relative flex-1">
            <input
              value={shareUrl}
              readOnly
              className="w-full border border-[#808080] text-lg px-[30px] pr-[120px] rounded-lg py-[10px]"
            />
            <button
              onClick={handleCopyLink}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border rounded-4xl border-[#808080] text-[#808080] px-[20px] py-[5px] cursor-pointer text-sm"
            >
              {copied ? <>Copied</> : <>Copy Link</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
