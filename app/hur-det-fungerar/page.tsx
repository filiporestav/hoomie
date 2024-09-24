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
      question: "Är det säkert att byta boende?",
      answer:
        "Ja, säkerheten är vår högsta prioritet. Vi erbjuder försäkringar och en verifieringsprocess för att skydda våra användare.",
    },
    {
      question: "Vad händer om något går fel?",
      answer:
        "Vår support är redo att hjälpa om något oväntat skulle hända. Dessutom har vi garantier och säkerhetspolicys på plats.",
    },
    {
      question: "Hur lång tid tar det att hitta ett byte?",
      answer:
        "Det beror på tillgänglighet och dina preferenser, men vi har ett stort urval av studentboenden att välja mellan.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <h1 className="text-5xl font-bold text-center text-gray-900 mb-16">
        Hur fungerar Hoomie?
      </h1>

      {/* Introduction */}
      <section className="mb-12 text-center">
        <p className="text-lg text-gray-700">
          Tänk dig att du kan upptäcka nya städer, kulturer och vänner, allt
          medan du bor i en annan students hem under några dagar eller en vecka.
          Med vår plattform får du möjligheten att byta boende med andra
          studenter och skapa oförglömliga minnen, allt till en låg kostnad.
        </p>
      </section>

      {/* Steps Section */}
      <section className="mb-24 text-center">
        <h2 className="text-4xl font-semibold text-gray-900 mb-12">
          Så här fungerar det
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <StepCard
            icon={FaUserPlus}
            title="Skapa ett konto"
            description="Registrera dig på plattformen och skapa en profil för att börja ditt äventyr."
          />
          <StepCard
            icon={FaHome}
            title="Lista ditt boende"
            description="Lägg till ditt studentboende med bilder och beskrivningar för att attrahera andra studenter."
          />
          <StepCard
            icon={FaSearch}
            title="Utforska boenden"
            description="Sök efter studentboenden som passar dina resmål och drömmar."
          />
          <StepCard
            icon={FaComments}
            title="Kontakta andra studenter"
            description="Använd vår chattfunktion för att diskutera detaljer och komma överens om bytet."
          />
          <StepCard
            icon={FaHandshake}
            title="Bekräfta bytet"
            description="När ni är överens om detaljerna, bekräfta bytet och boka boendet."
          />
          <StepCard
            icon={FaSmile}
            title="Njut av din resa"
            description="Flytta in i ditt nya boende och njut av att utforska en ny plats!"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={faqs} title="Vanliga frågor" />

      {/* Video Section */}
      <section className="mb-24 text-center">
        <h2 className="text-4xl font-semibold text-gray-900 mb-12">
          Så enkelt är det!
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
          Redo att börja ditt äventyr?
        </h2>
        <p className="text-lg mb-8">
          Skapa ett konto idag och upptäck hur enkelt det är att resa och bo
          billigt, samtidigt som du skapar nya vänskapsband!
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
