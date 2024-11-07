"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { Eye, MapPin, Heart, Users } from "lucide-react";

const AboutUs = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-8 text-gray-800">
      <div className="max-w-4xl mx-auto space-y-12 px-6 py-12 bg-white shadow-lg rounded-lg">
        {/* Hero Section */}
        <h1 className="text-5xl font-extrabold text-center text-indigo-700 mb-4">
          Om Hoomies
        </h1>
        <p className="text-lg text-center text-gray-600 leading-relaxed mb-6">
          Hoomies är här för att göra resandet tillgängligt och prisvärt för
          studenter. Genom att erbjuda en trygg plattform för hembyten kan
          studenter utforska världen och besöka andra universitetsstäder, allt
          utan att betala dyra boendekostnader.
        </p>

        {/* Content Sections */}
        {[
          {
            icon: <Eye className="text-indigo-600" />,
            title: "Varför finns Hoomies?",
            content: `Hoomies grundades för att möjliggöra meningsfulla resor för
              studenter som annars kanske inte skulle ha råd att resa. Genom att
              skapa en enkel och säker lösning för hembyten mellan studenter,
              vill vi öppna dörren för fler att uppleva nya miljöer, knyta nya
              kontakter och få en inblick i livet på andra studieorter.`,
          },
          {
            icon: <Heart className="text-indigo-600" />,
            title: "Våra värderingar och vägledande principer",
            content: `Vår grund är byggd på tre kärnvärderingar: säkerhet, gemenskap och
              hållbarhet. Dessa principer guidar oss i allt vi gör:`,
            list: [
              { label: "Säkerhet", description: "Vi strävar efter att skapa en trygg upplevelse för alla användare." },
              { label: "Gemenskap", description: "Att koppla samman människor från olika platser, vilket skapar äkta möten och vänskap." },
              { label: "Hållbarhet", description: "Resor som minskar miljöpåverkan genom att dela resurser och utrymmen." },
            ],
          },
          {
            icon: <MapPin className="text-indigo-600" />,
            title: "Vad gör oss unika?",
            content: `Till skillnad från andra boendeplattformar fokuserar Hoomies på
              att möjliggöra kortsiktiga, prisvärda och personliga hembyten för
              studenter. Vi har en verifieringsprocess som ökar säkerheten,
              vilket gör att du kan känna dig trygg när du delar ditt hem och
              reser till nya platser.`,
          },
          {
            icon: <Users className="text-indigo-600" />,
            title: "Varför Hoomies?",
            content: `Genom Hoomies kan studenter resa och få en autentisk
              boendeupplevelse utan att behöva betala för hotell eller hyra.
              Vårt mål är att studenter ska kunna resa och uppleva nya
              studieorter och kulturer på ett meningsfullt sätt, samtidigt som
              de skapar värdefulla nätverk och minnen för livet.`,
          },
        ].map(({ icon, title, content, list }, index) => (
          <Card key={index}>
            <CardHeader className="flex items-center space-x-2">
              {icon}
              <CardTitle className="text-3xl font-semibold text-indigo-600">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{content}</p>
              {list && (
                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                  {list.map((item, idx) => (
                    <li key={idx}>
                      <strong className="text-indigo-700">{item.label}:</strong> {item.description}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Team Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-center text-indigo-600 mb-4">Möt teamet</h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-6">
            {[
              {
                name: "Kolumbus Lindh",
                role: "Co-founder",
                imgSrc: "/kolumbus.jpg",
                description: `Kolumbus är en femteårsstudent i industriell ekonomi på KTH, med
                  en passion för att resa och upptäcka nya platser. Han brinner
                  för att göra resandet tillgängligt för alla.`,
                linkedin: "https://www.linkedin.com/in/kolumbuslindh/",
              },
              {
                name: "Filip Orestav",
                role: "Co-founder",
                imgSrc: "/filip.jpg",
                description: `Filip är en fjärdeårstudent i industriell ekonomi på KTH med
                  master i maskininlärning. Hans passion är att innovera,
                  effektivisera processer och att skapa värde för användare.`,
                linkedin: "https://www.linkedin.com/in/filip-orestav",
              },
            ].map(({ name, role, imgSrc, description, linkedin }, idx) => (
              <Card key={idx} className="flex flex-col items-center text-center p-4 shadow-lg">
                <Image src={imgSrc} width={200} height={200} alt={name} className="rounded-full mb-4" />
                <CardTitle className="text-xl font-semibold text-indigo-700">{name}</CardTitle>
                <p className="text-gray-600">{role}</p>
                <CardContent className="text-gray-700 mt-2">{description}</CardContent>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 mt-2 hover:underline">
                  <FaLinkedin className="text-indigo-600 w-6 h-6" />
                </a>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-indigo-600">Bli en del av Hoomies!</h2>
          <p className="text-gray-700 leading-relaxed">Utforska världen med trygghet och gemenskap genom Hoomies...</p>
          <Button variant="default" className="mt-4 px-6 py-2 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700" onClick={() => router.push("/skapa-konto")}>Gå med nu</Button>
        </section>

        <section className="text-center text-gray-600 py-8">
          <p className="text-xl font-semibold text-indigo-700 mb-2">Kontakta oss</p>
          <div className="flex justify-center items-center space-x-2">
            <AiOutlineMail className="text-indigo-600 w-6 h-6" />
            <a href="mailto:hoomies.verify@gmail.com" className="text-lg font-medium text-indigo-600 hover:text-indigo-800">hoomies.verify@gmail.com</a>
          </div>
        </section>
        <footer className="text-center text-gray-600">
          <p>&copy; 2024 Hoomies. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AboutUs;
