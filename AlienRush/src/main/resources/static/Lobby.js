var Lobby = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "Lobby" });
    },

    preload() {
        // Imágenes
        this.load.image('fondoLobby', 'assets/Lobby/PantallaLobby.png');
        this.load.image('listo', 'assets/Lobby/BotonListoAR.png');
        this.load.image('atras', 'assets/Perfil/BotonAtrasFlecha.png');

        // Audio
        this.load.audio('musicaMenu', 'audio/musicaMenu.mp3');
    },

    create() {
        // Fondo
        this.add.image(0, 0, 'fondoLobby').setOrigin(0, 0);

        // AUDIO
        if (!GlobalMusic.musicaMenu) {
            GlobalMusic.musicaMenu = this.sound.add('musicaMenu', { loop: true });
        }

        if (GlobalMusic.musicaActiva && !GlobalMusic.musicaMenu.isPlaying) {
            GlobalMusic.musicaMenu.play();
        }

        if (GlobalMusic.musicaJuego && GlobalMusic.musicaJuego.isPlaying) {
            GlobalMusic.musicaJuego.stop();
            GlobalMusic.musicaVictoria.stop();
        }

        /************************* VARIABLES *************************/
        let jugadoresText = this.add.text(20, 50, '', {
            fontFamily: 'Arial',
            fill: '#ffffff',
            fontSize: '24px'
        });
        
        let lobbyIdText = this.add.text(this.cameras.main.width - 150, this.cameras.main.height - 50, '', {
        	fontFamily: 'Impact, fantasy',
        	fill: '#ffffff',
        	fontSize: '40px'
    	}).setOrigin(1);

        let listoButton = this.add.image(this.cameras.main.width / 2, this.cameras.main.height - 100, 'listo').setInteractive();
        
        let atrasButton = this.add.image(100, 100, 'atras').setInteractive();

        // Obtener ID del lobby y nombre de usuario
        let lobbyId = this.registry.get('lobbyId') || 0;
        let userName = this.registry.get('userName') || 'Jugador';

        lobbyIdText.setText(`Lobby ID: ${lobbyId}`);

        // Configuración del cliente STOMP
        let socket = new SockJS('/ws'); // Endpoint configurado en tu `WebSocketConfig`
        let stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            console.log('Conectado a WebSocket');

            // Suscribirse a actualizaciones del lobby
            stompClient.subscribe(`/topic/lobby/${lobbyId}`, (message) => {
                let lobby = JSON.parse(message.body);

                // Actualizar lista de jugadores
                let jugadores = Object.entries(lobby.jugadoresListos)
                    .map(([jugador, listo]) => `${jugador} - ${listo ? 'Listo' : 'No listo'}`);
                jugadoresText.setText(jugadores.join('\n'));

                // Iniciar juego si ambos jugadores están listos
                if (lobby.todosListos) {
                    stompClient.disconnect();
                    this.scene.start('GameScene', { lobbyId: lobbyId });
                }
            });

            // Notificar al servidor que el jugador se ha unido
            stompClient.send('/app/unirseLobby', {}, JSON.stringify({ lobbyId: lobbyId, user: userName }));
        }, (error) => {
            console.error('Error al conectar al WebSocket:', error);
        });

        // Evento para el botón "Listo"
        listoButton.on('pointerdown', () => {
            stompClient.send('/app/marcarListo', {}, JSON.stringify({ lobbyId: lobbyId, user: userName }));
        });

        listoButton.on('pointerover', () => { listoButton.setScale(1.2); });
        listoButton.on('pointerout', () => { listoButton.setScale(1); });

        this.events.on('shutdown', () => {
            if (stompClient && stompClient.connected) {
                stompClient.send('/app/salirLobby', {}, JSON.stringify({ lobbyId: lobbyId, user: userName }));
                stompClient.disconnect();
            }
        });
        
        // Evento para el botón "Listo"
        atrasButton.on('pointerdown', () => {
           this.scene.start('CrearUnirseSala');
        });

        atrasButton.on('pointerover', () => { atrasButton.setScale(1.2); });
        atrasButton.on('pointerout', () => { atrasButton.setScale(1); });
    }
});