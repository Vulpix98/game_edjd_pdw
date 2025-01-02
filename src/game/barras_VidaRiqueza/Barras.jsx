// Barras.jsx
import React, { useContext, useEffect, useState } from 'react';
import BarrasContext from './BarrasContext';
import './barras.css';

const Barras = () => {

    const { barrasState } = useContext(BarrasContext);

    return (
        <div className="barras">
            <div className="bVida" style={{'--vida-height': `${barrasState.vidaHeight}px`, /* Usando variável CSS*/ }}></div>
            <div className="bRiqueza" style={{'--riqueza-height': `${barrasState.riquezaHeight}px`, /* Usando variável CSS*/ }}></div>
        </div>
    );
};

export default Barras;