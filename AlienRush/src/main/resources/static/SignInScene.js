var SignInScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "SignInScene" });
    },

    preload: function () {
		//Imagenes
        this.load.image('fondoInicio', 'assets/SignScene/Pantalla IS.png');
        this.load.image('Aceptar', 'assets/SignScene/BotonAceptar.png');
        this.load.image('Contrasena', 'assets/SignScene/LetrasContraseña.png');
        this.load.image('Usuario', 'assets/SignScene/LetrasUsuario.png');
		this.load.image('BotonR', 'assets/SignScene/BotonRegistrarse.png');
        this.load.image('Wifi', 'assets/SinConex/Wifi.png');
        this.load.image('noWifi', 'assets/SinConex/noWifi.png');
        this.load.image('botonRecargar', 'assets/SinConex/BotonRecargar.png');
        this.load.image('fondoError', 'assets/SinConex/fondoError.png');
        this.load.image('completaCampos', 'assets/SignScene/AlertaCompletaCampos.png');
        this.load.image('usuarioInvalido', 'assets/SignScene/AlertaUsuarioInvalido.png');

		this.load.image('BotonX', 'assets/CambiarContraseña/BotonX.png');

		//Audio
        this.load.audio('musicaMenu', 'audio/musicaMenu.mp3');
        this.load.image('fondoCarga','assets/Background/pantallaCarga.png');
        
        //Otras cosas
        this.load.html('nameform', 'assets/nombre.html');
        this.load.html('passform', 'assets/contra.html');
    },

    create: function () {
        /************************* FONDO *************************/
        //IMAGEN
        this.add.image(875, 440, 'fondoInicio');
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
        const elementId1 = this.add.dom(1465, 360).createFromCache('nameform');
        const elementPw1 = this.add.dom(1465, 460).createFromCache('passform');
		ready1 = this.add.image(1470, 670, 'Aceptar').setScale(1);
		BotonR = this.add.image(1470, 790, 'BotonR').setScale(1);
		text1 = this.add.image(1350, 320, 'Usuario').setScale(1);
		text2 = this.add.image(1380, 420, 'Contrasena').setScale(1);
        
        ready1.setInteractive();
        BotonR.setInteractive();
		iconoWifi = this.add.image(1680, 825, 'Wifi').setScale(0.2);

		//Alertas
		let alerta2 = this.add.image(1480, 400, 'usuarioInvalido').setVisible(false);;
		let alerta3 = this.add.image(1480, 400, 'completaCampos').setVisible(false);;
		let BotonX = this.add.image(1260, 465, 'BotonX').setVisible(false);;

		
        /************************* BOTONES *************************/
        ready1.on("pointerdown",()=>{
            const inputTextId = elementId1.getChildByName('nameField');
            const inputTextPw = elementPw1.getChildByName('password');
            const self = this; // Guardar el contexto actual
            //url:ipLocal+"usuarioInicio"
            if (inputTextId.value !== '' && inputTextPw.value !== '' )
            {
                $.ajax({
					
				method: "POST",
				
				url:"/usuarioInicio",
				
				data: JSON.stringify({nombre: inputTextId.value, password: inputTextPw.value}),
				
				processData: false,
				
				headers: {
					"Content-type":"application/json"
				}
				
				}).done(function(data, textStatus, jqXHR) {
					console.log(data);
					console.log(textStatus+" "+jqXHR.statusCode());
					if(textStatus == "success"){
					   self.registry.set('userName', inputTextId.value);
                       self.scene.start("MenuScene", {"nombreUsuario" :inputTextId.value});
					}
				}).fail(function(data){
					lanzarAlerta(alerta2);
			});
            }
			else{
				lanzarAlerta(alerta3);			}
        })
        
		function lanzarAlerta(alerta){
			alerta.setVisible(true);
			BotonX.setVisible(true);
			elementId1.setVisible(false);
			elementPw1.setVisible(false);
			ready1.setVisible(false);
			BotonR.setVisible(false);
   
			text1.setVisible(false);
			text2.setVisible(false);
		}

		// x
        BotonX.setInteractive();
        BotonX.on("pointerdown", () => {
            // Ocultar cuadro de confirmación
			elementId1.setVisible(true);
			elementPw1.setVisible(true);
			ready1.setVisible(true);
			BotonR.setVisible(true);
			alerta2.setVisible(false);
			alerta3.setVisible(false);
			BotonX.setVisible(false);
			text1.setVisible(true);
			text2.setVisible(true);
        });
		BotonX.on("pointerover", () => { BotonX.setScale(1.2); });
		BotonX.on("pointerout", () => { BotonX.setScale(1); });
				
        ready1.on("pointerover",()=>{
            ready1.setScale(1.2);
        })

        ready1.on("pointerout",()=>{
            ready1.setScale(1);
        })
        
        BotonR.on("pointerdown",()=>{
            this.scene.start("RegScene");
        })
		
		BotonR.on("pointerover",()=>{
            BotonR.setScale(1.2);
        })

        BotonR.on("pointerout",()=>{
            BotonR.setScale(1);
        })
    
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
        this.scene.launch("MenuSinConexion", {"sceneName": "SignInScene"});
        this.scene.bringToTop("MenuSinConexion");
        this.scene.pause();
    },
    onResume : function() {
       iconoWifi.setTexture("Wifi").setScale(0.2);
       this.setIntervals();
       this.scene.bringToTop("SignInScene");
       this.input.enabled = true;
    }
	
});