var MenuPausa = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "MenuPausa" });
    },

    init: function (data) {
        this.musica = data.musica;
    },

    preload: function () {
        this.load.image('fondoPause', 'assets/MenuPausa/fondoPausa.png');
        this.load.image('botonReanudar', 'assets/MenuPausa/BotonReanudar.png');
        this.load.image('botonMenu', 'assets/MenuPausa/BotonMenu.png');
        this.load.image('botonOpciones', 'assets/MenuPausa/BotonOpciones.png');
    },

    create: function () {
        // Fondo del menú de pausa
        this.add.image(400, 300, 'fondoPause');

        // Botón de Reanudar
        let botonReanudar = this.add.image(400, 300, 'botonReanudar').setInteractive();
        botonReanudar.on('pointerdown', () => {
            console.log("Reanudando MainGame...");
            this.scene.resume('MainGame');
            this.scene.get('MainGame').onResume();
            this.scene.stop('MenuPausa');
        });

        // Botón de Menú Principal
        let botonMenu = this.add.image(400, 400, 'botonMenu').setInteractive();
        botonMenu.on('pointerdown', () => {
            console.log("Regresando al menú principal...");
            this.musica.stop();
            this.scene.stop('MainGame');
            this.scene.start('MenuScene');  // Volver al menú principal
        });

        // Botón de Opciones
        let botonOpciones = this.add.image(400, 500, 'botonOpciones').setInteractive();
        botonOpciones.on('pointerdown', () => {
            console.log("Abriendo Opciones desde PauseMenu...");
            this.scene.launch('OpcionesPausa', { musica: this.musica });
            this.scene.pause();  // Pausa la escena actual (MenuPausa) y abre OpcionesPausa
        });

    }
});
