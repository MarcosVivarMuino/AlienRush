var ModoJuego = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "ModoJuego" });
    },

    preload: function () {
        this.load.image('BotonLocal', 'assets/ModoJuego/BotonLocal.png');
        this.load.image('BotonOnline', 'assets/ModoJuego/BotonOnline.png');

        this.load.image('BotonAtrasFlecha', 'assets/ModoJuego/BotonAtrasFlecha.png');
        this.load.image('Wifi', 'assets/SinConex/Wifi.png');
        this.load.image('noWifi', 'assets/SinConex/noWifi.png');
        this.load.image('fondoModoJuego', 'assets/ModoJuego/fondoModoJuego.png');
        this.load.html('idLobby', 'assets/nombre.html');
    },

    create: function () {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoModoJuego');

        /************************* VARIABLES *************************/
        let BotonLocal = this.add.image(1470, 500, 'BotonLocal');
        let BotonOnline = this.add.image(1470, 640, 'BotonOnline');

        let BotonAtrasFlecha = this.add.image(100, 100, 'BotonAtrasFlecha');

        let iconoWifi = this.add.image(1680, 825, 'Wifi').setScale(0.2);

       
        BotonLocal.setInteractive();
        BotonLocal.on("pointerdown", () => {
            this.scene.start("MainGame");

        });
        BotonLocal.on("pointerover", () => { BotonLocal.setScale(1.2); });
        BotonLocal.on("pointerout", () => { BotonLocal.setScale(1); });

        BotonOnline.setInteractive();
        BotonOnline.on("pointerdown", () => {
            this.scene.start("MainGameMultijugador");

        });
        BotonOnline.on("pointerover", () => { BotonOnline.setScale(1.2); });
        BotonOnline.on("pointerout", () => { BotonOnline.setScale(1); });
    

        // Botón Atrás
        BotonAtrasFlecha.setInteractive();
        BotonAtrasFlecha.on("pointerdown", () => {
            this.scene.start("MenuScene");
        });
        BotonAtrasFlecha.on("pointerover", () => { BotonAtrasFlecha.setScale(1.2); });
        BotonAtrasFlecha.on("pointerout", () => { BotonAtrasFlecha.setScale(1); });
    }
});