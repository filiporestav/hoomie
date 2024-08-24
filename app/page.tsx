import Image from "next/image";
import Link from "next/link";
import { FaSearch, FaInfoCircle } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header with Background Image */}
      <header
        className="w-full h-64 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/header-bg.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 w-full h-full flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-5xl font-bold mb-2">Välkommen till Hemlo</h1>
          <p className="text-lg">
            Byt ditt semesterhus och upptäck världen på ett nytt sätt
          </p>
          <p className="text-lg">
            Och det bästa av allt? Det är helt gratis att använda vår tjänst!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-10 text-center">
        <h2 className="text-4xl font-bold mb-6 text-amber-600">
          Byt ditt semesterhus enkelt med andra i Sverige
        </h2>
        <p className="text-lg mb-8 text-gray-700">
          Upptäck nya platser och spara pengar genom att byta hus med andra!
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/annonser"
            className="px-6 py-3 bg-amber-600 text-white rounded-md flex items-center space-x-2 hover:bg-amber-700 transition"
          >
            <FaSearch />
            <span>Bläddra bland annonser</span>
          </Link>
          <Link
            href="/hur-det-fungerar"
            className="px-6 py-3 bg-gray-200 text-amber-600 rounded-md flex items-center space-x-2 hover:bg-gray-300 transition"
          >
            <FaInfoCircle />
            <span>Så fungerar det</span>
          </Link>
        </div>
      </main>

      {/* Featured Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6 text-gray-800">
            Utvalda semesterhus
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Example of a featured house */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <Image
                src="/images/house1.jpg"
                alt="House 1"
                width={400}
                height={250}
                className="rounded-md"
              />
              <h4 className="text-2xl font-bold mt-4">Stuga i Skåne</h4>
              <p className="text-gray-600 mt-2">
                En charmig stuga mitt i naturen, perfekt för en avkopplande
                semester.
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <Image
                src="/images/house2.jpg"
                alt="House 2"
                width={400}
                height={250}
                className="rounded-md"
              />
              <h4 className="text-2xl font-bold mt-4">Villa i Stockholm</h4>
              <p className="text-gray-600 mt-2">
                En modern villa nära stadens puls, med alla bekvämligheter.
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <Image
                src="/images/house3.jpg"
                alt="House 3"
                width={400}
                height={250}
                className="rounded-md"
              />
              <h4 className="text-2xl font-bold mt-4">Sommarhus på Gotland</h4>
              <p className="text-gray-600 mt-2">
                Ett vackert sommarhus nära stranden, idealiskt för soliga dagar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
