import React, { useState, useEffect } from 'react';
import eventEmitter from '../EventEmitter';

function Timer() {
    const [timeRemaining, setTimeRemaining] = useState(5); // 5 minutos em segundos (300 segundos)
    const [isTimerVisible, setIsTimerVisible] = useState(false);

    useEffect(() => {
        let timerId;

        // Inicia o timer apenas quando o timer está visível
        if (isTimerVisible) {
            timerId = setInterval(() => {
                setTimeRemaining(prevTime => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        clearInterval(timerId); // Para o timer quando chegar a 0
                        eventEmitter.emit('timer-ended'); // Emitir evento quando o tempo acabar
                        return 0;
                    }
                });
            }, 1000);
        }

        // Limpa o intervalo ao desmontar ou ao ocultar o timer
        return () => clearInterval(timerId);
    }, [isTimerVisible]); // Executa novamente quando `isTimerVisible` muda

    useEffect(() => {
        // Ouvir o evento para mostrar o timer
        const handleShowTimer = () => {
            setIsTimerVisible(true); // Torna o timer visível
        };

        // Registrar evento
        eventEmitter.on('show-timer', handleShowTimer);

        // Limpar o evento ao desmontar
        return () => {
            eventEmitter.removeListener('show-timer', handleShowTimer);
        };
    }, []);

    // Formatar o tempo para exibir minutos e segundos
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <div
            style={{
                display: isTimerVisible ? 'block' : 'none',
                position: 'fixed',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '32px',
                color: '#fff',
                fontWeight: 'bold',
                zIndex: 10,
            }}
        >
            Tempo: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
    );
}

export default Timer;
