// src/scenes/MainMenu.jsx
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import Cutscene from './Game'; // Importe a classe Game
import GameDev from './GameDev'; // Importe a classe GameDev

const MainMenu = () => {
  // Criando uma referência para armazenar a instância do Phaser
  const gameRef = useRef(null);

  useEffect(() => {
    // Configuração inicial do Phaser com a cena do menu principal.
    const config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: window.innerWidth,
            height: window.innerHeight
        },
        scene: [],
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        pixelArt: true
    };

    // Cria a instância do Phaser e a armazena na referência
    gameRef.current = new Phaser.Game(config);

    return () => {
      // Limpeza: destrua a instância do Phaser quando o componente for desmontado
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []); // O array vazio garante que isso só aconteça na montagem inicial do componente

  // Função para iniciar a cena "Game"
  const startGame = () => {
    if (gameRef.current) {
      // Adiciona a cena "Game" dinamicamente
      gameRef.current.scene.add('game', Cutscene); // Adiciona a cena 'game' ao Phaser
      gameRef.current.scene.start('Cutscene'); // Inicia a cena 'game'

      // Destruir a cena atual (MainMenu) para que ela não apareça mais
      gameRef.current.scene.remove('mainMenu');
    }
  };

  const startGameDev = () => {
    if (gameRef.current) {
      // Adiciona a cena "Game" dinamicamente
      gameRef.current.scene.add('gamedev', GameDev); // Adiciona a cena 'game' ao Phaser
      gameRef.current.scene.start('GameDev'); // Inicia a cena 'game'

      // Destruir a cena atual (MainMenu) para que ela não apareça mais
      gameRef.current.scene.remove('mainMenu');
    }
  };

  // Use useEffect para adicionar o MainMenu como a primeira cena carregada
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.scene.add('mainMenu', {
        preload() {
          this.load.image('logo', 'assets/logo.png'); // Carregar um logo ou imagem, se necessário
        },
        create() {
          this.add.text(400, 200, 'Bem-vindo ao Menu Principal', {
            fontSize: '32px',
            fill: '#fff',
            align: 'center',
          }).setOrigin(0.5);
          
          const startButton = this.add.text(400, 300, 'Start Now', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 },
          }).setOrigin(0.5).setInteractive();

          const startDevButton = this.add.text(400, 350, 'Start Dev Now', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 },
          }).setOrigin(0.5).setInteractive();

          // Interação com o botão
          startButton.on('pointerdown', () => {
            startGame();
          });

          startDevButton.on('pointerdown', () => {
            startGameDev();
          });
        }
      });

      // Inicializa a cena 'mainMenu'
      gameRef.current.scene.start('mainMenu');
    }
  }, []); // Esse useEffect só roda uma vez após a montagem inicial

  return (
    <div>
      <div id="phaser-game-container" /> {/* O contêiner onde o Phaser será renderizado */}
    </div>
  );
};

export default MainMenu;
