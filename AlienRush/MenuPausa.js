var MenuPausa = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "MenuPausa" });
    },

    init: function (data) {
        this.musica = data.musica;
    },

    preload: function () {
        this.load.image('fondoPausa', 'assets/MenuPausa/fondoPausa.png');
        this.load.image('botonReanudar', 'assets/MenuPausa/BotonReanudar.png');
        this.load.image('botonMenu', 'assets/MenuPausa/BotonMenu.png');
    },

    create: function () {
         /************************* FONDO *************************/
        //IMAGEN
        this.add.image(875, 440, 'fondoPausa');
        //AUDIO
        
        
        /************************* VARIABLES *************************/
        let botonReanudar = this.add.image(875, 440, 'botonReanudar')       
        let botonMenu = this.add.image(875, 590, 'botonMenu')
        
        /************************* BOTONES *************************/
        //REANUDAR
        botonReanudar.setInteractive();
        botonReanudar.on('pointerdown', () => {
            console.log("Reanudando MainGame...");
            this.scene.resume('MainGame');
            this.scene.get('MainGame').onResume();
            this.scene.stop('MenuPausa');
        });

        //MENU       
        botonMenu.setInteractive();
        botonMenu.on('pointerdown', () => {
            console.log("Regresando al menú principal...");
            this.scene.stop('MainGame');
            this.scene.start('MenuScene');  // Volver al menú principal
        });

    }
});