// InventoryContext.jsx
import React, { createContext, useState } from 'react';

// Cria o contexto
export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  return (
    <InventoryContext.Provider value={{ isInventoryOpen, setIsInventoryOpen }}>
      {children}
    </InventoryContext.Provider>
  );
};


