var Ajustes = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "Ajustes" });
    },

    init: function (data) {
        this.musica = data.musica;  // Recibimos la música desde el menú principal
    },

    preload: function () {
        this.load.image('fondoAjustes', 'assets/Ajustes/fondoAjustes.jpg');
        this.load.image('BotonMusica', 'assets/Ajustes/BotonMusica.png');
        this.load.image('BotonVolver', 'assets/Ajustes/BotonVolver.png');

    },

    create: function () {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoAjustes').setScale(5, 3.5);

        /************************* VARIABLES *************************/
        let BotonMusica = this.add.image(875, 560, 'BotonMusica');
        let BotonVolver = this.add.image(875, 800, 'BotonVolver');

        /************************* BOTONES *************************/
        //MUSICA
        BotonMusica.setInteractive();
        BotonMusica.on("pointerdown", () => {
            if (this.musica.isPlaying) {
                this.musica.pause();
            } else {
                this.musica.resume();
            }
        })
        BotonMusica.on("pointerover", () => { BotonMusica.setScale(1.5); })
        BotonMusica.on("pointerout", () => { BotonMusica.setScale(1); })
        
        //VOLVER
        BotonVolver.setInteractive();
        BotonVolver.on("pointerdown", () => {
            this.scene.start("MenuScene", { musicaFondo: this.musica });
        })
        BotonVolver.on("pointerover", () => { BotonVolver.setScale(1.5); })
        BotonVolver.on("pointerout", () => { BotonVolver.setScale(1); })



    },

});