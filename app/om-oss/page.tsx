"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, MapPin, Heart, Users,  } from "lucide-react"; // Replacing icons with similar alternatives

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
          Hoomies gör resandet tillgängligt för studenter genom att erbjuda ett
          tryggt och prisvärt sätt att upptäcka nya platser. Vi kopplar samman
          studenter för hembyten och skapar möjligheter för minnesvärda
          upplevelser.
        </p>

        {/* Vision Section */}
        <Card>
          <CardHeader className="flex items-center space-x-2">
            <Eye className="text-indigo-600" />
            <CardTitle className="text-3xl font-semibold text-indigo-600">
              Vår vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Vi på Hoomies tror på en värld där resande är en möjlighet för
              alla, oavsett ekonomi. Genom vår plattform kan resenärer byta hem
              utan höga kostnader, vilket skapar en gemenskap för äkta
              upplevelser och hållbart resande.
            </p>
          </CardContent>
        </Card>

        {/* Roadmap Section */}
        <Card>
          <CardHeader className="flex items-center space-x-2">
            <MapPin className="text-indigo-600" />
            <CardTitle className="text-3xl font-semibold text-indigo-600">
              Vår resa framåt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Hoomies står för friheten att utforska, ansluta och skapa minnen.
              På vår resa strävar vi efter att:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong className="text-indigo-700">
                  2024 - Utökad säkerhet:
                </strong>{" "}
                Implementera fler verifieringsverktyg och en utökad
                försäkringsplan för ökad trygghet.
              </li>
              <li>
                <strong className="text-indigo-700">
                  2025 - Fler destinationer:
                </strong>{" "}
                Expandera till fler länder och skapa utbytesmöjligheter globalt.
              </li>
              <li>
                <strong className="text-indigo-700">
                  2026 - En hållbar resa:
                </strong>{" "}
                Introducera klimatkompensation och hållbara resemöjligheter för
                att minska vårt miljöavtryck.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Culture Section */}
        <Card>
          <CardHeader className="flex items-center space-x-2">
            <Heart className="text-indigo-600" />
            <CardTitle className="text-3xl font-semibold text-indigo-600">
              Vår kultur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              På Hoomies bygger vi på samarbete, gemenskap och tillit. Vi
              värdesätter:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong className="text-indigo-700">Öppenhet:</strong> En
                transparent kommunikation och process skapar förtroende mellan
                användare.
              </li>
              <li>
                <strong className="text-indigo-700">Innovation:</strong> Vi
                utvecklar ständigt våra tjänster för att förbättra
                användarupplevelsen.
              </li>
              <li>
                <strong className="text-indigo-700">Gemenskap:</strong> Resande
                är personligt, och vi stödjer en gemenskap där människor kan
                mötas och dela sina upplevelser.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Values Section */}
        <Card>
          <CardHeader className="flex items-center space-x-2">
            <Users className="text-indigo-600" />
            <CardTitle className="text-3xl font-semibold text-indigo-600">
              Våra värderingar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Vår mission är att ge studenter ett prisvärt och tryggt sätt att
              utforska världen och träffa nya människor. Vi stödjer resenärer
              som värdesätter upplevelser framför saker och hjälper dem att resa
              enkelt och tryggt. Tjänsten är byggd av två KTH studenter, Filip och Kolumbus,
              som båda brinner för att resa och upptäcka världen.
            </p>
          </CardContent>
        </Card>

        {/* Call to Action Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-indigo-600">
            Bli en del av Hoomies!
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Oavsett om du vill upptäcka Sverige eller världen, finns Hoomies här
            för att göra resandet tillgängligt för alla. Bli en del av vår
            gemenskap och låt oss tillsammans skapa hållbara och minnesvärda
            upplevelser!
          </p>
          <div className="text-center">
            <Button
              variant="default"
              className="mt-4 px-6 py-2 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition duration-200"
              onClick={() => router.push("/skapa-konto")}
            >
              Gå med nu
            </Button>
          </div>
          <section className="text-center text-gray-600">

            <p>Kontakta oss: hoomies.verify@gmail.com</p>
          </section>
        </section>
        <section className="text-center text-gray-600">
          <p>&copy; 2024 Hoomies. All rights reserved.</p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
