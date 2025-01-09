import React, { useState, useEffect } from 'react';

const RadiationMeter = () => {
    const [value, setValue] = useState(0);  // Estado do medidor (valor de 0 a 100)

    useEffect(() => {
        // Intervalo de 5 minutos (300.000 ms)
        const duration = 300000;
        const stepTime = duration / 100;  // Tempo para cada incremento (em ms)

        const interval = setInterval(() => {
            setValue(prevValue => {
                if (prevValue < 100) {
                    return prevValue + 1;  // Incrementa o valor do medidor
                } else {
                    clearInterval(interval);  // Para o intervalo quando atingir 100
                    return prevValue;
                }
            });
        }, stepTime);

        return () => clearInterval(interval);  // Limpar o intervalo quando o componente for desmontado
    }, []);

    // Estilo da roda (medidor de radiação)
    const meterStyle = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        border: '5px solid #333',
        background: 'radial-gradient(circle, rgba(255,255,255,0.5) 30%, rgba(0,0,0,0.5) 80%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
    };

    // Estilo do taço
    const needleStyle = {
        width: '3px',
        height: '70px',
        backgroundColor: 'red',
        position: 'absolute',
        transformOrigin: 'bottom',
        transform: `rotate(${(value / 100) * 180 - 90}deg)`,  // Faz a rotação do taço
        transition: 'transform 0.1s ease-out',
    };

    // Estilo do texto
    const textStyle = {
        position: 'absolute',
        fontSize: '20px',
        color: '#333',
        fontWeight: 'bold',
    };

    return (
        <div style={meterStyle}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <div style={needleStyle}></div>
                <div style={textStyle}>{value}%</div>
            </div>
        </div>
    );
};

export default RadiationMeter;
