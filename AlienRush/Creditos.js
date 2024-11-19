var Creditos = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "Creditos" });
    },

    preload: function () {
        this.load.image('fondoCreditos', 'assets/Creditos/fondoCreditos.png');

    },

    create: function () {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoCreditos');
        
        /************************* VARIABLES *************************/
        let BotonVolver = this.add.image(1470, 750, 'BotonVolver');

        /************************* BOTONES **************************/
        //VOLVER
        BotonVolver.setInteractive();
        BotonVolver.on("pointerdown", () => {
            this.scene.start("MenuScene", { musicaFondo: this.musica });
        })
        BotonVolver.on("pointerover", () => { BotonVolver.setScale(1.2); })
        BotonVolver.on("pointerout", () => { BotonVolver.setScale(1); })

    },

});