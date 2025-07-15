"use client";

import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";

export const paymentMethods = [
  {
    id: "credit-card",
    label: "Credit/ Debit Card",
  },
  {
    id: "paypal",
    label: "PayPal",
  },
  {
    id: "apple-pay",
    label: "Apple Pay",
  },
  {
    id: "google-pay",
    label: "Google Pay",
  },
  {
    id: "cash",
    label: "Cash",
  },
  {
    id: "check",
    label: "Check",
  },
  {
    id: "zelle-pay",
    label: "Zelle Pay",
  },
  {
    id: "klarna",
    label: "Klarna",
  },
  {
    id: "cryptocurrency",
    label: "Cryptocurrency",
  },
  {
    id: "samsung-pay",
    label: "Samsung Pay",
  },
  {
    id: "venmo",
    label: "Venmo",
  },
  {
    id: "square-cash-app",
    label: "Square Cash App",
  },
];

const PaymentMethodSection = ({
  setPaymentMethodSection,
  paymentMethodData,
  saveBusinessDetails,
}) => {
  const [selectedMethods, setSelectedMethods] = useState(
    paymentMethodData || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (JSON.stringify(selectedMethods) !== JSON.stringify(paymentMethodData)) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [selectedMethods, paymentMethodData]);

  const toggleMethod = (id) => {
    if (selectedMethods.includes(id)) {
      setSelectedMethods(selectedMethods.filter((method) => method !== id));
    } else {
      setSelectedMethods([...selectedMethods, id]);
    }
  };

  const handleClearAll = () => {
    setSelectedMethods([]);
  };

  const handleCancel = () => {
    if (hasChanges) {
      setIsModalOpen(true);
    } else {
      setPaymentMethodSection((prev) => ({ ...prev, show: false }));
    }
  };

  const handleConfirmExit = () => {
    setIsModalOpen(false)
    setPaymentMethodSection((prev) => ({ ...prev, show: false }));
  }

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    setPaymentMethodSection((prev) => ({
      ...prev,
      show: false,
      data: selectedMethods,
    }));
    saveBusinessDetails({ paymentMethods: selectedMethods });
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-[#666666] leading-5">
            Payment Method
          </h2>
          {selectedMethods.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-[#0084FF] text-sm hover:underline cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="h-1 w-26 bg-[#0084FF] rounded-full mb-8"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-3">
              <div
                className="relative cursor-pointer"
                onClick={() => toggleMethod(method.label)}
              >
                {selectedMethods.includes(method.label) ? (
                  <div className="w-4 h-4 border border-blue-500 bg-blue-500 flex items-center justify-center rounded">
                    <FiCheck className="text-white" size={16} />
                  </div>
                ) : (
                  <div className="w-4 h-4 border-2 border-[#0000004D] rounded"></div>
                )}
              </div>
              <label
                className="text-gray-600 text-lg cursor-pointer"
                onClick={() => toggleMethod(method.label)}
              >
                {method.label}
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
          className="px-5 py-2.5 bg-[#0084FF] text-white rounded-lg hover:bg-blue-600 text-base cursor-pointer"
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

export default PaymentMethodSection;
