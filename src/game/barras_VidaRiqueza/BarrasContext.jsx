// BarrasContext.jsx
import React, { createContext, useState, useContext } from 'react';

const BarrasContext = createContext();

export const BarrasProvider = ({ children }) => {
  const [barrasState, setBarrasState] = useState({ x: 100, y: 100, size: 100, color: 0xff0000 });

  const updateBarras = (newState) => {
    setBarrasState((prev) => ({ ...prev, ...newState }));
  };

  return (
    <BarrasContext.Provider value={{ barrasState, updateBarras }}>
      {children}
    </BarrasContext.Provider>
  );
};

export const useBarras = () => useContext(BarrasContext);

export default BarrasContext;