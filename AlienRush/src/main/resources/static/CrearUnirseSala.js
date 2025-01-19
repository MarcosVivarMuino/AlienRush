var CrearUnirseSala = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "CrearUnirseSala" });
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

        /************************* VARIABLES *************************/
        let BotonUS = this.add.image(1470, 500, 'BotonUS');
        let BotonCS = this.add.image(1470, 360, 'BotonCS');
        let BotonAceptar = this.add.image(1470, 500, 'BotonAceptar').setVisible(false);
        let BotonCancelar = this.add.image(1470, 640, 'BotonCancelar').setVisible(false);
        let texto = this.add.image(1480, 320, 'texto').setVisible(false);
        let BotonAtrasFlecha = this.add.image(100, 100, 'BotonAtrasFlecha');
        let campoTexto = this.add.dom(1450, 390).createFromCache('idLobby').setVisible(false);

        let iconoWifi = this.add.image(1680, 825, 'Wifi').setScale(0.2);

        // Configuración del cliente STOMP
        let socket = new SockJS('/ws'); // Asegúrate de que este endpoint coincide con tu servidor
        let stompClient = Stomp.over(socket);

        let userName = this.registry.get('userName');
        console.log(userName);

        stompClient.connect({}, () => {
            console.log('Conectado a WebSocket');

            // Botón para crear sala
            BotonCS.setInteractive();
            BotonCS.on("pointerdown", () => {
                stompClient.send('/app/crearLobby', {}, userName);
                stompClient.subscribe('/topic/lobbyCreado', (message) => {
                    let lobby = JSON.parse(message.body);
                    this.registry.set('lobbyId', lobby.id);
                    this.scene.start('Lobby');
                });
            });
            BotonCS.on("pointerover", () => { BotonCS.setScale(1.2); });
            BotonCS.on("pointerout", () => { BotonCS.setScale(1); });

            // Botón para unirse a sala
            BotonUS.setInteractive();
            BotonUS.on("pointerdown", () => {
                BotonCS.setVisible(false);
                BotonUS.setVisible(false);
                campoTexto.setVisible(true);
                BotonAceptar.setVisible(true);
                BotonCancelar.setVisible(true);
                texto.setVisible(true);
            });
            BotonUS.on("pointerover", () => { BotonUS.setScale(1.2); });
            BotonUS.on("pointerout", () => { BotonUS.setScale(1); });

            // Botón Aceptar
           BotonAceptar.setInteractive();
           BotonAceptar.on("pointerdown", () => {
		    const inputElement = campoTexto.getChildByName('nameField');
		    const lobbyId = inputElement.value;
		
		    if (lobbyId !== '') {
		        // Aquí solo se llama a unirseLobby una vez
		        stompClient.send('/app/unirseLobby', {}, JSON.stringify({ user: userName, lobbyId: lobbyId }));
		
		        // Después de unirse, solo se suscribe a las actualizaciones del lobby
		        stompClient.subscribe(`/topic/lobbyActualizado/${lobbyId}`, (message) => {
		            let lobby = JSON.parse(message.body);
		            if (lobby) {
		                this.registry.set('lobbyId', lobbyId);
		                this.scene.start('Lobby');
		            } else {
		                alert('Error al unirse al lobby');
		            }
		        });
		    }
		});
		
					
			
        BotonAceptar.on("pointerover", () => { BotonAceptar.setScale(1.2); });
        BotonAceptar.on("pointerout", () => { BotonAceptar.setScale(1); });

        // Botón Cancelar
        BotonCancelar.setInteractive();
        BotonCancelar.on("pointerdown", () => {
            BotonCS.setVisible(true);
            BotonUS.setVisible(true);
            campoTexto.setVisible(false);
            BotonAceptar.setVisible(false);
            BotonCancelar.setVisible(false);
            texto.setVisible(false);
        });
        BotonCancelar.on("pointerover", () => { BotonCancelar.setScale(1.2); });
        BotonCancelar.on("pointerout", () => { BotonCancelar.setScale(1); });
        });
        
        this.events.on('shutdown', () => {
    		if (stompClient && stompClient.connected) {
        		stompClient.disconnect();
    		}
		});


        // Botón Atrás
        BotonAtrasFlecha.setInteractive();
        BotonAtrasFlecha.on("pointerdown", () => {
            this.scene.start("ModoJuego");
        });
        BotonAtrasFlecha.on("pointerover", () => { BotonAtrasFlecha.setScale(1.2); });
        BotonAtrasFlecha.on("pointerout", () => { BotonAtrasFlecha.setScale(1); });
    }
});