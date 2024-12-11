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
        this.load.image('BotonBC', 'assets/Perfil/BotonBC.png');
        this.load.image('BotonCS', 'assets/Perfil/BotonCS.png');
        this.load.image('BotonCC', 'assets/Perfil/BotonCC.png');
        this.load.image('BotonCP', 'assets/Perfil/BotonCP.png');

		this.load.image('BotonAtrasFlecha', 'assets/Perfil/BotonAtrasFlecha.png');

	    this.load.image('fondoPerfil', 'assets/Perfil/fondoPerfil.png');

    },

    create: function () {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoPerfil');
        
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
        let botonBorrarCuenta = this.add.image(1470, 360, 'BotonBC');
        let botonCerrarSesion = this.add.image(1470, 500, 'BotonCS');
        let botonCambiarCuenta = this.add.image(1470, 640, 'BotonCC');
        let botonCambiarContraseña = this.add.image(1470, 780, 'BotonCP');

		let BotonAtrasFlecha = this.add.image(100, 100, 'BotonAtrasFlecha');

        /************************* BOTONES *************************/
        //botonBorrarCuenta
        botonBorrarCuenta.setInteractive();
        botonBorrarCuenta.on("pointerdown", () => {
            this.scene.start("BorrarCuenta");
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
		
		//BotonAtrasFlecha
        BotonAtrasFlecha.setInteractive();
        BotonAtrasFlecha.on("pointerdown", () => {
            this.scene.start("MenuScene");
        })
        BotonAtrasFlecha.on("pointerover", () => { BotonAtrasFlecha.setScale(1.2); })
        BotonAtrasFlecha.on("pointerout", () => { BotonAtrasFlecha.setScale(1); })

    }
});