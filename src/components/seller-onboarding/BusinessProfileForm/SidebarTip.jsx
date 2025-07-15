"use client";
import Image from "next/image";
import HelpQuestionMark from "../../../../public/image/HelpQuestionMark.svg";

export default function SidebarTip() {
  return (
    <>
      <div className="w-full md:max-w-[22%]">
        <div className="bg-white rounded-2xl shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Image src={HelpQuestionMark} alt={HelpQuestionMark} />
            <span
              className="font-bold text-sm text-[#666666] leading-6"
              style={{ letterSpacing: "0.14px" }}
            >
              Tip
            </span>
          </div>

          <div
            className="space-y-6 text-sm font-normal leading-[24px]"
            style={{ letterSpacing: "0.14px" }}
          >
            <p className="text-[#666666]">
              Showcase highlights for no additional cost.
            </p>

            <p className="text-[#666666]">
              Select minimum 1 to maximum 6 highlights which would appear on
              your profile page and also in search results page.
            </p>

            <p className="text-[#666666]">
              You can change them anytime in future.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
