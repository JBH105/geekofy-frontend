// "use client";
// import { useState } from "react";
// import { FiCheck } from "react-icons/fi";
// import Image from "next/image";
// import FlatFee from "../../../../public/image/Highlights/FlatFee.svg";
// import PayAfterService from "../../../../public/image/Highlights/PayAfterService.svg";
// import MoneyBackGuarantee from "../../../../public/image/Highlights/MoneyBackGuarantee.svg";
// import FixedFee from "../../../../public/image/Highlights/FixedFee.svg";
// import FreeConsultation from "../../../../public/image/Highlights/FreeConsultation.svg";
// import Availablebyappointment from "../../../../public/image/Highlights/Availablebyappointment.svg";
// import Open24x7 from "../../../../public/image/Highlights/Open24x7.svg";
// import SameDayService from "../../../../public/image/Highlights/SameDayService.svg";
// import AppleCertifiedProfessional from "../../../../public/image/Highlights/AppleCertifiedProfessional.svg";
// import FreeEstimates from "../../../../public/image/Highlights/FreeEstimates.svg";
// import WalkinsWelcome from "../../../../public/image/Highlights/WalkinsWelcome.svg";
// import FamilyOwnedandOperated from "../../../../public/image/Highlights/FamilyOwnedandOperated.svg";
// import SpeaksSpanish from "../../../../public/image/Highlights/SpeaksSpanish.svg";
// import EmergencyServices from "../../../../public/image/Highlights/EmergencyServices.svg";
// import MicrosoftCertifiedProfessional from "../../../../public/image/Highlights/MicrosoftCertifiedProfessional.svg";

// export const highlights = [
//   { name: "Flat Fee", icon: FlatFee },
//   { name: "Pay After Service", icon: PayAfterService },
//   { name: "Money Back Guarantee", icon: MoneyBackGuarantee },
//   { name: "Fixed Fee", icon: FixedFee },
//   { name: "Free Consultation", icon: FreeConsultation },
//   { name: "Available by appointment", icon: Availablebyappointment },
//   { name: "Open 24x7", icon: Open24x7 },
//   { name: "Same Day Service", icon: SameDayService },
//   { name: "Apple Certified Professional", icon: AppleCertifiedProfessional },
//   { name: "Free Estimates", icon: FreeEstimates },
//   { name: "Walk-ins Welcome", icon: WalkinsWelcome },
//   { name: "Family Owned and Operated", icon: FamilyOwnedandOperated },
//   { name: "ES Speaks Spanish", icon: SpeaksSpanish },
//   { name: "Emergency Services", icon: EmergencyServices },
//   {
//     name: "Microsoft Certified Professional",
//     icon: MicrosoftCertifiedProfessional,
//   },
// ];

// const HighlightSection = ({
//   setHighlightSection,
//   highlightData,
//   saveBusinessDetails,
// }) => {
//   const [selectedHighlights, setSelectedHighlights] = useState(
//     highlightData || []
//   );

//   const toggleHighlight = (highlight) => {
//     if (selectedHighlights.includes(highlight)) {
//       setSelectedHighlights(
//         selectedHighlights.filter((item) => item !== highlight)
//       );
//     } else {
//       if (selectedHighlights.length < 6) {
//         setSelectedHighlights([...selectedHighlights, highlight]);
//       }
//     }
//   };

//   const isHighlightDisabled = (highlightName) => {
//     return (
//       selectedHighlights.length >= 6 &&
//       !selectedHighlights.includes(highlightName)
//     );
//   };

//   const handleCancel = () => {
//     setHighlightSection((prev) => ({ ...prev, show: false }));
//   };

//   const handleSave = () => {
//     setHighlightSection((prev) => ({
//       ...prev,
//       show: false,
//       data: selectedHighlights,
//     }));
//     saveBusinessDetails({ highlights: selectedHighlights });
//   };

//   const handleClearAll = () => {
//     setSelectedHighlights([]);
//   };

//   return (
//     <>
//       <div className="bg-white rounded-[16px] p-[32px] shadow-[1px_1px_25px_rgba(0,0,0,0.05)]">
//         <div className="flex justify-between items-start mb-[8px]">
//           <h1 className="text-lg font-semibold text-[#666666] leading-[24px]">
//             Highlights
//           </h1>
//           {selectedHighlights.length > 0 && (
//             <button
//               onClick={handleClearAll}
//               className="text-[14px] text-[#0084FF] hover:text-[#0073e6] cursor-pointer"
//             >
//               Clear All
//             </button>
//           )}
//         </div>
//         <div className="h-[4px] w-[96px] bg-[#0084FF] rounded-full mb-[32px]"></div>

