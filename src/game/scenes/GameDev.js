import { Scene } from 'phaser';
import eventEmitter from '../EventEmitter';

// Game Scene
export class GameDev extends Scene {
    constructor() {
        super({ key: 'GameDev' });
    }

    preload() {
        // Carregar o mapa e o tileset
        this.load.tilemapTiledJSON('map', '/assets/GameDev/game.json');
        this.load.image('tiles', '/assets/GameDev/tileset.png');
        this.load.image('trees', '/assets/GameDev/trees.png');
        this.load.image('rocks', '/assets/GameDev/rocks.png');
        // Carregar o sprite do jogador
        this.load.spritesheet('player', './././public/assets/GameDev/walk.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        // Criar o mapa
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tileset', 'tiles');
        const trees = map.addTilesetImage('trees', 'trees');
        const rocks = map.addTilesetImage('rocks', 'rocks');

        // Criar e armazenar as camadas
        this.backgroundLayer = map.createLayer('Background', tileset, 0, 0);
        this.treeLayer = map.createLayer('Tree', trees, 0, 0);
        this.rockLayer = map.createLayer('Rock', rocks, 0, 0);

        this.backgroundLayer.setDepth(0);
        this.treeLayer.setDepth(1);
        this.rockLayer.setDepth(2);

        // Obter as camadas de hitboxes
        const treeHitboxLayer = map.getObjectLayer('Tree_Hitbox');
        const rockHitboxLayer = map.getObjectLayer('Rock_Hitbox');
        
        // Armazenar todas as hitboxes de recursos
        this.resources = [];

        // Criar hitboxes para cada árvore
        treeHitboxLayer.objects.forEach(obj => {
            const hitbox = this.add.rectangle(
                obj.x + obj.width / 2,
                obj.y + obj.height,
                obj.width,
                obj.height
            );
            this.physics.add.existing(hitbox, true);
            hitbox.setData('type', 'tree');  // Marcar como árvore
            hitbox.setData('tileX', map.worldToTileX(obj.x)); // Coordenadas do tile
            hitbox.setData('tileY', map.worldToTileY(obj.y));
            this.resources.push(hitbox);
            hitbox.setFillStyle(0x00ff00, 0.3); // Cor verde semitransparente
        });

        // Criar hitboxes para cada pedra
        rockHitboxLayer.objects.forEach(obj => {
            const hitbox = this.add.rectangle(
                obj.x + obj.width / 2,
                obj.y + obj.height / 2,
                obj.width,
                obj.height
            );
            this.physics.add.existing(hitbox, true);
            hitbox.setData('type', 'rock');  // Marcar como pedra
            hitbox.setData('tileX', map.worldToTileX(obj.x)); // Coordenadas do tile
            hitbox.setData('tileY', map.worldToTileY(obj.y));
            this.resources.push(hitbox);
            hitbox.setFillStyle(0xff0000, 0.3); // Cor vermelha semitransparente
        });

        // Criar o jogador com hitbox
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.body.setSize(16, 16).setOffset(8, 16);

        // Criar o NPC com hitbox
        this.npc = this.physics.add.sprite(200, 150, 'player');
        this.npc.body.setSize(16, 16).setOffset(8, 16);
        this.npc.setImmovable(true); // NPC não se move
        this.npc.setInteractive(); // Habilitar interatividade para o NPC
        this.npc.setData('type', 'npc'); // Tag para identificar o NPC

        // Adicionar colisão entre jogador e NPC
        this.physics.add.collider(this.player, this.npc);

        // Colidir o jogador com as hitboxes das árvores e pedras
        this.resources.forEach(resource => {
            this.physics.add.collider(this.player, resource);
        });

        // Adicionar controle de movimento para o jogador
        this.cursors = this.input.keyboard.createCursorKeys();

        // Configurando as teclas WASD
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Registra o ouvinte para o evento 'toggle-inventory' na cena
        this.events.on('toggle-inventory', () => {
            // console.log("Evento toggle-inventory recebido!");
            toggleInventory(); // Chama a função para alternar a visibilidade do inventário
        });

        // Captura da tecla 'E' para alternar o inventário
        this.input.keyboard.on('keydown-E', () => {
            // console.log('Tecla E pressionada!');
            eventEmitter.emit('toggle-inventory'); // Emite o evento para alternar o inventário
        });

        // Configurar o evento para o botão de ação (barra de espaço)
        this.input.keyboard.on('keydown-SPACE', this.collectResource, this);

        this.input.keyboard.on('keydown-SPACE', () => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                this.npc.x, this.npc.y
            );

            if (distance < 50) { // Distância para interação
                this.interactWithNPC(this.npc);
            }
        });

