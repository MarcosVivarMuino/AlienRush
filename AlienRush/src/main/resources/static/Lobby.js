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
let jugador1 = this.add.text(1500, 400, '', {
    fontFamily: 'Impact, fantasy',
    fill: '#ffffff',
    fontSize: '50px',
    align: 'right',
}).setOrigin(1);

let jugador2 = this.add.text(1500, 650, '', {
    fontFamily: 'Impact, fantasy',
    fill: '#ffffff',
    fontSize: '50px',
    align: 'right',
}).setOrigin(1);

let lobbyIdText = this.add.text(1565, 250, '', {
    fontFamily: 'Impact, fantasy',
    fill: '#ffffff',
    fontSize: '40px',
}).setOrigin(1);

let listoButton = this.add.image(1475, this.cameras.main.height - 100, 'listo').setInteractive();
let atrasButton = this.add.image(100, 100, 'atras').setInteractive();

// Obtener ID del lobby y nombre de usuario
let lobbyId = this.registry.get('lobbyId') || 0;
let userName = this.registry.get('userName') || 'Jugador';
const self = this;

lobbyIdText.setText(`Lobby ID: ${lobbyId}`);

// Configuración del cliente STOMP
let socket = new SockJS('/ws');
let stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
    console.log('Conectado a WebSocket');

    // Suscribirse a las actualizaciones del lobby
    stompClient.subscribe(`/topic/lobbyActualizado/${lobbyId}`, onPonerNombres);

    // Solicitar información del lobby enviando el ID
    stompClient.send('/app/lobbyActualizado', {}, JSON.stringify(lobbyId));
}, (error) => {
    console.error('Error al conectar al WebSocket:', error);
});

	function onPonerNombres(message) {
    console.log(message.body);
    let lobby = JSON.parse(message.body);

    // Actualizar los nombres de los jugadores
    let player1Name = lobby.player1Name || 'Esperando...';
    let player2Name = lobby.player2Name || 'Esperando...';

    jugador1.setText(player1Name);
    jugador2.setText(player2Name);

    // Cambiar el color del texto de su nombre a verde si está listo
    if (lobby.player1Listo) {
        jugador1.setStyle({ color: '#00FF00' });  // Verde
    }
    if (lobby.player2Listo) {
        jugador2.setStyle({ color: '#00FF00' });  // Verde
    }

    // Verificar si el juego puede comenzar
    if (lobby.todosListos) {
        stompClient.disconnect();
        self.registry.set('player1Name', player1Name);
        self.registry.set('player2Name', player2Name);
        self.scene.start('MainGameMultijugador', { lobbyId: lobby.id });
    }
}

// Evento para el botón "Listo"
listoButton.on('pointerdown', () => {
    // Enviar el mensaje al servidor indicando que el jugador está listo
    stompClient.send('/app/marcarListo', {}, JSON.stringify({ lobbyId: lobbyId, user: userName }));
    stompClient.send('/app/lobbyActualizado', {}, JSON.stringify(lobbyId));
    listoButton.setVisible(false);
});

// Cambio de escala cuando el puntero está sobre el botón
listoButton.on('pointerover', () => { listoButton.setScale(1.2); });
listoButton.on('pointerout', () => { listoButton.setScale(1); });
// Evento para el botón "Atrás"
atrasButton.on('pointerdown', () => {
    stompClient.send('/app/salirLobby', {}, JSON.stringify({ lobbyId: lobbyId, user: userName }));
    this.scene.start('CrearUnirseSala');
});
atrasButton.on('pointerover', () => { atrasButton.setScale(1.2); });
atrasButton.on('pointerout', () => { atrasButton.setScale(1); });

// Manejo de desconexión al salir de la escena
this.events.on('shutdown', () => {
    if (stompClient && stompClient.connected) {
        stompClient.send('/app/salirLobby', {}, JSON.stringify({ lobbyId: lobbyId, user: userName }));
        stompClient.send('/app/lobbyActualizado', {}, JSON.stringify(lobbyId));
        stompClient.disconnect();
    }
});

    }
});