//         <p className="text-[16px] font-bold leading-[24px] text-[#666666] mb-[24px]">
//           Select up to 6 highlights
//         </p>

//         <div className="flex flex-col flex-wrap md:flex-row gap-y-[32px]">
//           {highlights.map((highlight) => {
//             const isDisabled = isHighlightDisabled(highlight.name);
//             const isSelected = selectedHighlights.includes(highlight.name);

//             return (
//               <div
//                 key={highlight.name}
//                 onClick={() => !isDisabled && toggleHighlight(highlight.name)}
//                 className={`flex items-center gap-[9.75px] cursor-pointer transition-opacity duration-200 ${
//                   isDisabled ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 style={{ flexBasis: "31.333%" }}
//               >
//                 {/* Checkbox */}
//                 <div
//                   className={`min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] flex items-center justify-center border rounded ${
//                     isSelected
//                       ? "bg-[#0084FF] border-[#0084FF]"
//                       : isDisabled
//                       ? "border-[#E0E0E0]"
//                       : "border-[#B3B3B3]"
//                   }`}
//                 >
//                   {isSelected && <FiCheck className="text-white" size={14} />}
//                 </div>

//                 {/* Icon + Text block */}
//                 <div className="flex items-center gap-[9.75px] flex-1 min-w-0">
//                   <div className="relative shrink-0">
//                     <Image
//                       src={highlight.icon}
//                       alt={highlight.name}
//                       width={21}
//                       height={20}
//                       className="object-contain"
//                     />
//                   </div>
//                   <span
//                     className={`text-[16px] font-normal whitespace-nowrap ${
//                       isDisabled ? "text-[#B3B3B3]" : "text-[#666666]"
//                     }`}
//                   >
//                     {highlight.name}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-end gap-[16px] mt-[50px]">
//         <button
//           onClick={handleCancel}
//           className="px-[20px] py-[10px] border border-[#666666] rounded-[8px] hover:bg-gray-100 text-[#666666] text-[16px] cursor-pointer"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleSave}
//           className="px-[20px] py-[10px] bg-[#0084FF] text-white rounded-[8px] hover:bg-[#0073e6] text-[16px] cursor-pointer"
//         >
//           Save
//         </button>
//       </div>
//     </>
//   );
// };

// export default HighlightSection;

"use client";
import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import Image from "next/image";

