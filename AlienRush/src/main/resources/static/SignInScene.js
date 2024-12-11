var SignInScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "SignInScene" });
    },

    preload: function () {
		//Imagenes
        this.load.image('fondoMenu', 'assets/Menu/fondoMenu.png');
        this.load.image('Aceptar', 'assets/SignScene/BotonAceptar.png');
		
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
        } else if(GlobalMusic.musicaVictoria && GlobalMusic.musicaVictoria.isPlaying) {
            GlobalMusic.musicaVictoria.stop();
        } else if(GlobalMusic.musicaEmpate && GlobalMusic.musicaEmpate.isPlaying) {
            GlobalMusic.musicaEmpate.stop();
        } 


        /************************* VARIABLES *************************/
        const elementId1 = this.add.dom(900, 400).createFromCache('nameform');
        const elementPw1 = this.add.dom(900, 475).createFromCache('passform');
        ready1 = this.add.image(900, 590, 'Aceptar').setScale(1);
        
        ready1.setInteractive();

        /************************* BOTONES *************************/
        ready1.on("pointerdown",()=>{
            const inputTextId = elementId1.getChildByName('nameField');
            const inputTextPw = elementPw1.getChildByName('password');
            
                if (inputTextId.value !== '' && inputTextPw.value !== '' )
                {
                    $.ajax({
						
					method: "POST",
					
					url:ipLocal+"usuarioInicio",
					
					data: JSON.stringify({nombre: inputTextId.value, password: inputTextPw.value}),
					
					processData: false,
					
					headers: {
						"Content-type":"application/json"
					}
					
					}).done(function(data, textStatus, jqXHR) {
						console.log(data);
						console.log(textStatus+" "+jqXHR.statusCode());
						if(textStatus == "success"){
                            this.scene.start("MenuScene");
						}
					}).fail(function(data){
						alert("Usuario invalido o no registrado");
					});
                }
        })
        
        ready1.on("pointerover",()=>{
            ready1.setScale(1.2);
        })

        ready1.on("pointerout",()=>{
            ready1.setScale(1);
        })
    },
});