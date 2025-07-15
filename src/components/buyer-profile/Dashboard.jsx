"use client";

import { useState, useRef, useEffect } from "react";
import BasicInformation from "./BasicInformation";
import Invoices from "./Invoices";
import Favourites from "./Favourites";
import Password from "./Password";
import Reviews from "./Reviews";
import Sidebar from "./Sidebar";
import SecondaryHeader from "../layout/SecondaryHeader";
import Image from "next/image";
import ProfileIconBuyer from "../../../public/image/ProfileIconBuyer.svg";
import ChangePhoto from "../../../public/image/ChangePhoto.svg";
import testImg from "../../../public/image/test_img.svg";
import api from "@/lib/api";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("basic-information");
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    profileImageKey: null,
  });
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/profile");
      const { data } = response;

      let imageUrl = null;
      if (data?.data?.profileAvatar || data?.data?.businessDetails?.profileImage) {
        const imageResponse = await api.get("/api/s3", {
          params: { key: data?.data?.profileAvatar || data?.data?.businessDetails?.profileImage },
        });
        imageUrl = imageResponse?.data?.data?.url;
      }

      setProfileData({
        firstName: data?.data?.firstName || "",
        lastName: data?.data?.lastName || "",
        email: data?.data?.email || "",
        phone: data?.data?.ownerPhone || "",
        dateOfBirth: data?.data?.dob || "",
        gender: data?.data?.gender || "",
        profileImageKey: data?.data?.businessDetails?.profileImage || null,
      });

      setProfileImage(imageUrl);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChangePhotoClick = () => {
    setShowPhotoOptions(!showPhotoOptions);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setShowPhotoOptions(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "path",
        `geekofy-assets/Buyer/${profileData.firstName}-${profileData.lastName}/logo`
      );

      const uploadResponse = await api.post("/api/s3", formData);
      const newImageKey = uploadResponse.data?.data?.keys;

      await api.post("/api/profile", {
        profileAvatar: newImageKey,
      });

      await fetchProfile();
    } catch (error) {
      console.error("Error uploading image:", error);
      if (profileData.profileImageKey) {
        const imageResponse = await api.get("/api/s3", {
          params: { key: profileData.profileImageKey },
        });
        setProfileImage(imageResponse?.data?.data?.url);
      } else {
        setProfileImage(null);
      }
    } finally {
      setShowPhotoOptions(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await api.post("/api/profile", {
        profileImage: null,
      });

      await fetchProfile();
    } catch (error) {
      console.error("Error deleting profile image:", error);
    } finally {
      setShowPhotoOptions(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderContent = () => {
    switch (activeSection) {
      case "basic-information":
        return (
          <BasicInformation
            profileData={profileData}
            setProfileData={setProfileData}
            loading={loading}
          />
        );
      case "invoices":
        return <Invoices />;
      case "favourites":
        return <Favourites />;
      case "password":
        return <Password />;
      case "reviews":
        return <Reviews />;
      default:
        return (
          <BasicInformation
            profileData={profileData}
            setProfileData={setProfileData}
            loading={loading}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#00000066] flex items-center justify-center z-50">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <>
      <SecondaryHeader />
      <div className="bg-white h-full">
        <div className="layout_container mx-auto h-fit">
          {/* User Info Section */}
          <div className="relative w-[1280px] h-[167px] mx-auto">
            <Image
              src={testImg}
              alt="Profile Header"
              layout="fill"
              objectFit="cover"
            />
            {/* Profile Avatar positioned over the header */}
            <div className="absolute -bottom-24 left-[91px]">
              <div className="relative">
                <div className="w-[180px] h-[180px] bg-white border-4 rounded-full flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={172}
                      height={172}
                      className="object-scale-down height_revert"
                    />
                  ) : (
                    <Image src={ProfileIconBuyer} alt="Profile Icon" />
                  )}
                </div>
                <div className="absolute bottom-1 right-1 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer">
                  <Image
                    src={ChangePhoto}
                    alt="ChangePhoto"
                    onClick={handleChangePhotoClick}
                  />
                </div>

                {showPhotoOptions && (
                  <div className="absolute bottom-[-140px] right-0 mt-2 w-36 left-[25px] bg-[#F5F5F5] border border-[#CCCCCC] rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)] z-10">
                    <div className="py-2 pl-4 relative">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#F5F5F5] border-l border-t border-[#CCCCCC] rotate-45 z-[1] rounded-[2px]" />{" "}
                      <button
                        onClick={triggerFileInput}
                        className="block w-full text-left py-2 text-base text-[#333333] hover:bg-[#E5E5E5] cursor-pointer"
                      >
                        Change Photo
                      </button>
                      <button
                        onClick={handleDeletePhoto}
                        className="block w-full text-left py-2 text-base text-[#333333] hover:bg-[#E5E5E5] cursor-pointer"
                      >
                        Delete Photo
                      </button>
                    </div>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* User Name and Email - moved down to accommodate the avatar */}
          <div className="mt-[61px] px-8 ml-80">
            <h2 className="text-2xl font-semibold text-[#333333]">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-lg font-semibold text-[#808080]">
              {profileData.email}
            </p>
          </div>

          {/* Profile Settings Heading */}
          <div className="px-8 mt-12 ml-80">
            <h2 className="text-xl font-semibold ">Profile Settings</h2>
            <div className="h-1 w-24 bg-[#0084FF] rounded-full mt-1"></div>
          </div>

          {/* Main Content */}
          <div className="pl-14 mt-[60px]">
            <div className="flex gap-10">
              <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
              <main className="">{renderContent()}</main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
