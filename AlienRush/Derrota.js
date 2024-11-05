var Derrota = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function() {
        Phaser.Scene.call(this, { "key": "Derrota" });
    },

    preload: function() {
        this.load.image('fondoDerrota','assets/Derrota/fondoDerrota.png');

    },

    create: function() {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoDerrota').setScale(5, 3.5);
        
    },
    
});