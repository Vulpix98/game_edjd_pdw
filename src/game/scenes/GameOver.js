import Phaser from 'phaser';

export class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    preload() {
    }

    create() {
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Game Over', {
            fontSize: '64px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);
    }
}

export default GameOver;
