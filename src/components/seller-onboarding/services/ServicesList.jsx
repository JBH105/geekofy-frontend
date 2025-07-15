"use client";
import React from "react";

const ServicesList = ({ service, onEdit, onDelete }) => {
  return (
    <>
      <div className="p-8 rounded-[10px] bg-[#FFFFFF] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),_-1px_-1px_25px_0px_rgba(0,0,0,0.05)] flex flex-col justify-start gap-3">
        <div className="relative">
          <div className="flex gap-4 items-center absolute -top-4 right-0">
            <button onClick={onEdit} className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M8.57631 1.83789H2.68362C2.2371 1.83789 1.80886 2.01538 1.49312 2.33132C1.17738 2.64726 1 3.07577 1 3.52257V15.3153C1 15.7621 1.17738 16.1906 1.49312 16.5066C1.80886 16.8225 2.2371 17 2.68362 17H14.469C14.9155 17 15.3438 16.8225 15.6595 16.5066C15.9752 16.1906 16.1526 15.7621 16.1526 15.3153V9.41895"
                  stroke="#666666"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.954 1.52336C14.2889 1.18826 14.7431 1 15.2167 1C15.6903 1 16.1445 1.18826 16.4794 1.52336C16.8143 1.85847 17.0024 2.31296 17.0024 2.78687C17.0024 3.26078 16.8143 3.71528 16.4794 4.05038L8.89215 11.6432C8.69226 11.8431 8.44532 11.9894 8.17408 12.0686L5.75556 12.7762C5.68312 12.7973 5.60634 12.7986 5.53324 12.7799C5.46015 12.7611 5.39343 12.7231 5.34008 12.6697C5.28672 12.6163 5.24869 12.5495 5.22997 12.4764C5.21124 12.4032 5.21251 12.3264 5.23363 12.2539L5.94076 9.83389C6.02033 9.5627 6.16681 9.3159 6.36671 9.11622L13.954 1.52336Z"
                  stroke="#666666"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button onClick={onDelete} className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
              >
                <path
                  d="M2.61795 16C2.16995 16 1.78862 15.8404 1.47395 15.5211C1.15929 15.2019 1.00195 14.8153 1.00195 14.3614V1.79581H0.00195312V0.78123H4.00195V0H10.002V0.78123H14.002V1.79581H13.002V14.3614C13.002 14.8282 12.848 15.2181 12.54 15.5313C12.232 15.8444 11.8473 16.0007 11.386 16H2.61795ZM12.002 1.79581H2.00195V14.3614C2.00195 14.5434 2.05962 14.6929 2.17495 14.8099C2.29029 14.9269 2.43795 14.9854 2.61795 14.9854H11.387C11.5403 14.9854 11.6813 14.9205 11.81 14.7906C11.9386 14.6607 12.0026 14.5174 12.002 14.3604V1.79581ZM4.80995 12.9562H5.80995V3.82498H4.80995V12.9562ZM8.19395 12.9562H9.19395V3.82498H8.19395V12.9562Z"
                  fill="#666666"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-start items-start">
          <div className="flex gap-3 items-center">
            <div className="w-[100px] flex justify-between items-center">
              <p className="text-[#666666] text-[14px] font-bold font-helvetica not-italic leading-normal">
                Service
              </p>
              <p className="text-[#000] text-[14px] font-bold font-helvetica not-italic leading-normal">
                :
              </p>
            </div>
            <p className="text-[#666666] text-[14px] font-normal font-helvetica not-italic leading-normal">
              {service?.serviceName}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-[100px] flex justify-between items-center">
              <p className="text-[#666666] text-[14px] font-bold font-helvetica not-italic leading-normal">
                Pricing
              </p>
              <p className="text-[#000] text-[14px] font-bold font-helvetica not-italic leading-normal">
                :
              </p>
            </div>
            <p className="text-[#666666] text-[14px] font-normal font-helvetica not-italic leading-normal">
              {service.pricing?.type.replace(/_/g, " ")}{" "}
              {service.pricing?.amount !== null
                ? `$${service?.pricing?.amount}`
                : ""}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-[100px] flex justify-between items-center">
              <p className="text-[#666666] text-[14px] font-bold font-helvetica not-italic leading-normal">
                Description
              </p>
              <p className="text-[#000] text-[14px] font-bold font-helvetica not-italic leading-normal">
                :
              </p>
            </div>
            <p className="text-[#666666] text-[14px] font-normal font-helvetica not-italic leading-normal">
              {service?.description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesList;
