var Creditos = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function() {
        Phaser.Scene.call(this, { "key": "Creditos" });
    },

    preload: function() {
        this.load.image('fondoCreditos','assets/Creditos/fondoCreditos.png');

    },

    create: function() {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoCreditos');
        
    },
    
});