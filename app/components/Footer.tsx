import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-10 bg-gray-800 text-white">
      <div className="container mx-auto px-4 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Image src="/icon.ico" width={100} height={100} alt="Hoomie Logo" />
            <h4 className="text-xl font-bold mb-2 mt-4">Hoomies</h4>
            <p className="text-center md:text-left">
              Byt hem, dela äventyr - upptäck Sverige tillsammans
            </p>
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
                <Link href="/om-oss" className="hover:underline">
                  Om oss
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
          <p className="text-sm text-center md:text-left mt-4 md:col-span-3">
            © {new Date().getFullYear()} Hoomies. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  );
}
