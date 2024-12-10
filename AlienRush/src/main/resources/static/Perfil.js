var Perfil = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "Perfil" });
    },

    init: function (data) {
        this.musicaMenu = data.musica;  // Música del menú
        this.musicasAdicionales = data.musicas || []; // Música adicional (si la hubiera)
    },

    preload: function () {
        this.load.image('BotonBorrarCuenta', 'assets/Perfil/BotonBorrarCuenta.png');
        this.load.image('BotonCerrarSesion', 'assets/Perfil/BotonCerrarSesion.png');
        this.load.image('BotonCambiarCuenta', 'assets/Perfil/BotonCambiarCuenta.png');
        this.load.image('BotonCambiarContraseña', 'assets/Perfil/BotonCambiarContraseña.png');
        this.load.image('iconoPerfil', 'assets/Perfil/iconoPerfil.png');
        this.load.image('fondoMenu', 'assets/Menu/fondoMenu.png');

    },

    create: function () {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoMenu');
        
        //AUDIO
        // Inicializar música del menú si no existe
        if (!GlobalMusic.musicaMenu) {
            GlobalMusic.musicaMenu = this.sound.add('musicaMenu', { loop: true });
        }
        
        // Reproducir música solo si está activada
        if (GlobalMusic.musicaActiva && !GlobalMusic.musicaMenu.isPlaying) {
            GlobalMusic.musicaMenu.play();
        }
        
        // Asegurarnos de detener la música del juego
        if (GlobalMusic.musicaJuego && GlobalMusic.musicaJuego.isPlaying) {
            GlobalMusic.musicaJuego.stop();
            GlobalMusic.musicaVictoria.stop();
        }

        /************************* VARIABLES *************************/
        let botonBorrarCuenta = this.add.image(700, 440, 'BotonBorrarCuenta');
        let botonCerrarSesion = this.add.image(1000, 440, 'BotonCerrarSesion');
        let botonCambiarCuenta = this.add.image(700, 580, 'BotonCambiarCuenta');
        let botonCambiarContraseña = this.add.image(1000, 580, 'BotonCambiarContraseña');
        this.add.image(1450, 500, 'iconoPerfil').setScale(0.8);

        /************************* BOTONES *************************/
        //botonBorrarCuenta
        botonBorrarCuenta.setInteractive();
        botonBorrarCuenta.on("pointerdown", () => {
            this.scene.start("MenuScene");
        })
        botonBorrarCuenta.on("pointerover", () => { botonBorrarCuenta.setScale(1.2); })
        botonBorrarCuenta.on("pointerout", () => { botonBorrarCuenta.setScale(1); })

        //botonCerrarSesion
        botonCerrarSesion.setInteractive();
        botonCerrarSesion.on("pointerdown", () => {
            this.scene.start("MenuScene");
        })
        botonCerrarSesion.on("pointerover", () => { botonCerrarSesion.setScale(1.2); })
        botonCerrarSesion.on("pointerout", () => { botonCerrarSesion.setScale(1); })

        //botonCambiarCuenta
        botonCambiarCuenta.setInteractive();
        botonCambiarCuenta.on("pointerdown", () => {
            this.scene.start("MenuScene");
        })
        botonCambiarCuenta.on("pointerover", () => { botonCambiarCuenta.setScale(1.2); })
        botonCambiarCuenta.on("pointerout", () => { botonCambiarCuenta.setScale(1); })

        //botonCambiarContraseña
        botonCambiarContraseña.setInteractive();
        botonCambiarContraseña.on("pointerdown", () => {
            this.scene.start("MenuScene");
        })
        botonCambiarContraseña.on("pointerover", () => { botonCambiarContraseña.setScale(1.2); })
        botonCambiarContraseña.on("pointerout", () => { botonCambiarContraseña.setScale(1); })
    }
});