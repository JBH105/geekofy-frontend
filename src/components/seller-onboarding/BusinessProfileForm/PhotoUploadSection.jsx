"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import UploadImage from "../../../../public/image/UploadImage.svg";
import DeleteIcon from "../../../../public/image/DeleteIcon.svg";
import api from "@/lib/api";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

export default function PhotoUploadSection({
  setPhotoUploadSection,
  photoUploadData,
  saveBusinessDetails,
  photoUploadSection,
  businessSlug,
  businessName,
}) {
  const [photos, setPhotos] = useState(
    photoUploadData?.map((data) => ({
      url: data?.url,
      key: data?.key,
      text: data?.text,
    })) || []
  );
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (JSON.stringify(photos) !== JSON.stringify(photoUploadData)) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [photos, photoUploadData]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newPhotos = [];

    Array.from(e.target.files).forEach((file) => {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        toast.error("Please upload only JPEG, JPG or PNG files");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      newPhotos.push({
        url: imageUrl,
        text: "",
        file,
        tempId: Date.now() + Math.random(),
      });
    });

    if (newPhotos.length > 0) {
      setPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  const handleCaptionChange = (index, text) => {
    const updatedPhotos = [...photos];
    updatedPhotos[index].text = text;
    setPhotos(updatedPhotos);
  };

  const handleDeletePhoto = (index) => {
    const updatedPhotos = [...photos];
    const toDelete = updatedPhotos[index];

    // Clean up blob URL
    if (toDelete?.file && toDelete?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(toDelete.url);
    }

    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  const handleCancel = () => {
    if (hasChanges) {
      setIsModalOpen(true);
    } else {
      setPhotoUploadSection((prev) => ({ ...prev, show: false }));
    }
  };

  const handleSave = async () => {
    if (!photos) return;

    const existingPhotos = [];
    const newPhotos = [];

    photos.forEach((photo) => {
      if (photo.file) {
        newPhotos.push(photo);
      } else {
        existingPhotos.push(photo);
      }
    });

    let uploadedPhotosWithText = [];

    if (newPhotos.length > 0) {
      const formData = new FormData();
      newPhotos.forEach((photo) => {
        formData.append("images", photo.file);
      });
      formData.append(
        "path",
        `geekofy-assets/${businessName}/${businessSlug}/gallery`
      );

      try {
        const uploadRes = await api.post("/api/s3", formData);
        const keys = uploadRes?.data?.data?.keys;

        const urlRes = await api.get("/api/s3", {
          params: { keys: JSON.stringify(keys) },
        });

        uploadedPhotosWithText = urlRes.data?.data?.urls.map((url, idx) => ({
          url,
          key: keys[idx],
          text: newPhotos[idx].text || "",
        }));
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Failed to upload image.");
        return;
      }
    }

    const finalPhotos = [...existingPhotos, ...uploadedPhotosWithText];

    saveBusinessDetails({
      galleryImages: finalPhotos.map((item) => ({
        image: item.key,
        text: item.text,
      })),
    });

    setPhotoUploadSection((prev) => ({
      ...prev,
      data: finalPhotos,
      show: false,
    }));
  };

  const handleConfirmExit = () => {
    setIsModalOpen(false)
    setPhotoUploadSection((prev) => ({ ...prev, show: false }));
  }

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-1">
          <div className="text-lg font-semibold text-[#666666] leading-5 mb-2">
            Photos
          </div>
        </div>
        <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-4"></div>

        {photos.length === 0 ? (
          <>
            <p className="text-base text-[#666666] mb-5">
              Upload images that showcase your business, such as your
              storefront, before-and-after shots, or examples of completed work
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
            </div>
          </>
        ) : (
          <>
            <p className="text-base text-[#666666] mb-5">
              Upload images that showcase your business, such as your
              storefront, before-and-after shots, or examples of completed work
            </p>
            <div className="flex flex-wrap gap-6 mx-[38px]">
              {photos.map((photo, index) => (
                <div
                  key={photo.key || photo.tempId || index}
                  className="border border-[#999999] rounded-lg overflow-hidden flex flex-col w-[300px]"
                >
                  <div className="relative w-[300px] h-[200px] ">
                    <Image
                      src={photo.url}
                      alt="Uploaded photo"
                      fill
                      className="object-scale-down rounded-t-lg "
                    />
                  </div>
                  <div className="p-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={photo.text}
                      onChange={(e) =>
                        handleCaptionChange(index, e.target.value)
                      }
                      placeholder="Title or Caption (Optional)"
                      className="w-full text-[#999999] text-sm outline-none border-b border-transparent focus:border-transparent py-[10px] px-[4px]"
                    />
                    <button
                      onClick={() => handleDeletePhoto(index)}
                      className="flex-shrink-0"
                    >
                      <Image
                        src={DeleteIcon}
                        alt="DeleteIcon"
                        className="cursor-pointer m-[10px]"
                      />
                    </button>
                  </div>
                </div>
              ))}

              {photos.length < 10 && (
                <div
                  onClick={handleImageClick}
                  className="border border-dashed border-[#0084FF] rounded-lg bg-[#D5E8FF]/50 flex items-center justify-center cursor-pointer w-[300px]"
                  style={{ height: "244px" }}
                >
                  <div className="flex flex-col items-center justify-center p-6">
                    <div className="flex items-center justify-center mb-2">
                      <Image src={UploadImage} alt="UploadImage" />
                    </div>
                    <p className="text-[#0084FF] font-bold text-sm mb-1 text-center">
                      {photos.length > 0
                        ? "Add more photos"
                        : "Upload photos that highlight your business."}
                    </p>
                    <p className="text-xs text-[#333333] text-center">
                      jpeg, png or jpg format up-to 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/jpeg, image/png, image/jpg"
          className="hidden"
          multiple
        />
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
}
