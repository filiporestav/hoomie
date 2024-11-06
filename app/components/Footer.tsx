import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-12 bg-white text-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Brand Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center mb-3">
              <Image
                src="/icon.ico"
                alt="Hoomie Logo"
                width={50}
                height={50}
                className="mr-2"
              />
              <span className="text-indigo-600 font-bold text-3xl">
                hoomies
              </span>
            </Link>
            <p className="text-sm max-w-xs">
              Byt hem, dela äventyr - upptäck Sverige tillsammans
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="text-center md:text-left">
            <h4 className="text-xl font-semibold mb-4">Snabblänkar</h4>
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

          {/* Follow Us Section */}
          <div className="text-center md:text-left">
            <h4 className="text-xl font-semibold mb-4">Följ oss</h4>
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
        </div>

        {/* Footer Bottom Text */}
        <p className="text-sm text-center mt-10">
          © {new Date().getFullYear()} Hoomies. Alla rättigheter förbehållna.
        </p>
      </div>
    </footer>
  );
}
