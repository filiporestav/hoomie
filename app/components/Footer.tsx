import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="py-10 bg-gray-800 text-white">
      <div className="container mx-auto px-4 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">Hoomie</h4>
            <p>Byt din studentbostad och upptäck Sverige på ett nytt sätt.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Snabblänkar</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/annonser" className="hover:underline">
                  Utforska annonser
                </Link>
              </li>
              <li>
                <Link href="/hur-det-fungerar" className="hover:underline">
                  Så fungerar det
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:underline">
                  Kontakta oss
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Följ oss</h4>
            <div className="flex space-x-4 justify-center md:justify-start">
              {/* Add your social media links here */}
              <Link href="#" className="hover:underline">
                Facebook
              </Link>
              <Link href="#" className="hover:underline">
                Instagram
              </Link>
              <Link href="#" className="hover:underline">
                Twitter
              </Link>
            </div>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} Hoomie. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  );
}
