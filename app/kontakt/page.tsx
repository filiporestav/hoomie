import React from "react";

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="py-8 bg-indigo-900 text-white text-center">
        <h1 className="text-4xl font-bold">Kontakta oss</h1>
        <p className="mt-2">Vi är här för att hjälpa dig!</p>
      </header>

      <main className="flex-grow container mx-auto px-4 py-10">
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Skicka oss ett meddelande</h2>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <input
                type="text"
                placeholder="Ditt namn"
                className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
              <input
                type="email"
                placeholder="Din e-post"
                className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
            <textarea
              placeholder="Ditt meddelande"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-4"
              rows={4}
              required
            ></textarea>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Skicka
            </button>
          </form>
        </section>

        <section className="mt-10">
          <h2 className="text-3xl font-bold mb-4">Kontaktinformation</h2>
          <p className="mb-2">
            <strong>Email:</strong> support@hoomie.se
          </p>
          <p className="mb-2">
            <strong>Telefon:</strong> +46 123 456 789
          </p>
          <p className="mb-2">
            <strong>Adress:</strong> Studentgatan 1, 12345 Stockholm, Sverige
          </p>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;