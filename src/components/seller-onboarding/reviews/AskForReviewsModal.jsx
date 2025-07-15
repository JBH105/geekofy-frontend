"use client";
import api from "@/lib/api";
import Image from "next/image";
import { toast } from "react-toastify";
import React, { useEffect, useRef, useState } from "react";
import FacebookIcon from "../../../../public/image/FacebookIcon.svg";
import TwitterIcon from "../../../../public/image/TwitterIcon.svg";
import WhatsappIcon from "../../../../public/image/WhatsappIcon.svg";
import TelegramIcon from "../../../../public/image/TelegramIcon.svg";
import VerifiedIcon from "../../../../public/image/VerifiedIcon.svg";
import { AiOutlineClose, AiOutlineCopy } from "react-icons/ai";
import { getSession, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const AskForReviewsModal = ({
  onClose,
  businessName,
  isLoading,
  setIsLoading,
}) => {
  const modalRef = useRef();
  const { data: userSession } = useSession();
  const sellerId = userSession?.user?.id;
  const shareUrl = `https://geekofy.com/business/review?sellerId=${sellerId}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const messages = encodeURIComponent("Check out this business!");
  const [emails, setEmails] = useState(["", "", "", "", ""]);
  const [isSending, setIsSending] = useState(false);
  const [emailStatuses, setEmailStatuses] = useState({});
  const [useTemplate, setUseTemplate] = useState(true);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [message, setMessage] = useState(
    `Hey,
    
    I hope everything's going well! I'm excited to let you know that I've recently joined Geekofy to find more fantastic clients like you. Reviews are a big part of what helps me grow, and I'd love if you could share your experience with others. A few sentences about how we worked together would be so helpful and appreciated.
    
    Thanks again for being an amazing customer!
    
    Thanks,
    ${businessName}`
  );
  const [duplicateEmails, setDuplicateEmails] = useState({});

  const defaultTemplate = `Hey,
    
    I hope everything's going well! I'm excited to let you know that I've recently joined Geekofy to find more fantastic clients like you. Reviews are a big part of what helps me grow, and I'd love if you could share your experience with others. A few sentences about how we worked together would be so helpful and appreciated.
    
    Thanks again for being such an amazing customer!
    
    Thanks,
    ${businessName}`;

  // Convert plain text to HTML with preserved line breaks
  const formatMessageToHtml = (text) => {
    return text.replace(/\n/g, "<br>");
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setIsLinkCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setIsLinkCopied(false), 3000);
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef?.current && !modalRef?.current.contains(event?.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const fetchEmailStatuses = async () => {
      try {
        setIsLoading(true);
        const session = await getSession();
        const response = await api.get("/api/business/review-equest", {
          params: { sellerId: session?.user?.id },
        });
        if (response.data.success) {
          const statusMap = {};
          const fetchedEmails = response.data.data.map((item) => item.email);
          response.data.data.forEach((item) => {
            statusMap[item.email] = item.status;
          });
          setEmailStatuses(statusMap);

          const newEmails = ["", "", "", "", ""];
          fetchedEmails.forEach((email, index) => {
            if (index < 5) {
              newEmails[index] = email;
            }
          });
          setEmails(newEmails);
        }
      } catch (error) {
        toast.error("Failed to fetch email statuses.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmailStatuses();
  }, [setIsLoading]);

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);

    // Check for duplicate emails
    const duplicates = {};
    newEmails.forEach((email, i) => {
      if (email && newEmails.filter((e) => e === email).length > 1) {
        duplicates[i] = true;
      }
    });
    setDuplicateEmails(duplicates);
  };

  const handleMessageChange = (e) => {
    if (!useTemplate) {
      setMessage(e.target.value);
    }
  };

  const handleRadioChange = (useTemplateSelected) => {
    setUseTemplate(useTemplateSelected);
    setMessage(useTemplateSelected ? defaultTemplate : "");
  };

  const handleSendEmail = async () => {
    try {
      setIsSending(true);
      setIsLoading(true);

      // Check if there are any duplicate emails
      const hasDuplicates = Object.values(duplicateEmails).some((val) => val);
      if (hasDuplicates) {
        toast.error("Please remove duplicate email addresses before sending.");
        setIsSending(false);
        setIsLoading(false);
        return;
      }

      const validEmails = emails.filter(
        (email) =>
          email.trim() !== "" &&
          emailStatuses[email] !== "submitted" &&
          emailStatuses[email] !== "pending"
      );

      if (validEmails.length === 0) {
        toast.error("Please enter at least one new email address.");
        setIsSending(false);
        setIsLoading(false);
        return;
      }

      const payload = {
        email: validEmails,
        message: useTemplate
          ? formatMessageToHtml(defaultTemplate)
          : formatMessageToHtml(message),
        isHtml: true,
      };

      await api.post("/api/business/review-equest", payload);

      const updatedStatuses = { ...emailStatuses };
      validEmails.forEach((email) => {
        updatedStatuses[email] = "pending";
      });
      setEmailStatuses(updatedStatuses);

      toast.success("Emails sent successfully!");
    } catch (error) {
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
      setIsLoading(false);
    }
  };

  const handleResendEmail = async (email) => {
    try {
      setIsSending(true);
      setIsLoading(true);
      const payload = {
        email: [email],
        message: useTemplate
          ? formatMessageToHtml(defaultTemplate)
          : formatMessageToHtml(message),
        isHtml: true,
      };
      await api.post(
        "/api/business/review-equest/reSendReviewRequest",
        payload
      );
      toast.success("Email resent successfully!");
    } catch (error) {
      toast.error("Failed to resend email. Please try again.");
    } finally {
      setIsSending(false);
      setIsLoading(false);
    }
  };

  const isSendButtonDisabled = () => {
    return (
      emails.every(
        (email) =>
          email.trim() === "" ||
          emailStatuses[email] === "submitted" ||
          emailStatuses[email] === "pending"
      ) || Object.values(duplicateEmails).some((val) => val)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080] bg-opacity-50 overflow-auto">
      <div
        ref={modalRef}
        className="bg-[#FFFFFF] rounded-[15px] w-[1120px] max-w-full py-[60px] px-[40px] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#666666] hover:text-[#333333] transition-colors duration-300 cursor-pointer"
        >
          <AiOutlineClose className="w-6 h-6" />
        </button>
        <div className="flex gap-9 flex-col">
          <div className="px-[35px] flex flex-col gap-4 justify-start">
            <p className="text-[#4D4D4D] font-helvetica text-[18px] font-bold leading-[20px]">
              Ask past customers for reviews
            </p>
            <p className="text-[#666666] font-helvetica text-[16px] font-normal leading-[24px]">
              Positive reviews are vital—they give new customers insight into
              how thrilled others are with your services.
            </p>
          </div>
          <div className="flex gap-8 items-stretch">
            <div className="w-[356px] h-[376px] flex flex-col gap-8">
              <p className="px-[35px] text-[#666666] text-start font-helvetica text-[16px] font-bold leading-[24px]">
                Email previous customers
              </p>
              <div className="flex flex-col justify-start gap-5">
                {[...Array(5)]?.map((_, index) => (
                  <div className="relative" key={index}>
                    <div className="flex gap-4 items-center">
                      <p className="text-[#666666] font-helvetica text-[16px] font-normal leading-[24px]">
                        {index + 1}.
                      </p>
                      <div className="relative flex-grow">
                        <input
                          type="email"
                          id={`email-${index}`}
                          name="email"
                          className={`block px-3.5 pb-3 pt-4 w-full text-sm bg-transparent rounded-xl shadow-[0px_1px_4px_0px_rgba(28,28,28,0.06)] text-[#333333] border ${
                            duplicateEmails[index]
                              ? "border-[#FF0000]"
                              : "border-[#e8e8e8]"
                          } appearance-none focus:outline-none focus:ring-0 peer focus:border-[#999999] transition-colors duration-300 ${
                            emailStatuses[emails[index]] === "submitted"
                              ? "bg-gray-100 cursor-not-allowed"
                              : ""
                          }`}
                          placeholder=" "
                          autoComplete="off"
                          value={emails[index]}
                          onChange={(e) =>
                            handleEmailChange(index, e.target.value)
                          }
                          disabled={
                            emailStatuses[emails[index]] === "submitted"
                          }
                        />
                        <label
                          htmlFor={`email-${index}`}
                          className={`absolute text-sm ${
                            duplicateEmails[index]
                              ? "text-[#FF0000]"
                              : "text-[#9C9C9C]"
                          } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 left-3 
                          peer-placeholder-shown:scale-100 
                          peer-placeholder-shown:-translate-y-1/2 
                          peer-placeholder-shown:top-1/2 
                          peer-focus:top-2 
                          peer-focus:scale-75 
                          peer-focus:-translate-y-4 
                          peer-focus:left-3 
                          peer-focus:text-[#333333] 
                          peer-focus:font-medium`}
                        >
                          Email address
                        </label>
                        {duplicateEmails[index] && (
                          <p className="text-[#FF0000] text-xs mt-1 ml-2">
                            Email already entered in another field
                          </p>
                        )}
                        {emails[index] &&
                          !duplicateEmails[index] &&
                          emailStatuses[emails[index]] === "submitted" && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                              <Image
                                src={VerifiedIcon}
                                alt="VerifiedIcon"
                                className="mr-1.5 mb-2 mt-1.5"
                              />
                              <span className="text-[#666666] text-[12px] font-helvetica">
                                Submitted
                              </span>
                            </div>
                          )}
                        {emails[index] &&
                          !duplicateEmails[index] &&
                          emailStatuses[emails[index]] === "pending" && (
                            <button
                              onClick={() => handleResendEmail(emails[index])}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#0084FF] text-[12px] font-helvetica font-medium hover:underline cursor-pointer"
                              disabled={isSending || isLoading}
                            >
                              Resend
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[652px] h-[320px] flex flex-col gap-7">
              <div className="flex gap-[90px] justify-center items-center">
                <div className="flex gap-2">
                  <input
                    type="radio"
                    checked={useTemplate}
                    onChange={() => handleRadioChange(true)}
                    className="h-5 w-5"
                  />
                  <p className="text-[#666666] font-helvetica text-[16px] font-bold leading-[24px]">
                    Use template
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="radio"
                    checked={!useTemplate}
                    onChange={() => handleRadioChange(false)}
                    className="h-5 w-5"
                  />
                  <p className="text-[#666666] font-helvetica text-[16px] font-bold leading-[24px]">
                    Write your own
                  </p>
                </div>
              </div>
              <div className="py-7 px-6 bg-[#FFFFFF] rounded-[8px] border border-[#999999]">
                {useTemplate ? (
                  <>
                    <p className="text-[#666666] text-[14px] font-normal font-helvetica leading-6">
                      Hey,
                    </p>
                    <p className="text-[#666666] text-[14px] font-normal font-helvetica leading-6 mt-6">
                      I hope everything's going well! I'm excited to let you
                      know that I've recently joined Geekofy to find more
                      fantastic clients like you. Reviews are a big part of what
                      helps me grow, and I'd love if you could share your
                      experience with others. A few sentences about how we
                      worked together would be so helpful and appreciated.
                    </p>
                    <p className="text-[#666666] text-[14px] font-normal font-helvetica leading-6 mt-6">
                      Thanks again for being such an amazing customer!
                    </p>
                    <p className="text-[#666666] text-[14px] font-normal font-helvetica leading-6 mt-6">
                      Thanks,
                    </p>
                    <p className="text-[#666666] text-[14px] font-normal font-helvetica leading-6 mt-1">
                      {businessName}
                    </p>
                  </>
                ) : (
                  <textarea
                    className="w-full h-[200px] text-[#666666] text-[14px] font-normal font-helvetica leading-6 bg-transparent border-none focus:outline-none resize-none"
                    value={message}
                    onChange={handleMessageChange}
                    placeholder="Write your custom message here..."
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="w-[356px]"></div>
            <div className="w-[652px] flex justify-between items-end">
              <div className="flex flex-col gap-[10px] items-start">
                <p className="text-[#666666] font-base font-semibold font-helvetica leading-[35px] tracking-[0.32px]">
                  Share via link
                </p>
                <div className="flex gap-6 items-center">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="cursor-pointer">
                      <Image src={FacebookIcon} alt="FacebookIcon" />
                    </button>
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${messages}&url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="cursor-pointer">
                      <Image src={TwitterIcon} alt="TwitterIcon" />
                    </button>
                  </a>

                  <a
                    href={`https://wa.me/?text=${messages}%20${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={WhatsappIcon}
                      alt="WhatsappIcon"
                      className="cursor-pointer"
                    />
                  </a>

                  {/* <a
                    href={`https://t.me/share?url=${encodedUrl}&text=${messages}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="cursor-pointer">
                      <Image src={TelegramIcon} alt="TelegramIcon" />
                    </button>
                  </a> */}

                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 text-[#666666] hover:text-[#333333] transition-colors duration-300 cursor-pointer"
                  >
                    <AiOutlineCopy className="w-10 h-10" />
                    {/* <span className="text-sm">Copy link</span> */}
                  </button>
                </div>
                {/* {isLinkCopied && (
                  <div className="mt-2 text-sm text-[#0084FF]">
                    Link copied to clipboard!
                  </div>
                )} */}
              </div>
              <button
                onClick={handleSendEmail}
                disabled={isSending || isSendButtonDisabled()}
                className="py-3 px-6 bg-[#0084FF] rounded-[8px] text-[#FFFFFF] text-base font-normal font-helvetica leading-6 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSending ? "Sending..." : "Send email"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskForReviewsModal;
