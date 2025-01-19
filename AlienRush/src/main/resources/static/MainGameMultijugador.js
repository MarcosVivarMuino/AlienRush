var MainGameMultijugador = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "MainGameMultijugador" });
    },

    init: function (data) {
        this.musicaMenu = data.musicaMenu; 
        this.fondo = data.fondo;       
        this.nombreUsuario = data.nombreUsuario;  
    },

    preload: function () {
        // Pantalla de carga
        this.add.image(875, 440, 'fondoCarga');
        var percentText = this.make.text({
            x: 1720,
            y: 960,
            text: '0%',
            style: {
                fontSize: 70,
                fill: '#ffffff',
                fontFamily: 'Impact, fantasy'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            console.log(value);
            percentText.setText(parseInt(value * 100) + '%');
        });

        this.load.on('fileprogress', function (file) {
            console.log(file.src);
        });
        this.load.on('complete', function () {
            console.log('complete');
            percentText.destroy();
        });

        // Archivos
        this.load.image('pulsaEsp', 'assets/Background/pulsaEsp.png');
        // HUD
        this.load.image('Vida1', 'assets/AssetsMainGame/HUD/Vida1.png');
        this.load.image('Vida2', 'assets/AssetsMainGame/HUD/Vida2.png');
        this.load.image('hud1', 'assets/AssetsMainGame/HUD/hud1.png');
        this.load.image('hud2', 'assets/AssetsMainGame/HUD/hud2.png');
        this.load.image('ACPU', 'assets/AssetsMainGame/Potenciadores/AumentoCapacidadPU.png');
        this.load.image('BPU', 'assets/AssetsMainGame/Potenciadores/BloqueadorPU.png');
        this.load.image('MRPU', 'assets/AssetsMainGame/Potenciadores/MovimientoRapidoPU.png');
        this.load.image('MPPU', 'assets/AssetsMainGame/Potenciadores/MultiplicadorPuntosPU.png');
        this.load.image('RPU', 'assets/AssetsMainGame/Potenciadores/RalentizadorPU.png');
        this.load.image('mas10', 'assets/AssetsMainGame/HUD/mas10.png');
		this.load.image('mas20', 'assets/AssetsMainGame/HUD/mas20.png');
		this.load.image('mas60', 'assets/AssetsMainGame/HUD/mas60.png');
        this.load.image('mas30', 'assets/AssetsMainGame/HUD/mas30.png');
        this.load.image('menos1', 'assets/AssetsMainGame/HUD/menos1.png');
        this.load.image('masPU', 'assets/AssetsMainGame/HUD/masPU.png');
        // Partida
        this.load.image('Player1', 'assets/AssetsMainGame/Personajes/Player1.png');
        this.load.image('Player2', 'assets/AssetsMainGame/Personajes/Player2.png');
        this.load.image('Vaca', 'assets/AssetsMainGame/Personajes/VacaAR.png');
        this.load.image('Escombro', 'assets/AssetsMainGame/Personajes/ChatarraAR.png');
        this.load.image('PU_Human', 'assets/AssetsMainGame/Personajes/SuperheroeAR.png');
        this.load.spritesheet('humano2', 'assets/AssetsMainGame/Personajes/Personaje2AR.png', {
            frameWidth: 320.5, // Ancho de cada fotograma
            frameHeight: 315 // Alto de cada fotograma
        });
        this.load.spritesheet('humano3', 'assets/AssetsMainGame/Personajes/Personaje3AR.png', {
            frameWidth: 307.5, // Ancho de cada fotograma
            frameHeight: 258 // Alto de cada fotograma
        });
        this.load.spritesheet('humano1', 'assets/AssetsMainGame/Personajes/Personaje1AR.png', {
            frameWidth: 295, // Ancho de cada fotograma
            frameHeight: 263 // Alto de cada fotograma
        });
        this.load.spritesheet('militar', 'assets/AssetsMainGame/Personajes/MilitarAR.png', {
            frameWidth: 294, // Ancho de cada fotograma
            frameHeight: 278 // Alto de cada fotograma
        });
        //Sonidos 
        this.load.audio('musicaJuego', 'audio/musicaJuego.mp3');
        this.load.audio('absorber', 'audio/absorber.mp3');
        this.load.audio('daño', 'audio/daño.mp3');
        this.load.audio('cogerPowerUp', 'audio/cogerPowerUp.mp3');
        this.load.audio('lanzarAumentoCapacidad', 'audio/lanzarAumentoCapacidad.mp3');
        this.load.audio('lanzarBloqueo', 'audio/lanzarBloqueo.mp3');
        this.load.audio('lanzarHielo', 'audio/lanzarHielo.mp3');
        this.load.audio('lanzarVelocidad', 'audio/lanzarVelocidad.mp3');
        this.load.audio('lanzarX2', 'audio/lanzarX2.mp3');

    },

    create: function () {
        //////////////////////////////////////////////////////////////ANIMACIONES/////////////////////////////////////////////////////////////////
        this.anims.create({
            key: 'caminar_humano1',
            frames: this.anims.generateFrameNumbers('humano1', { start: 0, end: 1 }),
            frameRate: 2, // Velocidad de la animación
            repeat: -1 // Repetir indefinidamente
        });

        this.anims.create({
            key: 'caminar_humano2',
            frames: this.anims.generateFrameNumbers('humano2', { start: 0, end: 1 }),
            frameRate: 2, // Velocidad de la animación
            repeat: -1 // Repetir indefinidamente
        });

        this.anims.create({
            key: 'caminar_humano3',
            frames: this.anims.generateFrameNumbers('humano3', { start: 0, end: 1 }),
            frameRate: 2, // Velocidad de la animación
            repeat: -1 // Repetir indefinidamente
        });

        this.anims.create({
            key: 'caminar_militar',
            frames: this.anims.generateFrameNumbers('militar', { start: 0, end: 1 }),
            frameRate: 2, // Velocidad de la animación
            repeat: -1 // Repetir indefinidamente
        });
        ///////////////////////////////////////////////////////////////INSTANCIACION////////////////////////////////////////////////////////////////////
        Vacas = [];
        PowerUps = [];
        Humanos = [];
        Vacas = [];
        corazones1 = []
        corazones2 = []
        Escombros = []
        Militares = []
        PUHumanos = []
        paused = false;

        this.physics.world.bounds.width = 1750; // Limite al tamaño del mundo
        this.physics.world.bounds.height = 880;
        this.cameras.main.setBounds(0, 0, 1750, 880); // Define los limites de la camara
        this.gameStarted = false; // El juego no comienza hasta pulsar ESP
        this.temporizadorEvento = null; // Guardará el evento del temporizador

        this.add.image(875, 440, this.fondo).setScale(1); // Creacion del fondo
        this.pantallaEsp = this.add.image(875, 440, 'pulsaEsp').setDepth(10); // Mostrar pantalla inicial

        
        //AUDIO
        // Inicializar música del juego si no existe
        if (!GlobalMusic.musicaJuego) {
            GlobalMusic.musicaJuego = this.sound.add('musicaJuego', { loop: false });
        }

        // Reproducir música solo si está activada
        if (GlobalMusic.musicaActiva && !GlobalMusic.musicaJuego.isPlaying) {
            GlobalMusic.musicaJuego.play();
        }

        // Detener la música del menú
        if (GlobalMusic.musicaMenu && GlobalMusic.musicaMenu.isPlaying) {
            GlobalMusic.musicaMenu.stop();
        }

        absorber = this.sound.add('absorber', { volume: 0.5 });
        daño = this.sound.add('daño', { volume: 0.5 });
        cogerPowerUp = this.sound.add('cogerPowerUp', { volume: 0.3 });
        lanzarAumentoCapacidad = this.sound.add('lanzarAumentoCapacidad', { volume: 0.5 });
        lanzarBloqueo = this.sound.add('lanzarBloqueo', { volume: 0.5 });
        lanzarHielo = this.sound.add('lanzarHielo', { volume: 1.3 });
        lanzarVelocidad = this.sound.add('lanzarVelocidad', { volume: 0.5 });
        lanzarX2 = this.sound.add('lanzarX2', { volume: 0.5 });

        // Instanciacion Humanos
        for (let i = 0; i < 25; i++) {
            // Array de tipos de humanos
            let tiposDeHumanos = ['humano1', 'humano2', 'humano3'];

            // Seleccionar un tipo aleatorio
            let tipoHumano = tiposDeHumanos[Math.floor(Math.random() * tiposDeHumanos.length)];

            let x = Phaser.Math.Between(10, 1750); // Coordenada x aleatoria
            let y = Phaser.Math.Between(20, 880); // Coordenada y aleatoria
            let humano
            randNum = Math.floor(Math.random() * 3); // Devuelve 0, 1 o 2

            humano = this.add.sprite(x, y, tipoHumano).setScale(0.2);
            humano.play('caminar_' + tipoHumano); // Inicia la animación de caminar
            Humanos.push(humano); // Reemplaza con el sprite animado
        }

        // Instanciacion Vacas
        for (let i = 0; i < 8; i++) {
            let x = Phaser.Math.Between(10, 1750); // Coordenada x aleatoria
            let y = Phaser.Math.Between(20, 880); // Coordenada y aleatoria
            let vaca = this.add.image(x, y, 'Vaca').setScale(0.3);
            Vacas.push(vaca);
        }
        //Instanciacion Escombros
        for (let i = 0; i < 15; i++) {
            let x = Phaser.Math.Between(10, 1700); // Coordenada x aleatoria
            let y = Phaser.Math.Between(20, 800); // Coordenada y aleatoria
            let escombro = this.add.image(x, y, 'Escombro').setScale(0.15);
            Escombros.push(escombro);
        }

        //Instanciacion Militar
        for (let i = 0; i < 2; i++) {
            let x = Phaser.Math.Between(10, 1700); // Coordenada x aleatoria
            let y = Phaser.Math.Between(20, 800); // Coordenada y aleatoria
            let militar = this.add.sprite(x, y, 'militar').setScale(0.2);
            militar.play('caminar_militar');
            Militares.push(militar);
        }

        //Instanciacion Humano Militar
        for (let i = 0; i < 2; i++) {
            let x = Phaser.Math.Between(10, 1700); // Coordenada x aleatoria
            let y = Phaser.Math.Between(20, 800); // Coordenada y aleatoria
            let PUHuman = this.add.image(x, y, 'PU_Human').setScale(0.2);
            PUHumanos.push(PUHuman);
        }

        // Instanciacion de los jugadores
        player1 = this.physics.add.sprite(200, 600, 'Player1').setDepth(10);
        player1.tipoPU = '';
        player1.score = 0;
        player1.alpha = 1;
        player1.vidas = 5;
        player1.speed = 10;
        player1.size = 0.8
        player1.multiplicador = 1
        player1.canPU = true

        player1.setBounce(1); // Limites del jugador
        player1.setCollideWorldBounds(true);

        player2 = this.physics.add.sprite(1550, 600, 'Player2').setDepth(10);
        player2.tipoPU = '';
        player2.score = 0;
        player2.alpha = 0.8;
        player2.vidas = 5;
        player2.speed = 10;
        player2.size = 0.8
        player2.multiplicador = 1
        player2.canPU = true

        player2.setBounce(1); // Limites del jugador
        player2.setCollideWorldBounds(true);

        // Instanciacion vidas
        this.add.image(150, 90, 'hud1').setScale(0.5).setDepth(10);
        this.add.text(80, 90, 'Jugador 1', { fontSize: '25px', color: '#ffffff' });
        for (let i = 0; i < player1.vidas; i++) {
            let corazon = this.add.image(120 + i * 40, 60 + i * -3, 'Vida1').setScale(0.5).setDepth(10);
            corazones1.push(corazon);
        }

        this.add.image(1600, 90, 'hud2').setScale(0.5).setDepth(10);
        this.add.text(1530, 90, 'Jugador 2', { fontSize: '25px', color: '#ffffff' });
        for (let i = 0; i < player2.vidas; i++) {
            let corazon = this.add.image(1630 - i * 40, 60 + i * -3, 'Vida2').setScale(0.5).setDepth(10);
            corazones2.push(corazon);
        }

        //Instanciacion Power Up
        PowerUp1 = this.add.image(350, 90, 'ACPU').setScale(0.06).setDepth(10);
        PowerUp2 = this.add.image(1400, 90, 'ACPU').setScale(0.06).setDepth(10);

        PowerUp1.alpha = 0
        PowerUp2.alpha = 0

        // Instanciacion temporizador
        this.tiempoRestante = 120; // 5 minutos en segundos
        this.textoTemporizador = this.add.text(720, 30, 'Tiempo: 2:00', { fontSize: '70px', color: '#ffffff', fontFamily: 'Impact, fantasy' });

        // Instanciacion Puntos
        Score1 = this.add.text(50, 140, '0', { fontSize: '70px', color: '#ffffff', fontFamily: 'Impact, fantasy' });
        Score2 = this.add.text(1560, 140, '0', { fontSize: '70px', color: '#ffffff', fontFamily: 'Impact, fantasy' });

        //////////////////////////////////////////////////////////////////MOVIMIENTO///////////////////////////////////////////////////////////////////////////
        // Mover los humanos aleatoriamente cada cierto tiempo
        this.time.addEvent({
            delay: 1000, // Cambiar la dirección cada 1 segundo
            callback: moverHumanosAleatoriamente,
            callbackScope: this,
            loop: true
        });

        // Mover las vacas aleatoriamente cada cierto tiempo
        this.time.addEvent({
            delay: 1000, // Cambiar la dirección cada 1 segundo
            callback: moverVacasAleatoriamente,
            callbackScope: this,
            loop: true
        });

        // Mover el militar aleatoriamente cada cierto tiempo
        this.time.addEvent({
            delay: 1000, // Cambiar la dirección cada 1 segundo
            callback: moverMilitarAleatoriamente,
            callbackScope: this,
            loop: true
        });

        // Mover el PUHuman aleatoriamente cada cierto tiempo
        this.time.addEvent({
            delay: 1000, // Cambiar la dirección cada 1 segundo
            callback: moverPUHumanAleatoriamente,
            callbackScope: this,
            loop: true
        });

        ////////////////////////////////////////////////////////////////////INTERACCIONES///////////////////////////////////////////////////////////////////////////
        // Controles Jugador 1
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // Arriba
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); // Izquierda
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); // Derecha
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S); // Abajo
        this.keySPC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Interactuar
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); // Power Up

        // Menu de Pause
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.paused = false;


        ///////////////////////////////////////////////////////////////////////FUNCIONES////////////////////////////////////////////////////////////////////////////
        function moverHumanosAleatoriamente() {
            // Mover cada humano en una dirección aleatoria
            Humanos.forEach((humano) => {
                let nuevaX = humano.x + Phaser.Math.Between(-100, 100);
                let nuevaY = humano.y + Phaser.Math.Between(-100, 100);

                // Asegúrate de que los humanos no salgan de los límites de la pantalla
                nuevaX = Phaser.Math.Clamp(nuevaX, 80, 1680);
                nuevaY = Phaser.Math.Clamp(nuevaY, 80, 800);

                // Calcular la dirección de movimiento
                let velX = nuevaX - humano.x; // Diferencia en X
                let velY = nuevaY - humano.y; // Diferencia en Y

                // Calcular el ángulo de rotación hacia la dirección del movimiento
                let angle = Math.atan2(velY, velX);

                // Aplicar la rotación antes de animar
                humano.rotation = angle;

                // Usar un tween para animar el movimiento
                this.tweens.add({
                    targets: humano,
                    x: nuevaX,
                    y: nuevaY,
                    duration: 500,
                    ease: 'Power1'
                });
            });
        }

        function moverVacasAleatoriamente() {
            // Mover cada humano en una dirección aleatoria
            Vacas.forEach((vaca) => {
                let nuevaX = vaca.x + Phaser.Math.Between(-150, 150);
                let nuevaY = vaca.y + Phaser.Math.Between(-150, 150);

                // Asegúrate de que los humanos no salgan de los límites de la pantalla
                nuevaX = Phaser.Math.Clamp(nuevaX, 80, 1680);
                nuevaY = Phaser.Math.Clamp(nuevaY, 80, 800);

                // Calcular la dirección de movimiento
                let velX = nuevaX - vaca.x; // Diferencia en X
                let velY = nuevaY - vaca.y; // Diferencia en Y

                // Calcular el ángulo de rotación hacia la dirección del movimiento
                let angle = Math.atan2(velY, velX);

                // Aplicar la rotación antes de animar
                vaca.rotation = angle;

                // Usar un tween para animar el movimiento
                this.tweens.add({
                    targets: vaca,
                    x: nuevaX,
                    y: nuevaY,
                    duration: 500,
                    ease: 'Power1'
                });
            });
        }

        function moverMilitarAleatoriamente() {
            Militares.forEach((militar) => {
                let nuevaX = militar.x + Phaser.Math.Between(-80, 80);
                let nuevaY = militar.y + Phaser.Math.Between(-80, 80);

                // Asegúrate de que los humanos no salgan de los límites de la pantalla
                nuevaX = Phaser.Math.Clamp(nuevaX, 80, 1680);
                nuevaY = Phaser.Math.Clamp(nuevaY, 80, 800);

                // Calcular la dirección de movimiento
                let velX = nuevaX - militar.x; // Diferencia en X
                let velY = nuevaY - militar.y; // Diferencia en Y

                // Calcular el ángulo de rotación hacia la dirección del movimiento
                let angle = Math.atan2(velY, velX);

                // Aplicar la rotación antes de animar
                militar.rotation = angle;

                // Usar un tween para animar el movimiento
                this.tweens.add({
                    targets: militar,
                    x: nuevaX,
                    y: nuevaY,
                    duration: 500,
                    ease: 'Power1'
                });
            });
        }

        function moverPUHumanAleatoriamente() {
            PUHumanos.forEach((PUHuman) => {
                let nuevaX = PUHuman.x + Phaser.Math.Between(-100, 100);
                let nuevaY = PUHuman.y + Phaser.Math.Between(-100, 100);

                // Asegúrate de que los humanos no salgan de los límites de la pantalla
                nuevaX = Phaser.Math.Clamp(nuevaX, 80, 1680);
                nuevaY = Phaser.Math.Clamp(nuevaY, 80, 800);

                // Calcular la dirección de movimiento
                let velX = nuevaX - PUHuman.x; // Diferencia en X
                let velY = nuevaY - PUHuman.y; // Diferencia en Y

                // Calcular el ángulo de rotación hacia la dirección del movimiento
                let angle = Math.atan2(velY, velX);

                // Aplicar la rotación antes de animar
                PUHuman.rotation = angle;

                // Usar un tween para animar el movimiento
                this.tweens.add({
                    targets: PUHuman,
                    x: nuevaX,
                    y: nuevaY,
                    duration: 500,
                    ease: 'Power1'
                });
            });
        }
		
		// Método para enviar el estado del juego al servidor cuando se inicia
		function enviarEstadoAlServidor () {
			    const lobbyId = this.registry.get('lobbyId') || 0;

			    // Construir el estado del juego
			    const data = {
			        id: lobbyId,
			        player1X: this.player1.x,
			        player1Y: this.player1.y,
			        player1Score: this.player1.score,
			        player1Vidas: this.player1.vidas,
			        player1Speed: this.player1.speed,
			        player1Size: this.player1.size,
			        player1Multiplicador: this.player1.multiplicador,
			        player1CanPU: this.player1.canPU,
			        player1Nombre: this.player1.nombre,

			        player2X: this.player2.x,
			        player2Y: this.player2.y,
			        player2Score: this.player2.score,
			        player2Vidas: this.player2.vidas,
			        player2Speed: this.player2.speed,
			        player2Size: this.player2.size,
			        player2Multiplicador: this.player2.multiplicador,
			        player2CanPU: this.player2.canPU,
			        player2Nombre: this.player2.nombre,

			        humanos: this.humanos.map(humano => ({ x: humano.x, y: humano.y })),
			        vacas: this.vacas.map(vaca => ({ x: vaca.x, y: vaca.y })),
			        militares: this.militares.map(militar => ({ x: militar.x, y: militar.y })),
			        PUHumanos: this.PUHumanos.map(PUHuman => ({ x: PUHuman.x, y: PUHuman.y })),
			        escombros: this.escombros.map(escombro => ({ x: escombro.x, y: escombro.y })),
			        pausa: this.gamePaused
			    };

			    // Enviar los datos al servidor usando STOMP
			    stompClient.send("/app/start", {}, JSON.stringify(data));
			}

		
		socket = new SockJS('/ws'); // Endpoint configurado en tu `WebSocketConfig`
		stompClient = Stomp.over(socket);


		// Conectar al servidor
		stompClient.connect({}, function (frame) {
		    console.log('Conectado: ' + frame);

		    // Suscribirse a un canal para recibir mensajes (por ejemplo, posiciones)
		    stompClient.subscribe('/topic/positions', function (message) {
		        const data = JSON.parse(message.body);
		        console.log("Posiciones actualizadas:", data);
		        actualizarObjetos(data); // Actualiza los objetos en el juego
		    });

		    // Suscribirse a un canal de inicio de partida
		    stompClient.subscribe('/topic/start', function (message) {
		        const data = JSON.parse(message.body);
		        console.log("Partida iniciada:", data);
				
				
		    });
			
			const lobbyId = 0;
			stompClient.send("/app/start", {}, JSON.stringify({ id: lobbyId }));
			enviarEstadoAlServidor();

		});
	
		
    },

    update: function () {
        // Iniciar juego si no ha comenzado
        if (!this.gameStarted && (Phaser.Input.Keyboard.JustDown(this.keyY))) {
            this.iniciarJuego();
			this.enviarEstadoAlServidor();
        }
    
        if (this.gameStarted) {
    
		    if (Phaser.Input.Keyboard.JustDown(this.keyESC)) {
                this.pausarJuego();
				this.enviarEstadoAlServidor();
            }
			
			this.actualizarControles();
            this.detectarAcciones();
            this.actualizarTam();
			
			//ESTADO DEL JUEGO AL WEBSOCKET
			this.enviarEstadoAlServidor();

        }
    },
	
    
    // Inicia el juego
    iniciarJuego: function () {
        this.gameStarted = true;
        this.pantallaEsp.destroy();
        this.iniciarTemporizador();
		
		// Inicializar jugadores con valores predeterminados
	    this.player1 = this.crearJugador(100, 100, 'Player1', 'Jugador 1');
	    this.player2 = this.crearJugador(1500, 100, 'Player2', 'Jugador 2');
	    
	    // Crear objetos en el juego
	    this.generarObjetos();

	    // Enviar los datos de la partida al servidor
	    this.enviarEstadoAlServidor();
    },
    
	crearJugador: function (x, y, sprite, nombre) {
	    let jugador = this.add.sprite(x, y, sprite);
	    jugador.nombre = nombre;
	    jugador.score = 0;
	    jugador.vidas = 5;
	    jugador.speed = 10;
	    jugador.size = 0.8;
	    jugador.multiplicador = 1;
	    jugador.canPU = true;
	    jugador.x = x;
	    jugador.y = y;
	    return jugador;
	},
	
	generarObjetos: function () {
	    // Genera objetos en posiciones aleatorias
	    this.humanos = [];
	    this.vacas = [];
	    this.militares = [];
	    this.PUHumanos = [];
	    this.escombros = [];

	    for (let i = 0; i < 5; i++) { 
	        this.generarHumano();
	        this.generarVaca();
	        this.generarEscombro();
	        this.generarMilitar();
	        this.generarHumanoEspecial();
	    }
	},

	generarHumano: function () {
	    let x = Phaser.Math.Between(10, 1750);
	    let y = Phaser.Math.Between(20, 880);
	    let humano = this.add.sprite(x, y, 'humano1');
	    humano.play('caminar_humano1');
	    this.humanos.push(humano);
	},

	generarVaca: function () {
	    let x = Phaser.Math.Between(20, 1700);
	    let y = Phaser.Math.Between(30, 800);
	    let vaca = this.add.sprite(x, y, 'Vaca');
	    this.vacas.push(vaca);
	},

	generarEscombro: function () {
	    let x = Phaser.Math.Between(20, 1700);
	    let y = Phaser.Math.Between(30, 800);
	    let escombro = this.add.sprite(x, y, 'Escombro');
	    this.escombros.push(escombro);
	},

	generarMilitar: function () {
	    let x = Phaser.Math.Between(20, 1700);
	    let y = Phaser.Math.Between(30, 800);
	    let militar = this.add.sprite(x, y, 'Militar');
	    this.militares.push(militar);
	},

	generarHumanoEspecial: function () {
	    let x = Phaser.Math.Between(20, 1700);
	    let y = Phaser.Math.Between(30, 800);
	    let PUHuman = this.add.sprite(x, y, 'PU_Human');
	    this.PUHumanos.push(PUHuman);
	},

	

		
    // Pausa el juego
    pausarJuego: function () {
        if (!this.paused) {
            console.log("Pausando MainGame y lanzando MenuPausa...");
            this.scene.launch('MenuPausa');
            this.scene.pause();
            this.paused = true;
        }
    },
    
    // Actualiza controles de los jugadores
    actualizarControles: function () {
        // Controles de player 2
        player2.body.position.x += this.keyL.isDown ? player2.speed : this.keyJ.isDown ? -player2.speed : 0;
        player2.body.position.y += this.keyK.isDown ? player2.speed : this.keyI.isDown ? -player2.speed : 0;
    
        // Controles de player 1
        player1.body.position.x += this.keyD.isDown ? player1.speed : this.keyA.isDown ? -player1.speed : 0;
        player1.body.position.y += this.keyS.isDown ? player1.speed : this.keyW.isDown ? -player1.speed : 0;
    },
    
    // Detecta acciones de los jugadores
    detectarAcciones: function () {
        if (Phaser.Input.Keyboard.JustDown(this.keySPC)) this.absorberObjeto(player1);
        if (Phaser.Input.Keyboard.JustDown(this.keyENTER)) this.absorberObjeto(player2);
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) this.usarPU(player1);
        if (Phaser.Input.Keyboard.JustDown(this.keyO)) this.usarPU(player2);
    },
    
    // Absorbe objetos cercanos a un jugador
    absorberObjeto: function (player) {
        this.detectarColision(player, Humanos, 95, (humano) => {
            player.score += 10 * player.multiplicador;
			if(player.multiplicador == 1.5){
				
				this.mostrarFeedback(humano.x, humano.y, 'mas20');
			}else{
				this.mostrarFeedback(humano.x, humano.y, 'mas10');
			}
            this.actuScore();
            absorber.play();
            humano.destroy();
            this.generarHumano();
        });
    
        this.detectarColision(player, Vacas, 110, (vaca) => {
            player.score += 30 * player.multiplicador;
			if(player.multiplicador == 1.5){
				this.mostrarFeedback(vaca.x, vaca.y, 'mas60');
			}else{
				this.mostrarFeedback(vaca.x, vaca.y, 'mas30');
			}            
			this.actuScore();
            absorber.play();
            vaca.destroy();
            this.generarVaca();
        });
    
        this.detectarColision(player, Escombros, 95, (escombro) => {
            this.mostrarFeedback(escombro.x, escombro.y, 'menos1');
            this.perderVida(player);
            daño.play();
            this.generarEscombro(escombro);
        });
    
        if (player.canPU) {
            this.detectarColision(player, PUHumanos, 95, (PUHuman) => {
                this.mostrarFeedback(PUHuman.x, PUHuman.y, 'masPU');
                this.darPowerUp(player);
                cogerPowerUp.play();
                PUHuman.destroy();
                this.generarHumanoEspecial();
            });
        }
    
        this.detectarColision(player, Militares, 60, () => {
            this.terminarPartida(player);
        });
    },
    
    // Detecta colisión entre un jugador y objetos
    detectarColision: function (player, objetos, distancia, callback) {
    objetos.forEach((objeto) => {
        	if (
            	Phaser.Math.Distance.Between(player.x, player.y, objeto.x, objeto.y) < distancia &&
            	!objeto.isBeingProcessed
        	) {
            	objeto.isBeingProcessed = true; // Marca el objeto como procesado
            	callback(objeto);
            	this.time.delayedCall(500, () => {
                	objeto.isBeingProcessed = false; // Desmarca después de 500ms
            	});
        	}
    	});
	},

    
    // Genera un humano en una posición aleatoria
    generarHumano: function () {
        // Array de tipos de humanos
        let tiposDeHumanos = ['humano1', 'humano2', 'humano3'];

        // Seleccionar un tipo aleatorio
        let tipoHumano = tiposDeHumanos[Math.floor(Math.random() * tiposDeHumanos.length)];

        let x = Phaser.Math.Between(10, 1750); // Coordenada x aleatoria
        let y = Phaser.Math.Between(20, 880); // Coordenada y aleatoria
        let humano
        randNum = Math.floor(Math.random() * 3); // Devuelve 0, 1 o 2

        humano = this.add.sprite(x, y, tipoHumano).setScale(0.2);
        humano.play('caminar_' + tipoHumano); // Inicia la animación de caminar
        Humanos.push(humano); // Reemplaza con el sprite animado
    },

	generarVaca: function () {
		let maxVacas = 8;
    	if (Vacas.length >= maxVacas) return; // No generar más vacas si alcanzamos el límite
    	let x = Phaser.Math.Between(20, 1700);
    	let y = Phaser.Math.Between(30, 800);
    	let vaca = this.add.image(x, y, 'Vaca').setScale(0.3);
    	Vacas.push(vaca);
    },


    generarEscombro : function(escombro) {
        let x = Phaser.Math.Between(20, 1700);
        let y = Phaser.Math.Between(30, 800);

        escombro.x = x
        escombro.y = y
    },

    generarHumanoEspecial : function() {
        let x = Phaser.Math.Between(20, 1700);
        let y = Phaser.Math.Between(30, 800);
        let PUHuman = this.add.image(x, y, 'PU_Human').setScale(0.2);
        PUHumanos.push(PUHuman);
    },
    
    // Resta vida al jugador
    perderVida: function (player) {
        if (player.vidas > 0) {
            player.vidas--;
            let corazones = player === player1 ? corazones1 : corazones2;
            corazones[player.vidas].destroy();
        }
    
        if (player.vidas <= 0) {
            this.terminarPartida(player);
        }
    },
    
    // Termina la partida dependiendo del jugador
    terminarPartida: function (jugador) {
        let escenaVictoria = jugador === player1 ? "Victoria2" : "Victoria1";
        this.shutdown();
        this.scene.stop();
        this.scene.start(escenaVictoria, {
            player1Score: player1.score,
            player2Score: player2.score,
            fondo: this.fondo,
            nombreUsuario: this.nombreUsuario
        });
    },
    
    // Actualiza animaciones (por ejemplo, tamaño de los jugadores)
    actualizarTam: function () {
        player1.setScale(player1.size);
        player2.setScale(player2.size);
    },
    
    // Actualiza la puntuación en pantalla
    actuScore: function () {
        Score1.setText(` ${player1.score}`);
        Score2.setText(` ${player2.score}`);
    },

    mostrarFeedback: function(x, y, tipo){
        var image = this.add.image(x, y, tipo);
        this.tweens.add({
            targets: image, 
            scale: 1.5, 
            alpha: 0,
            duration: 1000, 
            ease: 'Power1', 
            onComplete: () => {
                image.destroy(); 
            }
        });
    },

    iniciarTemporizador: function () {
        // Configuración del temporizador
        this.temporizadorEvento = this.time.addEvent({
            delay: 1000, // 1 segundo
            callback: this.actualizarTemporizador,
            callbackScope: this,
            loop: true
        });
    },
    actualizarTemporizador: function () {
        // Reducir el tiempo restante
        this.tiempoRestante--;
    
        // Actualizar el texto del temporizador
        const minutos = Math.floor(this.tiempoRestante / 60);
        const segundos = this.tiempoRestante % 60;
        this.textoTemporizador.setText(`Tiempo: ${minutos}:${segundos < 10 ? '0' : ''}${segundos}`);
    
        // Si el tiempo se agota, termina la partida
        if (this.tiempoRestante <= 0) {
            this.temporizadorEvento.remove(); // Detener el temporizador
    
            // Decidir el resultado del juego
            if (player1.score > player2.score) {
                this.scene.start("Victoria1", {
                    player1Score: player1.score,
                    player2Score: player2.score,
                    fondo: this.fondo,
                    nombreUsuario: this.nombreUsuario
                });
            } else if (player2.score > player1.score) {
                this.scene.start("Victoria2", {
                    player1Score: player1.score,
                    player2Score: player2.score,
                    fondo: this.fondo,
                    nombreUsuario: this.nombreUsuario
                });
            } else {
                this.scene.start("Empate", {
                    player1Score: player1.score,
                    player2Score: player2.score,
                    fondo: this.fondo,
                    nombreUsuario: this.nombreUsuario
                });
            }
        }
    },

    darPowerUp : function(player) {
        const powerUps = [
            'AumentoCapacidadPU',
            'BloqueadorPU',
            'MovimientoRapido',
            'MultiplicadorPuntos',
            'Ralentizador'
        ];

        player.tipoPU = Phaser.Math.RND.pick(powerUps);
        player.canPU = false;

        switch (player.tipoPU) {
            case 'AumentoCapacidadPU':
                if (player == player1) {
                    PowerUp1.setTexture('ACPU');
                    PowerUp1.alpha = 1;
                } else {
                    PowerUp2.setTexture('ACPU');
                    PowerUp2.alpha = 1;
                }
                break;
            case 'BloqueadorPU':
                if (player == player1) {
                    PowerUp1.setTexture('BPU');
                    PowerUp1.alpha = 1;
                } else {
                    PowerUp2.setTexture('BPU');
                    PowerUp2.alpha = 1;
                }
                break;
            case 'MovimientoRapido':
                if (player == player1) {
                    PowerUp1.setTexture('MRPU');
                    PowerUp1.alpha = 1;
                } else {
                    PowerUp2.setTexture('MRPU');
                    PowerUp2.alpha = 1;
                }
                break;
            case 'MultiplicadorPuntos':
                if (player == player1) {
                    PowerUp1.setTexture('MPPU');
                    PowerUp1.alpha = 1;
                } else {
                    PowerUp2.setTexture('MPPU');
                    PowerUp2.alpha = 1;
                }
                break;
            case 'Ralentizador':
                if (player == player1) {
                    PowerUp1.setTexture('RPU');
                    PowerUp1.alpha = 1;
                } else {
                    PowerUp2.setTexture('RPU');
                    PowerUp2.alpha = 1;
                }
                break;
        }
    },

    usarPU : function(player, escena) {
        switch (player.tipoPU) {
            case 'AumentoCapacidadPU':
                lanzarAumentoCapacidad.play();
                player.tipoPU = ' '
                if (player == player1) {
                    PowerUp1.alpha = 0
                } else {
                    PowerUp2.alpha = 0
                }
                player.size = 1.0;
                this.time.delayedCall(5000, () => {
                    player.size = 0.8;
                    player.canPU = true
                });
                break;
            case 'BloqueadorPU':
                lanzarBloqueo.play();
                player.tipoPU = ''
                if (player == player1) {
                    PowerUp1.alpha = 0
                    player2.speed = 0
                    this.time.delayedCall(5000, () => {
                        player2.speed = 10;
                        player.canPU = true
                    });
                } else {
                    PowerUp2.alpha = 0
                    player1.speed = 0
                    this.time.delayedCall(5000, () => {
                        player1.speed = 10;
                        player.canPU = true
                    });
                }
                break;
            case 'MovimientoRapido':
                lanzarVelocidad.play();
                player.tipoPU = ''
                if (player == player1) {
                    PowerUp1.alpha = 0
                } else {
                    PowerUp2.alpha = 0
                }
                player.speed = 15;
                this.time.delayedCall(5000, () => {
                    player.speed = 10;
                    player.canPU = true
                });
                break;
            case 'MultiplicadorPuntos':
                lanzarX2.play();
                player.tipoPU = ''
                if (player == player1) {
                    PowerUp1.alpha = 0
                } else {
                    PowerUp2.alpha = 0
                }
                player.multiplicador = 1.5;
                this.time.delayedCall(5000, () => {
                    player.multiplicador = 1;
                    player.canPU = true
                });
                break;
            case 'Ralentizador':
                lanzarHielo.play();
                player.tipoPU = ''
                if (player == player1) {
                    PowerUp1.alpha = 0
                    player2.speed = 5
                    this.time.delayedCall(5000, () => {
                        player2.speed = 10;
                        player.canPU = true
                    });
                } else {
                    PowerUp2.alpha = 0
                    player1.speed = 5
                    this.time.delayedCall(5000, () => {
                        player1.speed = 10;
                        player.canPU = true
                    });
                }
                break;
        }
    },
    
    shutdown: function () {
    // Destruir teclas registradas
    this.input.keyboard.removeKey(this.SPC);
    this.input.keyboard.removeKey(this.keyESC);
    this.input.keyboard.removeKey(this.keyENTER);
    this.input.keyboard.removeKey(this.keyW);
    this.input.keyboard.removeKey(this.keyA);
    this.input.keyboard.removeKey(this.keyS);
    this.input.keyboard.removeKey(this.keyD);
    this.input.keyboard.removeKey(this.keyI);
    this.input.keyboard.removeKey(this.keyJ);
    this.input.keyboard.removeKey(this.keyK);
    this.input.keyboard.removeKey(this.keyL);
    this.input.keyboard.removeKey(this.keyO);
    this.input.keyboard.removeKey(this.keyE);
    this.input.keyboard.removeKey(this.keyY);
    
},
    
    onResume: function () {
        console.log("Reanudando MainGame...");
        this.paused = false;
    }
});