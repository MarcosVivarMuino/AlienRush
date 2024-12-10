var Ajustes = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "Ajustes" });
    },

    init: function (data) {
        this.musicaMenu = data.musica;
        this.musicasAdicionales = data.musicas || []; // Lista de músicas adicionales
    },


    preload: function () {
        this.load.image('fondoAjustes', 'assets/Ajustes/fondoAjustes.png');

        this.load.image('BotonAjustesSiPulsado', 'assets/Ajustes/BotonAjustesSiPulsado.png');
        this.load.image('BotonAjustesSiSinPulsar', 'assets/Ajustes/BotonAjustesSiSinPulsar.png');
        this.load.image('BotonAjustesNoPulsado', 'assets/Ajustes/BotonAjustesNoPulsado.png');
        this.load.image('BotonAjustesNoSinPulsar', 'assets/Ajustes/BotonAjustesNoSinPulsar.png');

        this.load.image('BotonVolver', 'assets/Ajustes/BotonVolver.png');

    },

    create: function () {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoAjustes');

        /************************* VARIABLES *************************/
        let botonSi = this.add.image(1300, 430, GlobalMusic.musicaActiva ? 'BotonAjustesSiPulsado' : 'BotonAjustesSiSinPulsar').setInteractive();
        let botonNo = this.add.image(1450, 430, !GlobalMusic.musicaActiva ? 'BotonAjustesNoPulsado' : 'BotonAjustesNoSinPulsar').setInteractive();
        let BotonVolver = this.add.image(1470, 750, 'BotonVolver');

        /************************* BOTONES *************************/
        //MUSICA
        // Lógica para el botón "Sí"
        botonSi.on('pointerdown', () => {
            if (!GlobalMusic.musicaActiva) {
                GlobalMusic.musicaActiva = true;
                botonSi.setTexture('BotonAjustesSiPulsado');
                botonNo.setTexture('BotonAjustesNoSinPulsar');
    
                // Reanudar música dependiendo de la escena actual
                if (this.scene.isActive('MenuScene') && GlobalMusic.musicaMenu) {
                    GlobalMusic.musicaMenu.play();
                } else if (this.scene.isActive('MainGame') && GlobalMusic.musicaJuego) {
                    GlobalMusic.musicaJuego.play();
                }
            }
        });

        botonSi.on("pointerover", () => { botonSi.setScale(1.2); });
        botonSi.on("pointerout", () => { botonSi.setScale(1); });

        // Lógica para desactivar la música (Botón "No")
        botonNo.on('pointerdown', () => {
            if (GlobalMusic.musicaActiva) {
                GlobalMusic.musicaActiva = false;
                botonSi.setTexture('BotonAjustesSiSinPulsar');
                botonNo.setTexture('BotonAjustesNoPulsado');
    
                // Pausar ambas músicas
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
        
        //VOLVER
        BotonVolver.setInteractive();
        BotonVolver.on("pointerdown", () => {
            this.scene.start("MenuScene", { musicaFondo: this.musica });
        })
        BotonVolver.on("pointerover", () => { BotonVolver.setScale(1.2); })
        BotonVolver.on("pointerout", () => { BotonVolver.setScale(1); })



    },

});