        // Focar a câmera no jogador
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);  // Opcional: Ajuste do zoom da 

        // Para debug: exibir as hitboxes
        this.physics.world.drawDebug = true;
    }

    update() {
        // Controle de movimento do jogador
        this.player.setVelocity(0);
        if (this.cursors.left.isDown || this.keys.left.isDown) {
            this.player.setVelocityX(-100);
        } else if (this.cursors.right.isDown || this.keys.right.isDown) {
            this.player.setVelocityX(100);
        }
        if (this.cursors.up.isDown || this.keys.up.isDown) {
            this.player.setVelocityY(-100);
        } else if (this.cursors.down.isDown || this.keys.down.isDown) {
            this.player.setVelocityY(100);
        }
    }

    collectResource() {
        const collectDistance = 50;
        this.resources.forEach(resource => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                resource.x, resource.y
            );
    
            if (distance <= collectDistance && resource.active) {
                const tileX = resource.getData('tileX');
                const tileY = resource.getData('tileY');
                // console.log(`Resource type: ${resource.getData('type')}, TileX: ${tileX}, TileY: ${tileY}`);
    
                if (resource.getData('type') === 'tree') {
                    // Remover ou substituir os tiles da árvore (3x4 tiles)
                    for (let dx = 0; dx < 3; dx++) {  // 3 tiles de largura
                        for (let dy = 0; dy < 4; dy++) {  // 4 tiles de altura
                            const currentTileX = tileX + dx;
                            const currentTileY = tileY + dy;
                            const tile = this.treeLayer.getTileAt(currentTileX, currentTileY, true);
                            // console.log("Tree tile:", tile);
                            if (tile) {
                                this.treeLayer.putTileAt(-1, currentTileX, currentTileY);  // Substituir por "vazio"
                                // this.treeLayer.removeTileAt(currentTileX, currentTileY, true, true);
                            }
                        }
                    }
                } else if (resource.getData('type') === 'rock') {
                    // Remover ou substituir os tiles da pedra (2x2 tiles)
                    for (let dx = 0; dx < 2; dx++) {  // 2 tiles de largura
                        for (let dy = 0; dy < 2; dy++) {  // 2 tiles de altura
                            const currentTileX = tileX + dx;
                            const currentTileY = tileY + dy;
                            const tile = this.rockLayer.getTileAt(currentTileX, currentTileY, true);
                            // console.log("Rock tile:", tile);
                            if (tile) {
                                this.rockLayer.putTileAt(-1, currentTileX, currentTileY);  // Substituir por "vazio"
                                // this.rockLayer.removeTileAt(currentTileX, currentTileY, true, true);
                            }
                        }
                    }
                }

                const type = resource.getData('type'); // Tipo do recurso (ex.: 'tree' ou 'rock')
                const randomQuantity = Math.floor(Math.random() * 4) + 1; // Quantidade aleatória de 1 a 4

                resource.destroy(); // Remove o recurso do mapa

                // Modificar o tipo do recurso, se necessário
                let modifiedType = type;

                if (type === 'tree') {
                    modifiedType = 'wood'; // Alterando o tipo de 'tree' para 'wood'
                } else if (type === 'rock') {
                    modifiedType = 'stone'; // Alterando o tipo de 'rock' para 'stone'
                }


                // Atualiza o inventário enviando o recurso coletado
                eventEmitter.emit('add-to-inventory', { type: modifiedType, quantity: randomQuantity });
            }
        });
    }

    interactWithNPC(npc) {
        // Função para lidar com a interação com o NPC
        console.log(`Interagindo com o NPC! Tipo: ${npc.getData('type')}`);
        // Adicione aqui a lógica para diálogo, missão ou outro evento
        eventEmitter.emit('npc-interaction', { message: 'Olá, jogador! Eu sou um NPC.' });
    }
}

export default GameDev