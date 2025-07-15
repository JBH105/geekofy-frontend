"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import UploadImage from "../../../../public/image/UploadImage.svg";
import DeleteIcon from "../../../../public/image/DeleteIcon.svg";
import api from "@/lib/api";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

export default function ProfileImageSection({
  setProfileImageSection,
  saveBusinessDetails,
  profileImageSection,
  businessSlug,
  businessName,
}) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(profileImageSection || null);
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (JSON.stringify(previewUrl) !== JSON.stringify(profileImageSection)) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [previewUrl, profileImageSection]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should not exceed 5MB");
      return;
    }

    // Check file type
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      alert("Only jpeg, png or jpg formats are allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      setImage(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => {
    if (hasChanges) {
      setIsModalOpen(true);
    } else {
      setProfileImageSection((prev) => ({ ...prev, show: false }));
    }
  };

  const handleConfirmExit = () => {
    setIsModalOpen(false);
    setProfileImageSection((prev) => ({ ...prev, show: false }));
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "path",
      `geekofy-assets/${businessName}/${businessSlug}/logo`
    );

    try {
      const response = await api.post("/api/s3", formData);

      const imageUrl = await api.get("/api/s3", {
        params: { key: response.data?.data?.keys },
      });
      saveBusinessDetails({ profileImage: response.data?.data?.keys });
      setProfileImageSection((prev) => ({
        ...prev,
        data: imageUrl?.data?.data?.url,
        show: false,
      }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image.");
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-1">
          <div className="text-lg font-semibold text-[#666666] leading-5 mb-2">
            Profile Image / Business Logo
          </div>
        </div>
        <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-4"></div>

        {!previewUrl ? (
          <>
            <p className="text-base text-[#666666] mb-5">
              Upload your picture, business logo, storefront image or any image
              that represents your business.
            </p>
            <div
              onClick={handleImageClick}
              className="border border-dashed border-[#0084FF] rounded-md p-6 bg-[#D5E8FF80] flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="flex items-center justify-center mb-2">
                <Image src={UploadImage} alt="UploadImage" />
              </div>
              <p className="text-[#0084FF] font-bold text-sm mb-1">
                Upload photos that highlight your business.
              </p>
              <p className="text-xs text-[#000000CC]">
                jpeg, png or jpg format up-to 5MB
              </p>
              <p className="text-xs text-[#000000CC] mt-1">
                (125px × 125px for best resolution)
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg, image/png, image/jpg"
                className="hidden"
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-base text-[#666666] mb-5">
              Upload images that showcase your business, such as your
              storefront, before-and-after shots, or examples of completed work
            </p>
            <div className="flex flex-col md:flex-row items-start gap-12 ">
              {/* Image box */}
              <div className="border border-gray-200 rounded-md p-1 w-[135px] h-[135px] flex items-center justify-center overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Business Logo"
                  width={125}
                  height={125}
                  className="object-scale-down height_revert"
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-col justify-center gap-5 mt-8">
                <label className="flex items-center text-[#666666] cursor-pointer ">
                  <FiEdit className="w-5 h-5 mr-6 hover:text-[#ED790F]" />
                  <span>Change image</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/jpeg, image/png, image/jpg"
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleDeleteImage}
                  className="flex items-center cursor-pointer "
                >
                  <Image src={DeleteIcon} alt="DeleteIcon" className="mr-8" />
                  <span className="text-[#666666]">Delete</span>
                </button>
              </div>
            </div>
          </>
        )}
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
          disabled={image === null ? true : false}
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
