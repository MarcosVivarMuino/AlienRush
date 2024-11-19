var Victoria2 = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: 'Victoria2' });
    },

    init: function (data) {
        this.player1Score = data.player1Score;
        this.player2Score = data.player2Score;
    },

    preload: function () {
        this.load.image('fondoVictoria2', 'assets/Victoria2/fondoVictoria2.png');
        this.load.image('botonMenu', 'assets/Victoria2/BotonMenu.png');
    },

    create: function () {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoVictoria2');
        
        this.add.text(415, 610, `${this.player1Score}`, {
            fontSize: '80px',
            color: '#FFFFFF',
            fontFamily: 'Impact, fantasy'
        }).setOrigin(0.5);

        this.add.text(1350, 610, `${this.player2Score}`, {
            fontSize: '80px',
            color: '#FFFFFF',
            fontFamily: 'Impact, fantasy'
        }).setOrigin(0.5);

        /************************* VARIABLES *************************/
        let botonMenu = this.add.image(875, 800, 'botonMenu')

        /************************* BOTONES *************************/
        //MENU       
        botonMenu.setInteractive();
        botonMenu.on('pointerdown', () => {
            console.log("Regresando al menú principal...");
            this.scene.stop('MainGame');
            this.scene.start('MenuScene');  // Volver al menú principal
        });
        botonMenu.on("pointerover", () => { botonMenu.setScale(1.2); });
        botonMenu.on("pointerout", () => { botonMenu.setScale(1); });

    }
});
