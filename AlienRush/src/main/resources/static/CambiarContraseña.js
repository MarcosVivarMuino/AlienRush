var CambiarContraseña = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "CambiarContraseña" });
    },

	init: function (data) {
       this.nombreUsuario = data.nombreUsuario;            
   },
	   
    preload: function () {
		//Imagenes
        this.load.image('fondoCambiarContraseña', 'assets/CambiarContraseña/fondoCambiarContraseña.png');
        this.load.image('BotonAceptar', 'assets/CambiarContraseña/BotonAceptar.png');
        this.load.image('BotonAtrasFlecha', 'assets/CambiarContraseña/BotonAtrasFlecha.png');
		
		this.load.image('Confirmacion', 'assets/CambiarContraseña/RecuadroEstasSeguro.png');
		this.load.image('BotonSi', 'assets/CambiarContraseña/BotonSi.png');
		this.load.image('BotonNo', 'assets/CambiarContraseña/BotonNo.png');
		
		this.load.image('Contrasena', 'assets/CambiarContraseña/LetrasContraseña.png');
		this.load.image('NContrasena', 'assets/CambiarContraseña/LetrasNuevaContraseña.png');
		this.load.image('Wifi', 'assets/SinConex/Wifi.png');
		this.load.image('noWifi', 'assets/SinConex/noWifi.png');
		//Audio
        this.load.audio('musicaMenu', 'audio/musicaMenu.mp3');
		
		//Html
		this.load.html('nameform', 'assets/nombre.html');
		this.load.html('passform', 'assets/contra.html');
    },

    create: function () {	
        /************************* FONDO *************************/
        //IMAGEN
        this.add.image(875, 440, 'fondoCambiarContraseña');
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
        } else if(GlobalMusic.musicaVictoria && GlobalMusic.musicaVictoria.isPlaying) {
            GlobalMusic.musicaVictoria.stop();
        } else if(GlobalMusic.musicaEmpate && GlobalMusic.musicaEmpate.isPlaying) {
            GlobalMusic.musicaEmpate.stop();
        } 


        /************************* VARIABLES *************************/
		const cuadroContra = this.add.dom(1465, 400).createFromCache('passform');
		const cuadroNuevaContra = this.add.dom(1465, 500).createFromCache('passform');
		
		let BotonAceptar = this.add.image(1530, 640, 'BotonAceptar');
		let BotonAtrasFlecha = this.add.image(1320, 640, 'BotonAtrasFlecha');
		
		this.add.image(1380, 360, 'Contrasena').setScale(1);
		this.add.image(1450, 460, 'NContrasena').setScale(1);
		// Confirmación
        let Confirmacion = this.add.image(1480, 440, 'Confirmacion').setVisible(false);
        let BotonSi = this.add.image(1410, 480, 'BotonSi').setVisible(false);
        let BotonNo = this.add.image(1545, 480, 'BotonNo').setVisible(false);
		iconoWifi = this.add.image(1680, 825, 'Wifi').setScale(0.2);

        /************************* BOTONES *************************/
        //BotonAceptar
        BotonAceptar.setInteractive();
        BotonAceptar.on("pointerdown", () => {
			const inputTextPw = cuadroContra.getChildByName('password');
			const inputTextNewPw = cuadroNuevaContra.getChildByName('password');

			if (inputTextPw.value !== '' && inputTextNewPw.value !== '') {
		        Confirmacion.setVisible(true);
		        BotonSi.setVisible(true);
		        BotonNo.setVisible(true);
				cuadroNuevaContra.setVisible(false);
				cuadroContra.setVisible(false);
				BotonAceptar.setVisible(false);
				BotonAtrasFlecha.setVisible(false);
				
			} else {
			    alert("Por favor, completa ambos campos.");
			}
        })
        BotonAceptar.on("pointerover", () => { BotonAceptar.setScale(1.2); })
        BotonAceptar.on("pointerout", () => { BotonAceptar.setScale(1); })

        //BotonAtrasFlecha
        BotonAtrasFlecha.setInteractive();
        BotonAtrasFlecha.on("pointerdown", () => {
            this.scene.start("Perfil");
        })
        BotonAtrasFlecha.on("pointerover", () => { BotonAtrasFlecha.setScale(1.2); })
        BotonAtrasFlecha.on("pointerout", () => { BotonAtrasFlecha.setScale(1); })

		// BotonNo
        BotonNo.setInteractive();
        BotonNo.on("pointerdown", () => {
			this.scene.start("CambiarContraseña");
        });
        BotonNo.on("pointerover", () => { BotonNo.setScale(1.2); });
        BotonNo.on("pointerout", () => { BotonNo.setScale(1); });

        // BotonSi
        BotonSi.setInteractive();
        BotonSi.on("pointerdown", () => {
            const inputTextPw = cuadroContra.getChildByName('password');
            const inputTextNewPw = cuadroNuevaContra.getChildByName('password');

            if (inputTextNewPw.value !== '' && inputTextPw.value !== '') {
                const usuario = {
                    "nombre": this.nombreUsuario,
                    "password": inputTextPw.value,
					"nuevaPassword": inputTextNewPw.value
					
                };
				console.log(usuario);
                $.ajax({
                    method: "PUT",
                    url:"/usuario",
                    data: JSON.stringify(usuario),
                    contentType: "application/json",
                    processData: false
                })
                .done(function (data, textStatus, jqXHR) {
                    if (textStatus === "success") {
                        this.scene.start("MenuScene"); // Volver al perfil o menú principal
                    }
					
                }.bind(this))
				
                .fail(function (data) {
                    alert("La contraseña no es correcta");
                   
				});
				
            }else{
				alert("Rellena ambos campos");
			}

        });
        BotonSi.on("pointerover", () => { BotonSi.setScale(1.2); });
        BotonSi.on("pointerout", () => { BotonSi.setScale(1); });

		this.setIntervals();
				

			},
			
		    
		    checkConexion: function(){
				let local = this;
				$.ajax({
		        method: "GET",
		        url: "/conexion",
		        error: function () {
		            iconoWifi.setTexture("noWifi").setScale(0.2);
		            local.stopIntervals();
		            local.reConnect();
		        },
		    });
			},
			
			setIntervals: function(){
				intervalConexion = setInterval(() => {
		        	this.checkConexion();
		    	}, 1000);
			},
			
			stopIntervals: function(){
				clearInterval(intervalConexion);
			},
			
			reConnect: function () {
		        this.scene.launch("MenuSinConexion", {"sceneName": "CambiarContraseña"});
		        this.scene.bringToTop("MenuSinConexion");
		        this.scene.pause();
		    },
		    onResume : function() {
		       iconoWifi.setTexture("Wifi").setScale(0.2);
		       this.setIntervals();
		    }
});




