var RegScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "RegScene" });
    },

    preload: function () {
		//Imagenes
        this.load.image('fondoRegistro', 'assets/RegScene/Pantalla Registro.png');
        this.load.image('Aceptar', 'assets/SignScene/BotonAceptar.png');
        this.load.image('Contrasena', 'assets/SignScene/LetrasContraseña.png');
        this.load.image('Usuario', 'assets/SignScene/LetrasUsuario.png');
		this.load.image('BotonIS', 'assets/RegScene/BotonIS.png');
				
		//Audio
        this.load.audio('musicaMenu', 'audio/musicaMenu.mp3');
        this.load.image('fondoCarga','assets/Background/pantallaCarga.png');
        
        //Otras cosas
        this.load.html('nameform', 'assets/nombre.html');
        this.load.html('passform', 'assets/contra.html');
    },

    create: function () {
		///////////////////////////////////////////////////////API//////////////////////////////////////////////////////////////
		fetch('/api/getIp')
    			.then(response => response.text())
    			.then(data => {
				ipLocal = "http://"+data+":8080/"
        		console.log(ipLocal); 
    	});
        /************************* FONDO *************************/
        //IMAGEN
        this.add.image(875, 440, 'fondoRegistro');
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
        const elementId1 = this.add.dom(1500, 400).createFromCache('nameform');
        const elementPw1 = this.add.dom(1500, 500).createFromCache('passform');
		const elementPw2 = this.add.dom(1500, 600).createFromCache('passform');

        cont = this;
        ready1 = this.add.image(1500, 690, 'Aceptar').setScale(1);
		BotonIS = this.add.image(1500, 800, 'BotonIS').setScale(1);
        this.add.image(1380, 360, 'Usuario').setScale(1);
        this.add.image(1410, 455, 'Contrasena').setScale(1);
        this.add.image(1410, 555, 'Contrasena').setScale(1);
        
        ready1.setInteractive();
        BotonIS.setInteractive();

        /************************* BOTONES *************************/
        ready1.on("pointerdown",()=>{
            const inputTextId = elementId1.getChildByName('nameField');
            const inputTextPw = elementPw1.getChildByName('password');
			const inputTextPw2 = elementPw2.getChildByName('password');
						
            const self = this; // Guardar el contexto actual
            
                if (inputTextId.value !== '' && inputTextPw.value !== '' && inputTextPw2.value !== '')
                {
					if(inputTextPw.value == inputTextPw2.value){
						$.ajax({
											
						method: "POST",
						
						url:ipLocal+"usuario",
						
						data: JSON.stringify({nombre: inputTextId.value, password: inputTextPw.value}),
						
						processData: false,
						
						headers: {
							"Content-type":"application/json"
						}
						
						})
						
						.done(function(data, textStatus, jqXHR) {
							console.log(data);
							console.log(textStatus+" "+jqXHR.statusCode());
							if(textStatus == "success"){
		                           self.scene.start("MenuScene", {"nombreUsuario": inputTextId});
							}
						})
						
						.fail(function(data){
							alert("Usuario invalido o no registrado");
						});
					}else{
						alert("Las contraseñas no coinciden");
					}
                   
				}else{
					alert("Rellena todos los campos");
				}
        })
        
        ready1.on("pointerover",()=>{
            ready1.setScale(1.2);
        })

        ready1.on("pointerout",()=>{
            ready1.setScale(1);
        })
        
        BotonIS.on("pointerdown",()=>{
            this.scene.start("SignInScene");
        })
		
		BotonIS.on("pointerover",()=>{
            BotonIS.setScale(1.2);
        })

        BotonIS.on("pointerout",()=>{
            BotonIS.setScale(1);
        })
    },
});