"use client";

import React from "react";
import {
  FaUserPlus,
  FaHome,
  FaSearch,
  FaComments,
  FaHandshake,
  FaSmile,
} from "react-icons/fa";
import StepCard from "../components/InfoSteps/StepCard";
import FAQSection from "../components/FAQ/FAQSection";
import { useRouter } from "next/navigation";

const HurDetFungerarPage = () => {
  const router = useRouter();
  const faqs = [
    {
      question: "Är det säkert att byta hem?",
      answer:
        "Ja, säkerheten är vår högsta prioritet. Vi erbjuder olika säkerhetsfunktioner och en verifieringsprocess för att skydda våra användare.",
    },
    {
      question: "Vad händer om något går fel?",
      answer:
        "Vi har en kundtjänst som är redo att hjälpa dig om något skulle gå fel under bytet. Dessutom har vi en säkerhetspolicy och garantier för att skydda både dig och ditt hem.",
    },
    {
      question: "Hur lång tid tar det att hitta ett byte?",
      answer:
        "Det varierar beroende på dina preferenser och tillgängligheten av hem, men vi har många alternativ att välja mellan.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <h1 className="text-5xl font-bold text-center text-gray-900 mb-16">
        Hur fungerar Semesterbyte?
      </h1>

      {/* Steps Section */}
      <section className="mb-24 text-center">
        <h2 className="text-4xl font-semibold text-gray-900 mb-12">
          Så här fungerar det
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <StepCard
            icon={FaUserPlus}
            title="Skapa ett konto"
            description="Registrera dig snabbt och enkelt på vår plattform. Börja utforska direkt efter registrering."
          />
          <StepCard
            icon={FaHome}
            title="Lista ditt hem"
            description="Lägg till ditt hem med bilder och beskrivningar för att attrahera potentiella byten."
          />
          <StepCard
            icon={FaSearch}
            title="Utforska och hitta"
            description="Använd våra filter för att hitta det perfekta bytet som matchar dina behov."
          />
          <StepCard
            icon={FaComments}
            title="Kommunicera"
            description="Diskutera detaljerna med andra användare för att säkra ett smidigt byte."
          />
          <StepCard
            icon={FaHandshake}
            title="Bekräfta bytet"
            description="Kom överens om villkoren och bekräfta bytet enkelt via vår plattform."
          />
          <StepCard
            icon={FaSmile}
            title="Njut av ditt nya hem"
            description="Upplev ditt nya hem och lämna en recension för att hjälpa framtida användare."
          />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={faqs} title="Vanliga frågor" />

      {/* Video Section */}
      <section className="mb-24 text-center">
        <h2 className="text-4xl font-semibold text-gray-900 mb-12">
          Så här enkelt är det!
        </h2>
        <div className="flex justify-center">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="How it works video"
            className="rounded-md shadow-lg"
            width="800"
            height="450"
          ></iframe>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-amber-500 text-white rounded-md">
        <h2 className="text-4xl font-semibold mb-4">
          Redo att börja byta hem?
        </h2>
        <p className="text-lg mb-8">
          Skapa ett konto idag och upptäck de fantastiska möjligheter som väntar
          på dig.
        </p>
        <button
          onClick={() => router.push("/registrer")}
          className="px-8 py-4 bg-white text-amber-500 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
        >
          Skapa konto
        </button>
      </section>
    </div>
  );
};

export default HurDetFungerarPage;
