import React, { useState, useEffect } from 'react';
import eventEmitter from '../EventEmitter';
import './Radiation.css';

const RadiationMeter = () => {
    const [value, setValue] = useState(0);  // Estado do medidor (valor de 0 a 100)
    const [isRadiationsVisible, setIsRadiationsVisible] = useState(false);

    useEffect(() => {
        // Intervalo de 5 minutos (300.000 ms)
        const duration = 300000;
        const stepTime = duration / 100;  // Tempo para cada incremento (em ms)
        let interval;

        if (isRadiationsVisible) {
            interval = setInterval(() => {
                setValue(prevValue => {
                    if (prevValue < 100) {
                        return prevValue + 1;  // Incrementa o valor do medidor
                    } else {
                        clearInterval(interval);  // Para o intervalo quando atingir 100
                        return prevValue;
                    }
                });
            }, stepTime);
        }
        
        return () => clearInterval(interval);  // Limpar o intervalo quando o componente for desmontado
    }, [isRadiationsVisible]);

    useEffect(() => {
        const handleRadiation = () => {
            setIsRadiationsVisible(true); 
        };

        eventEmitter.on('show-radiation', handleRadiation);

        return () => {
            eventEmitter.removeListener('show-radiation', handleRadiation);
        };
    }, []);

    return (
        <div className="meterStyle" style={{ display: isRadiationsVisible ? 'block' : 'none' }}>
            <div className="niveisCor"></div>
            <div className="circuloBranco"></div>
            <div className="meioCirculoBranco"></div>
            <div className="needleStyle" style={{'--rotate': `${(value / 100) * 180 - 90}deg`}}></div>
            <div className="centroRotacao"></div>
            <div className="textStyle">{value} Sv</div>
        </div>
    );
};

export default RadiationMeter;
