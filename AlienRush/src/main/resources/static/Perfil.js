var Perfil = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "Perfil" });
    },

    init: function (data) {
        this.musicaMenu = data.musica;  // Música del menú
        this.musicasAdicionales = data.musicas || []; // Música adicional (si la hubiera)
		this.nombreUsuario = data.nombreUsuario;
    },

    preload: function () {
        this.load.image('BotonBC', 'assets/Perfil/BotonBC.png');
        this.load.image('BotonCS', 'assets/Perfil/BotonCS.png');
        this.load.image('BotonCP', 'assets/Perfil/BotonCP.png');

		this.load.image('BotonAtrasFlecha', 'assets/Perfil/BotonAtrasFlecha.png');

		this.load.image('Confirmacion', 'assets/BorrarCuenta/RecuadroEstasSeguro.png');
		this.load.image('BotonSi', 'assets/BorrarCuenta/BotonSi.png');
		this.load.image('BotonNo', 'assets/BorrarCuenta/BotonNo.png');
		
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
        let botonCambiarContraseña = this.add.image(1470, 360, 'BotonCP');
        let botonBorrarCuenta = this.add.image(1470, 500, 'BotonBC');
        let botonCerrarSesion = this.add.image(1470, 640, 'BotonCS');

		let BotonAtrasFlecha = this.add.image(100, 100, 'BotonAtrasFlecha');

		// Confirmación
        let Confirmacion = this.add.image(1480, 440, 'Confirmacion').setVisible(false);
        let BotonSi = this.add.image(1410, 480, 'BotonSi').setVisible(false);
        let BotonNo = this.add.image(1545, 480, 'BotonNo').setVisible(false);
        
        iconoWifi = this.add.image(100, 200, 'Wifi').setScale(0.5);
        /************************* BOTONES *************************/
        //botonBorrarCuenta
        botonBorrarCuenta.setInteractive();
        botonBorrarCuenta.on("pointerdown", () => {
            this.scene.start("BorrarCuenta", {"nombreUsuario": this.nombreUsuario});
        })
        botonBorrarCuenta.on("pointerover", () => { botonBorrarCuenta.setScale(1.2); })
        botonBorrarCuenta.on("pointerout", () => { botonBorrarCuenta.setScale(1); })

        //botonCerrarSesion
        botonCerrarSesion.setInteractive();
        botonCerrarSesion.on("pointerdown", () => {
			Confirmacion.setVisible(true);
	        BotonSi.setVisible(true);
	        BotonNo.setVisible(true);
			botonBorrarCuenta.setVisible(false);
			botonCerrarSesion.setVisible(false);
			botonCambiarContraseña.setVisible(false);
        })
        botonCerrarSesion.on("pointerover", () => { botonCerrarSesion.setScale(1.2); })
        botonCerrarSesion.on("pointerout", () => { botonCerrarSesion.setScale(1); })

		// BotonNo
        BotonNo.setInteractive();
        BotonNo.on("pointerdown", () => {
            // Ocultar cuadro de confirmación
            Confirmacion.setVisible(false);
            BotonSi.setVisible(false);
            BotonNo.setVisible(false);
			botonBorrarCuenta.setVisible(true);
			botonCerrarSesion.setVisible(true);
			botonCambiarContraseña.setVisible(true);
        });
        BotonNo.on("pointerover", () => { BotonNo.setScale(1.2); });
        BotonNo.on("pointerout", () => { BotonNo.setScale(1); });

        // BotonSi
        BotonSi.setInteractive();
        BotonSi.on("pointerdown", () => {
		$.ajax({
    		method: "PUT",
    		url:"/numusuarios",
    		contentType: "application/json",
    		async: false,
    		data: JSON.stringify(this.nombreUsuario),
    		success: function () {
        		console.log("Usuario desconectado. Eliminado de la lista.");
    		},
    		error: function () {
        		console.error("Error al eliminar usuario de la lista.");
    		}
		});
			this.scene.start("SignInScene");
		});
        BotonSi.on("pointerover", () => { BotonSi.setScale(1.2); });
        BotonSi.on("pointerout", () => { BotonSi.setScale(1); });
				
       
        //botonCambiarContraseña
        botonCambiarContraseña.setInteractive();
        botonCambiarContraseña.on("pointerdown", () => {
            this.scene.start("CambiarContraseña", {"nombreUsuario": this.nombreUsuario});
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
		
		intervalConexion = setInterval(() => {
        	this.checkConexion();
    	}, 1000);
    },
    checkConexion: function(){
		let local = this;
		$.ajax({
        method: "GET",
        url: "/conexion",
        error: function () {
            iconoWifi.setTexture("noWifi").setScale(0.4);
            clearInterval(intervalConexion);
            local.reConnect();
        },
    });
	},
	reConnect: function () {
        this.scene.launch("MenuSinConexion", {"sceneName": "Perfil"});
        this.scene.bringToTop("MenuSinConexion");
        this.scene.pause();
    },
    onResume : function() {
       iconoWifi.setTexture("Wifi").setScale(0.5);
       intervalConexion = setInterval(() => {
        	this.checkConexion();
    	}, 1000);
    }
});