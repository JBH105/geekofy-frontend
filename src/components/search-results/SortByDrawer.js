import React from "react";

const SortByDrawer = ({
  showSortBy,
  setShowSortBy,
  selectedSortOption,
  setSelectedSortOption,
}) => {
  const sortOptions = [
    "Relevance",
    "Newest First",
    "Price: Low to High",
    "Price: High to Low",
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          showSortBy ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowSortBy(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full z-50 transform ${
          showSortBy ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out bg-white shadow-xl`}
      >
        <div className="flex flex-col h-full">
          {/* Back Button */} 
          <div className="bg-blue-600 text-white p-3 sm:p-4 flex items-center justify-between">
            <button
              className="flex items-center gap-2"
              onClick={() => setShowSortBy(false)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-semibold text-base sm:text-lg">Back</span>
            </button>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Sort By</h2>
          </div>

          {/* Sort Options */}
          <div className="flex-1 overflow-y-auto">
            {sortOptions.map((option) => (
              <div
                key={option}
                className={`py-4 px-6 border-b border-gray-100 ${
                  selectedSortOption === option
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setSelectedSortOption(option);
                  setShowSortBy(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={
                      selectedSortOption === option
                        ? "text-blue-600 font-medium"
                        : "text-gray-800"
                    }
                  >
                    {option}
                  </span>
                  {selectedSortOption === option && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Apply Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setShowSortBy(false)}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SortByDrawer;
