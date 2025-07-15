import api from "@/lib/api";
import { create } from "zustand";
import { getSession } from "next-auth/react";

export const useBusinessStore = create((set, get) => ({
  data: {
    headerData: null,
    overviewData: null,
    servicesData: null,
    reviewsData: null,
    photosData: null,
    faqsData: null,
    mapData: null,
    detailsData: null,
  },
  isLoading: {
    header: false,
    overview: false,
    services: false,
    reviews: false,
    photos: false,
    faqs: false,
    map: false,
    details: false,
  },
  error: {
    header: null,
    overview: null,
    services: null,
    reviews: null,
    photos: null,
    faqs: null,
    map: null,
    details: null,
  },

  // Centralized function to fetch /api/business/details
  fetchDetailsData: async (businessSlug) => {
    let { data, isLoading, error } = get();

    if (data.detailsData) {
      return data.detailsData;
    }

    if (isLoading.details) {
      while (isLoading.details) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        ({ isLoading } = get());
      }
      return get().data.detailsData;
    }

    // Fetch the data
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, details: true },
        error: { ...state.error, details: null },
      }));
      const detailsResponse = await api?.get?.("/api/business/details", {
        params: { businessSlug },
      });

      set((state) => ({
        data: { ...state.data, detailsData: detailsResponse?.data },
        isLoading: { ...state.isLoading, details: false },
      }));

      return detailsResponse?.data;
    } catch (err) {
      set((state) => ({
        error: { ...state.error, details: "Failed to load details data." },
        isLoading: { ...state.isLoading, details: false },
      }));
      console.error(err);
      throw err;
    }
  },

  // Fetch data for header and sidebar
  fetchHeaderData: async (businessSlug) => {
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, header: true },
        error: { ...state.error, header: null },
      }));

      // await new Promise((res) => setTimeout(res, 1500)); // for delay api
      const [infoResponse, detailsData, ratingResponse] = await Promise.all([
        api?.get?.("/api/business/info", {
          params: { businessSlug },
        }),
        get().fetchDetailsData(businessSlug),
        api?.get?.("/api/business/review/rating", {
          params: { businessSlug },
        }),
      ]);

      let imageUrl = null;

      if (detailsData?.data?.profileImage) {
        imageUrl = await api.get("/api/s3", {
          params: { key: detailsData?.data?.profileImage },
        });
      }

      const headerData = {
        name: infoResponse?.data?.data?.businessName || "Unknown Business",
        logo: imageUrl?.data?.data?.url || null,
        rating: ratingResponse?.data?.data?.averageRating || 0,
        reviewCount: ratingResponse?.data?.data?.totalReviews || 0,
        status: infoResponse?.data?.data?.contactNumberVerified
          ? "Verified"
          : "Unverified",
        hoursData: Array.isArray(detailsData?.data?.businessHours)
          ? detailsData.data.businessHours
          : [],
        phone:
          infoResponse?.data?.data?.contactNumber &&
          /^\d{10}$/.test(infoResponse?.data?.data?.contactNumber)
            ? `(${infoResponse?.data?.data?.contactNumber?.slice(
                0,
                3
              )}) ${infoResponse?.data?.data?.contactNumber?.slice(
                3,
                6
              )}-${infoResponse?.data?.data?.contactNumber?.slice(6)}`
            : "Not available",
        location: {
          city: infoResponse?.data?.data?.city || "Unknown",
          state: infoResponse?.data?.data?.state || "Unknown",
          zipCode: infoResponse?.data?.data?.zipCode || "Unknown",
          country: infoResponse?.data?.data?.country || "Unknown",
          neighborhood: infoResponse?.data?.data?.neighborhood || "Unknown",
        },
        features: Array.isArray(detailsData?.data?.highlights)
          ? detailsData?.data?.highlights
          : [],
      };

      set((state) => ({
        data: { ...state.data, headerData },
        isLoading: { ...state.isLoading, header: false },
      }));
    } catch (err) {
      set((state) => ({
        error: { ...state.error, header: "Failed to load header data." },
        isLoading: { ...state.isLoading, header: false },
      }));
      console.error(err);
    }
  },

  // Fetch data for Overview tab
  fetchOverviewData: async (businessSlug) => {
    try {
      set((state) => ({
        isLoading: { ...state?.isLoading, overview: true },
        error: { ...state?.error, overview: null },
      }));

      const detailsData = await get()?.fetchDetailsData(businessSlug);

      const overviewData = {
        description:
          detailsData?.data?.introDescription || "No description available",
        yearFounded: detailsData?.data?.yearFounded || "Unknown",
        employeeCount: detailsData?.data?.employeeStrength || null,
        services: {
          caters: Array.isArray(detailsData?.data?.supportTypes)
            ? detailsData?.data?.supportTypes
            : [],
          supportType: Array.isArray(detailsData?.data?.supportTypes)
            ? detailsData?.data?.supportTypes
            : [],
          paymentMethods: Array.isArray(detailsData?.data?.paymentMethods)
            ? detailsData?.data?.paymentMethods
            : [],
        },
      };

      set((state) => ({
        data: { ...state.data, overviewData },
        isLoading: { ...state.isLoading, overview: false },
      }));
    } catch (err) {
      set((state) => ({
        error: { ...state.error, overview: "Failed to load overview data." },
        isLoading: { ...state.isLoading, overview: false },
      }));
      console.error(err);
    }
  },

  // Fetch data for Services tab
  fetchServicesData: async (businessSlug) => {
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, services: true },
        error: { ...state.error, services: null },
      }));
      const serviceResponse = await api?.get?.("/api/business/service", {
        params: { businessSlug },
      });

      const servicesData = {
        services: {
          serviceCategories: [
            {
              category: "Services",
              items: Array.isArray(serviceResponse?.data?.data)
                ? serviceResponse?.data?.data?.map((service) => ({
                    serviceType: service?.serviceType || "serviceType",
                    name: service?.serviceName || "Unnamed Service",
                    description: service?.description || "No description",
                    amount: service?.amount || 0,
                    amountType: service?.amountType || "unknown",
                  }))
                : [],
            },
          ],
        },
      };

      set((state) => ({
        data: { ...state.data, servicesData },
        isLoading: { ...state.isLoading, services: false },
      }));
    } catch (err) {
      set((state) => ({
        error: { ...state.error, services: "Failed to load services data." },
        isLoading: { ...state.isLoading, services: false },
      }));
      console.error(err);
    }
  },

  // Fetch data for Reviews tab
  fetchReviewsData: async (businessSlug) => {
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, reviews: true },
        error: { ...state.error, reviews: null },
      }));
      const session = await getSession();
      const reviewResponse = await api?.get?.("/api/business/review", {
        params: { page: 1, limit: 10 },
        params: { businessSlug },
      });

      const reviewsData = {
        reviews: Array.isArray(reviewResponse?.data?.data?.data)
          ? reviewResponse?.data?.data?.data?.map((review) => ({
              id: review?.id || "unknown",
              customerName: review?.customerName || "Anonymous",
              comment: review?.comment || "comment",
              rating: review?.rating || 0,
            }))
          : [],
      };

      set((state) => ({
        data: { ...state.data, reviewsData },
        isLoading: { ...state.isLoading, reviews: false },
      }));
    } catch (err) {
      set((state) => ({
        error: { ...state.error, reviews: "Failed to load reviews data." },
        isLoading: { ...state.isLoading, reviews: false },
      }));
      console.error(err);
    }
  },

  // Fetch data for Photos tab (hardcoded)
  fetchPhotosData: async (businessSlug) => {
    const details = await get().fetchDetailsData(businessSlug);
    let urlWithCaption = [];

    if (details?.data?.galleryImages?.length > 0) {
      const responseArray = await api.get("/api/s3", {
        params: {
          keys: JSON.stringify(
            details?.data?.galleryImages?.map((data) => data.image)
          ),
        },
      });

      urlWithCaption = responseArray.data?.data?.urls?.map((url, index) => ({
        url: url,
        key: details?.data?.galleryImages?.[index]?.image,
        text: details?.data?.galleryImages?.[index]?.text,
      }));
    }

    const photosData = {
      photos: urlWithCaption,
    };

    set((state) => ({
      data: { ...state.data, photosData },
      isLoading: { ...state.isLoading, photos: false },
      error: { ...state.error, photos: null },
    }));
  },

  // Fetch data for FAQs tab
  fetchFaqsData: async (businessSlug) => {
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, faqs: true },
        error: { ...state.error, faqs: null },
      }));

      const detailsData = await get().fetchDetailsData(businessSlug);

      const faqsData = {
        faqs: Array.isArray(detailsData?.data?.faqs)
          ? detailsData?.data?.faqs?.map((faq) => ({
              id: faq?.id || "unknown",
              question: faq?.question || "No question",
              answer: faq?.answer || "No answer",
            }))
          : [],
      };

      set((state) => ({
        data: { ...state.data, faqsData },
        isLoading: { ...state.isLoading, faqs: false },
      }));
    } catch (err) {
      set((state) => ({
        error: { ...state.error, faqs: "Failed to load FAQs data." },
        isLoading: { ...state.isLoading, faqs: false },
      }));
      console.error(err);
    }
  },

  // Fetch data for Map tab
  fetchMapData: async (businessSlug) => {
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, map: true },
        error: { ...state.error, map: null },
      }));
      const infoResponse = await api?.get?.("/api/business/info", {
        params: { businessSlug },
      });

      const mapData = {
        location: {
          city: infoResponse?.data?.data?.city || "Unknown",
          state: infoResponse?.data?.data?.state || "Unknown",
          zipCode: infoResponse?.data?.data?.zipCode || "Unknown",
          country: infoResponse?.data?.data?.country || "Unknown",
          locationLat: infoResponse?.data?.data?.locationLat || "Unknown",
          locationLng: infoResponse?.data?.data?.locationLng || "Unknown",
          hideExactAddress: infoResponse?.data?.data?.hideExactAddress,
          address: infoResponse?.data?.data?.address,
        },
      };

      set((state) => ({
        data: { ...state.data, mapData },
        isLoading: { ...state.isLoading, map: false },
      }));
    } catch (err) {
      set((state) => ({
        error: { ...state.error, map: "Failed to load map data." },
        isLoading: { ...state.isLoading, map: false },
      }));
      console.error(err);
    }
  },

  // Reset all data
  resetStore: () =>
    set({
      data: {
        headerData: null,
        overviewData: null,
        servicesData: null,
        reviewsData: null,
        photosData: null,
        faqsData: null,
        mapData: null,
        detailsData: null,
      },
      isLoading: {
        header: false,
        overview: false,
        services: false,
        reviews: false,
        photos: false,
        faqs: false,
        map: false,
        details: false,
      },
      error: {
        header: null,
        overview: null,
        services: null,
        reviews: null,
        photos: null,
        faqs: null,
        map: null,
        details: null,
      },
    }),
}));
