"use client";

import React, { useState } from "react";
import AccountForm from "./profileData/account-form";
import AdsContainer from "./adsData/adsContainer";

interface ClientAccountProps {
  user: any;
}

export default function ClientAccount({ user }: ClientAccountProps) {
  const [activeTab, setActiveTab] = useState("Mina Annonser");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Min profil</h2>
        </div>
        <nav className="mt-6">
          <a
            href="#"
            className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200 ${
              activeTab === "Mina Annonser" ? "bg-gray-100 text-gray-700" : ""
            }`}
            onClick={() => setActiveTab("Mina annonser")}
          >
            Mina annonser
          </a>
          <a
            href="#"
            className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200 ${
              activeTab === "Användaruppgifter"
                ? "bg-gray-100 text-gray-700"
                : ""
            }`}
            onClick={() => setActiveTab("Användaruppgifter")}
          >
            Användaruppgifter
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto ">
        {activeTab === "Mina annonser" ? (
          <AdsContainer user={user} />
        ) : (
          <AccountForm user={user} />
        )}
      </div>
    </div>
  );
}
