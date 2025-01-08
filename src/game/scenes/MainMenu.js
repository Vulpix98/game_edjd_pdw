import Phaser from 'phaser';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        // Carrega os recursos necessários, como imagens ou fontes
        this.load.image('logo', 'assets/logo.png'); // Exemplo: Logo do jogo
    }

    create() {
        // Adiciona o logo ao centro da tela
        this.add.image(this.scale.width / 2, 150, 'logo').setScale(0.5);

        // Adiciona o título ao menu
        this.add.text(this.scale.width / 2, 250, 'Bem-vindo ao Menu Principal', {
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5);

        // Cria o botão para iniciar o jogo
        const startButton = this.add.text(this.scale.width / 2, 350, 'Iniciar Jogo', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive();

        // Cria o botão para iniciar o modo de desenvolvimento
        const devButton = this.add.text(this.scale.width / 2, 400, 'Modo Dev', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive();

        // Evento de clique no botão para iniciar o jogo principal
        startButton.on('pointerdown', () => {
            this.scene.start('Cutscene'); // Substitua 'Game' pelo nome real da cena do jogo principal
        });

        // Evento de clique no botão para iniciar o modo de desenvolvimento
        devButton.on('pointerdown', () => {
            this.scene.start('GameDev'); // Substitua 'GameDev' pelo nome real da cena de desenvolvimento
        });
    }
}

export default MainMenu;
