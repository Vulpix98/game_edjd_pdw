import React, { createContext, useState, useContext, useEffect } from 'react';
import eventEmitter from '../EventEmitter';

const BarrasContext = createContext();

export const BarrasProvider = ({ children }) => {
  const [barrasState, setBarrasState] = useState({ vidaHeight: 100, riquezaHeight: 100 });

  const updateBarras = (newState) => {
    setBarrasState((prev) => ({ ...prev, ...newState }));
  };

  useEffect(() => {
    const handleChangeLife = ({ amount }) => {
      setBarrasState((prev) => ({
        ...prev,
        vidaHeight: Math.max(0, prev.vidaHeight - amount), // Garante que não passe de 0
      }));
    };

    const handleChangeWealth = ({ amount }) => {
      setBarrasState((prev) => ({
        ...prev,
        riquezaHeight: Math.max(0, prev.riquezaHeight - amount), // Garante que não passe de 0
      }));
    };

    eventEmitter.on('change-life', handleChangeLife);
    eventEmitter.on('change-wealth', handleChangeWealth);

    return () => {
      eventEmitter.removeListener('change-life', handleChangeLife);
      eventEmitter.removeListener('change-wealth', handleChangeWealth);
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
