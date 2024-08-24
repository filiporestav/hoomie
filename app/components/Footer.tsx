import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Footer Top */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold">Hemlo</h2>
            <p className="text-gray-200 mt-2">
              Byt semesterhus med svenskar, tryggt och enkelt.
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-400 pt-6 text-center md:text-left">
          <nav className="mb-4">
            <ul className="flex flex-col md:flex-row justify-center md:justify-start space-y-2 md:space-y-0 md:space-x-6">
              <li>
                <Link href="/privacy" className="hover:text-gray-200"></Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gray-200"></Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-200"></Link>
              </li>
            </ul>
          </nav>
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Hemlo. Alla rättigheter
            förbehållna.
          </p>
        </div>
      </div>
    </footer>
  );
}
