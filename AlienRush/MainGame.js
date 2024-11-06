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
        this.load.image('PlayerHead','assets/AssetsMainGame/Personajes/Cabeza_Ovni_PH.png');
        this.load.image('PlayerRay','assets/AssetsMainGame/Personajes/Rayo_Succion_PH.png');
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
        playerHead1 = this.physics.add.sprite(800, 130, 'PlayerHead').setScale(0.3);
        playerRay1 = this.physics.add.sprite(800, 130, 'PlayerRay').setScale(0.3);
        playerHead1.tipoPU = -1;
        playerHead1.vel = 250;
        playerHead1.score = 0;

        playerHead1.setBounce(0.2); // Limites del jugador
        playerHead1.setCollideWorldBounds(true);

        playerHead2 = this.physics.add.sprite(400, 720, 'PlayerHead').setScale(0.3);
        playerRay2 = this.physics.add.sprite(420, 720, 'PlayerRay').setScale(0.3);
        playerHead2.tipoPU = -1;
        playerHead2.vel = 250;
        playerHead2.score = 0;

        playerHead2.setBounce(0.2); // Limites del jugador
        playerHead2.setCollideWorldBounds(true);

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
    if (this.keyJ.isDown){ 
        playerHead2, playerRay2.setVelocityX(-playerHead2.vel);
    }
    else if (this.keyL.isDown){
        playerHead2, playerRay2.setVelocityX(playerHead2.vel);
    }
    else{
        playerHead2, playerRay2.setVelocityX(0);
    }

    // Controles player 2
    if (this.keyA.isDown){ // Interacciones W-A-S-D (playerHead2)
        playerHead2.setVelocityX(-playerHead2.vel);

        playerHead2.anims.play('leftUfo', true);
    }
    else if (this.keyD.isDown){
        playerHead2.setVelocityX(playerHead2.vel);

        playerHead2.anims.play('rightUfo', true);
    }
    else{
        playerHead2.setVelocityX(0);

        playerHead2.anims.play('turnUfo');
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyW)) {
        if (playerHead2.body.touching.down) {
          playerHead2.canDoubleJump = true;
          playerHead2.body.setVelocityY(-400);
        } else if (playerHead2.numJump>0 && playerHead2.canDoubleJump) {
          playerHead2.canDoubleJump = false;
          playerHead2.body.setVelocityY(-400);
          playerHead2.numJump--;
        }
    }

    if(Phaser.Input.Keyboard.JustDown(this.keyESC)){ // Menu de pausa
        if(!paused){
            pauseText1 = this.add.text(800, 400, 'PAUSADO', { fontSize: '100px', color: "#000000",fontStyle: "bold"});
            pauseText2 = this.add.text(800, 600, '<PULSA ESC PARA REANUDAR>', { fontSize: '100px', color: "#000000",fontStyle: "bold"});
            playerHead1.body.moves = false;
            playerHead2.body.moves = false;
            paused=true;
        }else if(paused){
            pauseText1.destroy();
            pauseText2.destroy();
            playerHead1.body.moves = true;
            playerHead2.body.moves = true;
            paused = false;
        }
    }
    ///////////////////////////////////////////////////////////////COMPROBACIONES///////////////////////////////////////////////////////////////////////////
    cam.centerOnX(Ahead().x); // La camara sigue al jugador mas adelantado

    if(this.keyE.isDown){ // Accion jugador 2
        switch(playerHead2.tipoPU){
            case 0:
                Objeto2.destroy();
                playerHead2.tipoPU = -1;
                this.time.addEvent({ delay: 0, callback:congelado, callbackScope: this});
                this.time.addEvent({ delay: 2500, callback:descongelado, callbackScope: this});
                break;
            case 1:
                Objeto2.destroy();
                playerHead2.tipoPU = -1;
                this.time.addEvent({ delay: 0, callback:paralizado, callbackScope: this});
                this.time.addEvent({ delay: 1500, callback:desparalizado, callbackScope: this});
                break;
            case 2:
                Objeto2.destroy();
                this.time.addEvent({ delay: 0, callback:esteroides, callbackScope: this});
                this.time.addEvent({ delay: 2500, callback:desinflado, callbackScope: this});
                playerHead2.tipoPU = -1;
                break;
            case 3:
                Objeto2.destroy();
                playerHead2.tipoPU = -1;
                tirarPU.play();
                playerHead2.numJump = 10;
                break;
        }
    }
    if(this.keyO.isDown){ // Accion Jugador1
        switch(playerHead1.tipoPU){
            case 0:
                Objeto1.destroy();
                playerHead1.tipoPU = -1;
                this.time.addEvent({ delay: 0, callback:congelado, callbackScope: this});
                this.time.addEvent({ delay: 2500, callback:descongelado, callbackScope: this});
                break;
            case 1:
                Objeto1.destroy();
                playerHead1.tipoPU = -1;
                this.time.addEvent({ delay: 0, callback:paralizado, callbackScope: this});
                this.time.addEvent({ delay: 1500, callback:desparalizado, callbackScope: this});
                break;
            case 2:
                Objeto1.destroy();
                playerHead1.tipoPU = -1;
                this.time.addEvent({ delay: 0, callback:correr, callbackScope: this});
                this.time.addEvent({ delay: 2500, callback:parar, callbackScope: this});
                break;
            case 3:
                Objeto1.destroy();
                playerHead1.tipoPU = -1;
                tirarPU.play();
                playerHead1.numJump = 10;
                break;
        }
    }
    // Comprueba si el jugador rompe el muro y lo actualiza en consecuencia
    aux = inTouch();
    if(aux != undefined){
        if(Phaser.Input.Keyboard.JustDown(this.keyQ)){ // Interaccion con breakable Walls
            aux.dureza -= playerHead2.fuerza;
            aux.tocado = false;
        }else if(Phaser.Input.Keyboard.JustDown(this.keyU)){
            aux.dureza -= playerHead1.fuerza;
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
        if (playerHead1.body.position.x>playerHead2.body.position.x){
           return playerHead1;
        }else{
            return playerHead2;
        }
    }

    function congelado(){
        tirarPU.play();
        if(this.keyE.isDown){
            playerHead1.setTint(0x0000ff); // pinta al jugador de azul
            playerHead1.vel = 150;
        }else if(this.keyO.isDown){
            playerHead2.setTint(0x0000ff); // pinta al jugador de azul
            playerHead2.vel = 150;
        }
    }
    function descongelado(){
        if(playerHead1.vel == 150){
            playerHead1.clearTint(); // pinta al jugador de rojo
            playerHead1.vel = 250;
        }else if(playerHead2.vel == 150){
            playerHead2.clearTint(); // pinta al jugador de rojo
            playerHead2.vel = 300;
        }
    }
    function paralizado(){
        tirarPU.play();
        if(this.keyE.isDown){
            playerHead1.setTint(0xffff00); // pinta al jugador de rojo
            playerHead1.vel = 0;
        }else if(this.keyO.isDown){
            playerHead2.setTint(0xffff00); // pinta al jugador de rojo
            playerHead2.vel = 0;
        }
    }
    function desparalizado(){
        if(playerHead1.vel == 0){
            playerHead1.clearTint(); // pinta al jugador de rojo
            playerHead1.vel = 250;
        }else if(playerHead2.vel == 0){
            playerHead2.clearTint(); // pinta al jugador de rojo
            playerHead2.vel = 300;
        }
    }
    function correr(){
        tirarPU.play();
        playerHead1.setTint(0x00FFFF);
        playerHead1.vel = 400;
    }
    function parar(){
        playerHead1.clearTint();
        playerHead1.vel = 300;
    }
    function esteroides(){
        tirarPU.play();
        playerHead2.setTint(0x00FFFF);
        playerHead2.fuerza = 10;
    }
    function desinflado(){
        playerHead2.clearTint();
        playerHead2.fuerza=5;
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