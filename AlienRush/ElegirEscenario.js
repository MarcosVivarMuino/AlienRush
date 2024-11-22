var ElegirEscenario = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "ElegirEscenario" });
    },

    preload: function () {
        this.load.image('fondoMenu', 'assets/ElegirEscenario/fondoMenu.png');
        this.load.image('granja', 'assets/ElegirEscenario/BotonGranja.png');
        this.load.image('proximamente', 'assets/ElegirEscenario/BotonProximamente.png');
        this.load.image('volver', 'assets/ElegirEscenario/BotonVolver.png');

        this.load.audio('musicaMenu', 'audio/musicaMenu.mp3');

        this.load.image('fondoGranja', 'assets/AssetsMainGame/Escenarios/Granja2.png')
        this.load.image('fondoCiudad', 'assets/AssetsMainGame/Escenarios/Ciudad.png')
    },

    create: function () {
        /************************* FONDO *************************/
        //IMAGEN
        this.add.image(875, 440, 'fondoMenu');
        //AUDIO
        // Inicializar música del menú si no existe
        if (!GlobalMusic.musicaMenu) {
            GlobalMusic.musicaMenu = this.sound.add('musicaMenu', { loop: true });
        }
        
        // Reproducir música solo si está activada
        if (GlobalMusic.musicaActiva && !GlobalMusic.musicaMenu.isPlaying) {
            GlobalMusic.musicaMenu.play();
        }
        
        // Asegurarnos de detener la música del juego
        if (GlobalMusic.musicaJuego && GlobalMusic.musicaJuego.isPlaying) {
            GlobalMusic.musicaJuego.stop();
            GlobalMusic.musicaVictoria.stop();
        }
        
        
        /************************* VARIABLES *************************/
        let granja = this.add.image(1370, 400, 'granja');
        let ciudad = this.add.image(1580, 400, 'proximamente');
        let proximamente1 = this.add.image(1370, 580, 'proximamente');
        let proximamente2 = this.add.image(1580, 580, 'proximamente');
        let volver = this.add.image(1470, 780, 'volver');
        

        /************************* BOTONES *************************/
        //GRANJA
        granja.setInteractive();
        granja.on("pointerdown", () => {
            this.scene.start("MainGame", {
                fondo: 'fondoGranja'
            });
        })
        granja.on("pointerover", () => { granja.setScale(1.2); })
        granja.on("pointerout", () => { granja.setScale(1); })
        
        //CIUDAD
        ciudad.setInteractive();
        ciudad.on("pointerdown", () => {
            this.scene.start("MainGame", {
                fondo: 'fondoCiudad'
            });
        })
        ciudad.on("pointerover", () => { ciudad.setScale(1.2); })
        ciudad.on("pointerout", () => { ciudad.setScale(1); })
        
        //VOLVER
        volver.setInteractive();
        volver.on("pointerdown", () => {
            this.scene.start("MenuScene");
        })
        volver.on("pointerover", () => { volver.setScale(1.2); })
        volver.on("pointerout", () => { volver.setScale(1); })
    },

});