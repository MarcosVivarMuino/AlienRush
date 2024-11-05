var MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function() {
        Phaser.Scene.call(this, { "key": "MenuScene" });
    },

    preload: function() {
        this.load.image('fondoMenu','assets/Menu/fondoMenu.jpg');
        this.load.image('play','assets/Menu/BotonJugar.png');
        this.load.image('ajustes','assets/Menu/BotonAjustes.png');
        this.load.image('creditos','assets/Menu/BotonCreditos.png');
    },

    create: function() {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoMenu').setScale(5, 3.5);
        
        /************************* VARIABLES *************************/
        let play = this.add.image(875, 560, 'play');        
        let ajustes = this.add.image(875, 680, 'ajustes');
        let creditos = this.add.image(875, 800, 'creditos');
        
        /************************* BOTONES *************************/
        //JUGAR
        play.setInteractive();
        play.on("pointerdown",()=>{
            this.scene.start("Victoria");
        })
        play.on("pointerover",()=>{
            play.setScale(1.5);
        })
        play.on("pointerout",()=>{
            play.setScale(1);
        })
            
        //AJUSTES
        ajustes.setInteractive();
        ajustes.on("pointerdown",()=>{
            this.scene.start("Derrota");
        })
        ajustes.on("pointerover",()=>{
            ajustes.setScale(1.5);
        })
        ajustes.on("pointerout",()=>{
            ajustes.setScale(1);
        })

        //CREDITOS
        creditos.setInteractive();
        creditos.on("pointerdown",()=>{
            this.scene.start("Creditos");
        })
        creditos.on("pointerover",()=>{
            creditos.setScale(1.5);
        })
        creditos.on("pointerout",()=>{
            creditos.setScale(1);
        })
    },

});