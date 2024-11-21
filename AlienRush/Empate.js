var Empate = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: 'Empate' });
    },

    init: function(data){
        this.player1Score = data.player1Score;
        this.player2Score = data.player2Score;
    },

    preload: function () {
        this.load.image('fondoEmpate', 'assets/Empate/fondoEmpate.png');
        this.load.image('botonMenu', 'assets/Empate/BotonVMP.png');
        this.load.audio('musicaEmpate', 'audio/empate.mp3');
    },

    create: function () {
        /************************* FONDO *************************/
        //IMAGEN
        this.add.image(875, 440, 'fondoEmpate');
        
        //TEXTO
        this.add.text(875, 300, `${this.player1Score}`, {
            fontSize: '60px',
            color: '#FFFFFF',
            fontFamily: 'Impact, fantasy'
        }).setOrigin(0.5);

        //AUDIO
        // Inicializar música del juego si no existe
        if (!GlobalMusic.musicaEmpate) {
            GlobalMusic.musicaEmpate = this.sound.add('musicaEmpate', { loop: false });
        }

        // Reproducir música solo si está activada
        if (GlobalMusic.musicaActiva && !GlobalMusic.musicaEmpate.isPlaying) {
            GlobalMusic.musicaEmpate.play();
        }

        // Detener la música del menú
        if (GlobalMusic.musicaJuego && GlobalMusic.musicaJuego.isPlaying) {
            GlobalMusic.musicaJuego.stop();
        }

        /************************* VARIABLES *************************/
        let botonMenu = this.add.image(875, 540, 'botonMenu')

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
