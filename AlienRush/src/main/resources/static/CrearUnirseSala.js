var CrearUnirseSala = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "CrearUnirseSala" });
    },

    init: function (data) {
        /*this.musicaMenu = data.musica;  // Música del menú
        this.musicasAdicionales = data.musicas || []; // Música adicional (si la hubiera)
		this.nombreUsuario = data.nombreUsuario;*/
    },

    preload: function () {
        this.load.image('BotonUS', 'assets/CrearUnirseSala/BotonUnirseSala.png');
        this.load.image('BotonCS', 'assets/CrearUnirseSala/BotonCrearSala.png');
        this.load.image('BotonAceptar', 'assets/CrearUnirseSala/BotonAceptar.png');
        this.load.image('BotonCancelar', 'assets/CrearUnirseSala/BotonCancelar.png');
        this.load.image('texto', 'assets/CrearUnirseSala/textoLobby.png');

		this.load.image('BotonAtrasFlecha', 'assets/CrearUnirseSala/BotonAtrasFlecha.png');
		
        this.load.image('Wifi', 'assets/SinConex/Wifi.png');
        this.load.image('noWifi', 'assets/SinConex/noWifi.png');
		
	    this.load.image('fondoJugar', 'assets/CrearUnirseSala/fondoJugar.png');
        this.load.html('idLobby', 'assets/nombre.html');

    },

    create: function () {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoJugar');
        
        /*//AUDIO
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
*/
        /************************* VARIABLES *************************/
        let BotonUS = this.add.image(1470, 500, 'BotonUS');
        let BotonCS = this.add.image(1470, 360, 'BotonCS');
        let BotonAceptar = this.add.image(1470, 500, 'BotonAceptar').setVisible(false);
        let BotonCancelar = this.add.image(1470, 640, 'BotonCancelar').setVisible(false);
        let texto = this.add.image(1480, 320, 'texto').setVisible(false);

		let BotonAtrasFlecha = this.add.image(100, 100, 'BotonAtrasFlecha');
        
        let campoTexto = this.add.image(1350, 390, 'idLobby').setScale(1).setVisible(false);

		iconoWifi = this.add.image(1680, 825, 'Wifi').setScale(0.2);
        /************************* BOTONES *************************/
        //BotonCS
        BotonCS.setInteractive();
        BotonCS.on("pointerdown", () => {
            this.scene.start("CrearUnirseSala", {"nombreUsuario": this.nombreUsuario});
        })
        BotonCS.on("pointerover", () => { BotonCS.setScale(1.2); })
        BotonCS.on("pointerout", () => { BotonCS.setScale(1); })

        //BotonUS
        BotonUS.setInteractive();
        BotonUS.on("pointerdown", () => {
            BotonCS.setVisible(false);
            BotonUS.setVisible(false);
            campoTexto.setVisible(true);
            BotonAceptar.setVisible(true);
            BotonCancelar.setVisible(true);
            texto.setVisible(true);
        })
        BotonUS.on("pointerover", () => { BotonUS.setScale(1.2); })
        BotonUS.on("pointerout", () => { BotonUS.setScale(1); })

        //BotonCancelar
        BotonCancelar.setInteractive();
        BotonCancelar.on("pointerdown", () => {
            BotonCS.setVisible(true);
            BotonUS.setVisible(true);
            campoTexto.setVisible(false);
            BotonAceptar.setVisible(false);
            BotonCancelar.setVisible(false);
            texto.setVisible(false);
        })
        BotonCancelar.on("pointerover", () => { BotonCancelar.setScale(1.2); })
        BotonCancelar.on("pointerout", () => { BotonCancelar.setScale(1); })


        // BotonAceptar
        BotonAceptar.setInteractive();
        BotonAceptar.on("pointerdown", () => {
            const inputTextId = elementId1.getChildByName('nameField');
            const self = this; 
            if (inputTextId.value !== '')
            {
               /* $.ajax({	
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
                       self.scene.start("MenuScene", {"nombreUsuario" :inputTextId.value});
					}
				}).fail(function(data){
					alert("Usuario invalido o no registrado");
				});*/
            }
			this.scene.start("CrearUnirseSala");
		});
        BotonAceptar.on("pointerover", () => { BotonAceptar.setScale(1.2); });
        BotonAceptar.on("pointerout", () => { BotonAceptar.setScale(1); });
			
		//BotonAtrasFlecha
        BotonAtrasFlecha.setInteractive();
        BotonAtrasFlecha.on("pointerdown", () => {
            this.scene.start("MenuScene");
        })
        BotonAtrasFlecha.on("pointerover", () => { BotonAtrasFlecha.setScale(1.2); })
        BotonAtrasFlecha.on("pointerout", () => { BotonAtrasFlecha.setScale(1); })
		
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
        this.scene.launch("MenuSinConexion", {"sceneName": "CrearUnirseSala"});
        this.scene.bringToTop("MenuSinConexion");
		this.scene.pause();

    },
    onResume : function() {
       iconoWifi.setTexture("Wifi").setScale(0.2);
       this.setIntervals();
       this.scene.bringToTop("Perfil");
       this.input.enabled = true;
    }
});