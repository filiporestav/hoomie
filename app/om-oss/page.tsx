"use client";
import React from "react";
import { useRouter } from "next/navigation";

const AboutUs = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-8 text-gray-800">
      <div className="max-w-4xl mx-auto space-y-8 px-6 py-12 bg-white shadow-lg rounded-lg">
        {/* Hero Section */}
        <h1 className="text-5xl font-extrabold text-center text-indigo-700 mb-4">
          Om Hoomies
        </h1>
        <p className="text-lg text-center text-gray-600 leading-relaxed mb-6">
          Hoomies gör resande mer tillgängligt för studenter genom att erbjuda
          ett säkert och prisvärt sätt att upptäcka nya platser. Vi kopplar
          samman studenter som vill byta hem under kortare perioder, och skapar
          nya möjligheter till minnesvärda upplevelser.
        </p>

        {/* Vision Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-indigo-600">Vår vision</h2>
          <p className="text-gray-700 leading-relaxed">
            På Hoomies tror vi på en värld där resande är en möjlighet för alla,
            oavsett ekonomi. Vi vill erbjuda en plattform där resenärer kan byta
            hem utan hinder och höga kostnader, skapa en gemenskap för de som
            söker äkta upplevelser och hållbart resande.
          </p>
        </section>

        {/* Roadmap Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-indigo-600">
            Vår resa framåt
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Hoomies står för friheten att utforska, ansluta, och skapa minnen.
            Genom åren strävar vi efter att:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <strong className="text-indigo-700">
                2024 - Utökad säkerhet:
              </strong>{" "}
              Implementera nya verifieringsverktyg och en mer omfattande
              försäkringsplan för att skapa trygghet för alla användare.
            </li>
            <li>
              <strong className="text-indigo-700">
                2025 - Fler destinationer:
              </strong>{" "}
              Expandera våra tjänster till fler länder och öppna upp för
              utbytesmöjligheter globalt.
            </li>
            <li>
              <strong className="text-indigo-700">
                2026 - En hållbar resa:
              </strong>{" "}
              Introducera klimatkompensation och hållbara resemöjligheter för en
              mer miljövänlig plattform.
            </li>
          </ul>
        </section>

        {/* Culture Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-indigo-600">Vår kultur</h2>
          <p className="text-gray-700 leading-relaxed">
            På Hoomies omfamnar vi ett samarbete byggt på gemenskap och tillit.
            Vi värdesätter:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <strong className="text-indigo-700">Öppenhet:</strong> Vi är
              transparenta i vår kommunikation och våra processer, vilket bygger
              förtroende mellan användare.
            </li>
            <li>
              <strong className="text-indigo-700">Innovation:</strong> Vi ser
              ständigt över hur vi kan förbättra våra tjänster och skapa
              mervärde för våra användare.
            </li>
            <li>
              <strong className="text-indigo-700">Gemenskap:</strong> Resande är
              personligt, och vi stöttar en gemenskap där människor kan mötas
              och dela sina upplevelser.
            </li>
          </ul>
        </section>

        {/* Values Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-indigo-600">
            Våra värderingar
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Vår mission är att ge studenter ett prisvärt och tryggt sätt att
            utforska nya platser och möta nya människor. Vi stödjer resenärer
            som värdesätter upplevelser framför materiella ting och hjälper dem
            att resa säkert och prisvärt.
          </p>
        </section>

        {/* Call to Action Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-indigo-600">
            Var med du också!
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Oavsett om du vill upptäcka Sverige eller ett annat land, så finns
            Hoomie här för att göra det möjligt. Gå med i vår gemenskap av
            nyfikna studenter och låt oss göra resandet tillgängligt för alla!
          </p>
          <div className="text-center">
            <button
              className="mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition duration-200"
              onClick={() => router.push("/skapa-konto")}
            >
              Bli en del av oss
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
