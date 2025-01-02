import React, { createContext, useState, useContext, useEffect } from 'react';
import eventEmitter from '../EventEmitter';

const BarrasContext = createContext();

export const BarrasProvider = ({ children }) => {
  const [barrasState, setBarrasState] = useState({ vidaHeight: 100 });

  const updateBarras = (newState) => {
    setBarrasState((prev) => ({ ...prev, ...newState }));
  };

  useEffect(() => {
    const handleReduceLife = ({ amount }) => {
      setBarrasState((prev) => ({
        ...prev,
        vidaHeight: Math.max(0, prev.vidaHeight - amount), // Garante que não passe de 0
      }));
    };

    eventEmitter.on('reduce-life', handleReduceLife);

    return () => {
      eventEmitter.removeListener('reduce-life', handleReduceLife);
    };
  }, []);

  return (
    <BarrasContext.Provider value={{ barrasState, updateBarras }}>
      {children}
    </BarrasContext.Provider>
  );
};

export const useBarras = () => useContext(BarrasContext);

export default BarrasContext;
