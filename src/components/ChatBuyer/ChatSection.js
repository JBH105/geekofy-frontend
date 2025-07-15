"use client";

import { useState, useRef, useEffect } from "react";
import EmojiChatIcon from "../../../public/image/EmojiChatIcon.svg";
import FileUploadChatIcon from "../../../public/image/FileUploadChatIcon.svg";
import Image from "next/image";

export default function ChatSection({
  conversation,
  onSendMessage,
  isMessagesHovered,
  messagesRef,
}) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [conversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage(e);
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  };

  return (
    <div className="w-[690px] flex-1 flex flex-col bg-white rounded-2xl shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
      {/* Messages container */}
      <div
        className="p-5 pb-0 h-full flex flex-col"
        style={{ minHeight: 0 }} // Important for flex children to shrink properly
      >
        {/* Messages content that will grow and push input to bottom */}
        <div
          ref={messagesRef}
          className={`flex-1 overflow-y-auto h-full ${
            isMessagesHovered ? "custom-scrollbar-light" : "no-scrollbar"
          }`}
        >
          <div className="min-h-full flex flex-col justify-end">
            <div>
              {conversation.map((msg, index) => (
                <div key={msg.id} className="mb-2">
                  {(index === 0 ||
                    conversation[index - 1].sender !== msg.sender) && (
                    <div className="flex items-center mb-2">
                      <div
                        className={`font-medium ${
                          msg.sender === "Me"
                            ? "text-[#333333] font-semibold text-base leading-5"
                            : "text-[#00900E] font-semibold text-base leading-5"
                        }`}
                      >
                        {msg.sender}
                      </div>
                      <div className="text-xs text-[#666666] ml-3">
                        {msg.time}
                      </div>
                    </div>
                  )}
                  <div
                    className={`pl-0 whitespace-pre-line text-sm ${
                      msg.sender === "Me"
                        ? "text-[#666666] font-normal leading-5"
                        : "text-[#666666] font-medium leading-5"
                    }`}
                  >
                    {msg.message}
                  </div>
                  {index !== conversation.length - 1 &&
                    conversation[index + 1].sender !== msg.sender && (
                      <div className="border-t-2 border-dashed border-[#B3B3B3] my-4"></div>
                    )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Sticky input area at the bottom */}
        <div className="sticky bottom-0 bg-white pt-2.5 pb-5">
          <form onSubmit={handleSendMessage} className="flex items-end gap-3">
            <button
              type="button"
              className="mb-4 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Image src={EmojiChatIcon} alt="EmojiChatIcon" />
            </button>
            <button
              type="button"
              className="mb-4 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Image src={FileUploadChatIcon} alt="FileUploadChatIcon" />
            </button>
            <div className="flex-1 relative mt-1">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full p-2 border border-gray-200 text-base rounded-lg outline-none resize-none max-h-[150px] overflow-y-auto scrollbar-hide"
                rows="1"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 mb-2 bg-[#CCCCCC] text-[#666666] font-bold leading-6 tracking-[0.14px] rounded-lg disabled:opacity-50 transition-colors h-fit cursor-pointer"
              disabled={!message.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
