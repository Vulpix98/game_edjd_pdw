import { Scene } from 'phaser';
import eventEmitter from '../EventEmitter';

// Game Scene
export class GameDev extends Scene {
    constructor() {
        super({ key: 'GameDev' });

        // Variável para armazenar a mesa de crafting
        // uma vez que a 'craftingTable' só vai existir depois de a fazer(crafta)
        this.globalCraftingTable = Object;
        this.globalCraftingTable.x = 99999;
        this.globalCraftingTable.y = 99999;        

    }

    preload() {
        // Carregar o mapa e o tileset
        this.load.tilemapTiledJSON('map', '/assets/GameDev/game.json');
        this.load.image('tiles', '/assets/GameDev/tileset.png');
        this.load.image('trees', '/assets/GameDev/trees.png');
        this.load.image('rocks', '/assets/GameDev/rocks.png');
        this.load.image('clouds', '/assets/GameDev/clouds.png');
        this.load.image('buildings', '/assets/GameDev/nuclear_reactor.png');
        this.load.image('reactorExplode', '/assets/GameDev/reactor_explode.png');
        this.load.image('city', '/assets/GameDev/city.png');
        // Carregar o sprite do jogador
        this.load.image('crafting', './././public/assets/Textures/crafting.png');
        this.load.spritesheet('player', './././public/assets/GameDev/walk.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() { 
        // Criar o mapa
        const map = this.make.tilemap({ key: 'map' });

        const tileset = map.addTilesetImage('tileset', 'tiles');
        const trees = map.addTilesetImage('trees', 'trees');
        const rocks = map.addTilesetImage('rocks', 'rocks');

        const clouds = map.addTilesetImage('clouds', 'clouds');
        const buildings = map.addTilesetImage('nuclear_reactor', 'buildings');
        const reactorExplode = map.addTilesetImage('reactor_explode', 'reactorExplode');
        const city = map.addTilesetImage('city', 'city');

        // Criar e armazenar as camadas
        this.backgroundLayer = map.createLayer('Background', tileset, 0, 0);
        this.treeLayer = map.createLayer('Tree', trees, 0, 0);
        this.rockLayer = map.createLayer('Rock', rocks, 0, 0);

        const layer2 = map.createLayer('Clouds', clouds, 0, 0);
        const layer5 = map.createLayer('Buildings', buildings, 0, 0);
        const layer6 = map.createLayer('ReactorExplode', reactorExplode, 0, 0);
        const layer7 = map.createLayer('City', city, 0, 0);
        const layer8 = map.createLayer('DetailCity', city, 0, 0);

        // Organizar as camadas
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
            //hitbox.setFillStyle(0x00ff00, 0.3); // Cor verde semitransparente
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
            //hitbox.setFillStyle(0xff0000, 0.3); // Cor vermelha semitransparente
        });

        // Criar o jogador com hitbox
        this.player = this.physics.add.sprite(1216, 1250, 'player');
        this.player.body.setSize(16, 16).setOffset(8, 16);

