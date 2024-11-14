var Ajustes = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "Ajustes" });
    },

    init: function (data) {
        this.musica = data.musica;  // Recibimos la música desde el menú principal
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
        let botonSi = this.add.image(1300, 430, this.musica.isPlaying ? 'BotonAjustesSiPulsado' : 'BotonAjustesSiSinPulsar').setInteractive();
        let botonNo = this.add.image(1450, 430, !this.musica.isPlaying ? 'BotonAjustesNoPulsado' : 'BotonAjustesNoSinPulsar').setInteractive();
        let BotonVolver = this.add.image(1470, 750, 'BotonVolver');

        /************************* BOTONES *************************/
        //MUSICA
        // Lógica para el botón "Sí"
        botonSi.on('pointerdown', () => {
            if (!this.musica.isPlaying) {
                this.musica.resume(); // Reanudar la música
                botonSi.setTexture('BotonAjustesSiPulsado'); // Cambiar la imagen a "Sí pulsado"
                botonNo.setTexture('BotonAjustesNoSinPulsar'); // Cambiar la imagen a "No sin pulsar"
            }
        });

        botonSi.on("pointerover", () => { botonSi.setScale(1.5); });
        botonSi.on("pointerout", () => { botonSi.setScale(1); });

        // Lógica para el botón "No"
        botonNo.on('pointerdown', () => {
            if (this.musica.isPlaying) {
                this.musica.pause(); // Pausar la música
                botonSi.setTexture('BotonAjustesSiSinPulsar'); // Cambiar la imagen a "Sí sin pulsar"
                botonNo.setTexture('BotonAjustesNoPulsado'); // Cambiar la imagen a "No pulsado"
            }
        });
    
        botonNo.on("pointerover", () => { botonNo.setScale(1.5); });
        botonNo.on("pointerout", () => { botonNo.setScale(1); });

        //VOLVER
        BotonVolver.setInteractive();
        BotonVolver.on("pointerdown", () => {
            this.scene.start("MenuScene", { musicaFondo: this.musica });
        })
        BotonVolver.on("pointerover", () => { BotonVolver.setScale(1.5); })
        BotonVolver.on("pointerout", () => { BotonVolver.setScale(1); })



    },

});