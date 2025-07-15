import React from "react";

const CheckboxInput = ({ name, value, label, onChange, checked }) => {
  const id = `${name}-${value}`;

  return (
    <div className="flex items-center gap-[8px] w-full">
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
        className="w-[16px] h-[16px] text-blue-600 focus:ring-blue-600 border-gray-300 rounded-sm"
      />
      <label
        htmlFor={id}
        className={`text-[#666] text-[14px] leading-[24px] cursor-pointer flex items-center justify-center tracking-[0.14px] hover:text-[#E6641D] ${
          checked ? "font-semibold" : "font-normal"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default CheckboxInput;
