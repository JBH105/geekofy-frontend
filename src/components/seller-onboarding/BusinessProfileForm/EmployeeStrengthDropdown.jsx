import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import ClickAwayListener from "@/components/shared/ClickAwayListener";

const EmployeeStrengthDropdown = ({
  employeeStrength,
  setEmployeeStrength,
  saveBusinessDetails,
}) => {
  const options = [
    // { value: "", label: "", disabled: true },
    { value: "Solo", label: "Solo" },
    { value: "2-5", label: "2-5" },
    { value: "6-10", label: "6-10" },
    { value: "11-20", label: "11-20" },
    { value: "20+", label: "20+" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // iOS detection
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && dropdownRef.current) {
      dropdownRef.current.style.WebkitAppearance = "none";
      dropdownRef.current.style.backgroundImage = "none";
      dropdownRef.current.style.paddingRight = "2.5rem";
    }
  }, []);

  const handleSelect = (value) => {
    if (value === "") return;
    setEmployeeStrength(value);
    setIsOpen(false);
    saveBusinessDetails({ employeeStrength: value });
  };

  return (

    <div
    className="bg-white rounded-2xl p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]"
    style={{
      boxShadow:
        "1px 1px 25px 0px rgba(0, 0, 0, 0.05), -1px -1px 25px 0px rgba(0, 0, 0, 0.05)",
    }}
  >
    <div className="flex justify-between items-center mb-1">
      <div
        className="text-lg font-semibold text-[#666666] leading-5 mb-2"
        style={{ letterSpacing: "0.2px" }}
      >
        Employee Strength
      </div>
    </div>
    <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-8"></div>

    <div className="relative">
      <ClickAwayListener
        onClickAway={() => {
          if (employeeStrength) {
            saveBusinessDetails({ employeeStrength });
          }
          setIsOpen(false);
        }}
      >
        <div className="w-full">
          {/* Custom dropdown button */}
          <div
            ref={dropdownRef}
            className="block px-3.5 pb-3 pt-4 w-full text-sm bg-transparent rounded-xl shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] text-[#333333] border border-[#e8e8e8] appearance-none focus:outline-none focus:ring-0 peer focus:border-[#999999] transition-colors duration-300 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {employeeStrength || "Select"}
          </div>

          <label
            className="absolute text-sm text-[#9C9C9C] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 left-3 
                 peer-placeholder-shown:scale-100 
                 peer-placeholder-shown:-translate-y-1/2 
                 peer-placeholder-shown:top-1/2 
                 peer-focus:top-2 
                 peer-focus:scale-75 
                 peer-focus:-translate-y-4 
                 peer-focus:left-3 
                 peer-focus:text-[#333333] 
                 peer-focus:font-medium"
          >
            Select *
          </label>

          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <FaChevronDown className="h-4 w-4 text-[#999999]" />
          </div>

          {/* Custom dropdown options */}
          {isOpen && (
            <div className="absolute z-20 mt-1 w-full max-h-[440px] overflow-auto rounded-xl shadow-lg bg-white border border-[#e8e8e8]">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                    employeeStrength === option.value
                      ? "bg-blue-50 text-blue-600"
                      : option.disabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#333333]"
                  }`}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </ClickAwayListener>
    </div>
    </div>
  );
};

export default EmployeeStrengthDropdown;
