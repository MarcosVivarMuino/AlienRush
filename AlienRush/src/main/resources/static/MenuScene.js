var MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "MenuScene" });
    },
    
    init: function(data) {
		this.nombreUsuario = data.nombreUsuario
    },

    preload: function () {
        this.load.image('fondoMenu', 'assets/Menu/fondoMenu.png');
        this.load.image('play', 'assets/Menu/BotonJugar.png');
        this.load.image('ajustes', 'assets/Menu/BotonAjustes.png');
        this.load.image('creditos', 'assets/Menu/BotonCreditos.png');
        this.load.image('iconoPerfil', 'assets/Menu/iconoPerfil.png');
        this.load.image('enviar', 'assets/SignScene/BotonAceptar.png');
        this.load.image('Wifi', 'assets/SinConex/Wifi.png');
        this.load.image('noWifi', 'assets/SinConex/noWifi.png');

        this.load.audio('musicaMenu', 'audio/musicaMenu.mp3');
        this.load.image('fondoCarga','assets/Background/pantallaCarga.png');
        
        this.load.html('nameform', 'assets/nombre.html');
    },

    create: function () {
    	////////////////////////////////NUMJUGADORES/////////////////////////////////
			$.ajax({
    			method: "POST",
    			url:"/numusuarios",
    			contentType: "application/json",
    			data: JSON.stringify(this.nombreUsuario),
    			success: function () {
        			console.log("Usuario conectado. Añadido a la lista.");
    			},
    			error: function () {
        			console.error("Error al agregar usuario a la lista.");
    		}
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
        let play = this.add.image(1470, 360, 'play');
        let ajustes = this.add.image(1470, 500, 'ajustes');
        let creditos = this.add.image(1470, 640, 'creditos');
        let iconoPerfil = this.add.image(100, 80, 'iconoPerfil').setScale(0.7);;
        iconoWifi = this.add.image(1680, 825, 'Wifi').setScale(0.2);

		////////////////////////////////////////CHAT///////////////////////////////////////////
		// Fondo del chat
	    const chatBackground = this.add.rectangle(0, 520, 500, 300, 0x000000).setOrigin(0).setAlpha(0.8);
	
	    // Texto de mensajes
	    chatMessages = this.add.text(0, 1500, '', {
	        font: '25px Arial',
	        fill: '#ffffff',
	        wordWrap: { width: 480 }
	    }).setOrigin(0);
		///////////////////////////////////MUESTREODEUSUARIOS//////////////////////////////////
		usuariosConectadosText = this.add.text(20, 470, 'Usuarios conectados: 0', {
        	fontFamily: 'Impact, fantasy',
        	fill: '#ffffff',
        	fontSize: '40px'
    	});
	    // Entrada de texto para el mensaje
	    const chatInput = this.add.dom(210, 850).createFromCache('nameform');
		// Capturar el evento de tecla "Enter"
		const inputField = chatInput.getChildByName('nameField');
		inputField.addEventListener("keypress", function (event) {
		    if (event.key === "Enter") {
		        // Cuando se presiona "Enter", enviar el mensaje
		        if (inputField && inputField.value.trim() !== '') {
		            this.sendMessage(inputField.value);
		            inputField.value = '';  // Limpiar el campo de texto después de enviar el mensaje
		        }
		    }
		}.bind(this));
		
	    btnEnviar = this.add.image(460, 850, 'enviar').setInteractive().setScale(0.4);
	
	    btnEnviar.on('pointerdown', () => {
            const inputField = chatInput.getChildByName('nameField');
            if (inputField && inputField.value.trim() !== '') {
                this.sendMessage(inputField.value);
                inputField.value = '';
            }
        });
        /************************* BOTONES *************************/
        //JUGAR
        play.setInteractive();
        play.on("pointerdown", () => {
<<<<<<< Updated upstream
            this.scene.start("CrearUnirSala", {"nombreUsuario": this.nombreUsuario});
=======
            this.scene.start("ModoJuego", {"nombreUsuario": this.nombreUsuario});
>>>>>>> Stashed changes
        })
        play.on("pointerover", () => { play.setScale(1.2); })
        play.on("pointerout", () => { play.setScale(1); })

        //AJUSTES
        ajustes.setInteractive();
        ajustes.on("pointerdown", () => {
            this.scene.start("Ajustes", {
                musica: GlobalMusic.musicaMenu,
                musicas: [GlobalMusic.musicaMenu, GlobalMusic.musicaJuego]
            });
        })
        ajustes.on("pointerover", () => { ajustes.setScale(1.2); })
        ajustes.on("pointerout", () => { ajustes.setScale(1); })

        //CREDITOS
        creditos.setInteractive();
        creditos.on("pointerdown", () => {
            this.scene.start("Creditos");
        })
        creditos.on("pointerover", () => { creditos.setScale(1.2); })
        creditos.on("pointerout", () => { creditos.setScale(1); })

        //ICONO PERFIL
        iconoPerfil.setInteractive();
        iconoPerfil.on("pointerdown", () => {
            this.scene.start("Perfil", {"nombreUsuario": this.nombreUsuario});
        })
        iconoPerfil.on("pointerover", () => { iconoPerfil.setScale(0.9); })
        iconoPerfil.on("pointerout", () => { iconoPerfil.setScale(0.7); })
        
        //////////////////////////////////////////////INTERVALOS/////////////////////////////////////////////////////////
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
		intervalChat = setInterval(() => {
    		this.refreshChat(chatMessages);
		}, 1000);
	
		// Actualizar el número de usuarios conectados cada segundo
    	intervalUsers = setInterval(() => {
        	this.refreshUsuariosConectados(usuariosConectadosText);
    	}, 1000);
    	
    	intervalConexion = setInterval(() => {
        	this.checkConexion();
    	}, 1000);
	},
	
	stopIntervals: function(){
		clearInterval(intervalChat);
		clearInterval(intervalUsers);
		clearInterval(intervalConexion);
	},
	
	 reConnect: function () {
        this.scene.launch("MenuSinConexion", {"sceneName": "MenuScene"});
        this.scene.bringToTop("MenuSinConexion");
		this.scene.pause();

    },
    
    onResume : function() {
       iconoWifi.setTexture("Wifi").setScale(0.2);
       this.setIntervals();
       this.scene.bringToTop("MenuScene");
       this.input.enabled = true;
    },
	
    sendMessage: function (message) {
     const chatMessage = {
        NombreUsuario: this.nombreUsuario,
        mensaje: message
    };

    // Enviar el mensaje al servidor
    $.ajax({
        method: "POST",
        url:"/chat", // La URL de tu servidor
        data: JSON.stringify(chatMessage), // Convierte el objeto a JSON
        contentType: "application/json",  // Asegúrate de establecer el tipo de contenido
        success: function () {
        },
        error: function (xhr, status, error) {
            console.error("Error al enviar mensaje", error);
        }
    });
	},

	refreshChat: function (chatMessages) {
    // Obtener mensajes del servidor
    $.ajax({
        method: "GET",
        url:"/chat",
        success: function (data) {

            // Limitar el número de mensajes mostrados
            const maxMessages = 10; // Mostrar solo los últimos 50 mensajes
            if (data.length > maxMessages) {
                data = data.slice(data.length - maxMessages);
            }

            // Crear un array de mensajes en formato pila inversa (más recientes abajo)
            const formattedMessages = data.map(msg => `${msg.NombreUsuario}: ${msg.mensaje}`);

            // Renderizar los mensajes en orden inverso, más recientes abajo
            chatMessages.text = formattedMessages.join('\n');

            // Ajustar la posición del texto para alinear los mensajes con el borde inferior del contenedor
            const containerHeight = 300; // Altura del área de chat
            const totalTextHeight = chatMessages.height; // Altura total del texto

            if (totalTextHeight > containerHeight) {
                // Si el texto excede la altura del contenedor, alinear el texto al borde inferior
                chatMessages.setY(520 + containerHeight - totalTextHeight);
            } else {
                // Si hay suficiente espacio, alinear el texto al área inferior del contenedor
                chatMessages.setY(520 + (containerHeight - totalTextHeight));
            }
        },
        error: function () {
            console.error("Error al actualizar chat");
        }
    });
	},

	refreshUsuariosConectados: function (usuariosConectadosText) {
    $.ajax({
        method: "GET",
        url:"/numusuarios",
        success: function (data) {
            usuariosConectadosText.setText(`Usuarios conectados: ${data}`);
        },
        error: function () {
            console.error("Error al obtener usuarios conectados");
        }
    });
	}

});