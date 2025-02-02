// src/scenes/MainMenu.jsx
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainMenuScene from './Main'; // Certifique-se de ajustar o caminho
import CutScene from './CutScene';
import Game from './Game';
import GameOver from './GameOver';

const MainMenu = () => {
    const gameRef = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: window.innerWidth,
                height: window.innerHeight,
            },
            scene: [MainMenuScene, CutScene, Game, GameOver],
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                },
            },
            pixelArt: true,
        };

        gameRef.current = new Phaser.Game(config);

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
            }
        };
    }, []);

    return <div id="phaser-game-container" style={{ width: '100%', height: '100%' }} />;
};

export default MainMenu;
