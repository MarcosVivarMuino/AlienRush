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

        this.load.audio('musicaMenu', 'audio/musicaMenu.mp3');
        this.load.image('fondoCarga','assets/Background/pantallaCarga.png');
        
        this.load.html('nameform', 'assets/nombre.html');
    },

    create: function () {
		////////////////////////////////IP//////////////////////////////////////////
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
        let play = this.add.image(1470, 360, 'play');
        let ajustes = this.add.image(1470, 500, 'ajustes');
        let creditos = this.add.image(1470, 640, 'creditos');
        let iconoPerfil = this.add.image(100, 80, 'iconoPerfil').setScale(0.7);

		////////////////////////////////////////CHAT///////////////////////////////////////////
		// Fondo del chat
	    const chatBackground = this.add.rectangle(0, 520, 500, 300, 0x000000).setOrigin(0).setAlpha(0.8);
	
	    // Texto de mensajes
	    const chatMessages = this.add.text(0, 1500, '', {
	        font: '25px Arial',
	        fill: '#ffffff',
	        wordWrap: { width: 480 }
	    }).setOrigin(0);
	
	    // Entrada de texto para el mensaje
	    const chatInput = this.add.dom(210, 850).createFromCache('nameform');
	    
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
            this.scene.start("ElegirEscenario");
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
        
    setInterval(() => {
   this.refreshChat(chatMessages, ipLocal);
	}, 1000);
},
    sendMessage: function (message) {
     const chatMessage = {
        NombreUsuario: nombreUsuario,
        mensaje: message
    };
    
     console.log("Enviando mensaje:", chatMessage);

    // Enviar el mensaje al servidor
    $.ajax({
        method: "POST",
        url: ipLocal + "chat", // La URL de tu servidor
        data: JSON.stringify(chatMessage), // Convierte el objeto a JSON
        contentType: "application/json",  // Asegúrate de establecer el tipo de contenido
        success: function () {
            console.log("Mensaje enviado");
        },
        error: function (xhr, status, error) {
            console.error("Error al enviar mensaje", error);
        }
    });
	},

	refreshChat: function (chatMessages, ipLocal) {
        // Obtener mensajes del servidor
        $.ajax({
            method: "GET",
            url: ipLocal + "chat",
            success: function (data) {
				console.log(data);
                // Invertir los mensajes para que los más recientes estén en la parte superior
            	newMessages = data.map(msg => `${msg.NombreUsuario}: ${msg.mensaje}`).reverse();
            	chatMessages.text = newMessages.join('\n');

            	// Actualizar la posición para que el texto de los mensajes más recientes aparezca hacia arriba
            	// Cambiar la posición 'y' para desplazar los mensajes hacia arriba
            	chatMessages.setY(820 - chatMessages.height);  // Ajuste de la posición para que el texto se mueva hacia arriba
            },
            error: function () {
                console.error("Error al actualizar chat");
            }
        });
    }
});