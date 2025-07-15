"use client";
import { useState, useEffect } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import YearFoundedIcon from "../../../../public/image/ProfileIcon/YearFoundedIcon.svg";
import EmployeeStrengthIcon from "../../../../public/image/ProfileIcon/EmployeeStrengthIcon.svg";
import CatersIcon from "../../../../public/image/ProfileIcon/CatersIcon.svg";
import SupporttypeIcon from "../../../../public/image/ProfileIcon/SupporttypeIcon.svg";
import PaymentMethod from "../../../../public/image/ProfileIcon/PaymentMethod.svg";
import TrueIcon from "../../../../public/image/TrueIcon.svg";
import CloseIcon from "../../../../public/image/CloseIcon.svg";
import Image from "next/image";
import { supportTypes } from "@/components/seller-onboarding/BusinessProfileForm/SupportTypeSection";
import { paymentMethods } from "@/components/seller-onboarding/BusinessProfileForm/PaymentMethodSection";

// Original Desktop OverviewRow Component (unchanged)
const DesktopOverviewRow = ({ icon, label, children }) => (
  <div className="flex items-start space-x-4">
    {/* Icon */}
    <div className="w-6 pt-1">
      <Image
        src={icon || "/placeholder.svg"}
        alt={`${label} Icon`}
        width={24}
        height={24}
      />
    </div>
    {/* Label with border-right */}
    <div className="border-r border-[#666666] pr-4 min-w-[170px] pt-[2px]">
      <p className="text-sm text-[#666666] font-semibold leading-6 tracking-[0.14px]">
        {label}
      </p>
    </div>
    {/* Content */}
    <div className="flex-1">{children}</div>
  </div>
);

// Mobile OverviewRow Component
const MobileOverviewRow = ({ icon, label, children }) => (
  <div className="space-y-2">
    {/* Icon and Label */}
    <div className="flex items-center space-x-3">
      <div className="w-6">
        <Image
          src={icon || "/placeholder.svg"}
          alt={`${label} Icon`}
          width={24}
          height={24}
        />
      </div>
      <p className="text-sm text-[#666666] font-semibold leading-6 tracking-[0.14px]">
        {label}
      </p>
    </div>
    {/* Content */}
    <div className="pl-9">{children}</div>
  </div>
);

export default function OverviewTab({ business, isLoading }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640); // 640px is sm breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const isSelected = (arr, id) => arr?.includes(id);
  const isCatersSelected = (cat) => business?.services?.caters?.includes(cat);
  const isSupportSelected = (id) =>
    business?.services?.supportType?.includes(id);
  const isPaymentSelected = (label) =>
    business?.services?.paymentMethods?.includes(label);

  const getEmployeeRange = (count) => {
    if (count === "Solo") return "Solo";
    if (count === "2-5") return "2-5 Employees";
    if (count === "6-10") return "6-10 Employees";
    if (count === "11-20") return "11-20 Employees";
    if (count === "20+") return "20+ Employees";
    return "";
  };

  const specialSupportTypes = supportTypes.filter(
    (type) => type.id === "residential" || type.id === "business"
  );

  const primarySupportTypes = supportTypes.filter(
    (type) => type.id !== "residential" && type.id !== "business"
  );

  // Choose the appropriate component based on screen size
  const OverviewRow = isMobile ? MobileOverviewRow : DesktopOverviewRow;

  return (
    <div className="space-y-6 ml-5">
      <div>
        <p className="text-[#666666] text-sm leading-6 tracking-[0.14px] mt-6">
          {business?.description}
        </p>
      </div>

      <OverviewRow icon={YearFoundedIcon} label="Year Founded">
        <p className="text-[#666666] text-sm leading-6 tracking-[0.14px]">
          {business?.yearFounded}
        </p>
      </OverviewRow>

      <OverviewRow icon={EmployeeStrengthIcon} label="Employee Strength">
        <p className="text-[#666666] text-sm leading-6 tracking-[0.14px]">
          {getEmployeeRange(business?.employeeCount)}
        </p>
      </OverviewRow>

      <OverviewRow icon={CatersIcon} label="Caters">
        <div
          className={
            isMobile
              ? "flex items-center gap-2  "
              : "grid grid-cols-3 gap-y-2 gap-x-6"
          }
        >
          {specialSupportTypes.map((type, index) => (
            <div key={index} className="flex items-center gap-2">
              <Image
                src={isCatersSelected(type.id) ? TrueIcon : CloseIcon}
                alt="Status Icon"
                width={16}
                height={16}
              />
              <span className="text-[#666666] text-sm leading-6 tracking-[0.14px]">
                {type.label}
              </span>
            </div>
          ))}
        </div>
      </OverviewRow>

      <OverviewRow icon={SupporttypeIcon} label="Support Type">
        <div
          className={
            isMobile
              ? "space-y-2 grid grid-cols-2"
              : "grid grid-cols-3 gap-y-2 gap-x-6"
          }
        >
          {primarySupportTypes?.map((type, index) => (
            <div key={index} className="flex items-center gap-2">
              <Image
                src={isSupportSelected(type.id) ? TrueIcon : CloseIcon}
                alt="Status Icon"
                width={16}
                height={16}
              />
              <span className="text-[#666666] text-sm leading-6 tracking-[0.14px]">
                {type?.label}
              </span>
            </div>
          ))}
        </div>
      </OverviewRow>

      <OverviewRow icon={PaymentMethod} label="Payment Method">
        <div
          className={
            isMobile
              ? "space-y-2 grid grid-cols-2"
              : "grid grid-cols-3 gap-y-2 gap-x-6"
          }
        >
          {paymentMethods.map((method, index) => (
            <div key={index} className="flex items-center gap-2">
              <Image
                src={isPaymentSelected(method.label) ? TrueIcon : CloseIcon}
                alt="Status Icon"
                width={16}
                height={16}
              />
              <span className="text-[#666666] text-sm leading-6 tracking-[0.14px]">
                {method?.label}
              </span>
            </div>
          ))}
        </div>
      </OverviewRow>
    </div>
  );
}
