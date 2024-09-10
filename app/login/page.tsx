"use client";

import { login } from "./actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    setLoading(true);
    const result = await login(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
      router.push("/account");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-[url('/images/holiday-background.jpg')]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-80">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Välkommen tillbaka
        </h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            setError(null); // Reset error before submission
            await handleLogin(formData);
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Lösenord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-5 w-5 text-amber-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              disabled={loading} // Disable button when loading
            >
              Logga in
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Har du inget konto?{" "}
              <a
                href="/register"
                className="font-medium text-amber-600 hover:text-amber-500"
              >
                Skapa ett konto
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