// Placeholder imports for icons (replace with actual icon paths)
import FlatFee from "../../../../public/image/Highlights/FlatFee.svg";
import PayAfterService from "../../../../public/image/Highlights/PayAfterService.svg";
import MoneyBackGuarantee from "../../../../public/image/Highlights/MoneyBackGuarantee.svg";
import FixedFee from "../../../../public/image/Highlights/FixedFee.svg";
import FreeConsultation from "../../../../public/image/Highlights/FreeConsultation.svg";
import Availablebyappointment from "../../../../public/image/Highlights/Availablebyappointment.svg";
import Open24x7 from "../../../../public/image/Highlights/Open24x7.svg";
import SameDayService from "../../../../public/image/Highlights/SameDayService.svg";
import AppleCertifiedProfessional from "../../../../public/image/Highlights/AppleCertifiedProfessional.svg";
import FreeEstimates from "../../../../public/image/Highlights/FreeEstimates.svg";
import WalkinsWelcome from "../../../../public/image/Highlights/WalkinsWelcome.svg";
import FamilyOwnedandOperated from "../../../../public/image/Highlights/FamilyOwnedandOperated.svg";
import SpeaksSpanish from "../../../../public/image/Highlights/SpeaksSpanish.svg";
import EmergencyServices from "../../../../public/image/Highlights/EmergencyServices.svg";
import MicrosoftCertifiedProfessional from "../../../../public/image/Highlights/MicrosoftCertifiedProfessional.svg";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
// Add placeholders for new icons (replace with actual paths)
// import NoHiddenCharges from "../../../../public/image/Highlights/NoHiddenCharges.svg";
// import TransparentPricing from "../../../../public/image/Highlights/TransparentPricing.svg";
// import QuotationBeforeService from "../../../../public/image/Highlights/QuotationBeforeService.svg";
// import DiscountsForStudentsSeniors from "../../../../public/image/Highlights/DiscountsForStudentsSeniors.svg";
// import SevenDaysSupport from "../../../../public/image/Highlights/SevenDaysSupport.svg";
// import ThirtyDaysSupport from "../../../../public/image/Highlights/ThirtyDaysSupport.svg";
// import SixtyDaysSupport from "../../../../public/image/Highlights/SixtyDaysSupport.svg";
// import NinetyDaysSupport from "../../../../public/image/Highlights/NinetyDaysSupport.svg";
// import CertifiedTechnicians from "../../../../public/image/Highlights/CertifiedTechnicians.svg";
// import OriginalPartsUsed from "../../../../public/image/Highlights/OriginalPartsUsed.svg";
// import WarrantyOnRepairs from "../../../../public/image/Highlights/WarrantyOnRepairs.svg";
// import PreRepairDiagnosticReports from "../../../../public/image/Highlights/PreRepairDiagnosticReports.svg";
// import OnsiteRepairsOffered from "../../../../public/image/Highlights/OnsiteRepairsOffered.svg";
// import StorefrontLocation from "../../../../public/image/Highlights/StorefrontLocation.svg";
// import DoorstepPickupDrop from "../../../../public/image/Highlights/DoorstepPickupDrop.svg";
// import FreeLocalPickup from "../../../../public/image/Highlights/FreeLocalPickup.svg";
// import AmpleParkingAvailable from "../../../../public/image/Highlights/AmpleParkingAvailable.svg";
// import OpenOnWeekends from "../../../../public/image/Highlights/OpenOnWeekends.svg";
// import SameDayAppointmentSlots from "../../../../public/image/Highlights/SameDayAppointmentSlots.svg";
// import IOSAndroidSupported from "../../../../public/image/Highlights/IOSAndroidSupported.svg";
// import WindowsMacOSRepairs from "../../../../public/image/Highlights/WindowsMacOSRepairs.svg";
// import ARDeviceSupport from "../../../../public/image/Highlights/ARDeviceSupport.svg";
// import SmartHomeDeviceRepairs from "../../../../public/image/Highlights/SmartHomeDeviceRepairs.svg";
// import DroneRepairsAvailable from "../../../../public/image/Highlights/DroneRepairsAvailable.svg";
// import SmartwatchRepairs from "../../../../public/image/Highlights/SmartwatchRepairs.svg";
// import WiFiNetworkingSupport from "../../../../public/image/Highlights/WiFiNetworkingSupport.svg";
// import DataRecoveryTools from "../../../../public/image/Highlights/DataRecoveryTools.svg";
// import EcoFriendlyDisposal from "../../../../public/image/Highlights/EcoFriendlyDisposal.svg";
// import OldDeviceRecycling from "../../../../public/image/Highlights/OldDeviceRecycling.svg";
// import SustainableRepairMaterials from "../../../../public/image/Highlights/SustainableRepairMaterials.svg";
// import RefurbishmentServices from "../../../../public/image/Highlights/RefurbishmentServices.svg";
// import PetSafeRepairEnvironment from "../../../../public/image/Highlights/PetSafeRepairEnvironment.svg";
// import BatteryRecyclingAccepted from "../../../../public/image/Highlights/BatteryRecyclingAccepted.svg";
// import PaperlessBilling from "../../../../public/image/Highlights/PaperlessBilling.svg";
// import WheelchairAccessibleStore from "../../../../public/image/Highlights/WheelchairAccessibleStore.svg";
// import StaffTrainedForHearingImpaired from "../../../../public/image/Highlights/StaffTrainedForHearingImpaired.svg";
// import SeniorCitizenSupport from "../../../../public/image/Highlights/SeniorCitizenSupport.svg";
// import ChildFriendlyWaitingArea from "../../../../public/image/Highlights/ChildFriendlyWaitingArea.svg";
// import FamilyLoungeAvailable from "../../../../public/image/Highlights/FamilyLoungeAvailable.svg";

