"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

type FAQItemProps = {
  question: string;
  answer: string;
};

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAQ = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-6">
      <button
        onClick={toggleFAQ}
        className="w-full text-left p-6 bg-gray-100 rounded-md flex justify-between items-center focus:outline-none shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <span className="text-xl font-semibold text-gray-800">{question}</span>
        <FaChevronDown
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          } text-gray-600`}
        />
      </button>
      {isOpen && (
        <div className="mt-4 px-6 py-4 bg-white rounded-md text-gray-700 shadow-inner">
          {answer}
        </div>
      )}
    </div>
  );
};

export default FAQItem;
