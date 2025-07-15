"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import CallIcon from "../../../public/image/CallIcon.svg";
import SearchAdminIcon from "../../../public/image/SearchAdminIcon.svg";
import EditIcon from "../../../public/image/EditIcon.svg";
import Email from "../../../public/image/Email.svg";
import api from "@/lib/api";

export default function BusinessTable() {
  const [businesses, setBusinesses] = useState([]);
  const [checkboxState, setCheckboxState] = useState({
    total: false,
    active: false,
    tempClosed: false,
    permClosed: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [counts, setCounts] = useState({
    total: 0,
    active: 0,
    tempClosed: 0,
    permClosed: 0,
  });

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await api.get("/api/admin/business-seller");
        if (response.data.success) {
          const formattedBusinesses = response.data.data.businesses
            .map((business, index) => ({
              id: index + 1, 
              name: business.name || "N/A", 
              phone: business.contact_info.phone || "N/A",
              email: business.contact_info.email || "N/A",
              registered: business.registration_date || "N/A",
              active: business.status.active,
              tempClosed: business.status.temporarily_closed,
              permClosed: business.status.permanently_closed,
            }))
            .filter(
              (business) =>
                business.name !== "N/A" ||
                business.phone !== "N/A" ||
                business.email !== "N/A"
            );
          setBusinesses(formattedBusinesses);
          setCounts(response.data.data.summary); 
        }
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };

    fetchBusinesses();
  }, []);

  const handleCheckboxChange = (filter) => {
    setCheckboxState((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleBusinessCheckboxChange = (id, field) => {
    setBusinesses((prevBusinesses) =>
      prevBusinesses.map((business) =>
        business.id === id
          ? {
              ...business,
              [field]: !business[field],
            }
          : business
      )
    );

    setCounts((prevCounts) => {
      const updatedBusinesses = businesses.map((business) =>
        business.id === id
          ? { ...business, [field]: !business[field] }
          : business
      );
      return {
        total: updatedBusinesses.length,
        active: updatedBusinesses.filter((b) => b.active).length,
        tempClosed: updatedBusinesses.filter((b) => b.tempClosed).length,
        permClosed: updatedBusinesses.filter((b) => b.permClosed).length,
      };
    });
  };

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = business.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilters =
      (!checkboxState.active || business.active) &&
      (!checkboxState.tempClosed || business.tempClosed) &&
      (!checkboxState.permClosed || business.permClosed);
    return matchesSearch && matchesFilters;
  });

  const { total, active, tempClosed, permClosed } = counts;

  return (
    <main className="bg-white p-8 rounded-2xl shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] mb-4">
      <div className="">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search Business"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-[#e1e1e1] rounded-md px-3 py-3 w-64 text-[#666666]"
            />
            <Image
              src={SearchAdminIcon}
              alt="Search Icon"
              className="ml-3 w-6 h-6"
              style={{ marginRight: "60px" }} 
            />
          </div>
          <div className="flex items-center space-x-[20px] text-sm mr-10">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={checkboxState.total}
                onChange={() => handleCheckboxChange("total")}
                className="w-4 h-4 rounded border border-[#666666] bg-[#FFFFFF] appearance-none checked:bg-[#666666] checked:border-[#666666] focus:outline-none cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-white checked:after:text-xs checked:after:font-bold"
              />
              <span className="text-[#333333] text-sm font-normal ml-2">
                Total : {total}
              </span>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={checkboxState.active}
                onChange={() => handleCheckboxChange("active")}
                className="w-4 h-4 rounded border border-[#00900E] bg-[#E5FFE6] appearance-none checked:bg-[#00900E] checked:border-[#00900E] focus:outline-none cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-white checked:after:text-xs checked:after:font-bold"
              />
              <span className="text-[#333333] text-sm font-normal ml-2">
                Active : {active}
              </span>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={checkboxState.tempClosed}
                onChange={() => handleCheckboxChange("tempClosed")}
                className="w-4 h-4 rounded border border-[#A16600] bg-[#FAE7C1] appearance-none checked:bg-[#A16600] checked:border-[#A16600] focus:outline-none cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-white checked:after:text-xs checked:after:font-bold"
              />
              <span className="text-[#333333] text-sm font-normal ml-2">
                Temp. Closed : {tempClosed}
              </span>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={checkboxState.permClosed}
                onChange={() => handleCheckboxChange("permClosed")}
                className="w-4 h-4 rounded border border-[#F52A19] bg-[#FBDBDB] appearance-none checked:bg-[#F52A19] checked:border-[#F52A19] focus:outline-none cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-white checked:after:text-xs checked:after:font-bold"
              />
              <span className="text-[#333333] text-sm font-normal ml-2">
                Perm. Closed : {permClosed}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="rounded-[10px] border border-[#e1e1e1] bg-[#f2f2f2]">
                <th className="text-left py-3 px-2 text-sm text-[#000000] font-medium whitespace-nowrap">
                  S. No.
                </th>
                <th className="text-left py-3 px-2 text-sm text-[#000000] font-medium whitespace-nowrap">
                  Business Name
                </th>
                <th className="text-left py-3 px-2 text-sm text-[#000000] font-medium whitespace-nowrap">
                  Contact Info
                </th>
                <th className="text-left py-3 px-2 text-sm text-[#000000] font-medium whitespace-nowrap">
                  Registered
                </th>
                <th className="text-left py-3 px-2 text-sm text-[#000000] font-medium whitespace-nowrap">
                  Active
                </th>
                <th className="text-left py-3 px-2 text-sm text-[#000000] font-medium whitespace-nowrap">
                  Temp. Closed
                </th>
                <th className="text-left py-3 px-2 text-sm text-[#000000] font-medium whitespace-nowrap">
                  Perm. Closed
                </th>
                <th className="text-left py-3 px-2 text-sm text-[#000000] font-medium whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((business) => (
                <tr key={business.id} className="">
                  <td className="py-4 px-2 text-sm font-normal text-[#666666]">
                    {business.id}
                  </td>
                  <td className="py-4 px-2 text-sm font-normal text-[#666666]">
                    {business.name}
                  </td>
                  <td className="py-4 px-2 text-sm font-normal">
                    <div className="flex items-center text-[#666666] mb-1">
                      <Image
                        src={CallIcon}
                        alt="Call Icon"
                        className="w-4 h-4 mr-2"
                      />
                      <span>{business.phone}</span>
                    </div>
                    <div className="flex items-center text-[#666666]">
                      <Image
                        src={Email}
                        alt="Email Icon"
                        className="w-4 h-4 mr-2"
                      />
                      <span>{business.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-sm font-normal text-[#666666]">
                    {business.registered}
                  </td>
                  <td className="py-4 px-2">
                    <input
                      type="checkbox"
                      checked={business.active}
                      onChange={() =>
                        handleBusinessCheckboxChange(business.id, "active")
                      }
                      className="w-4 h-4 rounded border border-[#00900E] bg-[#E5FFE6] appearance-none checked:bg-[#00900E] checked:border-[#00900E] focus:outline-none cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-white checked:after:text-xs checked:after:font-bold"
                    />
                  </td>
                  <td className="py-4 px-2">
                    <input
                      type="checkbox"
                      checked={business.tempClosed}
                      onChange={() =>
                        handleBusinessCheckboxChange(business.id, "tempClosed")
                      }
                      className="w-4 h-4 rounded border border-[#A16600] bg-[#FAE7C1] appearance-none checked:bg-[#A16600] checked:border-[#A16600] focus:outline-none cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-white checked:after:text-xs checked:after:font-bold"
                    />
                  </td>
                  <td className="py-4 px-2">
                    <input
                      type="checkbox"
                      checked={business.permClosed}
                      onChange={() =>
                        handleBusinessCheckboxChange(business.id, "permClosed")
                      }
                      className="w-4 h-4 rounded border border-[#F52A19] bg-[#FBDBDB] appearance-none checked:bg-[#F52A19] checked:border-[#F52A19] focus:outline-none cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-white checked:after:text-xs checked:after:font-bold"
                    />
                  </td>
                  <td className="py-4 px-2">
                    <Image
                      src={EditIcon}
                      alt="Edit Icon"
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
