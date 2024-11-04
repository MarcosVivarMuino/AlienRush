var MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function() {
        Phaser.Scene.call(this, { "key": "MenuScene" });
    },

    init: function() {},

    preload: function() {
        this.load.image('fondo','assets/Background/Menu_Final.jpg');
        this.load.image('play','assets/Menu/BotonJugar.png');
        this.load.image('ajustes','assets/Menu/ajustes.png');
        this.load.image('exit','assets/Menu/salir.png');
        this.load.image('logo','assets/Menu/logo.png');
        this.load.audio('background_music', 'assets/MUSICAS/menuUno.mp3');
        this.load.image('fondoCarga','assets/Background/pantallaCarga.jpg');
    },

    create: function() {
        this.add.image(900, 500, 'fondo').setScale(0.85, 0.85);
        //this.add.text(300, 300, 'IP Address: ' + ipAddress, {fontSize: 45,color: "#FFFFFF",fontFamily: 'Impact, fantasy'});

        let play = this.add.image(900, 590, 'play').setScale(3);

        backgroundMusic = this.sound.add('background_music',{volume: 0.5});
        backgroundMusic.loop = true; // This is what you are looking for
        backgroundMusic.play();

        //let ajustes = this.add.image(1000, 720, 'ajustes').setScale(1.2);

        // Añade interactividad a los botones
        play.setInteractive();
        //ajustes.setInteractive();

        /*function exitButtonClick() 
        {    if (confirm("¿Seguro que quieres salir?")) {
            //navigator.app.exitApp();  
             }
            ;}*/
        play.on("pointerdown",()=>{
            this.scene.start("ElecScene");
        })

        play.on("pointerover",()=>{
            play.setScale(3.5);
        })

        play.on("pointerout",()=>{
            play.setScale(3);
        })

        /*ajustes.on("pointerover",()=>{
            ajustes.setScale(1.8);
        })

        ajustes.on("pointerout",()=>{
            ajustes.setScale(1.2);
        })*/
    },
    update: function() {
        
    }
});