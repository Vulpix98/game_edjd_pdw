// Barras.jsx
import React, { useState, useEffect, useContext } from 'react';
import eventEmitter from '../EventEmitter';
import { useBarras } from './BarrasContext'; // Usando o context para acessar as barras
import './barras.css';

const Barras = () => {
  const { barrasState } = useBarras(); // Obtém o estado das barras
  const [isBarrasVisible, setIsBarrasVisible] = useState(false); // Inicialmente, as barras estão ocultas

  useEffect(() => {
    // Ouvir o evento para mostrar as barras
    const handleShowBarras = () => {
      setIsBarrasVisible(true); // Torna as barras visíveis
    };

    // Registrar evento para mostrar as barras
    eventEmitter.on('show-barras', handleShowBarras);

    // Limpar o evento ao desmontar
    return () => {
      eventEmitter.removeListener('show-barras', handleShowBarras);
    };
  }, []);

  return (
    <div
      className="barras"
      style={{ display: isBarrasVisible ? 'inline-flex' : 'none' }} // Exibe as barras se isBarrasVisible for true
    >
      <div className="bVida" style={{'--vida-height': `${barrasState.vidaHeight}px`, /* Usando variável CSS*/ }}></div>
      <div className="bRiqueza" style={{'--riqueza-height': `${barrasState.riquezaHeight}px`, /* Usando variável CSS*/ }}></div>
    </div>
  );
};

export default Barras;
