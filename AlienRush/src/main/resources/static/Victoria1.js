var Victoria1 = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: 'Victoria1' });
    },

    init: function(data){
        this.player1Score = data.player1Score;
        this.player2Score = data.player2Score;
        this.fondo = data.fondo;
        this.nombreUsuario = data.nombreUsuario;
    },

    preload: function () {
        this.load.image('PantallaPuntuacionCiudadAzul', 'assets/Victoria1/PantallaPuntuacionCiudadAzul.png');
        this.load.image('PantallaPuntuacionGranjaAzul', 'assets/Victoria1/PantallaPuntuacionGranjaAzul.png');
        this.load.image('botonMenu', 'assets/Victoria1/BotonVMP.png');
        this.load.audio('musicaVictoria', 'audio/victoria.mp3');
    },

    create: function () {
        /************************* FONDO *************************/
        //IMAGEN
        if(this.fondo = "fondoGranja"){
            this.add.image(875, 440, 'PantallaPuntuacionGranjaAzul');
            
        }else if(this.fondo = "fondoCiudad"){
            this.add.image(875, 440, 'PantallaPuntuacionCiudadAzul');
        }

        //TEXTO
        this.add.text(450, 400, `${this.nombreUsuario} 1`, {
            fontSize: '80px',
            color: '#FFFFFF',
            fontFamily: 'Impact, fantasy'
        }).setOrigin(0.5);

        this.add.text(450, 500, `${this.player1Score}`, {
            fontSize: '80px',
            color: '#FFFFFF',
            fontFamily: 'Impact, fantasy'
        }).setOrigin(0.5);

        this.add.text(450, 650, `${this.nombreUsuario} 2`, {
            fontSize: '80px',
            color: '#FFFFFF',
            fontFamily: 'Impact, fantasy'
        }).setOrigin(0.5);

        this.add.text(450, 750, `${this.player2Score}`, {
            fontSize: '80px',
            color: '#FFFFFF',
            fontFamily: 'Impact, fantasy'
        }).setOrigin(0.5);
        
        //AUDIO
        // Inicializar música del juego si no existe
        if (!GlobalMusic.musicaVictoria) {
            GlobalMusic.musicaVictoria = this.sound.add('musicaVictoria', { loop: true });
        }

        // Reproducir música solo si está activada
        if (GlobalMusic.musicaActiva && !GlobalMusic.musicaVictoria.isPlaying) {
            GlobalMusic.musicaVictoria.play();
        }

        // Detener la música del menú
        if (GlobalMusic.musicaJuego && GlobalMusic.musicaJuego.isPlaying) {
            GlobalMusic.musicaJuego.stop();
        }

        /************************* VARIABLES *************************/
        let botonMenu = this.add.image(875, 800, 'botonMenu')

        /************************* BOTONES *************************/
        //MENU       
        botonMenu.setInteractive();
        botonMenu.on('pointerdown', () => {
            console.log("Regresando al menú principal...");
            this.scene.stop('MainGame');
            this.scene.start('MenuScene');  // Volver al menú principal
        });
        botonMenu.on("pointerover", () => { botonMenu.setScale(1.2); });
        botonMenu.on("pointerout", () => { botonMenu.setScale(1); });

    }
});
