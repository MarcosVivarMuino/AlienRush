var MenuPausa = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "MenuPausa" });
    },

    init: function (data) {
        this.musicaMenu = data.musica;  // Música del menú
        this.musicasAdicionales = data.musicas || []; // Música adicional (si la hubiera)
    },

    preload: function () {
        this.load.image('botonReanudar', 'assets/MenuPausa/BotonReanudar.png');
        this.load.image('botonMenu', 'assets/MenuPausa/BotonVMP.png');
        this.load.image('fondoPausa', 'assets/MenuPausa/fondoPausa.png');
        
        this.load.image('BotonPausaSiPulsado', 'assets/MenuPausa/BotonPausaSiPulsado.png');
        this.load.image('BotonPausaSiSinPulsar', 'assets/MenuPausa/BotonPausaSiSinPulsar.png');
        this.load.image('BotonPausaNoPulsado', 'assets/MenuPausa/BotonPausaNoPulsado.png');
        this.load.image('BotonPausaNoSinPulsar', 'assets/MenuPausa/BotonPausaNoSinPulsar.png');

    },

    create: function () {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoPausa');
      
        /************************* VARIABLES *************************/
        let botonReanudar = this.add.image(853, 440, 'botonReanudar')
        let botonMenu = this.add.image(853, 580, 'botonMenu')
        let botonSi = this.add.image(780, 780, GlobalMusic.musicaActiva ? 'BotonPausaSiPulsado' : 'BotonPausaSiSinPulsar').setInteractive();
        let botonNo = this.add.image(923, 780, !GlobalMusic.musicaActiva ? 'BotonPausaNoPulsado' : 'BotonPausaNoSinPulsar').setInteractive();

        /************************* BOTONES *************************/
        //REANUDAR
        botonReanudar.setInteractive();
        botonReanudar.on('pointerdown', () => {
            console.log("Reanudando MainGame...");
            this.scene.resume('MainGame');
            this.scene.get('MainGame').onResume();
            this.scene.stop('MenuPausa');
        });
        botonReanudar.on("pointerover", () => { botonReanudar.setScale(1.2); });
        botonReanudar.on("pointerout", () => { botonReanudar.setScale(1); });

        //MENU       
        botonMenu.setInteractive();
        botonMenu.on('pointerdown', () => {
            console.log("Regresando al menú principal...");
            this.scene.stop('MainGame');
            this.scene.start('MenuScene');  // Volver al menú principal
        });
        botonMenu.on("pointerover", () => { botonMenu.setScale(1.2); });
        botonMenu.on("pointerout", () => { botonMenu.setScale(1); });

        // Lógica para el botón "Sí"
        botonSi.on('pointerdown', () => {
            if (!GlobalMusic.musicaActiva) {
                GlobalMusic.musicaActiva = true;  // Cambiar el estado de la música
                botonSi.setTexture('BotonPausaSiPulsado');  // Cambiar la imagen del botón
                botonNo.setTexture('BotonPausaNoSinPulsar');  // Cambiar la imagen del botón "No"

                // Reanudar música dependiendo de la escena actual
                let musicaMenu = this.scene.get('MenuScene') ? GlobalMusic.musicaMenu : null;
                let musicaJuego = this.scene.get('MainGame') ? GlobalMusic.musicaJuego : null;

                if (musicaJuego && !musicaJuego.isPlaying) {
                    musicaJuego.play();  // Reproducir la música del juego si está en esa escena
                }
            }
        });

        botonSi.on("pointerover", () => { botonSi.setScale(1.2); });
        botonSi.on("pointerout", () => { botonSi.setScale(1); });

        // Lógica para desactivar la música (Botón "No")
        botonNo.on('pointerdown', () => {
            if (GlobalMusic.musicaActiva) {
                GlobalMusic.musicaActiva = false;  // Cambiar el estado de la música
                botonSi.setTexture('BotonPausaSiSinPulsar');  // Cambiar la imagen del botón
                botonNo.setTexture('BotonPausaNoPulsado');  // Cambiar la imagen del botón "No"

                // Pausar ambas músicas, si están activas
                if (GlobalMusic.musicaMenu && GlobalMusic.musicaMenu.isPlaying) {
                    GlobalMusic.musicaMenu.stop();
                }
                if (GlobalMusic.musicaJuego && GlobalMusic.musicaJuego.isPlaying) {
                    GlobalMusic.musicaJuego.stop();
                }
            }
        });

        botonNo.on("pointerover", () => { botonNo.setScale(1.2); });
        botonNo.on("pointerout", () => { botonNo.setScale(1); });
    }
});