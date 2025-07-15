"use client";

import { useState, useEffect, useRef } from "react";
import DeleteIcon from "../../../../public/image/DeleteIcon.svg";
import Image from "next/image";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

export default function FAQSection({
  setFAQSection,
  faqData,
  saveBusinessDetails,
}) {
  const [faqs, setFaqs] = useState(faqData || []);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [showAddFAQ, setShowAddFAQ] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const questionTextareaRef = useRef(null);
  const answerTextareaRef = useRef(null);

  useEffect(() => {
    if (JSON.stringify(faqs) !== JSON.stringify(faqData)) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [faqs, faqData]);

  useEffect(() => {
    if (questionTextareaRef.current) {
      questionTextareaRef.current.style.height = "auto";
      questionTextareaRef.current.style.height = `${questionTextareaRef.current.scrollHeight}px`;
    }
    if (answerTextareaRef.current) {
      answerTextareaRef.current.style.height = "auto";
      answerTextareaRef.current.style.height = `${answerTextareaRef.current.scrollHeight}px`;
    }
  }, [editQuestion, editAnswer, newQuestion, newAnswer]);

  const handleEditFAQ = (faq) => {
    setEditingFAQ(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const handleSaveEdit = (id) => {
    if (editQuestion.trim() === "" && editAnswer.trim() === "") return;

    setFaqs(
      faqs.map((faq) =>
        faq.id === id
          ? { ...faq, question: editQuestion, answer: editAnswer }
          : faq
      )
    );
    setEditingFAQ(null);
    setEditQuestion("");
    setEditAnswer("");
  };

  const handleCancelEdit = () => {
    setEditingFAQ(null);
    setEditQuestion("");
    setEditAnswer("");
  };

  const handleDeleteFAQ = (id) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  const handleCancel = () => {
    if (hasChanges) {
      setIsModalOpen(true);
    } else {
      setFAQSection((prev) => ({ ...prev, show: false }));
    }
  };

  const handleConfirmExit = () => {
    setIsModalOpen(false)
    setFAQSection((prev) => ({ ...prev, show: false }));
  }

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    setFAQSection((prev) => ({ ...prev, show: false, data: faqs }));
    saveBusinessDetails({ faqs: faqs });
  };

  const handleShowAddForm = () => {
    setShowAddFAQ(true);
  };

  const handleSaveAndAddNew = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      const newFAQ = {
        id: Date.now().toString(),
        question: newQuestion,
        answer: newAnswer,
      };
      setFaqs([...faqs, newFAQ]);
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  const handleCancelFaqs = () => {
    setNewQuestion("");
    setNewAnswer("");
    setShowAddFAQ(false);
  };

  const handleSaveFaqs = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      const newFAQ = {
        id: Date.now().toString(),
        question: newQuestion,
        answer: newAnswer,
      };
      setFaqs([...faqs, newFAQ]);
      setNewQuestion("");
      setNewAnswer("");
      setShowAddFAQ(false);
    }
  };

  const capitalizeFirstLetter = (str) => {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-[1px_1px_25px_0px_rgba(0,0,0,0.05),-1px_-1px_25px_0px_rgba(0,0,0,0.05)]">
        <div className="mb-10">
          <h1 className="text-lg font-semibold text-[#666666] leading-5 mb-2">
            Frequently Asked Questions
          </h1>
          <div className="h-1 w-24 bg-[#0084FF] rounded-full mb-4"></div>
        </div>

        <p className="text-[#333333] text-base leading-6 font-normal mb-8">
          Add questions and answers MOST relevant to your customers
        </p>

        {/* Existing FAQs */}
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-xl p-6">
              {editingFAQ === faq.id ? (
                <>
                  <div className="flex gap-3 mb-4 items-start">
                    <span className="text-[#666666] text-lg font-bold flex-shrink-0">
                      Q :
                    </span>
                    <textarea
                      ref={questionTextareaRef}
                      value={editQuestion}
                      onChange={(e) =>
                        setEditQuestion(capitalizeFirstLetter(e.target.value))
                      }
                      className="w-full max-w-[600px] bg-transparent border-none outline-none text-lg text-[#0084ff] font-medium leading-6 resize-none overflow-hidden"
                      placeholder=""
                      rows={1}
                    />
                  </div>
                  <div className="w-full h-px bg-gray-200 my-6"></div>
                  <div className="flex gap-3 items-start">
                    <span className="text-[#666666] text-lg font-bold flex-shrink-0">
                      A :
                    </span>
                    <textarea
                      ref={answerTextareaRef}
                      value={editAnswer}
                      onChange={(e) =>
                        setEditAnswer(capitalizeFirstLetter(e.target.value))
                      }
                      className="w-full max-w-[600px] bg-transparent border-none outline-none text-lg text-[#666666] font-normal leading-6 resize-none overflow-hidden"
                      placeholder=""
                      rows={1}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-[#666666] rounded-lg hover:bg-gray-50 text-[#666666] text-base cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(faq.id)}
                      className="px-4 py-2 bg-[#0084FF] text-white rounded-lg hover:bg-blue-600 text-base cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 flex-1">
                      <span className="text-[#666666] text-lg font-bold flex-shrink-0">
                        Q :
                      </span>
                      <span className="text-[#0084ff] text-base font-medium leading-6 flex-1 max-w-[600px] break-words whitespace-pre-line">
                        {faq.question}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        className="p-1.5 cursor-pointer text-[#666666] hover:text-[#ED790F] transition-colors duration-200"
                        onClick={() => handleEditFAQ(faq)}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="stroke-current"
                        >
                          <path
                            d="M8.58017 1.83887H2.68448C2.23773 1.83887 1.80927 2.01632 1.49337 2.33219C1.17747 2.64806 1 3.07647 1 3.52318V15.3133C1 15.7601 1.17747 16.1885 1.49337 16.5043C1.80927 16.8202 2.23773 16.9977 2.68448 16.9977H14.4758C14.9226 16.9977 15.3511 16.8202 15.667 16.5043C15.9829 16.1885 16.1603 15.7601 16.1603 15.3133V9.41826"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M13.9447 1.5252C14.2798 1.19017 14.7342 1.00195 15.2081 1.00195C15.682 1.00195 16.1364 1.19017 16.4715 1.5252C16.8065 1.86023 16.9948 2.31463 16.9948 2.78843C16.9948 3.26224 16.8065 3.71664 16.4715 4.05167L8.88035 11.6429C8.68036 11.8426 8.43329 11.9889 8.16192 12.0681L5.74216 12.7755C5.66969 12.7967 5.59286 12.798 5.51973 12.7792C5.4466 12.7605 5.37985 12.7224 5.32647 12.6691C5.27309 12.6157 5.23504 12.5489 5.2163 12.4758C5.19756 12.4027 5.19883 12.3259 5.21997 12.2534L5.92745 9.8339C6.00707 9.56277 6.15362 9.31603 6.35363 9.11639L13.9447 1.5252Z"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        className="p-1.5 cursor-pointer"
                        onClick={() => handleDeleteFAQ(faq.id)}
                      >
                        <Image
                          src={DeleteIcon}
                          alt="DeleteIcon"
                          width={14}
                          height={14}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <span className="text-[#666666] text-lg font-bold flex-shrink-0">
                      A :
                    </span>
                    <span className="text-[#666666] text-base font-normal leading-6 flex-1 max-w-[600px] break-words whitespace-pre-line">
                      {faq.answer}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add new FAQ */}
        {showAddFAQ && (
          <div className="border border-gray-200 rounded-xl p-6 mt-6">
            <div className="flex gap-2 mb-4 items-start">
              <span className="text-[#666666] text-lg font-bold flex-shrink-0">
                Q :
              </span>
              <textarea
                value={newQuestion}
                onChange={(e) =>
                  setNewQuestion(capitalizeFirstLetter(e.target.value))
                }
                className="w-full max-w-[600px] bg-transparent border-none outline-none text-[#0084ff] text-base font-medium leading-6 resize-none overflow-hidden"
                placeholder=""
                rows={1}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />
            </div>
            <div className="w-full h-px bg-gray-200 my-6"></div>
            <div className="flex gap-2 items-start">
              <span className="text-[#666666] text-lg font-bold flex-shrink-0">
                A :
              </span>
              <textarea
                value={newAnswer}
                onChange={(e) =>
                  setNewAnswer(capitalizeFirstLetter(e.target.value))
                }
                className="w-full max-w-[600px] bg-transparent border-none outline-none text-[#666666] text-base font-normal leading-6 resize-none overflow-hidden"
                placeholder=""
                rows={1}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />
            </div>
            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={handleSaveAndAddNew}
                className="py-[15px] px-[30px] rounded-[8px] bg-[rgba(213,232,255,0.5)] flex items-center text-center text-[#4D4D4D] text-base font-bold font-helvetica leading-6 not-italic cursor-pointer"
              >
                Save & Add New
              </button>
              <div className="flex gap-4">
                <button
                  onClick={handleSaveFaqs}
                  className="py-[15px] px-[30px] rounded-[8px] bg-[rgba(213,232,255,0.5)] flex items-center text-center text-[#4D4D4D] text-base font-bold font-helvetica leading-6 not-italic cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelFaqs}
                  className="py-[15px] px-[30px] rounded-[8px] bg-gray-200 flex items-center text-center text-[#4D4D4D] text-base font-bold font-helvetica leading-6 not-italic cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add button */}
        {!showAddFAQ && (
          <div className="mt-8">
            <button
              onClick={handleShowAddForm}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-10 rounded-lg transition-colors"
            >
              Add New FAQ
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 my-[50px]">
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
