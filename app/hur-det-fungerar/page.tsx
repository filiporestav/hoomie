"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FaRegCheckCircle,
  FaUserPlus,
  FaHome,
  FaSearch,
  FaComments,
  FaHandshake,
  FaSmile,
} from "react-icons/fa";

const HurDetFungerarPage = () => {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center text-amber-600 mb-12">
        Hur fungerar Hemlo?
      </h1>

      <section className="mb-16 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <FaUserPlus className="text-amber-600 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Skapa ett konto
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Registrera dig snabbt och enkelt på vår plattform. Börja utforska
              direkt efter registrering.
            </p>
          </div>

          <div>
            <FaHome className="text-amber-600 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Lista ditt hem
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Lägg till ditt hem med bilder och beskrivningar för att attrahera
              potentiella byten.
            </p>
          </div>

          <div>
            <FaSearch className="text-amber-600 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Utforska och hitta
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Använd våra filter för att hitta det perfekta bytet som matchar
              dina behov.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <FaComments className="text-amber-600 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Kommunicera
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Diskutera detaljerna med andra användare för att säkra ett smidigt
              byte.
            </p>
          </div>

          <div>
            <FaHandshake className="text-amber-600 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Bekräfta bytet
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Kom överens om villkoren och bekräfta bytet enkelt via vår
              plattform.
            </p>
          </div>

          <div>
            <FaSmile className="text-amber-600 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Njut av ditt nya hem
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Upplev ditt nya hem och lämna en recension för att hjälpa framtida
              användare.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Vanliga frågor
        </h2>
        <div className="max-w-4xl mx-auto">
          {[
            {
              question: "Är det säkert att byta hem?",
              answer:
                "Ja, säkerheten är vår högsta prioritet. Vi har olika säkerhetsfunktioner och en verifieringsprocess för att skydda våra användare.",
            },
            {
              question: "Vad händer om något går fel?",
              answer:
                "Vi har en kundtjänst som är redo att hjälpa dig om något skulle gå fel under bytet.",
            },
            {
              question: "Hur lång tid tar det att hitta ett byte?",
              answer:
                "Det varierar beroende på dina preferenser och tillgängligheten av hem, men vi har många alternativ att välja mellan.",
            },
          ].map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left p-4 bg-amber-100 rounded-md flex justify-between items-center focus:outline-none"
              >
                <span className="text-xl font-semibold text-amber-600">
                  {faq.question}
                </span>
                <FaRegCheckCircle
                  className={`transform transition-transform duration-200 ${
                    faqOpen === index ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {faqOpen === index && (
                <div className="mt-2 px-4 py-2 bg-amber-50 rounded-md text-gray-700">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
          Så här enkelt är det!
        </h2>
        <div className="flex justify-center">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="How it works video"
            className="rounded-md shadow-md"
            width="800"
            height="400"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default HurDetFungerarPage;
