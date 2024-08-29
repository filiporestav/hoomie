import Link from "next/link";
import { FaSearch, FaInfoCircle } from "react-icons/fa";
import { BsArrowRightCircle } from "react-icons/bs";
import ListingCard from "./components/ListingCard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header with Background Image */}
      <header
        className="w-full h-[70vh] bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/header-bg.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 w-full h-full flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-6xl font-bold mb-4">
            Välkommen till Semesterbyte
          </h1>
          <p className="text-2xl mb-6">
            Byt ditt semesterhus och upptäck världen på ett nytt sätt.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/annonser"
              className="px-8 py-4 bg-amber-600 text-white rounded-full flex items-center space-x-2 text-lg hover:bg-amber-700 transition"
            >
              <FaSearch />
              <span>Utforska annonser</span>
            </Link>
            <Link
              href="/hur-det-fungerar"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full flex items-center space-x-2 text-lg hover:bg-white hover:text-amber-600 transition"
            >
              <FaInfoCircle />
              <span>Så fungerar det</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            Hitta ditt nästa semesterhus
          </h2>
          <div className="flex justify-center mb-8">
            <input
              type="text"
              placeholder="Sök plats, t.ex. Stockholm, Gotland..."
              className="w-full max-w-3xl p-4 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
            <button className="px-6 py-4 bg-amber-600 text-white rounded-r-full hover:bg-amber-700 transition">
              <FaSearch />
            </button>
          </div>
          <Link href="/annonser" className="text-amber-600 hover:underline">
            <BsArrowRightCircle className="inline mr-2" /> Se alla annonser
          </Link>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6 text-gray-800">
            Utvalda semesterhus
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ListingCard
              id={1}
              imageSrc="/placeholder-image.jpg"
              title="Stuga i Skåne"
              location="Skåne, Sverige"
              availabilityWeeks={["30", "31", "32"]}
            />
            <ListingCard
              id={2}
              imageSrc="/placeholder-image.jpg"
              title="Villa i Stockholm"
              location="Stockholm, Sverige"
              availabilityWeeks={["28", "29", "30"]}
            />
            <ListingCard
              id={3}
              imageSrc="/placeholder-image.jpg"
              title="Lägenhet i Göteborg"
              location="Göteborg, Sverige"
              availabilityWeeks={["27", "28", "29"]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
