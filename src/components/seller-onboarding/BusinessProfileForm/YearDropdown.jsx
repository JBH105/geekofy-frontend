import ClickAwayListener from "@/components/shared/ClickAwayListener";
import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

const YearDropdown = ({ yearFounded, setYearFounded, saveBusinessDetails }) => {
  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  const allYears = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  );

  const [visibleYears, setVisibleYears] = useState(allYears.slice(0, 15)); // Changed from 10 to 15
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const optionsRef = useRef(null);

  // Load more years when scrolling
  useEffect(() => {
    const optionsElement = optionsRef.current;
    if (!optionsElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = optionsElement;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (isNearBottom && visibleYears.length < allYears.length) {
        const nextChunk = allYears.slice(
          visibleYears.length,
          visibleYears.length + 15 // Changed from 10 to 15
        );
        setVisibleYears([...visibleYears, ...nextChunk]);
      }
    };

    optionsElement.addEventListener("scroll", handleScroll);
    return () => optionsElement.removeEventListener("scroll", handleScroll);
  }, [visibleYears, allYears]);

  // iOS detection
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && dropdownRef.current) {
      dropdownRef.current.style.WebkitAppearance = "none";
      dropdownRef.current.style.backgroundImage = "none";
      dropdownRef.current.style.paddingRight = "2.5rem";
    }
  }, []);

  const handleSelect = (year) => {
    setYearFounded(year);
    setIsOpen(false);
    saveBusinessDetails({ yearFounded: year });
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
          Year Founded
        </div>
      </div>
      <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-8"></div>

      <div className="relative">
        <ClickAwayListener
          onClickAway={() => {
            if (yearFounded) {
              saveBusinessDetails({ yearFounded });
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
              {yearFounded || "Select year"}
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
              Year *
            </label>

            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <FaChevronDown className="h-4 w-4 text-[#999999]" />
            </div>

            {/* Custom dropdown options */}
            {isOpen && (
              <div
                ref={optionsRef}
                className="absolute z-20 mt-1 w-full max-h-[370px] overflow-auto rounded-xl shadow-lg bg-white border border-[#e8e8e8]"
              >
                {visibleYears.map((year) => (
                  <div
                    key={year}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                      yearFounded === year
                        ? "bg-blue-50 text-blue-600"
                        : "text-[#333333]"
                    }`}
                    onClick={() => handleSelect(year)}
                  >
                    {year}
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

export default YearDropdown;
