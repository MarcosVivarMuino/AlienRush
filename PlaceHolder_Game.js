var MainGame = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function() {
        Phaser.Scene.call(this, { "key": "MainGame" });
    },

    init: function() {},

    preload: function() {
        // Pantalla de carga
        this.add.image(900, 500, 'fondoCarga');

        var percentText = this.make.text({
            x: 1720,
            y: 960,
            text: '0%',
            style: {
                fontSize: 70,
                fill: '#ffffff',
                fontFamily: 'Impact, fantasy'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            console.log(value);
            percentText.setText(parseInt(value * 100) + '%');
        });
                    
        this.load.on('fileprogress', function (file) {
            console.log(file.src);
        });
        this.load.on('complete', function () {
            console.log('complete');
            percentText.destroy();
        });

        // Archivos
        this.load.image('sky','assets/Background/fondo.png');
        // Terreno
        this.load.image('sueloP1','assets/Terreno/p1_z1.png');
        this.load.image('sueloHierba','assets/Terreno/p2_z1.png');
        this.load.image('sueloP4','assets/Terreno/p4_z1.png');
        this.load.image('sueloB2','assets/Terreno/b2_z1.png');
        this.load.image('sueloM1','assets/Terreno/m1_z1.png');
        this.load.image('sueloM2','assets/Terreno/m1_z5.png');
        this.load.image('sueloP3','assets/Terreno/p3_z1.png');
        this.load.image('suelo3','assets/Terreno/3.png');
        this.load.image('suelo2','assets/Terreno/2.png');
        this.load.image('suelo1','assets/Terreno/1.png');
        this.load.image('suelo4','assets/Terreno/4y13.png');
        this.load.image('suelo5','assets/Terreno/5y14.png');
        this.load.image('suelo6','assets/Terreno/6y15.png');
        this.load.image('suelo9','assets/Terreno/9.png');
        this.load.image('suelo10','assets/Terreno/10.png');
        this.load.image('suelo11','assets/Terreno/11.png');
        this.load.image('suelo12','assets/Terreno/12.png');
        this.load.image('suelo18','assets/Terreno/18.png');
        this.load.image('suelo19','assets/Terreno/19.png');
        this.load.image('suelo20','assets/Terreno/20.png');
        this.load.image('pared','assets/Terreno/pared.png');
        this.load.image('hierba1','assets/Terreno/hierbas2.png');
        this.load.image('hierba2','assets/Terreno/hierbas3.png');
        this.load.image('hierba3','assets/Terreno/hierbas9.png');
        // Partida
        this.load.spritesheet('coin', 'assets/Partida/coin.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('wall','assets/Partida/paredRompible.png');
        this.load.image('circuloPU', 'assets/Interfaz/CirculoPU.png');
        this.load.image('snowball', 'assets/Interfaz/BoladehieloPU.png');
        this.load.image('electricBall', 'assets/Interfaz/RayoParalizantePU.png');
        this.load.image('potion', 'assets/Interfaz/PocionHittPU.png');
        this.load.image('battery', 'assets/Interfaz/BateriaPU.png');
        this.load.image('boots', 'assets/Interfaz/BotasSaltarinasPU.png');
        this.load.spritesheet('Hitt', 'assets/Partida/SpriteSheetHitt.png', { frameWidth: 315.5, frameHeight: 441 });
        this.load.spritesheet('Ufo', 'assets/Partida/spritesheetUFO.png', { frameWidth: 420, frameHeight: 380 });
        this.load.image('pincho1', 'assets/Partida/pincho1.png');
        this.load.image('pincho2', 'assets/Partida/pincho2.png');
        this.load.image('portal', 'assets/Partida/portal.png');
        this.load.image('PSalto', 'assets/Partida/salto.png');
        this.load.image('llave', 'assets/Partida/llave.png');
        this.load.image('muroLlave', 'assets/Partida/puertaLlave.png');
        this.load.image('agua', 'assets/Partida/agua.png');
        this.load.image('lava', 'assets/Partida/lava.png');
        this.load.image('PowerUp', 'assets/Partida/powerUp.png');
        this.load.image('medidorUfo', 'assets/Interfaz/medidorPuntosUfo.png');
        this.load.image('medidorHitt', 'assets/Interfaz/medidorPuntosHitt.png');
        //Sonidos 
        this.load.audio('Acoin', 'assets/Sonidos/cogerMoneda.mp3');
        this.load.audio('APU', 'assets/Sonidos/cogerPowerUp.mp3');
        this.load.audio('tirarPU', 'assets/Sonidos/tirarPowerUp.mp3');
        this.load.audio('victory', 'assets/Sonidos/victoria.mp3');
        this.load.audio('BGMusic', 'assets/MUSICAS/cancionJuego.mp3');
    },

    create: function() {
    ///////////////////////////////////////////////////////////////INSTANCIACION////////////////////////////////////////////////////////////////////
        coins = []; // Crea el grupo de monedas
        PowerUps= [];
        breakW = [];
        pinchos = [];
        PSaltos = [];
        paused = false;

        this.physics.world.bounds.width = 8544; // Limite al tamaño del mundo
        this.physics.world.bounds.height = 1000;
        this.cameras.main.setBounds(0, 0,8530,1000); // Define los limites de la camara
        
        this.add.image(1062, 590, 'sky').setScale(1).setOrigin(0.125,0.59); // Creacion del fondo

        platforms = this.physics.add.staticGroup(); // Definicion del grupo platforms
        // Definicion Zona 1
        platforms.create(135, 960, 'suelo1');
        platforms.create(650, 960, 'sueloP4');
        platforms.create(370, 925, 'suelo2').setScale(1,1.1);
        platforms.create(1859, 960, 'sueloP4');
        platforms.create(1089, 960, 'suelo3').setScale(1.2,1);
        platforms.create(840, 690, 'sueloP4').setScale(0.9,1);
        platforms.create(1100, 560, 'sueloB2');
        platforms.create(770, 400, 'sueloP3');
        platforms.create(417, 350, 'sueloHierba');
        platforms.create(140, 250, 'sueloP1');
        platforms.create(1300, 330, 'sueloM1');
        platforms.create(180, 600, 'sueloB2');
        // Definicion Zona 2
        platforms.create(1765, 920, 'suelo4');
        platforms.create(1859, 875, 'suelo5');
        platforms.create(2144, 960, 'suelo6');
        platforms.create(2429, 875, 'suelo5').setFlipX(true);
        platforms.create(2523, 920, 'suelo4').setFlipX(true);
        platforms.create(3085, 960, 'suelo9').setScale(0.9,1);
        platforms.create(1440, 600, 'sueloP3');
        platforms.create(1840, 450, 'sueloP3');
        platforms.create(2440, 450, 'sueloP3');
        platforms.create(2840, 590, 'sueloP4').setScale(0.9,1);
        platforms.create(2600, 550, 'sueloB2');
        platforms.create(3320, 600, 'sueloP3');
        platforms.create(3200, 330, 'sueloM1');
        // Definicion Zona 3
        platforms.create(3650, 890, 'suelo10');
        platforms.create(4172, 960, 'suelo11');
        platforms.create(3907, 250, 'sueloP1');
        platforms.create(3624, 250, 'sueloP1');
        platforms.create(4096, 335, 'sueloM2');
        platforms.create(4096, 490, 'sueloM2');
        platforms.create(4050, 570, 'sueloP3');
        platforms.create(4550, 582, 'sueloM1').setScale(1,1);
        platforms.create(4410, 770, 'sueloP3');
        // Definicion Zona 4
        platforms.create(5073, 959, 'suelo12');
        platforms.create(5595, 920, 'suelo4');
        platforms.create(5689, 875, 'suelo5');
        platforms.create(5974, 960, 'suelo6');
        platforms.create(6259, 875, 'suelo5').setFlipX(true);
        platforms.create(6353, 920, 'suelo4').setFlipX(true);
        platforms.create(6592, 960, 'suelo18');
        platforms.create(4690, 285, 'sueloP4');
        platforms.create(4890, 285, 'sueloP4');
        platforms.create(5686, 285, 'sueloP4');
        platforms.create(5354, 470, 'sueloM2');
        platforms.create(5354, 370, 'sueloM2');
        platforms.create(6000, 285, 'sueloP4');
        platforms.create(5500, 285, 'sueloP4');
        platforms.create(6350, 285, 'sueloP4');
        platforms.create(4965, 605, 'sueloP4')
        platforms.create(5300, 605, 'sueloP4')
        platforms.create(5800, 610, 'sueloB2');
        platforms.create(6100, 610, 'sueloB2');
        // Definicion Zona 5
        platforms.create(6924, 879, 'suelo19');
        platforms.create(7735, 960, 'suelo20');
        platforms.create(8444, 500, 'pared').setScale(1.5,1);
        platforms.create(7550, 30, 'suelo20').setFlipY(true).setScale(0.8,1);
        platforms.create(6980, 125, 'sueloM2');
        platforms.create(7050, 500, 'sueloP4');
        platforms.create(8038, 125, 'sueloM2');
        platforms.create(7287, 415, 'suelo5').setFlipX(true);
        platforms.create(7193, 460, 'suelo4');
        platforms.create(7430, 331, 'sueloP4');
        platforms.create(7771, 415, 'sueloM2');
        platforms.create(7630, 331, 'sueloP4');
        platforms.create(8038, 600, 'sueloM2');
        platforms.create(7802, 720, 'sueloP4');
        platforms.create(7250, 720, 'sueloP4');
        // Instanciacion de las monedas
        // Monedas Zona 1
        coins[0]=this.physics.add.sprite(615, 800, 'coin').setScale(2); 
        coins[1]=this.physics.add.sprite(370, 770, 'coin').setScale(2);
        coins[2]=this.physics.add.sprite(885, 890, 'coin').setScale(2);
        coins[3]=this.physics.add.sprite(1185, 890, 'coin').setScale(2);
        coins[4]=this.physics.add.sprite(835, 590, 'coin').setScale(2);
        coins[5]=this.physics.add.sprite(1095, 490, 'coin').setScale(2);
        coins[6]=this.physics.add.sprite(770, 320, 'coin').setScale(2);
        coins[7]=this.physics.add.sprite(420, 260, 'coin').setScale(2);
        coins[8]=this.physics.add.staticSprite(2910, 780, 'coin').setScale(2);
        coins[9]=this.physics.add.staticSprite(2910, 480, 'coin').setScale(2);
        coins[10]=this.physics.add.staticSprite(2150, 580, 'coin').setScale(2);
        coins[11]=this.physics.add.staticSprite(1450, 850, 'coin').setScale(2);
        coins[12]=this.physics.add.staticSprite(1450, 480, 'coin').setScale(2);
        coins[13]=this.physics.add.staticSprite(3350, 430, 'coin').setScale(2);
        coins[14]=this.physics.add.staticSprite(3650, 650, 'coin').setScale(2);
        coins[15]=this.physics.add.staticSprite(3790, 140, 'coin').setScale(2);
        coins[16]=this.physics.add.staticSprite(4200, 840, 'coin').setScale(2);
        coins[17]=this.physics.add.staticSprite(5000, 170, 'coin').setScale(2);
        coins[18]=this.physics.add.staticSprite(5500, 120, 'coin').setScale(2);
        coins[19]=this.physics.add.staticSprite(4850, 500, 'coin').setScale(2);
        coins[20]=this.physics.add.staticSprite(5450, 500, 'coin').setScale(2);
        coins[21]=this.physics.add.staticSprite(5800, 120, 'coin').setScale(2);
        coins[22]=this.physics.add.staticSprite(6600, 120, 'coin').setScale(2);
        coins[23]=this.physics.add.staticSprite(6600, 720, 'coin').setScale(2);
        coins[24]=this.physics.add.staticSprite(7200, 620, 'coin').setScale(2);
        coins[25]=this.physics.add.staticSprite(7200, 320, 'coin').setScale(2);
        coins[26]=this.physics.add.staticSprite(7900, 620, 'coin').setScale(2);
        coins[27]=this.physics.add.staticSprite(7750, 230, 'coin').setScale(2);

        //Instanciacion de los PowerUps
        // Power Ups Zona 1
        PowerUps[0]=this.physics.add.staticSprite(150, 100, 'PowerUp').setScale(1.5);
        PowerUps[1]=this.physics.add.staticSprite(180, 500, 'PowerUp').setScale(1.5);
        PowerUps[2]=this.physics.add.staticSprite(2400, 350, 'PowerUp').setScale(1.5);
        PowerUps[3]=this.physics.add.staticSprite(4000, 475, 'PowerUp').setScale(1.5);
        PowerUps[4]=this.physics.add.staticSprite(4600, 175, 'PowerUp').setScale(1.5);
        PowerUps[5]=this.physics.add.staticSprite(5030, 775, 'PowerUp').setScale(1.5);
        PowerUps[6]=this.physics.add.staticSprite(6300, 120, 'PowerUp').setScale(1.5);
        PowerUps[7]=this.physics.add.staticSprite(7070, 130, 'PowerUp').setScale(1.5);
        PowerUps[8]=this.physics.add.staticSprite(7170, 830, 'PowerUp').setScale(1.5);

        // Instanciacion de los jugadores
        player1 = this.physics.add.sprite(800, 130, 'Hitt').setScale(0.3); // Creacion del jugador 1(cursors)
        player1.tipoPU = -1;
        player1.canDoubleJump = false
        player1.vel = 250;
        player1.numJump = 0;
        player1.fuerza = 8;
        player1.score = 0;
        player1.setGravityY(100);

        player1.setBounce(0.2); // Limites del jugador
        player1.setCollideWorldBounds(true);

        player2 = this.physics.add.sprite(400, 720, 'Ufo').setScale(0.3); // Creacion del jugador 2 (WASD) 
        player2.tipoPU = -1;
        player2.canDoubleJump = false
        player2.vel = 300;
        player2.numJump = 0;
        player2.fuerza = 5;
        player2.score = 0;
        player2.setGravityY(100);

        player2.setBounce(0.2);// Limites del jugador
        player2.setCollideWorldBounds(true);

        // Instanciacion Interactuables
        breakW[0] = this.physics.add.staticImage(1300, 793, 'wall').setScale(1, 0.9);
        breakW[1] = this.physics.add.staticImage(2500, 280, 'wall').setScale(1, 0.9);
        breakW[2] = this.physics.add.staticImage(4100, 765, 'wall').setScale(1, 1.1);
        breakW[3] = this.physics.add.staticImage(4100, 68, 'wall').setScale(1);
        breakW[4] = this.physics.add.staticImage(6100, 88, 'wall').setScale(1, 1.1);
        breakW[5] = this.physics.add.staticImage(6500, 88, 'wall').setScale(1, 1.1);
        breakW[6] = this.physics.add.staticImage(8038, 825, 'wall').setScale(1,0.7);
        breakW[7] = this.physics.add.staticImage(3200, 790, 'wall').setScale(1,0.9);
        for(let i = 0; i<breakW.length;i++){
            breakW[i].dureza=80;
            breakW[i].tocado = false;
        }

        portal = this.physics.add.staticImage(8350, 840, 'portal').setScale(1);
        llave = this.physics.add.staticSprite(3990, 870, 'llave').setScale(2);
        muroLlave = this.physics.add.staticSprite(3600, 70, 'muroLlave');
        agua = this.physics.add.staticSprite(2145, 870, 'agua');
        lava = this.physics.add.staticSprite(5975, 870, 'lava').setScale(1.02,1);
        PSaltos[0] = this.physics.add.staticImage(3340, 545, 'PSalto').setScale(1.5);
        PSaltos[1] = this.physics.add.staticImage(4405, 715, 'PSalto').setScale(1.5);
        PSaltos[2] = this.physics.add.staticImage(5500, 230, 'PSalto').setScale(1.5);
        PSaltos[3] = this.physics.add.staticImage(5800, 230, 'PSalto').setScale(1.5);
        // Instanciacion sonidos
         Acoin = this.sound.add('Acoin',{volume: 0.3});
         APoU = this.sound.add('APU', {volume: 0.5});
         tirarPU = this.sound.add('tirarPU', {volume: 0.5});
         victory = this.sound.add('victory', {volume: 0.5});
         backgroundMusic = this.sound.add('BGMusic', {volume: 0.3});
         backgroundMusic.loop = true;
         backgroundMusic.play();
        // Pinchos
        pinchos[0] = this.physics.add.staticImage(106, 598, 'pincho1').setScale(1.3).setFlipX(true);
        pinchos[1] = this.physics.add.staticImage(255, 598, 'pincho1').setScale(1.3).setFlipX(false);
        pinchos[2] = this.physics.add.staticImage(1226, 640, 'pincho1').setScale(1.3).setFlipX(true);
        pinchos[3] = this.physics.add.staticImage(1226, 580, 'pincho1').setScale(1.3).setFlipX(true);
        pinchos[4] = this.physics.add.staticImage(1226, 520, 'pincho1').setScale(1.3).setFlipX(true);
        pinchos[5] = this.physics.add.staticImage(1226, 460, 'pincho1').setScale(1.3).setFlipX(true);
        pinchos[6] = this.physics.add.staticImage(2880, 892, 'pincho2').setScale(1.3);
        pinchos[7] = this.physics.add.staticImage(2930, 892, 'pincho2').setScale(1.3);
        pinchos[8] = this.physics.add.staticImage(2880, 660, 'pincho2').setScale(1.3).setFlipY(true);
        pinchos[9] = this.physics.add.staticImage(2930, 660, 'pincho2').setScale(1.3).setFlipY(true);
        pinchos[10] = this.physics.add.staticImage(3772, 890, 'pincho1').setScale(1.3);
        pinchos[11] = this.physics.add.staticImage(3772, 830, 'pincho1').setScale(1.3);
        pinchos[12] = this.physics.add.staticImage(3772, 770, 'pincho1').setScale(1.3);
        pinchos[13] = this.physics.add.staticImage(4800, 215, 'pincho2').setScale(1.3);
        pinchos[14] = this.physics.add.staticImage(4740, 215, 'pincho2').setScale(1.3);
        pinchos[15] = this.physics.add.staticImage(4860, 215, 'pincho2').setScale(1.3);
        pinchos[16] = this.physics.add.staticImage(5000, 890, 'pincho2').setScale(1.3);
        pinchos[17] = this.physics.add.staticImage(5060, 890, 'pincho2').setScale(1.3);
        pinchos[18] = this.physics.add.staticImage(5060, 675, 'pincho2').setScale(1.3).setFlipY(true);
        pinchos[19] = this.physics.add.staticImage(5000, 675, 'pincho2').setScale(1.3).setFlipY(true);
        pinchos[20] = this.physics.add.staticImage(7500, 262, 'pincho2').setScale(1.3);
        pinchos[21] = this.physics.add.staticImage(7560, 262, 'pincho2').setScale(1.3);
        pinchos[22] = this.physics.add.staticImage(7500, 892, 'pincho2').setScale(1.3);
        pinchos[23] = this.physics.add.staticImage(7560, 892, 'pincho2').setScale(1.3);
        pinchos[24] = this.physics.add.staticImage(8038, 448, 'pincho2').setScale(1.3);
        pinchos[25] = this.physics.add.staticImage(5440, 30, 'pincho2').setScale(1.3).setFlipY(true);
        pinchos[26] = this.physics.add.staticImage(5500, 30, 'pincho2').setScale(1.3).setFlipY(true);
        pinchos[27] = this.physics.add.staticImage(5560, 30, 'pincho2').setScale(1.3).setFlipY(true);
        pinchos[28] = this.physics.add.staticImage(5740, 30, 'pincho2').setScale(1.3).setFlipY(true);
        pinchos[29] = this.physics.add.staticImage(5800, 30, 'pincho2').setScale(1.3).setFlipY(true);
        pinchos[30] = this.physics.add.staticImage(5860, 30, 'pincho2').setScale(1.3).setFlipY(true);
        pinchos[31] = this.physics.add.staticImage(7360, 510, 'pincho1').setScale(1.3);
        pinchos[32] = this.physics.add.staticImage(7696, 510, 'pincho1').setScale(1.3).setFlipX(true);
        pinchos[33] = this.physics.add.staticImage(8200, 892, 'pincho2').setScale(1.3);

        //Instanciacion decoracion
        // Escena 1
        this.add.image(850, 630, 'hierba1').setScale(1.3);
        this.add.image(400, 292, 'hierba2').setScale(1.3);
        this.add.image(1100, 510, 'hierba3').setScale(1.3);
        // Escena 2
        this.add.image(1600, 900, 'hierba1').setScale(1.3);
        this.add.image(2850, 530, 'hierba1').setScale(1.3);
        this.add.image(2700, 902, 'hierba2').setScale(1.3);
        this.add.image(1845, 398, 'hierba3').setScale(1.3);
        // Escena 3
        this.add.image(3455, 902, 'hierba2').setScale(1.3);
        this.add.image(3800, 192, 'hierba1').setScale(1.3);
        this.add.image(4600, 234, 'hierba3').setScale(1.3);
        // Escena 4
        this.add.image(5440, 900, 'hierba2').setScale(1.3);
        this.add.image(5800, 225, 'hierba2').setScale(1.3);
        this.add.image(5799, 558, 'hierba3').setScale(1.3);
        this.add.image(5100, 545, 'hierba1').setScale(1.3);
        this.add.image(6600, 902, 'hierba1').setScale(1.3);
        this.add.image(6350, 225, 'hierba1').setScale(1.3);
        // Escena 5
        this.add.image(7350, 272, 'hierba1').setScale(1.3);
        this.add.image(6950, 745, 'hierba3').setScale(1.3);
        this.add.image(7750, 660, 'hierba2').setScale(1.3);
        this.add.image(6980, 440, 'hierba2').setScale(1.3);

        // Instanciacion texto
        this.physics.add.staticImage(200, 130, 'medidorHitt').setScale(0.3).setScrollFactor(0);
        this.physics.add.staticImage(1600, 130, 'medidorUfo').setScale(0.3).setScrollFactor(0);
        scoreText1 = this.add.text(200, 85, '0', { fontSize: '70px', fill: '#ffffff',fontFamily: 'Impact, fantasy' }).setScrollFactor(0);
        scoreText2 = this.add.text(1500, 85, '0', { fontSize: '70px', fill: '#ffffff',fontFamily: 'Impact, fantasy' }).setScrollFactor(0);
        this.add.image(440, 120, 'circuloPU').setScale(0.2).setScrollFactor(0); // Instanciacion de los circulos PU
        this.add.image(1350, 120, 'circuloPU').setScale(0.2).setScrollFactor(0); 

//////////////////////////////////////////////////////////////////ANIMACIONES///////////////////////////////////////////////////////////////////////////
    // Carga la animacion de andar hacia la izquierda (Ufo)
    this.anims.create({
        key: 'leftUfo',
        frames: this.anims.generateFrameNumbers('Ufo', { start: 2, end: 3 }),
        frameRate: 4,
        repeat: -1
    });
    // Carga la animacion de darse la vuelta (Ufo)
    this.anims.create({
        key: 'turnUfo',
        frames: [ { key: 'Ufo', frame: 0 } ],
        frameRate: 4
    });
    // Carga la animacion de ir hacia la dcha (Ufo)
    this.anims.create({
        key: 'rightUfo',
        frames: this.anims.generateFrameNumbers('Ufo', { start: 0, end: 1 }),
        frameRate: 4,
        repeat: -1
    });
    // Animacion giro de la moneda
    this.anims.create({ 
        key: 'spin',
        frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
        frameRate: 16,
        repeat: -1
    });
    // Carga la animacion de andar hacia la izquierda (Hitt)
    this.anims.create({
        key: 'leftHitt',
        frames: this.anims.generateFrameNumbers('Hitt', { start: 3, end: 5 }),
        frameRate: 6,
        repeat: -1
    });
    // Carga la animacion de darse la vuelta (Hitt)
    this.anims.create({
        key: 'turnHitt',
        frames: [ { key: 'Hitt', frame: 0 } ],
        frameRate: 20
    });
    // Carga la animacion de ir hacia la dcha (Hitt)
    this.anims.create({
        key: 'rightHitt',
        frames: this.anims.generateFrameNumbers('Hitt', { start: 0, end: 2 }),
        frameRate: 6,
        repeat: -1
    });
//////////////////////////////////////////////////////////////////////COLISIONES////////////////////////////////////////////////////////////////////////////
        this.physics.add.collider(player1, platforms); // Colisiones entre jugadores y entorno
        this.physics.add.collider(player2, platforms);
        for(let i = 0;i<coins.length;i++){ // Colisiones entre monedas y suelo
            this.physics.add.collider(platforms, coins[i]);
        }
        for(let i = 0;i<PowerUps.length;i++){ // Colisiones entre Power Ups y suelo
            this.physics.add.collider(platforms, PowerUps[i]);
        }
        for(let i = 0;i<coins.length;i++){ // Colisiones entre monedas y jugador
            this.physics.add.collider(player1, coins[i], takeCoin, null, this);
            this.physics.add.collider(player2, coins[i], takeCoin, null, this);
        }
        for(let i = 0;i<PowerUps.length;i++){ // Colisiones entre PowerUps y jugador
            this.physics.add.collider(player1, PowerUps[i], takePU, null, this);
            this.physics.add.collider(player2, PowerUps[i], takePU, null, this);
        }
        for(let i = 0;i<breakW.length;i++){ // Colisiones entre los muros rompibles y jugador
            this.physics.add.collider(player1, breakW[i], contacto, null, this);
            this.physics.add.collider(player2, breakW[i], contacto, null, this);
        }
        for(let i = 0;i<pinchos.length;i++){ // Colisiones entre los muros rompibles y jugador
            this.physics.add.overlap(player1, pinchos[i], pinchado, null, this);
            this.physics.add.overlap(player2, pinchos[i], pinchado, null, this);
        }
        for(let i = 0;i<PSaltos.length;i++){ // Colisiones entre los muros rompibles y jugador
            this.physics.add.overlap(player1, PSaltos[i], paArriba, null, this);
            this.physics.add.overlap(player2, PSaltos[i], paArriba, null, this);
        }
        this.physics.add.collider(player2, muroLlave);
        this.physics.add.collider(player1, muroLlave);
        this.physics.add.collider(player2, llave, abrir, null, this);
        this.physics.add.collider(player1, llave, abrir, null, this);
        this.physics.add.collider(player1, portal, win, null, this);
        this.physics.add.collider(player2, portal, win, null, this);
        this.physics.add.collider(player1, agua, mojado, null, this);
        this.physics.add.collider(player2, agua, mojado, null, this);
        this.physics.add.collider(player1, lava, quemado, null, this);
        this.physics.add.collider(player2, lava, quemado, null, this);

////////////////////////////////////////////////////////////////////INTERACCIONES///////////////////////////////////////////////////////////////////////////
        // Controles Jugador 2
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // Arriba
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); // Izquierda
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); // Derecha
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); // Power Up
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q); // Interactuar

        // Controles Jugador 1
        this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);  // Arriba
        this.keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);  // Izquierda
        this.keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);  // Derecha
        this.keyU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);  // Interactuar
        this.keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);  // Power Up

        // Menu de Pause
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
///////////////////////////////////////////////////////////////////////FUNCIONES////////////////////////////////////////////////////////////////////////////
    function takeCoin(player, coin){
        coin.disableBody(true, true);
        Acoin.play();
        if(player == player1){
            player1.score += 100; // Actualiza la puntuacion
            scoreText1.setText(player1.score);
        }else if (player == player2){
            player2.score += 100; // Actualiza la puntuacion
            scoreText2.setText(player2.score);
        }
    }
    function takePU(player, PU){
        PU.disableBody(true, true);
        APoU.play();
        if(player == player1){
            if(player1.tipoPU==-1){
            rand = Math.floor(Math.random() * 4);
            switch(rand){
                case 0:
                     player1.tipoPU = 0;
                     Objeto1 = this.add.image(440, 120, 'snowball').setScale(0.1).setScrollFactor(0); 
                    break;
                case 1:
                     player1.tipoPU = 1;
                     Objeto1 = this.add.image(440, 120, 'electricBall').setScale(0.1).setScrollFactor(0); 
                    break;
                case 2:
                     player1.tipoPU = 2;
                     Objeto1 = this.add.image(440, 120, 'potion').setScale(0.1).setScrollFactor(0); 
                    break;
                case 3:
                     player1.tipoPU = 3;
                     Objeto1 = this.add.image(440, 120, 'boots').setScale(0.1).setScrollFactor(0); 
                    break;
            }
            }
        }else if (player == player2){
            if(player2.tipoPU==-1){
            rand = Math.floor(Math.random() * 4);
            switch(rand){
                case 0:
                     player2.tipoPU = 0;
                     Objeto2 = this.add.image(1350, 120, 'snowball').setScale(0.1).setScrollFactor(0); 
                    break;
                case 1:
                     player2.tipoPU = 1;
                     Objeto2 = this.add.image(1350, 120, 'electricBall').setScale(0.1).setScrollFactor(0); 
                    break;
                case 2:
                     player2.tipoPU = 2;
                     Objeto2 = this.add.image(1350, 120, 'battery').setScale(0.1).setScrollFactor(0); 
                    break;
                case 3:
                     player2.tipoPU = 3;
                     Objeto2 = this.add.image(1350, 120, 'boots').setScale(0.1).setScrollFactor(0); 
            }
            }
        }
    }
    function contacto(player, wall){
        wall.tocado = true;
    }
    function pinchado(player, pincho){
        if(player == player1){
            player1.vel = 130;
            player1.setTint(0xff0000);
            player1.setGravityY(500);
            this.time.addEvent({ delay: 1000, callback:normal, callbackScope: this});
        }else if (player == player2){
            player2.vel = 130;
            player2.setTint(0xff0000);
            player2.setGravityY(500);
            this.time.addEvent({ delay: 1000, callback:normal, callbackScope: this});
        }
    }
    function normal(){
        if(player1.vel == 130){
            player1.vel=250;
            player1.clearTint();
            player1.setGravityY(100);
        }else if(player2.vel == 130){
            player2.vel=300;
            player2.setGravityY(100);
            player2.clearTint();
        }
    }
    function win(player, portal){
        if(player == player1){
            player1.score += 2000;
        }else if (player == player2){
            player2.score += 2000;
        }
        backgroundMusic.stop();
        victory.play();
        this.scene.start("Scene2", { "points1": player1.score, "points2": player2.score });
    }
    function paArriba(player){
        if(player == player1){
            player1.setVelocityY(-700);
        }else if (player == player2){
            player2.setVelocityY(-700);
        }
    }
    function abrir(player){
        if(player == player1){
            player1.score += 1000;
            scoreText1.setText('Hitt: ' + player1.score);
        }else if (player == player2){
            player2.score += 1000;
            scoreText2.setText(player2.score+' : Ufo');
        }
        muroLlave.destroy();
        llave.destroy();
    }
    function mojado(player){
        if(player == player1){
            player1.body.position.x = 1750;
            player1.body.position.y = 550;
        }else if (player == player2){
            player2.body.position.x = 1750;
            player2.body.position.y = 550;
        }
    }
    function quemado(player){
        if(player == player1){
            player1.body.position.x = 5600;
            player1.body.position.y = 550;
        }else if (player == player2){
            player2.body.position.x = 5600;
            player2.body.position.y = 550;
        }
    }
    },

    // Update
    update: function() {
        var cam = this.cameras.main;
        var scene = this.scene;
        fueraPlano();
    
    ////////////////////////////////////////////////////////////CONTROLES////////////////////////////////////////////////////////////////////////////////////
    // Controles player 1
    if (this.keyJ.isDown){ 
        player1.setVelocityX(-player1.vel);
        player1.anims.play('leftHitt', true);
    }
    else if (this.keyL.isDown){
        player1.setVelocityX(player1.vel);
        player1.anims.play('rightHitt', true);
    }
    else{
        player1.setVelocityX(0);

        player1.anims.play('turnHitt');
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyI)) {
        if (player1.body.touching.down) {
          player1.canDoubleJump = true;
          player1.body.setVelocityY(-400);
        } else if (player1.numJump>0 && player1.canDoubleJump) {
          // player can only jump 2x (double jump)
          player1.canDoubleJump = false;
          player1.body.setVelocityY(-400);
          player1.numJump--;
        }
      }

    // Controles player 2
    if (this.keyA.isDown){ // Interacciones W-A-S-D (Player2)
        player2.setVelocityX(-player2.vel);

        player2.anims.play('leftUfo', true);
    }
    else if (this.keyD.isDown){
        player2.setVelocityX(player2.vel);

        player2.anims.play('rightUfo', true);
    }
    else{
        player2.setVelocityX(0);

        player2.anims.play('turnUfo');
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyW)) {
        if (player2.body.touching.down) {
          player2.canDoubleJump = true;
          player2.body.setVelocityY(-400);
        } else if (player2.numJump>0 && player2.canDoubleJump) {
          player2.canDoubleJump = false;
          player2.body.setVelocityY(-400);
          player2.numJump--;
        }
    }

    if(Phaser.Input.Keyboard.JustDown(this.keyESC)){ // Menu de pausa
        if(!paused){
            pauseText1 = this.add.text(800, 400, 'PAUSADO', { fontSize: '100px', color: "#000000",fontStyle: "bold"});
            pauseText2 = this.add.text(800, 600, '<PULSA ESC PARA REANUDAR>', { fontSize: '100px', color: "#000000",fontStyle: "bold"});
            player1.body.moves = false;
            player2.body.moves = false;
            paused=true;
        }else if(paused){
            pauseText1.destroy();
            pauseText2.destroy();
            player1.body.moves = true;
            player2.body.moves = true;
            paused = false;
        }
    }
    ///////////////////////////////////////////////////////////////COMPROBACIONES///////////////////////////////////////////////////////////////////////////
    cam.centerOnX(Ahead().x); // La camara sigue al jugador mas adelantado

    if(this.keyE.isDown){ // Accion jugador 2
        switch(player2.tipoPU){
            case 0:
                Objeto2.destroy();
                player2.tipoPU = -1;
                this.time.addEvent({ delay: 0, callback:congelado, callbackScope: this});
                this.time.addEvent({ delay: 2500, callback:descongelado, callbackScope: this});
                break;
            case 1:
                Objeto2.destroy();
                player2.tipoPU = -1;
                this.time.addEvent({ delay: 0, callback:paralizado, callbackScope: this});
                this.time.addEvent({ delay: 1500, callback:desparalizado, callbackScope: this});
                break;
            case 2:
                Objeto2.destroy();
                this.time.addEvent({ delay: 0, callback:esteroides, callbackScope: this});
                this.time.addEvent({ delay: 2500, callback:desinflado, callbackScope: this});
                player2.tipoPU = -1;
                break;
            case 3:
                Objeto2.destroy();
                player2.tipoPU = -1;
                tirarPU.play();
                player2.numJump = 10;
                break;
        }
    }
    if(this.keyO.isDown){ // Accion Jugador1
        switch(player1.tipoPU){
            case 0:
                Objeto1.destroy();
                player1.tipoPU = -1;
                this.time.addEvent({ delay: 0, callback:congelado, callbackScope: this});
                this.time.addEvent({ delay: 2500, callback:descongelado, callbackScope: this});
                break;
            case 1:
                Objeto1.destroy();
                player1.tipoPU = -1;
                this.time.addEvent({ delay: 0, callback:paralizado, callbackScope: this});
                this.time.addEvent({ delay: 1500, callback:desparalizado, callbackScope: this});
                break;
            case 2:
                Objeto1.destroy();
                player1.tipoPU = -1;
                this.time.addEvent({ delay: 0, callback:correr, callbackScope: this});
                this.time.addEvent({ delay: 2500, callback:parar, callbackScope: this});
                break;
            case 3:
                Objeto1.destroy();
                player1.tipoPU = -1;
                tirarPU.play();
                player1.numJump = 10;
                break;
        }
    }
    // Comprueba si el jugador rompe el muro y lo actualiza en consecuencia
    aux = inTouch();
    if(aux != undefined){
        if(Phaser.Input.Keyboard.JustDown(this.keyQ)){ // Interaccion con breakable Walls
            aux.dureza -= player2.fuerza;
            aux.tocado = false;
        }else if(Phaser.Input.Keyboard.JustDown(this.keyU)){
            aux.dureza -= player1.fuerza;
            aux.tocado = false;
            
        }
        if(aux.dureza<80 && aux.dureza > 60){
            aux.setTint(0xF0F720);
        }else if(aux.dureza<60 && aux.dureza > 40){
            aux.setTint(0xFF6A06);
        }else if(aux.dureza<40){
            aux.setTint(0xFF0000);
        } 
        if(aux.dureza<=0){
            aux.destroy();
        }
    }
    /////////////////////////////////////////////////////////////////ANIMACIONES////////////////////////////////////////////////////////////////////////////
    for(let i = 0;i<coins.length;i++){
        coins[i].anims.play('spin',true);
    }

    ////////////////////////////////////////////////////////////////////FUNCIONES//////////////////////////////////////////////////////////////////////////
    function Ahead(){ // Funcion que devuelve el jugador mas adelantado
        if (player1.body.position.x>player2.body.position.x){
           return player1;
        }else{
            return player2;
        }
    }

    function fueraPlano(){ // Funcion que comprobara si un jugador se queda fuera de la pantalla
        if(Math.abs(player1.body.position.x-player2.body.position.x)>1200){
            if(player1.body.position.x>player2.body.position.x){
                player1.score += 1000;
            }else{
                player2.score += 1000;
            }
            backgroundMusic.stop();
            victory.play();
            scene.start("Scene2", { "points1": player1.score, "points2": player2.score });
        }
    }

    function congelado(){
        tirarPU.play();
        if(this.keyE.isDown){
            player1.setTint(0x0000ff); // pinta al jugador de azul
            player1.vel = 150;
        }else if(this.keyO.isDown){
            player2.setTint(0x0000ff); // pinta al jugador de azul
            player2.vel = 150;
        }
    }
    function descongelado(){
        if(player1.vel == 150){
            player1.clearTint(); // pinta al jugador de rojo
            player1.vel = 250;
        }else if(player2.vel == 150){
            player2.clearTint(); // pinta al jugador de rojo
            player2.vel = 300;
        }
    }
    function paralizado(){
        tirarPU.play();
        if(this.keyE.isDown){
            player1.setTint(0xffff00); // pinta al jugador de rojo
            player1.vel = 0;
        }else if(this.keyO.isDown){
            player2.setTint(0xffff00); // pinta al jugador de rojo
            player2.vel = 0;
        }
    }
    function desparalizado(){
        if(player1.vel == 0){
            player1.clearTint(); // pinta al jugador de rojo
            player1.vel = 250;
        }else if(player2.vel == 0){
            player2.clearTint(); // pinta al jugador de rojo
            player2.vel = 300;
        }
    }
    function correr(){
        tirarPU.play();
        player1.setTint(0x00FFFF);
        player1.vel = 400;
    }
    function parar(){
        player1.clearTint();
        player1.vel = 300;
    }
    function esteroides(){
        tirarPU.play();
        player2.setTint(0x00FFFF);
        player2.fuerza = 10;
    }
    function desinflado(){
        player2.clearTint();
        player2.fuerza=5;
    }
    function inTouch(){
        for(let i = 0;i<breakW.length;i++){
            if(breakW[i].tocado == true){
                return breakW[i];
            }
        }
    }
    }
});