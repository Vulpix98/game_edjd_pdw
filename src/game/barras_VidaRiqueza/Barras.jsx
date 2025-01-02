// Barras.jsx
import React, { useContext, useEffect, useState } from 'react';
import BarrasContext from './BarrasContext';
import './barras.css';

const Barras = () => {

    const { barrasState } = useContext(BarrasContext);

    return (
        <div className="barras">
            <div className="bVida" style={{'--vida-height': `${barrasState.vidaHeight}%`, /* Usando variável CSS*/ }}></div>
            <div className="bRiqueza"></div>
        </div>
    );
};

export default Barras;