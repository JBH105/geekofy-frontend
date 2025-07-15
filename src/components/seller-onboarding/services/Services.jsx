"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ServisesHeader from "./ServisesHeader";
import ServicesOptions from "./ServicesOptions";
import AddServiceForm from "./AddServiceForm";
import ServicesList from "./ServicesList";
import api from "@/lib/api";
import { getSession } from "next-auth/react";

const Services = ({ isLoading, setIsLoading }) => {
  const [selectedTab, setSelectedTab] = useState("Computers");
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const response = await api.get("/api/business/service", {
        params: { sellerId: session?.user?.id },
      });
      if (response.data.success) {
        setServices(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (serviceData) => {
    try {
      setIsLoading(true);
      const servicePayload = {
        serviceType: selectedTab,
        serviceName: serviceData.serviceName,
        description: serviceData.description,
        amount:
          serviceData.pricing.type === "contact_for_pricing"
            ? null
            : serviceData.pricing.amount
            ? parseFloat(serviceData.pricing.amount)
            : null,
        amountType: serviceData.pricing.type,
      };
      const payload = editingService ? servicePayload : [servicePayload];

      let response;
      if (editingService) {
        response = await api.put(
          `/api/business/service/${editingService.id}`,
          servicePayload
        );
      } else {
        response = await api.post("/api/business/service", payload);
      }

      if (response.data.success) {
        await fetchServices();
        setEditingService(null);
        toast.success("Service saved successfully!");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error(
          error.response.data.message || "Duplicate service name found"
        );
      } else {
        console.error("Error submitting service:", error);
        toast.error("Failed to save service. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
  };

  const handleDelete = async (serviceId) => {
    try {
      setIsLoading(true);
      const response = await api.delete(`/api/business/service/${serviceId}`);
      if (response.data.success) {
        await fetchServices();
        toast.success("Service deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
  };

  const filteredServices = services.filter(
    (service) => service.serviceType === selectedTab
  );

  return (
    <div
      className="bg-white rounded-2xl p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)] flex flex-col gap-8"
      style={{
        boxShadow:
          "1px 1px 25px 0px rgba(0, 0, 0, 0.05), -1px -1px 25px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      <ServisesHeader />
      <ServicesOptions selectedTab={selectedTab} onTabChange={setSelectedTab} />

      {filteredServices.length > 0 &&
        filteredServices.map((service) => (
          <React.Fragment key={service.id}>
            <ServicesList
              service={{
                id: service.id,
                serviceName: service.serviceName,
                description: service.description,
                pricing: {
                  type: service.amountType,
                  amount:
                    service.amountType === "contact_for_pricing"
                      ? null
                      : service.amount,
                },
              }}
              onEdit={() => handleEdit(service)}
              onDelete={() => handleDelete(service.id)}
            />
            {editingService?.id === service.id && (
              <AddServiceForm
                handleFormSubmit={handleFormSubmit}
                initialData={{
                  serviceName: editingService.serviceName,
                  description: editingService.description,
                  pricing: {
                    type: editingService.amountType,
                    amount:
                      editingService.amountType === "contact_for_pricing"
                        ? null
                        : editingService.amount,
                  },
                }}
                onCancel={handleCancelEdit}
                isLoading={isLoading}
                isEditing={true}
              />
            )}
          </React.Fragment>
        ))}

      {!editingService && (
        <AddServiceForm
          handleFormSubmit={handleFormSubmit}
          initialData={null}
          onCancel={handleCancelEdit}
          isLoading={isLoading}
          isEditing={false}
        />
      )}
    </div>
  );
};

export default Services;
