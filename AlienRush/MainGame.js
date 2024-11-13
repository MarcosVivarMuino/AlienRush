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
        this.load.image('fondo','assets/AssetsMainGame/Fondo_PlaceHolder.png');
        // Terreno
        // Partida
        this.load.image('Player1','assets/AssetsMainGame/Personajes/Player1.png');
        this.load.image('Player2','assets/AssetsMainGame/Personajes/Player2.png');
        //Sonidos 
    },

    create: function() {
    ///////////////////////////////////////////////////////////////INSTANCIACION////////////////////////////////////////////////////////////////////
        coins = []; // Crea el grupo de monedas
        PowerUps= [];
        breakW = [];
        pinchos = [];
        PSaltos = [];
        paused = false;

        this.physics.world.bounds.width = 1800; // Limite al tamaño del mundo
        this.physics.world.bounds.height = 1000;
        this.cameras.main.setBounds(0, 0,1800,1000); // Define los limites de la camara
        
        this.add.image(1062, 590, 'fondo').setScale(1).setOrigin(0.125,0.59); // Creacion del fondo

        // Instanciacion de los jugadores
        player1 = this.physics.add.sprite(800, 130, 'Player1').setScale(0.3);
        player1.tipoPU = -1;
        player1.vel = 250;
        player1.score = 0;

        player1.setBounce(0.2); // Limites del jugador
        player1.setCollideWorldBounds(true);

        player2 = this.physics.add.sprite(400, 720, 'Player2').setScale(0.3);
        player2.tipoPU = -1;
        player2.vel = 250;
        player2.score = 0;

        player2.setBounce(0.2); // Limites del jugador
        player2.setCollideWorldBounds(true);

        // Instanciacion Interactuables

        // Instanciacion sonidos
        // Pinchos

        //Instanciacion decoracion

        // Instanciacion texto

//////////////////////////////////////////////////////////////////ANIMACIONES///////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////COLISIONES////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////INTERACCIONES///////////////////////////////////////////////////////////////////////////
        // Controles Jugador 1
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // Arriba
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); // Izquierda
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); // Derecha
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S); // Abajo
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); // Power Up
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q); // Interactuar

        // Controles Jugador 2
        this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);  // Arriba
        this.keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);  // Izquierda
        this.keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);  // Derecha
        this.keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);  // Derecha
        this.keyU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);  // Interactuar
        this.keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);  // Power Up

        // Menu de Pause
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
///////////////////////////////////////////////////////////////////////FUNCIONES////////////////////////////////////////////////////////////////////////////
    },

    // Update
    update: function() {
        var cam = this.cameras.main;
        var scene = this.scene; 
    ////////////////////////////////////////////////////////////CONTROLES////////////////////////////////////////////////////////////////////////////////////
    // Controles player 2
    if (this.keyJ.isDown){  // Interacciones J-K-L-I (player2)
        player2.setVelocityX(-player2.vel);
    }
    else if (this.keyL.isDown){
        player2.setVelocityX(player2.vel);
    }
    else if (this.keyI.isDown){
        player2.setVelocityX(player2.vel);
    }else if (this.keyK.isDown){
        player2.setVelocityX(player2.vel);
    }

    // Controles player 1
    if (this.keyA.isDown){  // Interacciones W-A-S-D (player2)
        player1.setVelocityX(-player1.vel);
    }
    else if (this.keyD.isDown){
        player1.setVelocityX(player1.vel);
    }
    else if (this.keyW.isDown){
        player1.setVelocityX(player1.vel);
    }else if (this.keyS.isDown){
        player1.setVelocityX(player1.vel);
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
    if(this.keyE.isDown){ // Accion jugador 1
    }

    if(this.keyO.isDown){ // Accion Jugador 2
    }

    // Comprueba si el jugador rompe el muro y lo actualiza en consecuencia
    /////////////////////////////////////////////////////////////////ANIMACIONES////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////FUNCIONES//////////////////////////////////////////////////////////////////////////
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
    }
});