// Organized highlights into sections
export const highlights = [
  {
    name: "Pricing & Billing",
    highlights: [
      { name: "No Hidden Charges", icon: FlatFee },
      { name: "Transparent Pricing", icon: FlatFee },
      { name: "Quotation Before Service", icon: FlatFee },
      { name: "Flat Service Fees", icon: FlatFee },
      {
        name: "Discounts for Students & Seniors",
        icon: FlatFee,
      },
      { name: "Free Consultation Available", icon: FlatFee },
      { name: "Pay After Service", icon: FlatFee },
      { name: "7 Days Money Back Guarantee", icon: FlatFee },
      { name: "30 Days Money Back Guarantee", icon: FlatFee },
    ],
  },
  {
    name: "Aftercare & Extras",
    highlights: [
      { name: "7 Days Support for Same Issue", icon: FlatFee },
      { name: "30 Days Support for Same Issue", icon: FlatFee },
      { name: "60 Days Support for Same Issue", icon: FlatFee },
      { name: "90 Days Support for Same Issue", icon: FlatFee },
    ],
  },
  {
    name: "Repair Expertise",
    highlights: [
      { name: "Certified Technicians", icon: FlatFee },
      { name: "Original Parts Used", icon: FlatFee },
      { name: "Same-Day Repairs Available", icon: FlatFee },
      { name: "Warranty on Repairs", icon: FlatFee },
      {
        name: "Pre-Repair Diagnostic Reports",
        icon: FlatFee,
      },
      {
        name: "Apple Certified Professional",
        icon: FlatFee,
      },
      {
        name: "Microsoft Certified Professional",
        icon: FlatFee,
      },
    ],
  },
  {
    name: "Convenience",
    highlights: [
      { name: "Onsite Repairs Offered", icon: FlatFee },
      { name: "Storefront Location", icon: FlatFee },
      { name: "Doorstep Pickup & Drop", icon: FlatFee },
      { name: "Walk-Ins Welcome", icon: FlatFee },
      { name: "Free Local Pickup", icon: FlatFee },
      { name: "Ample Parking Available", icon: FlatFee },
      { name: "Open on Weekends", icon: FlatFee },
      { name: "Appointments Available", icon: FlatFee },
      { name: "Same-Day Appointment Slots", icon: FlatFee },
      { name: "Open 24x7", icon: FlatFee },
      { name: "Emergency Services", icon: FlatFee },
    ],
  },
  {
    name: "Tech & Tools",
    highlights: [
      { name: "iOS + Android Devices Supported", icon: FlatFee },
      { name: "Windows + macOS Repairs", icon: FlatFee },
      { name: "AR Device Support", icon: FlatFee },
      { name: "Smart Home Device Repairs", icon: FlatFee },
      { name: "Drone Repairs Available", icon: FlatFee },
      { name: "Smartwatch Repairs", icon: FlatFee },
      { name: "Wi-Fi & Networking Support", icon: FlatFee },
      { name: "Data Recovery Tools", icon: FlatFee },
    ],
  },
  {
    name: "Sustainability & Ethics",
    highlights: [
      { name: "Eco-Friendly Disposal", icon: FlatFee },
      { name: "Old Device Recycling", icon: FlatFee },
      {
        name: "Sustainable Repair Materials",
        icon: FlatFee,
      },
      { name: "Refurbishment Services Offered", icon: FlatFee },
      { name: "Pet-Safe Repair Environment", icon: FlatFee },
      { name: "Battery Recycling Accepted", icon: FlatFee },
      { name: "Paperless Billing", icon: FlatFee },
    ],
  },
  {
    name: "Accessibility & Inclusivity",
    highlights: [
      { name: "Wheelchair-Accessible Store", icon: FlatFee },
      {
        name: "Staff Trained for Hearing-Impaired",
        icon: FlatFee,
      },
      { name: "Senior Citizen Support", icon: FlatFee },
      { name: "Child-Friendly Waiting Area", icon: FlatFee },
      { name: "Family Lounge Available", icon: FlatFee },
      { name: "Family Owned and Operated", icon: FlatFee },
      { name: "Speaks Spanish", icon: FlatFee },
    ],
  },
];

