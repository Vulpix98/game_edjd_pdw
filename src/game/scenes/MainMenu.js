import Phaser from 'phaser';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        // Carregar o mapa e o tileset
        this.load.tilemapTiledJSON('map', '/assets/GameDev/cutscene.json');
        this.load.image('tiles', '/assets/GameDev/tileset.png');
        this.load.image('clouds', '/assets/GameDev/clouds.png');
        this.load.image('rocks', '/assets/GameDev/rocks.png');
        this.load.image('trees', '/assets/GameDev/trees.png');
        this.load.image('buildings', '/assets/GameDev/nuclear_reactor.png');
        this.load.image('reactorExplode', '/assets/GameDev/reactor_explode.png');
        this.load.image('city', '/assets/GameDev/city.png');
        this.load.image('normal_title','/assets/GameDev/normal_title.png');
        this.load.image('play_button','/assets/GameDev/play_button.png');
        this.load.image('dev_button','/assets/GameDev/dev_button.png');
    }

    create() {

        // Criar o mapa
        const map = this.make.tilemap({ key: 'map' });
        
        const tileset = map.addTilesetImage('tileset', 'tiles');
        const clouds = map.addTilesetImage('clouds', 'clouds');
        const rocks = map.addTilesetImage('rocks', 'rocks');
        const trees = map.addTilesetImage('trees', 'trees');
        const buildings = map.addTilesetImage('nuclear_reactor', 'buildings');
        const reactorExplode = map.addTilesetImage('reactor_explode', 'reactorExplode');
        const city = map.addTilesetImage('city', 'city');

        const layer = map.createLayer('Background', tileset, 0, 0);
        const layer2 = map.createLayer('Clouds', clouds, 0, 0);
        const layer3 = map.createLayer('Rocks', rocks, 0, 0);
        const layer4 = map.createLayer('Trees', trees, 0, 0);
        const layer5 = map.createLayer('Buildings', buildings, 0, 0);
        const layer6 = map.createLayer('ReactorExplode', reactorExplode, 0, 0);
        const layer7 = map.createLayer('City', city, 0, 0);
        const layer8 = map.createLayer('DetailCity', city, 0, 0);

        this.add.image(this.scale.width / 2, 200, 'normal_title').setScale(1.5);

        const playButton = this.add.image(this.scale.width / 2, 400, 'play_button').setScale(1);
        playButton.setInteractive();

        const devButton = this.add.image(this.scale.width / 2, 500, 'dev_button').setScale(1);
        devButton.setInteractive();

        playButton.on('pointerdown', () => {
            this.scene.start('CutScene');
        });

        devButton.on('pointerdown', () => {
            this.cache.tilemap.remove('map');

            this.scene.stop('MainMenu');
            this.scene.start('Game');
        });
    }
}

export default MainMenu;
