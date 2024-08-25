import React from "react";
import FAQItem from "./FAQItem";

type FAQ = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  faqs: FAQ[];
  title?: string;
};

const FAQSection: React.FC<FAQSectionProps> = ({ faqs, title }) => {
  return (
    <section className="mb-24">
      {title && (
        <h2 className="text-4xl font-semibold text-center text-gray-900 mb-12">
          {title}
        </h2>
      )}
      <div className="max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