const HighlightSection = ({
  setHighlightSection,
  highlightData,
  saveBusinessDetails,
}) => {
  const [selectedHighlights, setSelectedHighlights] = useState(
    highlightData || []
  );
  const [activeSection, setActiveSection] = useState("Pricing & Billing");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (JSON.stringify(selectedHighlights) !== JSON.stringify(highlightData)) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [selectedHighlights, highlightData]);

  const toggleHighlight = (highlight) => {
    if (selectedHighlights.includes(highlight)) {
      setSelectedHighlights(
        selectedHighlights.filter((item) => item !== highlight)
      );
    } else {
      if (selectedHighlights.length < 6) {
        setSelectedHighlights([...selectedHighlights, highlight]);
      }
    }
  };

  const isHighlightDisabled = (highlightName) => {
    return (
      selectedHighlights.length >= 6 &&
      !selectedHighlights.includes(highlightName)
    );
  };

  const handleCancel = () => {
    if (hasChanges) {
      setIsModalOpen(true);
    } else {
      setHighlightSection((prev) => ({ ...prev, show: false }));
    }
  };

  const handleSave = () => {
    setHighlightSection((prev) => ({
      ...prev,
      show: false,
      data: selectedHighlights,
    }));
    saveBusinessDetails({ highlights: selectedHighlights });
  };

  const handleClearAll = () => {
    setSelectedHighlights([]);
  };

  const handleConfirmExit = () => {
    setIsModalOpen(false);
    setHighlightSection((prev) => ({ ...prev, show: false }));
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="space-y-[32px]">
        {highlights?.map((section) => (
          <div
            key={section.name}
            className={`bg-white rounded-[16px] p-[32px] shadow-[1px_1px_25px_rgba(0,0,0,0.05)] ${
              activeSection === section.name
                ? " shadow-[1px_1px_30px_rgba(0,132,255,0.15)]"
                : ""
            }`}
          >
            <div className="flex justify-between items-start mb-[8px]">
              <h2
                className="text-lg font-semibold text-[#666666] leading-[24px] cursor-pointer"
                onClick={() => setActiveSection(section.name)}
              >
                {section.name}
              </h2>
              {selectedHighlights.length > 0 &&
                section.name === activeSection && (
                  <button
                    onClick={handleClearAll}
                    className="text-[14px] text-[#0084FF] hover:text-[#0073e6] cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
            </div>
            <div className="h-[4px] w-[96px] bg-[#0084FF] rounded-full mb-[32px]"></div>

            <p className="text-[16px] font-bold leading-[24px] text-[#666666] mb-[24px]">
              Select up to 6 highlights
            </p>

            <div className="flex flex-col flex-wrap md:flex-row gap-y-[32px]">
              {section.highlights.map((highlight) => {
                const isDisabled = isHighlightDisabled(highlight.name);
                const isSelected = selectedHighlights.includes(highlight.name);

                return (
                  <div
                    key={highlight.name}
                    onClick={() =>
                      !isDisabled && toggleHighlight(highlight.name)
                    }
                    className={`flex items-center gap-[9.75px] cursor-pointer transition-opacity duration-200 ${
                      isDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{ flexBasis: "31.333%" }}
                  >
                    {/* Checkbox */}
                    <div
                      className={`min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] flex items-center justify-center border rounded ${
                        isSelected
                          ? "bg-[#0084FF] border-[#0084FF]"
                          : isDisabled
                          ? "border-[#E0E0E0]"
                          : "border-[#B3B3B3]"
                      }`}
                    >
                      {isSelected && (
                        <FiCheck className="text-white" size={14} />
                      )}
                    </div>

                    {/* Icon + Text block */}
                    <div className="flex items-center gap-[9.75px] flex-1 min-w-0">
                      <div className="relative shrink-0">
                        <Image
                          src={highlight.icon}
                          alt={highlight.name}
                          width={21}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                      <span
                        className={`text-[16px] font-normal whitespace-nowrap truncate ${
                          isDisabled ? "text-[#B3B3B3]" : "text-[#666666]"
                        }`}
                      >
                        {highlight.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-[16px] mt-[50px]">
        <button
          onClick={handleCancel}
          className="px-[20px] py-[10px] border border-[#666666] rounded-[8px] hover:bg-gray-100 text-[#666666] text-[16px] cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-[20px] py-[10px] bg-[#0084FF] text-white rounded-[8px] hover:bg-[#0073e6] text-[16px] cursor-pointer"
        >
          Save
        </button>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelModal}
      />
    </>
  );
};

export default HighlightSection;
