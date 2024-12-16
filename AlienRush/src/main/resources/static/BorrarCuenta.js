var BorrarCuenta = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "BorrarCuenta" });
    },

	init: function (data) {
	    this.nombreUsuario = data.nombreUsuario;            
	},
	
    preload: function () {
		//Imagenes
        this.load.image('fondoBorrarCuenta', 'assets/BorrarCuenta/fondoBorrarCuenta.png');
        this.load.image('BotonAceptar', 'assets/BorrarCuenta/BotonAceptar.png');
        this.load.image('BotonAtrasFlecha', 'assets/BorrarCuenta/BotonAtrasFlecha.png');
		this.load.image('Contrasena', 'assets/BorrarCuenta/LetrasContraseña.png');
		this.load.image('RContrasena', 'assets/BorrarCuenta/LetrasRepiteContraseña.png');
		this.load.image('Confirmacion', 'assets/BorrarCuenta/RecuadroEstasSeguro.png');
		this.load.image('BotonSi', 'assets/BorrarCuenta/BotonSi.png');
		this.load.image('BotonNo', 'assets/BorrarCuenta/BotonNo.png');
		
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
        this.add.image(875, 440, 'fondoBorrarCuenta');
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
		const cuadroRContra = this.add.dom(1465, 500).createFromCache('passform');
				
		let BotonAceptar = this.add.image(1530, 640, 'BotonAceptar');
		let BotonAtrasFlecha = this.add.image(1320, 640, 'BotonAtrasFlecha');
		
		this.add.image(1380, 360, 'Contrasena').setScale(1);
		this.add.image(1470, 460, 'RContrasena').setScale(1);
		// Confirmación
        let Confirmacion = this.add.image(1480, 440, 'Confirmacion').setVisible(false);
        let BotonSi = this.add.image(1410, 480, 'BotonSi').setVisible(false);
        let BotonNo = this.add.image(1545, 480, 'BotonNo').setVisible(false);
        /************************* BOTONES *************************/
        //BotonAceptar
        BotonAceptar.setInteractive();
        BotonAceptar.on("pointerdown", () => {
			const inputTextPw = cuadroContra.getChildByName('password');
			const inputTextRPw = cuadroRContra.getChildByName('password');
			
			
			if (inputTextRPw.value !== '' && inputTextPw.value !== '') {
		        Confirmacion.setVisible(true);
		        BotonSi.setVisible(true);
		        BotonNo.setVisible(true);
				cuadroContra.setVisible(false);
				cuadroRContra.setVisible(false);
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
			cuadroContra.setVisible(true);
			cuadroRContra.setVisible(true);
			BotonAceptar.setVisible(true);
			BotonAtrasFlecha.setVisible(true);
        });
        BotonNo.on("pointerover", () => { BotonNo.setScale(1.2); });
        BotonNo.on("pointerout", () => { BotonNo.setScale(1); });

        // BotonSi
        BotonSi.setInteractive();
        BotonSi.on("pointerdown", () => {
            const inputTextPw = cuadroContra.getChildByName('password');
            const inputTextRPw = cuadroRContra.getChildByName('password');
			
            if (inputTextRPw.value !== '' && inputTextPw.value !== '') {
				if(inputTextPw.value == inputTextRPw.value){
					const usuario = {
	                    "nombre": this.nombreUsuario,
	                    "password": inputTextPw.value
	                };
					
					console.log(usuario);
	
	                $.ajax({
	                    method: "DELETE",
	                    url:"/usuario",
	                    data: JSON.stringify(usuario),
	                    contentType: "application/json",
	                    processData: false
	                })
	                .done(function (data, textStatus, jqXHR) {
	                    if (textStatus === "success") {
	                        this.scene.start("SignInScene"); // Volver al perfil o menú principal
	                    }
						
	                }.bind(this))
					
	                .fail(function (data) {
	                    alert("Contraseña incorrecta.");
	                   
					});
				}else{
					alert("Las contraseñas no coinciden");

				}
			}else{
				alert("Rellena ambos campos");
			}

        });
        BotonSi.on("pointerover", () => { BotonSi.setScale(1.2); });
        BotonSi.on("pointerout", () => { BotonSi.setScale(1); });
    }
});