          // Adicionar animações para o jogador (Cada linha tem animações separadas)
          this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });


        /*
        
        
        RESOLVER
        ESTA MERDA
        DO 
        NPC


        METER 
        NA MAQUINA
        
        */





        // Criar o NPC com hitbox
        this.npc = this.add.rectangle(1300, 1250, 64, 64, 0x00ff00, 0); // 0x00ff00 é a cor da hitbox (verde), 0 é a transparência
        this.physics.add.existing(this.npc, true);  // Adiciona a física, 'true' para tornar o retângulo imutável

        // Definir os dados do NPC, como o tipo 'npc'
        this.npc.setData('type', 'npc');

        // Tornar a hitbox interativa, se necessário (por exemplo, para cliques ou eventos de entrada)
        this.npc.setInteractive();

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
            right: Phaser.Input.Keyboard.KeyCodes.D,
            action: Phaser.Input.Keyboard.KeyCodes.SPACE,
            interact: Phaser.Input.Keyboard.KeyCodes.E
        });

        // display a hotbar
        eventEmitter.emit('show-hotbar');
        eventEmitter.emit('show-barras');

        // Registra o ouvinte para o evento 'toggle-inventory' na cena
        this.events.on('toggle-inventory', () => {
            toggleInventory();
        });

        // Captura da tecla 'E' para alternar o inventário
        this.input.keyboard.on('keydown-E', () => {
            eventEmitter.emit('toggle-inventory');
        });

        // Coletar Recursos !
        // Configurar o evento para o botão de ação (barra de espaço)
        this.input.keyboard.on('keydown-SPACE', this.collectResource, this);

        // interagir com NPC
        this.input.keyboard.on('keydown-SPACE', () => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                this.npc.x, this.npc.y
            );

            if (distance < 50) { // Distância para interação
                this.interactWithNPC(this.npc);
            }
        });

        eventEmitter.on('slotSelected', ({ slotIndex, item }) => {
            if (item != null) {
                this.interactWithSlot(slotIndex, item)            
            }
        });

        // Lógica de interação com a Mesa
        this.input.keyboard.on('keydown-SPACE', () => {
            
            // if (this.globalCraftingTable == null) {
            //     this.globalCraftingTable = Object;
            //     this.globalCraftingTable.x = 99999;
            //     this.globalCraftingTable.y = 99999;
            // }

            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                this.globalCraftingTable.x, this.globalCraftingTable.y
            );

            if (distance < 50) { // Distância para interação
                this.interactWithCraftingTable();
            }
        });
        

        // Criar a camada de borda
        const BordaRight = map.getObjectLayer('BordaRight');
        const BordaLeft = map.getObjectLayer('BordaLeft');
        const BordaTop = map.getObjectLayer('BordaTop');
        const BordaBottom = map.getObjectLayer('BordaBottom');

        // Função para criar hitboxes
        function criarBordaHitbox(x, y, largura, altura) {
            const bordaHitbox = this.add.zone(x, y);
            bordaHitbox.setSize(largura, altura);
            this.physics.world.enable(bordaHitbox);
            bordaHitbox.body.setImmovable(true);
            return bordaHitbox;
        }

        // Função para adicionar colisões com as bordas
        function adicionarColisaoBorda(bordaLayer) {
            if (bordaLayer && bordaLayer.objects) {
                bordaLayer.objects.forEach(obj => {
                    // Verifique se o objeto tem as propriedades necessárias (como x, y, width e height)
                    if (obj.x !== undefined && obj.y !== undefined && obj.width !== undefined && obj.height !== undefined) {
                        const bordaHitbox = criarBordaHitbox.call(this, obj.x + obj.width / 2, obj.y + obj.height / 2, obj.width, obj.height);
                        this.physics.add.collider(this.player, bordaHitbox);
                    }
                });
            }
        }

        // Adicionar colisões para cada camada de borda, se existir
        adicionarColisaoBorda.call(this, BordaRight);
        adicionarColisaoBorda.call(this, BordaLeft);
        adicionarColisaoBorda.call(this, BordaTop);
        adicionarColisaoBorda.call(this, BordaBottom);

        // Focar a câmera no jogador
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2);

        // Para debug: exibir as hitboxes
        //this.physics.world.drawDebug = true;
    }

    update() {
        this.player.setVelocity(0);
        
        let isMoving = false;

        // Movimentação horizontal
        if (this.cursors.left.isDown || this.keys.left.isDown) {
            this.player.setVelocityX(-100);
            isMoving = true;
            this.player.anims.play('walk-left', true); // Caminho para a esquerda
        } else if (this.cursors.right.isDown || this.keys.right.isDown) {
            this.player.setVelocityX(100);
            isMoving = true;
            this.player.anims.play('walk-right', true); // Caminho para a direita
        }
        
        // Movimentação vertical
        if (this.cursors.up.isDown || this.keys.up.isDown) {
            this.player.setVelocityY(-100);
            isMoving = true;
            this.player.anims.play('walk-up', true); // Caminho para cima
        } else if (this.cursors.down.isDown || this.keys.down.isDown) {
            this.player.setVelocityY(100);
            isMoving = true;
            this.player.anims.play('walk-down', true); // Caminho para baixo
        }

        // Se o jogador não estiver se movendo, para a animação
        if (!isMoving) {
            this.player.anims.stop();
            this.player.setFrame(1); // Fica na primeira imagem quando parado
        }

        this.checkCraftingTableDistance();
        this.checkNPCDistance();
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

                // Emitir evento para reduzir vida ao coletar recurso
                eventEmitter.emit('change-life', { amount: randomQuantity });
            }
        });
    } 

    interactWithNPC(npc) {
        // Função para lidar com a interação com o NPC
        console.log(`Interagindo com o NPC! Tipo: ${npc.getData('type')}`);
        eventEmitter.emit('npc-interaction', { type: npc.getData('type'), message: 'Olá, jogador! Eu sou um NPC.' });
    }

    checkNPCDistance() {
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
        if (distance > 100) {
            eventEmitter.emit('npc-close');
        }
    }

    interactWithSlot(slotIndex, item) {
        // console.log("Item recebido:", item); // Verifique sempre o valor de item

        this.input.keyboard.on('keydown-Q', () => {
            // Verificação robusta de que 'item' não é null ou undefined
            if (item != null && item.quantity != null ) { // item != null verifica null e undefined
                
                if (item.type === "crafting") {  
                    this.placeCrafting(item);

                    item = null;                    
                }                 
            } else {
                console.log("Item é inválido ou não tem quantity:", item); // Adiciona uma mensagem para debugar
            } 
        });

        
    }
    
    
    

    placeCrafting(item) {
        // Arredonda as coordenadas do jogador para o tile mais próximo na grade de 32x32
        const tileX = Math.floor(this.player.x / 32) * 32;
        const tileY = Math.floor(this.player.y / 32) * 32;
      
        // Define a posição relativa ao jogador (colocar a Crafting Table ao lado direito do jogador)
        let craftingX = tileX + 32;  // Move um tile para a direita
        let craftingY = tileY;
      
        // Adiciona o sprite da Crafting Table no tile ajustado
        this.globalCraftingTable = this.add.sprite(craftingX + 16, craftingY + 16, item.type);
        this.globalCraftingTable.setOrigin(0.5); // Centraliza o sprite no tile
        this.globalCraftingTable.setDisplaySize(32, 32); // Garante que o sprite tenha 32x32 pixels
      
        // Ajuste da hitbox do sprite
        this.globalCraftingTable.setSize(32, 32);  // Define a hitbox para o tamanho do sprite (32x32)
      
        // Habilita a física para o sprite da Crafting Table
        this.physics.world.enable(this.globalCraftingTable);
        this.physics.add.collider(this.player, this.globalCraftingTable);
      
        // Configurações de física (garantir que a Crafting Table fique fixa no lugar)
        this.globalCraftingTable.body.setImmovable(true);
      
        // Habilita a interação com o sprite da Crafting Table
        this.globalCraftingTable.setInteractive();
      
        // Atualiza a posição
        this.globalCraftingTable.x = craftingX;
        this.globalCraftingTable.y = craftingY;   
        

        // Emite o evento 'get-inventory' passando um callback
        eventEmitter.emit('get-inventory', (inventoryItems) => {
            eventEmitter.emit('update-inventory', [{ type: item.type, quantity: 1 }], inventoryItems);
        });

        // Emite o evento 'get-hotbar' passando um callback
        eventEmitter.emit('get-hotbar', (hotbarItems) => {
            eventEmitter.emit('update-hotbar', [{ type: item.type, quantity: 1 }], hotbarItems);
        });

    }
    
    checkCraftingTableDistance() {
        const distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.globalCraftingTable.x, this.globalCraftingTable.y
        );

        if (distance > 100) { // Distância para interação
            eventEmitter.emit('craftingTable-close');
        }
    }

    // Função para interagir com a Crafting Table
    interactWithCraftingTable() {
        console.log("Interagindo com a mesa de crafting...");
        eventEmitter.emit('craftingTable-interaction');
    }

    
}

export default GameDev