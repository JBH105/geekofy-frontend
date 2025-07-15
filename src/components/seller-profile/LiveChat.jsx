"use client";

import { useState } from "react";
import Image from "next/image";
import GellaryIcon from "../../../public/image/GellaryIcon.svg";
import SendIcon from "../../../public/image/SendIcon.svg";
import MinimizeIcon from "../../../public/image/MinimizeIcon.svg";
import MaximizeIcon from "../../../public/image/MaximizeIcon.svg";
import CloseLiveChatIcon from "../../../public/image/CloseLiveChatIcon.svg";
import MaximizeInIcon from "../../../public/image/MaximizeInIcon.svg";

export default function LiveChat({
  onClose,
  title = "Box Aid",
  messages: initialMessages,
}) {
  const [message, setMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState(
    initialMessages || [
      {
        id: 1,
        sender: "John Hopkins",
        content: "Hello",
        timestamp: "Feb 22, 2025, 7:53 PM",
        isUser: false,
      },
      {
        id: 2,
        sender: "Me",
        content: "How can I help you?\nWelcome",
        timestamp: "Feb 22, 2025, 7:54 PM",
        isUser: true,
      },
    ]
  );

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "Me",
        content: message,
        timestamp: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        isUser: true,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 sm:bottom-4 sm:right-4 max-sm:bottom-2 max-sm:right-2">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-[#0084FF] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors font-medium max-sm:px-3 max-sm:py-2 max-sm:text-sm max-sm:rounded-md"
        >
          {title}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-[#808080] z-50 overflow-hidden transition-all duration-300 
        max-sm:bottom-0 max-sm:right-0 max-sm:left-0 max-sm:rounded-t-lg max-sm:rounded-b-none max-sm:border-b-0
        ${
          isMaximized
            ? "w-[390px] max-w-[500px] h-[70vh] md:h-[75vh] lg:h-[80vh] xl:h-[85vh] max-h-[800px] max-sm:w-full max-sm:h-[85vh] max-sm:max-h-none"
            : "w-[390px] h-[390px] max-sm:w-full max-sm:h-[60vh] max-sm:min-h-[400px]"
        }`}
    >
      {/* Header */}
      <div className="bg-[#0084FF] text-white px-4 py-3 flex items-center justify-between max-sm:px-3 max-sm:py-2.5">
        <h3 className="font-semibold text-lg max-sm:text-base">{title}</h3>
        <div className="flex items-center space-x-1 max-sm:space-x-0.5">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded transition-colors cursor-pointer max-sm:p-1"
          >
            <Image
              src={MinimizeIcon || "/placeholder.svg"}
              alt="MinimizeIcon"
              className="max-sm:w-4 max-sm:h-4"
            />
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1.5 rounded transition-colors cursor-pointer max-sm:p-1"
          >
            <Image
              src={isMaximized ? MaximizeIcon : MaximizeInIcon}
              alt="MaximizeIcon"
              className="max-sm:w-4 max-sm:h-4"
            />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded transition-colors cursor-pointer max-sm:p-1"
          >
            <Image
              src={CloseLiveChatIcon || "/placeholder.svg"}
              alt="CloseLiveChatIcon"
              className="max-sm:w-4 max-sm:h-4"
            />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className={`overflow-y-auto bg-gray-50 transition-all duration-300 ${
          isMaximized
            ? "h-[calc(70vh-108px)] md:h-[calc(75vh-108px)] lg:h-[calc(80vh-108px)] xl:h-[calc(85vh-108px)] max-h-[724px] max-sm:h-[calc(85vh-120px)]"
            : "h-[280px] max-sm:h-[calc(60vh-120px)] max-sm:min-h-[280px]"
        }`}
      >
        <div className="p-4 space-y-4 max-sm:p-3 max-sm:space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:space-y-1">
                <span
                  className={`font-semibold text-base leading-5 max-sm:text-sm ${
                    msg.isUser ? "text-[#333333]" : "text-[#00900E]"
                  }`}
                >
                  {msg.sender}
                </span>
                <span className="text-xs text-[#666666] max-sm:text-[11px]">
                  {msg.timestamp}
                </span>
              </div>
              <div
                className={` ${
                  msg.isUser
                    ? "text-[#666666] font-medium text-sm whitespace-pre-line leading-[18px] max-sm:text-[13px] max-sm:leading-[16px]"
                    : "text-[#666666] font-semibold text-sm whitespace-pre-line leading-[18px] max-sm:text-[13px] max-sm:leading-[16px]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[#B3B3B3] bg-white p-3 max-sm:p-2.5">
        <div className="flex items-center space-x-2 max-sm:space-x-1.5">
          <button className="text-[#666666] transition-colors p-1 cursor-pointer max-sm:p-0.5">
            <Image
              src={GellaryIcon || "/placeholder.svg"}
              alt="GellaryIcon"
              className="max-sm:w-5 max-sm:h-5"
            />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message ..."
            className="flex-1 border-0 bg-transparent text-sm text-[#666666] placeholder-[#666666] outline-none max-sm:text-[13px] max-sm:py-1"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="text-[#0084FF] p-1 cursor-pointer max-sm:p-0.5"
            disabled={!message.trim()}
          >
            <Image
              src={SendIcon || "/placeholder.svg"}
              alt="SendIcon"
              className="max-sm:w-5 max-sm:h-5"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
