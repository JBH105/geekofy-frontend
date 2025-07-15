"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import SellerProfileHeader from "../seller-profile/SellerProfileHeader";

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState("consumer");
  const [expandedItems, setExpandedItems] = useState({ 2: true });

  const toggleItem = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqData = {
    consumer: [
      {
        question:
          "I hope everything's going well! I'm excited to let you know that I've recently joined Geekify to find more clients",
        answer: "",
      },
      {
        question:
          "I hope everything's going well! I'm excited to let you know that I've recently joined Geekify to find more clients",
        answer: "",
      },
      {
        question:
          "I hope everything's going well! I'm excited to let you know that I've recently joined Geekify",
        answer:
          "I hope everything's going well! I'm excited to let you know that I've recently joined Geekify to find more fantastic clients like you. Reviews are a big part of what helps me grow, and I'd love if you could share your experience with others. A few sentences about how we worked together would be so helpful and appreciated.",
      },
      {
        question:
          "I hope everything's going well! I'm excited to let you know that I've recently joined Geekify to find more clients",
        answer: "",
      },
      {
        question:
          "I hope everything's going well! I'm excited to let you know that I've recently joined Geekify to find more clients",
        answer: "",
      },
      {
        question:
          "I hope everything's going well! I'm excited to let you know that I've recently joined Geekify to find more clients",
        answer: "",
      },
      {
        question:
          "I hope everything's going well! I'm excited to let you know that I've recently joined Geekify to find more clients",
        answer: "",
      },
      {
        question:
          "I hope everything's going well! I'm excited to let you know that I've recently joined Geekify to find more clients",
        answer: "",
      },
    ],
    business: [
      {
        question: "How can I integrate Geekify into my business workflow?",
        answer:
          "You can integrate Geekify into your business workflow by using our API endpoints and webhook integrations. We provide comprehensive documentation and support for enterprise clients.",
      },
      {
        question: "What are the pricing plans for business accounts?",
        answer:
          "We offer flexible pricing plans for businesses of all sizes. Contact our sales team for a customized quote based on your specific needs and usage requirements.",
      },
      {
        question: "Do you provide dedicated support for business clients?",
        answer:
          "Yes, all business clients receive priority support with dedicated account managers and 24/7 technical assistance.",
      },
    ],
  };

  const currentFAQs = faqData[activeTab];

  return (
    <>
      <SellerProfileHeader />
      <div className="min-h-screen py-5 px-4">
        <div className="max-w-[930px] mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl leading-11 font-semibold text-[#0084FF] mb-[30px]">
              Frequently asked questions
            </h1>

            {/* Tab Buttons */}
            <div className="flex justify-center gap-[50px] mb-14">
              <button
                onClick={() => setActiveTab("consumer")}
                className={`px-[50px] py-[14px] rounded-[10px] text-base font-bold leading-6 transition-colors cursor-pointer outline-none ${
                  activeTab === "consumer"
                    ? "bg-[#0084FF] text-white"
                    : "border border-[#0084FF] text-[#666666]"
                }`}
              >
                Consumer
              </button>
              <button
                onClick={() => setActiveTab("business")}
                className={`px-[50px] py-[14px] rounded-[10px] text-base font-bold leading-6 transition-colors cursor-pointer outline-none ${
                  activeTab === "business"
                    ? "bg-[#0084FF] text-white"
                    : "border border-[#0084FF] text-[#666666]"
                }`}
              >
                Business
              </button>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-[19px]">
            {currentFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-[15px] shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 pt-3.5 pb-[10px] text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span
                    className={`text-base leading-6 ${
                      expandedItems[index]
                        ? "text-[#0084FF] font-bold "
                        : "text-[#4d4d4d] "
                    }`}
                  >
                    {faq.question}
                  </span>
                  {expandedItems[index] ? (
                    <FaChevronUp className="h-5 w-5 text-[#666666] flex-shrink-0" />
                  ) : (
                    <FaChevronDown className="h-5 w-5 text-[#666666] flex-shrink-0" />
                  )}
                </button>

                {expandedItems[index] && faq.answer && (
                  <div className="px-6 pb-4">
                    <p className="text-[#666666] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
