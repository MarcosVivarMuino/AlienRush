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
		
		//Audio
        this.load.audio('musicaMenu', 'audio/musicaMenu.mp3');
		
		//Html
		this.load.html('nameform', 'assets/nombre.html');
		this.load.html('passform', 'assets/contra.html');
    },

    create: function () {
		fetch('/api/getIp')
    			.then(response => response.text())
    			.then(data => {
				ipLocal = "http://"+data+":8080/"
        		console.log(data); 
    	});
		
				
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
		const cuadroNombre = this.add.dom(1470, 360).createFromCache('nameform');
		const cuadroContra = this.add.dom(1470, 460).createFromCache('passform');
		const cuadroNuevaContra = this.add.dom(1470, 560).createFromCache('newpassform');
		
		let BotonAceptar = this.add.image(1530, 640, 'BotonAceptar');
		let BotonAtrasFlecha = this.add.image(1320, 640, 'BotonAtrasFlecha');
		
		// Confirmación
        let Confirmacion = this.add.image(1480, 440, 'Confirmacion').setVisible(false);
        let BotonSi = this.add.image(1410, 480, 'BotonSi').setVisible(false);
        let BotonNo = this.add.image(1545, 480, 'BotonNo').setVisible(false);
        /************************* BOTONES *************************/
        //BotonAceptar
        BotonAceptar.setInteractive();
        BotonAceptar.on("pointerdown", () => {
			const inputTextId = cuadroNombre.getChildByName('nameField');
			const inputTextPw = cuadroContra.getChildByName('password');

			if (inputTextId.value !== '' && inputTextPw.value !== '') {
		        Confirmacion.setVisible(true);
		        BotonSi.setVisible(true);
		        BotonNo.setVisible(true);
				cuadroNombre.setVisible(false);
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
            // Ocultar cuadro de confirmación
            Confirmacion.setVisible(false);
            BotonSi.setVisible(false);
            BotonNo.setVisible(false);
			cuadroNombre.setVisible(true);
			cuadroContra.setVisible(true);
			BotonAceptar.setVisible(true);
			BotonAtrasFlecha.setVisible(true);
        });
        BotonNo.on("pointerover", () => { BotonNo.setScale(1.2); });
        BotonNo.on("pointerout", () => { BotonNo.setScale(1); });

        // BotonSi
        BotonSi.setInteractive();
        BotonSi.on("pointerdown", () => {
            const inputTextId = cuadroNombre.getChildByName('nameField');
            const inputTextPw = cuadroContra.getChildByName('password');

            if (inputTextId.value !== '' && inputTextPw.value !== '') {
                const usuario = {
                    nombre: inputTextId.value,
                    password: inputTextPw.value
                };

                $.ajax({
                    method: "DELETE",
                    url: ipLocal + "usuario",
                    data: JSON.stringify(usuario),
                    contentType: "application/json",
                    processData: false
                })
                .done(function (data, textStatus, jqXHR) {
                    if (textStatus === "success") {
                        this.scene.start("Perfil"); // Volver al perfil o menú principal
                    }
					
                }.bind(this))
				
                .fail(function (data) {
                    alert("Usuario o contraseña incorrecta.");
                   
				});
				
            }

        });
        BotonSi.on("pointerover", () => { BotonSi.setScale(1.2); });
        BotonSi.on("pointerout", () => { BotonSi.setScale(1); });
    }
});




