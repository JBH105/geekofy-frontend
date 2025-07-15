import React from "react";

const RadioInput = ({ type, name, value, label, onChange, checked }) => {
  const id = `${name}-${value}`;

  return (
    <label
      htmlFor={id}
      className="flex items-center gap-[8px] mb-[2px] cursor-pointer group"
    >
      <div
        className={`
          relative w-[14px] h-[14px]
          ${type === "radio" ? "rounded-full" : "rounded-[3px]"}
          ${
            checked ? "bg-[#0084FF] border-[#0084FF]" : "bg-white border-[#ccc]"
          }
          border-2 flex items-center justify-center
          group-hover:border-[#0084FF] transition-all duration-200
        `}
      >
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          checked={checked}
          className="absolute w-full h-full opacity-0 cursor-pointer focus:ring-2 focus:ring-[#0084FF] focus:ring-offset-2"
        />
        {checked && type === "checkbox" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
          >
            <path
              d="M1 3.95389L3.69943 6.5L9 1.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {checked && type === "radio" && (
          <div className="w-[6px] h-[6px] bg-white rounded-full" />
        )}
      </div>

      {label && (
        <span
          className={`
            text-[14px] leading-[24px] tracking-[0.14px] text-[#666]
            ${
              checked
                ? "font-semibold"
                : "font-normal group-hover:text-[#E6641D]"
            }
          `}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default RadioInput;
