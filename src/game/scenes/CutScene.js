import { Scene } from 'phaser';

// Cutscene Scene
export class CutScene extends Scene {
    constructor() {
        super({ key: 'CutScene' });
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
        this.load.image('title','/assets/GameDev/title.png');
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

        const reactorTileset = map.tilesets.find(tileset => tileset.name === 'reactor_explode');
        
        if (reactorTileset && reactorTileset.tileData) {
            layer6.forEachTile(tile => {
                // Verifique se o tile tem um índice válido
                if (tile.index !== -1) {
                    // Obtenha o id do tile
                    const tileId = tile.index - reactorTileset.firstgid;
        
                    // Verifique se o tileId existe no tileData
                    const tileData = reactorTileset.tileData[tileId];
                    if (tileData && tileData.animation) {
                        this.animateTileOnce(tile, tileData.animation);
                    }
                }
            });
        }

        // Configurar a câmera
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.scrollY = 0; // Posição inicial da câmera no topo

        // Animar a câmera para mover de cima para baixo
        this.tweens.add({
            targets: this.cameras.main,
            scrollY: map.heightInPixels - this.cameras.main.height, // Fim do movimento
            duration: 20000, // Duração da cutscene em milissegundos
            ease: 'Linear',
            onComplete: () => {
                // Adicionar a imagem do título no centro da tela
                const titleImage = this.add.image(
                    this.scale.width / 2, 
                    this.cameras.main.centerY + 750, // Ajuste a posição Y conforme necessário
                    'title'
                )
                .setOrigin(0.5) // Centralizar a imagem
                .setScale(2)
                .setAlpha(0);

                // Opcional: Adicionar um efeito de desaparecimento para o título após algum tempo
                this.tweens.add({
                    targets: titleImage,
                    scale: 2, // Escala para o tamanho desejado
                    alpha: 1, // Torna completamente visível
                    duration: 2000, // Duração da animação
                    ease: 'Quad.Out', // Efeito "bounce" na escala (opcional)
                    onComplete: () => {
                        // Opcional: Adicionar um efeito de desaparecimento após algum tempo
                        this.tweens.add({
                            targets: titleImage,
                            alpha: 0, // Tornar transparente
                            duration: 2000, // Tempo para desaparecer
                            delay: 3000, // Espera antes de iniciar o fade
                            onComplete: () => {
                                // Limpar os dados do mapa carregados
                                this.cache.tilemap.remove('map');

                                // Parar a cena 'Cutscene' e iniciar a 'GameDev'
                                this.scene.stop('Cutscene');
                                this.scene.start('Game');
                            }
                        });
                    }
                });
            }
        });
    }

    animateTileOnce(tile, animation) {
        setTimeout(() => { 
            let frame = 0;
            this.time.addEvent({
                delay: 1000,
                repeat: animation.length - 1,
                callback: () => {
                    tile.index = animation[frame].tileid + tile.tileset.firstgid;
                    frame++;
        
                    // Para a animação no último frame
                    if (frame >= animation.length) {
                        frame = animation.length - 1;
                        tile.index = animation[frame].tileid + tile.tileset.firstgid;
                    }
                }
            });
        }, 5000);
    }

    showCenteredText(textArray) {
        let yPosition = this.cameras.main.centerY; // Posição Y centralizada
        textArray.forEach((text, index) => {
            this.time.delayedCall(2000 * index, () => {
                const dialogueText = this.add.text(this.cameras.main.centerX, yPosition, text, {
                    font: '20px Arial',
                    fill: '#FF0000',
                    wordWrap: { width: 600 }
                }).setOrigin(0.5, 0.5); // Centraliza o texto em relação ao ponto (0, 0)

                // Opcional: Adicionar efeito de digitação
                this.typeText(dialogueText, text);
                yPosition += 50; // Ajusta a posição Y para o próximo texto
            });
        });
    }

    typeText(textObject, text) {
        let i = 0;
        this.time.addEvent({
            callback: () => {
                textObject.text += text[i];
                i++;
            },
            repeat: text.length - 1,
            delay: 50 // Velocidade do efeito de digitação
        });
    }
}

export default CutScene