// app/ClientProvider.tsx
"use client";

import React, { useState, useEffect, createContext, useContext } from "react";

// Create a Context for client-only checks
const ClientContext = createContext(false);

export const useClient = () => useContext(ClientContext);

const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <ClientContext.Provider value={isClient}>
      {children}
    </ClientContext.Provider>
  );
};

export default ClientProvider;
