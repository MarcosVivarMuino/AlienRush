var Victoria1 = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: 'Victoria1' });
    },

    init: function(data){
        this.player1Score = data.player1Score;
        this.player2Score = data.player2Score;
    },

    preload: function () {
        this.load.image('fondoVictoria1', 'assets/Victoria1/fondoVictoria1.png');
        this.load.image('botonMenu', 'assets/Victoria1/BotonMenu.png');
    },

    create: function () {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoVictoria1').setScale(0.5);
       
        this.add.text(700, 440, `Jugador 1: ${this.player1Score} puntos`, {
            fontSize: '30px',
            color: '#000',
            fontFamily: 'Impact, fantasy'
        }).setOrigin(0.5);

        this.add.text(700, 540, `Jugador 2: ${this.player2Score} puntos`, {
            fontSize: '30px',
            color: '#000',
            fontFamily: 'Impact, fantasy'
        }).setOrigin(0.5);

        /************************* VARIABLES *************************/
        let botonMenu = this.add.image(875, 740, 'botonMenu')

        /************************* BOTONES *************************/
        //MENU       
        botonMenu.setInteractive();
        botonMenu.on('pointerdown', () => {
            console.log("Regresando al menú principal...");
            this.scene.stop('MainGame');
            this.scene.start('MenuScene');  // Volver al menú principal
        });
        botonMenu.on("pointerover", () => { botonMenu.setScale(1.5); });
        botonMenu.on("pointerout", () => { botonMenu.setScale(1); });

    }
});
