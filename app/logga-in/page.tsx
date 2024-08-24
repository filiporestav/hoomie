import React from "react";

const LoginPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-amber-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-amber-600 mb-6">
          Logga in på ditt konto
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
              placeholder="Ange ditt lösenord"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Logga in
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Har du inget konto?{" "}
            <a
              href="/registrera"
              className="text-amber-600 hover:text-amber-500"
            >
              Skapa ett konto här
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
