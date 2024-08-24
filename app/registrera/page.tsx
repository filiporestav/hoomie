import React from "react";

const RegisterPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-amber-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-amber-600 mb-6">
          Skapa ett konto
        </h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Ange din email"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Användarnamn
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Ange ett användarnamn"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Lösenord
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Ange ett lösenord"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Skapa konto
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Har du redan ett konto?{" "}
            <a href="/logga-in" className="text-amber-600 hover:text-amber-500">
              Logga in här
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
