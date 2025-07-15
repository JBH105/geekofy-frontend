"use client";

import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";

export const supportTypes = [
  { id: "remote", label: "Remote Support" },
  { id: "instore", label: "In Store Service" },
  { id: "housecall", label: "House Call" },
  { id: "pickup", label: "Pick Up & Drop" },
  { id: "residential", label: "Residential Service" },
  { id: "business", label: "Business Service" },
];

export default function SupportTypeSection({
  setSupportTypeSection,
  supportTypeData,
  saveBusinessDetails,
}) {
  const [selectedTypes, setSelectedTypes] = useState(supportTypeData || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (JSON.stringify(selectedTypes) !== JSON.stringify(supportTypeData)) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [selectedTypes, supportTypeData]);

  const handleCheckboxChange = (id) => {
    if (selectedTypes.includes(id)) {
      setSelectedTypes(selectedTypes.filter((type) => type !== id));
    } else {
      setSelectedTypes([...selectedTypes, id]);
    }
  };

  const handleClearAll = () => {
    setSelectedTypes([]);
  };

  const handleCancel = () => {
    if (hasChanges) {
      setIsModalOpen(true);
    } else {
      setSupportTypeSection((prev) => ({ ...prev, show: false }));
    }
  };

  const handleSave = () => {
    setSupportTypeSection((prev) => ({
      ...prev,
      show: false,
      data: selectedTypes,
    }));
    saveBusinessDetails({ supportTypes: selectedTypes });
  };

  const handleConfirmExit = () => {
    setIsModalOpen(false);
    setSupportTypeSection((prev) => ({ ...prev, show: false }));
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const primarySupportTypes = supportTypes.filter(
    (type) => type.id !== "residential" && type.id !== "business"
  );
  const specialSupportTypes = supportTypes.filter(
    (type) => type.id === "residential" || type.id === "business"
  );

  const isSaveEnabled =
    selectedTypes.includes("residential") || selectedTypes.includes("business");

  return (
    <>
      <div className="bg-white p-8 rounded-lg shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[#666666] leading-5 mb-2">
                Support Type
              </h2>
              <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-8"></div>
            </div>
            {selectedTypes.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[#0084FF] hover:text-blue-600 text-sm font-medium cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Primary Support Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {primarySupportTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-3">
                  <div
                    onClick={() => handleCheckboxChange(type.id)}
                    className="relative cursor-pointer"
                  >
                    {selectedTypes.includes(type.id) ? (
                      <div className="w-4 h-4 border border-blue-500 bg-blue-500 flex items-center justify-center rounded">
                        <FiCheck className="text-white" size={16} />
                      </div>
                    ) : (
                      <div className="w-4 h-4 border-2 border-[#666666] rounded"></div>
                    )}
                  </div>
                  <label
                    htmlFor={type.id}
                    className="text-[#666666] font-normal text-base cursor-pointer"
                    onClick={() => handleCheckboxChange(type.id)}
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Special Support Types (Residential and Business) */}
      <div className="bg-white p-8 rounded-lg shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specialSupportTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-3">
              <div
                onClick={() => handleCheckboxChange(type.id)}
                className="relative cursor-pointer"
              >
                {selectedTypes.includes(type.id) ? (
                  <div className="w-4 h-4 border border-blue-500 bg-blue-500 flex items-center justify-center rounded">
                    <FiCheck className="text-white" size={16} />
                  </div>
                ) : (
                  <div className="w-4 h-4 border-2 border-[#666666] rounded"></div>
                )}
              </div>
              <label
                htmlFor={type.id}
                className="text-[#666666] font-normal text-base cursor-pointer"
                onClick={() => handleCheckboxChange(type.id)}
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-[50px]">
        <button
          onClick={handleCancel}
          className="px-5 py-2.5 border border-[#666666] rounded-lg hover:bg-gray-50 text-[#666666] text-base cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!isSaveEnabled}
          className={`px-5 py-2.5 rounded-lg text-base cursor-pointer ${
            isSaveEnabled
              ? "bg-[#0084FF] text-white hover:bg-blue-600"
              : "bg-gray-300 text-[#666666] cursor-not-allowed"
          }`}
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
}
