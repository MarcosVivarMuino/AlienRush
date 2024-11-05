var Victoria = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function() {
        Phaser.Scene.call(this, { "key": "Victoria" });
    },

    preload: function() {
        this.load.image('fondoVictoria','assets/Victoria/fondoVictoria.png');

    },

    create: function() {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoVictoria').setScale(5, 3.5);
        
    },
    
});