// Configuração inicial do Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let enemies;
let lastFired = 0;

function preload() {
    // Carregar os assets do jogo
    this.load.image('forest', 'assets/forest.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    // Adicionar o mapa
    this.add.image(400, 300, 'forest');

    // Adicionar o jogador
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);

    // Adicionar animações do jogador
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'player', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Adicionar inimigos
    enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 5,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    enemies.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Colisões entre o jogador e os inimigos
    this.physics.add.collider(player, enemies, hitEnemy, null, this);

    // Configuração das teclas de movimento
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Movimentação do jogador
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
    } else {
        player.setVelocityY(0);
    }

    // Lógica simples de IA dos inimigos
    Phaser.Actions.Call(enemies.getChildren(), function (enemy) {
        if (player.x < enemy.x) {
            enemy.setVelocityX(-50);
        } else if (player.x > enemy.x) {
            enemy.setVelocityX(50);
        }

        if (player.y < enemy.y) {
            enemy.setVelocityY(-50);
        } else if (player.y > enemy.y) {
            enemy.setVelocityY(50);
        }
    }, this);
}

function hitEnemy(player, enemy) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}
