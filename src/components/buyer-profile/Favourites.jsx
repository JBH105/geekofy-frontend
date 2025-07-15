import { useState, useEffect } from "react";
import ChateIcon from "../../../public/image/ProfileIcon/ChateIcon.svg";
import VerifiedIconBlue from "../../../public/image/VerifiedIconBlue.svg";
import Money from "../../../public/image/ProfileIcon/moneyBack.svg";
import callIcon from "../../../public/image/ProfileIcon/callIcon-fav.svg";
import addressIcon from "../../../public/image/ProfileIcon/addressIcon.svg";
import Image from "next/image";
import api from "@/lib/api";

export default function Favourites() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  console.log("🚀 ~ Favourites ~ favorites:", favorites)
  const [loading, setLoading] = useState(true);
  const [profileImageUrls, setProfileImageUrls] = useState({});
  const [review, setReview] = useState([]);
  console.log("🚀 ~ Favourites ~ review:", review)

  const [newData, setNewData] = useState([]);
  console.log("🚀 ~ Favourites ~ newData:", newData)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get("/api/favorite");
        console.log("🚀 ~ fetchFavorites ~ response:", response)

        if (response.data.success) {
          // Map the response to extract the 'item' object
          setNewData(response?.data?.data);
          const favoriteItems = response.data.data.map((fav) => fav.item);
          const userReview = response.data.data.map((fav) => fav?.review);
          setFavorites(favoriteItems);
          setReview(userReview);

          const urls = {};
          for (const favorite of favoriteItems) {
            if (favorite.businessDetails?.profileImage) {
              try {
                const imageResponse = await api.get("/api/s3", {
                  params: {
                    key: favorite.businessDetails.profileImage,
                  },
                });
                urls[favorite.id] = imageResponse.data.data.url;
              } catch (error) {
                console.error("Error fetching image URL:", error);
                urls[favorite.id] = "/default-profile.png";
              }
            } else {
              urls[favorite.id] = "/default-profile.png";
            }
          }
          setProfileImageUrls(urls);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

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

  if (!newData.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No favorites found
      </div>
    );
  }

  // Format phone number to US format
  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    const cleaned = ("" + phone).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  // Get today's business hours
  const getTodaysHours = (businessHours) => {
    if (!businessHours || !businessHours.length) return "Closed";

    const today = new Date().toLocaleString("en-us", { weekday: "long" });
    const todaysHours = businessHours.find(
      (day) => day.name.toLowerCase() === today.toLowerCase()
    );

    if (!todaysHours || !todaysHours.isOpen || !todaysHours.timeSlots?.length) {
      return "Closed";
    }

    return todaysHours.timeSlots
      .map((slot) => `${slot.open} - ${slot.close}`)
      .join(", ");
  };

  // Determine rating status
  const getRatingStatus = (averageRating) => {
    if (averageRating >= 4.5) return "Excellent";
    if (averageRating >= 4) return "Very Good";
    if (averageRating >= 3.5) return "Good";
    if (averageRating >= 3) return "Fair";
    if (averageRating >= 2.5) return "Average";
    return "";
  };

  return (
    <>
      <div className="min-h-screen space-y-5">
        {newData.map(({ item: favorite, review}) => (
          <div key={favorite.id} className="w-[834px]">
            <div
              className="bg-white shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]"
              style={{ borderRadius: "15px 15px 0px 0px" }}
            >
              <div className="px-7 py-3">
                <div className="flex items-start space-x-12">
                  <div className="flex-shrink-0">
                    <div className="w-[125px] h-[125px] border border-gray-200 rounded-md bg-white flex items-center justify-center">
                      <Image
                        src={
                          profileImageUrls[favorite.id] ||
                          "/default-profile.png"
                        }
                        alt="logo"
                        width={125}
                        height={125}
                        className="object-scale-down height_revert"
                      />
                    </div>
                    <div className="flex items-center ml-5 mt-3 space-x-2">
                      <Image src={VerifiedIconBlue} alt="VerifiedIconBlue" />
                      <span className="text-sm text-[#000] font-medium leading-5 tracking-[0.28px] italic">
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-semibold text-[#0084FF] leading-7 mb-2">
                          {favorite.businessInfo?.businessName ||
                            "My Computer Works"}
                        </h3>
                        {/* {review?.map((item, index) => ( */}
                          <div
                            className="flex items-center space-x-3 mb-3"
                          >
                            <div className="flex text-yellow-400">
                              {"★".repeat(Math.floor(review?.averageRating || 0))}
                              {"☆".repeat(
                                5 - Math.floor(review?.averageRating || 0)
                              )}
                            </div>
                            <span className="text-sm leading-6 text-[#666666]">
                              {review?.averageRating?.toFixed(1) || "N/A"} (
                              {review?.totalReviews || 0})
                            </span>
                            <span className="text-sm font-bold leading-6 tracking-[0.14px] text-[#00900E]">
                              {getRatingStatus(review?.averageRating || 0)}
                            </span>
                          </div>
                        {/* ))} */}
                      </div>
                      <button
                        onClick={() => setIsChatOpen(true)}
                        className="bg-[#059E14] hover:bg-green-700 text-white font-medium tracking-[1.68px] px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer text-sm"
                      >
                        <span>Live Chat</span>
                        <Image src={ChateIcon} alt="ChateIcon" />
                      </button>
                    </div>

                    <div className="flex items-start justify-between text-sm text-gray-600 mb-3">
                      {/* Left Column: Address & Phone */}
                      <div className="flex flex-col space-y-[11px]">
                        <div className="flex items-center space-x-2">
                          <Image
                            src={addressIcon}
                            className="w-[20.036px] h-[15px]"
                            alt="addressIcon"
                          />
                          <span>
                            {favorite.businessInfo?.address
                              ? favorite.businessInfo.address
                              : `${favorite.businessInfo?.city || ""}, ${
                                  favorite.businessInfo?.state || ""
                                }, ${favorite.businessInfo?.country || ""} ${
                                  favorite.businessInfo?.zipCode || ""
                                }`.trim()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Image
                            src={callIcon}
                            className="w-[20.036px] h-[20px]"
                            alt="callIcon"
                          />
                          <span>
                            {favorite.businessInfo?.ownerPhone &&
                              formatPhoneNumber(
                                favorite.businessInfo.ownerPhone
                              )}
                            {favorite.businessInfo?.contactNumber &&
                              `, ${formatPhoneNumber(
                                favorite.businessInfo.contactNumber
                              )}`}
                          </span>
                        </div>
                      </div>

                      {/* Right Column: Open Time & Year Founded */}
                      <div className="text-left">
                        <p>
                          <span className="font-bold text-sm text-[#666666] leading-6 tracking-[0.14px]">
                            Open:
                          </span>
                          <span className="ml-[4px] text-[#666666] leading-6">
                            {getTodaysHours(
                              favorite.businessDetails?.businessHours
                            )}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-sm text-[#666666] leading-6 tracking-[0.14px]">
                            Year Founded:
                          </span>
                          <span className="ml-[4px] text-[#666666] leading-6">
                            {favorite.businessDetails?.yearFounded || "N/A"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-[#666666] leading-6">
                      {favorite.businessDetails?.introDescription?.length > 100
                        ? `${favorite.businessDetails.introDescription.substring(
                            0,
                            100
                          )}...`
                        : favorite.businessDetails?.introDescription ||
                          "No description available."}{" "}
                      <span className="text-[#0084FF] text-sm leading-6 cursor-pointer">
                        read more
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="grid grid-cols-3 gap-4 bg-[#D5E8FFB2] px-7 py-3"
              style={{ borderRadius: "0px 0px 15px 15px" }}
            >
              {favorite.businessDetails?.highlights
                ?.slice(0, 6)
                .map((highlight, index) => (
                  <div
                    key={`${favorite.id}-highlight-${index}`}
                    className="flex items-center space-x-2 text-sm font-medium tracking-[0.84px] leading-5 text-[#666666]"
                  >
                    <span className="text-lg">
                      <Image
                        src={Money}
                        alt="money back"
                        className="object-cover w-[37px] h-[33px]"
                      />
                    </span>
                    <span>{highlight}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
        <div className="flex justify-end mt-12">
          <button className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors cursor-pointer">
            Next
          </button>
        </div>
      </div>
    </>
  );
}
