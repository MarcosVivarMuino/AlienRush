var Lobby = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "Lobby" });
    },

    preload() {
        //Imagenes
        this.load.image('fondoLobby', '.png');
        this.load.image('listo', '.png');

        //Audio
        this.load.audio('musicaMenu', 'audio/musicaMenu.mp3');
    },
        
    create() {
        // Agrega el fondo
        this.add.image(0, 0, 'fondoLobby').setOrigin(0, 0);

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
        let listo = this.add.image(1470, 360, 'listo');

        ///////////////////////////////////MUESTREODEUSUARIOS//////////////////////////////////
		usuariosConectadosText = this.add.text(20, 470, 'Usuarios conectados: 0', {
        	fontFamily: 'Impact, fantasy',
        	fill: '#ffffff',
        	fontSize: '40px'
    	});

        //JUGAR
        play.setInteractive();
        play.on("pointerdown", () => {
            this.scene.start("MainGame", {"nombreUsuario": this.nombreUsuario});
        })
        play.on("pointerover", () => { listo.setScale(1.2); })
        play.on("pointerout", () => { listo.setScale(1); })

        // Botón para iniciar el juego
        const startButton = this.add.text(this.cameras.main.centerX, 200, 'Listo', {
            fontSize: '24px',
            color: '#ff0000',
            fontFamily: 'Arial',
            backgroundColor: '#ffffff',
            padding: { x: 10, y: 5 },
        })
        .setOrigin(0.5)
        .setInteractive();

        // Al hacer clic en el botón, inicia la escena del juego
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene'); // Cambia 'GameScene' por el nombre de tu escena principal
        });
    }
});