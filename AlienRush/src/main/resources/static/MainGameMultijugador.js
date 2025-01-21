var MainGameMultijugador = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize: function() {
		Phaser.Scene.call(this, { "key": "MainGameMultijugador" });
	},

	init: function(data) {
		this.musicaMenu = data.musicaMenu;
		this.fondo = data.fondo;
		this.nombreUsuario = data.nombreUsuario;
	},

	preload: function() {
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

		this.load.on('progress', function(value) {
			console.log(value);
			percentText.setText(parseInt(value * 100) + '%');
		});

		this.load.on('fileprogress', function(file) {
			console.log(file.src);
		});
		this.load.on('complete', function() {
			console.log('complete');
			percentText.destroy();
		});

		if (this.fondo == null) {
			this.fondo = this.registry.get('fondoGranja');
		}

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
		this.load.image('fondoGranja', 'assets/AssetsMainGame/Escenarios/Granja2.png');
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

	create: function() {
		//////////////////////////////////////////////////////////////VARIABLES///////////////////////////////////////////////////////////////
		PowerUps = [];
		corazones1 = []
		corazones2 = []
		paused = false;
		self = this
		humanosMap = new Map();
		vacasMap = new Map();
		militaresMap = new Map();
		puHumanosMap = new Map();
		escombrosMap = new Map();
		////////////////////////////////////////////////////////////////EBSOCKETS//////////////////////////////////////////////////////////////
		// Establecer la conexión WebSocket
		// Establecer la conexión WebSocket
		socket = new SockJS('/ws');
		stompClient = Stomp.over(socket);

		stompClient.connect({}, () => {
			console.log('Conectado a WebSocket');

			// Obtener información del lobby
			const lobbyId = this.registry.get('lobbyId') || 0;
			const player1Name = this.registry.get('player1Name') || 'Jugador1';
			const player2Name = this.registry.get('player2Name') || 'Jugador2';

			// Suscribirse a las actualizaciones de la partida
			stompClient.subscribe(`/topic/partida/actualizada/${lobbyId}`, (message) => {
				const partida = JSON.parse(message.body);
				console.log('Partida actualizada:', partida);
			});

			const dataInicio = `${lobbyId},${player1Name},${player2Name}`;
			stompClient.send('/app/partida/iniciar', {}, dataInicio);

			// Suscribirse a las actualizaciones del lobby
			stompClient.subscribe('/topic/movJugador/' + lobbyId, function(message) {
				const data = JSON.parse(message.body);
				moverJugadores(data);
			});

			// Suscribirse a las actualizaciones del lobby
			stompClient.subscribe('/topic/actuObjetosIniciales/' + lobbyId, function(message) {
				const data = JSON.parse(message.body);
				actuObjetos(data);
			});


			// Suscribirse a las actualizaciones del lobby
			stompClient.subscribe('/topic/actuObjetos/' + lobbyId, function(message) {
				const data = JSON.parse(message.body);
				actuObjetosAleatorio(data);
			});

			// Suscribirse a las actualizaciones del lobby
			stompClient.subscribe('/topic/actuTime/' + lobbyId, function(message) {
				const data = JSON.parse(message.body);
				actualizarTemporizador(data);
			});

			// Suscribirse a las actualizaciones del lobby
			stompClient.subscribe('/topic/actuDelete/' + lobbyId, function(message) {
				const data = JSON.parse(message.body);
				actuDelete(data);
			});

			// Suscribirse a las actualizaciones del lobby
			stompClient.subscribe('/topic/recibirPU/' + lobbyId, function(message) {
				const data = JSON.parse(message.body);
				asignarPU(data);
			});

			// Suscribirse a las actualizaciones del lobby
			stompClient.subscribe('/topic/usarPU/' + lobbyId, function(message) {
				const data = JSON.parse(message.body);
				usarPU(data);
			});
		});


		this.stompClient = stompClient;

		function moverJugadores(data) {
			let numJug;
			let userName = self.registry.get('userName') || 'Jugador';

			if (data) {
				// Sincronizar posición y puntuación según el jugador
				if (data.player1Name == userName) {

					player1.setPosition(data.jugador1X, data.jugador1Y);
					player1.score = data.player1Score;

					player2.setPosition(data.jugador2X, data.jugador2Y);
					player2.score = data.player2Score;
					numJug = 1
				} else if (data.player2Name == userName) {
					player1.setPosition(data.jugador2X, data.jugador2Y);
					player1.score = data.player2Score;

					player2.setPosition(data.jugador1X, data.jugador1Y);
					player2.score = data.player1Score;
					numJug = 2
				} else {
					console.log("Error: No se ha encontrado un jugador coincidente.");
				}

				// Actualizar vidas de los jugadores
				if (data.playerLife1 < player1.vidas) {
					// Reducir vidas en corazones1
					while (data.playerLife1 < corazones1.length) {
						let corazon = corazones1.pop();
						if (corazon) corazon.destroy(); // Destruir sprite del corazón
					}
					player1.vidas = data.playerLife1;
				}

				if (data.playerLife2 < player2.vidas) {
					// Reducir vidas en corazones2
					while (data.playerLife2 < corazones2.length) {
						let corazon = corazones2.pop();
						if (corazon) corazon.destroy(); // Destruir sprite del corazón
					}
					player2.vidas = data.playerLife2;
				}

				// Actualizar la puntuación visual
				self.actuScore(numJug);
			} else {
				console.log("Error: Los datos recibidos son inválidos o nulos.");
			}
		}


		function actuObjetos(data) {
			// Verificar que los datos recibidos no sean nulos
			if (!data || typeof data !== 'object') {
				console.error("Error: Datos de objetos no válidos recibidos.");
				return;
			}

			// Actualizar las listas de objetos en el cliente
			if (data.humanos && Array.isArray(data.humanos)) {
				Humanos.forEach(obj => {
					const actualizado = data.humanos.find(o => o.id === obj.id);
					if (actualizado) {
						obj.x = actualizado.x;
						obj.y = actualizado.y;
					}
				});
			}

			if (data.vacas && Array.isArray(data.vacas)) {
				Vacas.forEach(obj => {
					const actualizado = data.vacas.find(o => o.id === obj.id);
					if (actualizado) {
						obj.x = actualizado.x;
						obj.y = actualizado.y;
					}
				});
			}

			if (data.militares && Array.isArray(data.militares)) {
				Militares.forEach(obj => {
					const actualizado = data.militares.find(o => o.id === obj.id);
					if (actualizado) {
						obj.x = actualizado.x;
						obj.y = actualizado.y;
					}
				});
			}

			if (data.PUHumanos && Array.isArray(data.PUHumanos)) {
				PUHumanos.forEach(obj => {
					const actualizado = data.PUHumanos.find(o => o.id === obj.id);
					if (actualizado) {
						obj.x = actualizado.x;
						obj.y = actualizado.y;
					}
				});
			}

			if (data.escombros && Array.isArray(data.escombros)) {
				Escombros.forEach(obj => {
					const actualizado = data.escombros.find(o => o.id === obj.id);
					if (actualizado) {
						obj.x = actualizado.x;
						obj.y = actualizado.y;
					}
				});
			}
		}

		// Función para actualizar y mover los objetos
		function actuObjetosAleatorio(data) {
			// Verificar que los datos recibidos no sean nulos
			if (!data || typeof data !== 'object') {
				console.error("Error: Datos de objetos no válidos recibidos.");
				return;
			}

			// Actualizar las listas de objetos en el cliente
			if (data.humanos && Array.isArray(data.humanos)) {
				data.humanos.forEach(actualizado => {
					const obj = humanosMap.get(actualizado.id);
					if (obj) {
						// Actualizar las posiciones
						moverHumano(actualizado.x, actualizado.y, humanosMap.get(actualizado.id)); // Llamar al método de movimiento
					}
				});
			}

			if (data.vacas && Array.isArray(data.vacas)) {
				data.vacas.forEach(actualizado => {
					const obj = vacasMap.get(actualizado.id);
					if (obj) {
						// Actualizar las posiciones
						moverVaca(actualizado.x, actualizado.y, vacasMap.get(actualizado.id)); // Llamar al método de movimiento
					}
				});
			}

			if (data.militares && Array.isArray(data.militares)) {
				data.militares.forEach(actualizado => {
					const obj = militaresMap.get(actualizado.id);
					if (obj) {
						// Actualizar las posiciones
						moverMilitar(actualizado.x, actualizado.y, militaresMap.get(actualizado.id)); // Llamar al método de movimiento
					}
				});
			}

			if (data.PUHumanos && Array.isArray(data.PUHumanos)) {
				data.PUHumanos.forEach(actualizado => {
					const obj = puHumanosMap.get(actualizado.id);
					if (obj) {
						// Actualizar las posiciones
						moverPUHuman(actualizado.x, actualizado.y, puHumanosMap.get(actualizado.id)); // Llamar al método de movimiento
					}
				});
			}

			if (data.escombros && Array.isArray(data.escombros)) {
				data.escombros.forEach(actualizado => {
					const obj = escombrosMap.get(actualizado.id);
					if (obj) {
						// Actualizar las posiciones
						obj.x = actualizado.x;
						obj.y = actualizado.y;
						// Si los escombros tienen algún movimiento o acción que hacer, puedes agregarlo aquí
					}
				});
			}
		}

		function actualizarTemporizador(data) {
			// Actualizar el texto del temporizador
			const minutos = Math.floor(data / 60);
			const segundos = data % 60;
			self.textoTemporizador.setText(`Tiempo: ${minutos}:${segundos < 10 ? '0' : ''}${segundos}`);

			// Si el tiempo se agota, termina la partida
			if (data <= 0) {
				self.temporizadorEvento.remove(); // Detener el temporizador

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
		}

		function actuDelete(data) {
			if (data.tipoP == 0) {
				let humano = humanosMap.get(data.objetoId);
				humano.x = data.PosX;
				humano.y = data.PosX
				humanosMap.set(data.objetoId, humano); // El id es la clave y el objeto es el valor
			} else if (data.tipoP == 1) {
				let vaca = vacasMap.get(data.objetoId);
				vaca.x = data.PosX;
				vaca.y = data.PosX
				vacasMap.set(data.objetoId, vaca);
			} else if (data.tipoP == 2) {
			} else if (data.tipoP == 3) {
				let escombro = escombrosMap.get(data.objetoId);
				escombro.x = data.PosX;
				escombro.y = data.PosX
				escombrosMap.set(data.objetoId, escombro); // El id es la clave y el objeto es el valor
			} else if (data.tipoP == 4) {
				let PUHuman = puHumanosMap.get(data.objetoId);
				PUHuman.x = data.PosX;
				PUHuman.y = data.PosX
				puHumanosMap.set(data.objetoId, PUHuman); // El id es la clave y el objeto es el valor
			}
		}

		function asignarPU(data) {
			if (player1Name == data.playerName) {
				switch (data.tipoPU) {
					case 1:
						PowerUp1.setTexture('ACPU');
						PowerUp1.alpha = 1;
						break;
					case 2:
						PowerUp1.setTexture('BPU');
						PowerUp1.alpha = 1;
						break;
					case 3:
						PowerUp1.setTexture('MRPU');
						PowerUp1.alpha = 1;
						break;
					case 4:
						PowerUp1.setTexture('MPPU');
						PowerUp1.alpha = 1;
						break;
					case 5:
						PowerUp1.setTexture('RPU');
						PowerUp1.alpha = 1;
						break;
				}
			} else if (player2Name == data.playerName) {
				switch (data.tipoPU) {
					case 1:
						PowerUp2.setTexture('ACPU');
						PowerUp2.alpha = 1;
						break;
					case 2:
						PowerUp2.setTexture('BPU');
						PowerUp2.alpha = 1;
						break;
					case 3:
						PowerUp2.setTexture('MRPU');
						PowerUp2.alpha = 1;
						break;
					case 4:
						PowerUp2.setTexture('MPPU');
						PowerUp2.alpha = 1;
						break;
					case 5:
						PowerUp2.setTexture('RPU');
						PowerUp2.alpha = 1;
						break;
				}
			}
		}

		function usarPU(data) {
			player1.size = data.sizePlayer1;
			console.log("tamaño antiguo: " + player1.size + ", tamaño nuevo: " + data.sizePlayer1);
			player2.size = data.sizePlayer2;
			player1.speed = data.speedPlayer1;
			console.log("velocidad1 antiguo: " + player1.size + ", velocidad1 nuevo: " + data.sizePlayer1);
			player2.speed = data.speedPlayer2;
			console.log("velocidad2 antiguo: " + player1.size + ", velocidad2 nuevo: " + data.sizePlayer1);
			player1.multiplicador = data.multPlayer1;
			console.log("mult antiguo: " + player1.size + ", mult nuevo: " + data.sizePlayer1);
			player2.multiplicador = data.multPlayer2;
			if (player1Name == data.playerName) {
				player1.tipoPU = ''
				player1.canPU = true;
				PowerUp1.alpha = 0;
			} else if (player2Name == data.playerName) {
				player2.tipoPU = ''
				player2.canPU = true;
				PowerUp2.alpha = 0;
			}
		}

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
		///////////////////////////////////////////////////////////////INSTANCIACION///////////////////////////////////////////////////////////////////

		this.physics.world.bounds.width = 1750; // Limite al tamaño del mundo
		this.physics.world.bounds.height = 880;
		this.cameras.main.setBounds(0, 0, 1750, 880); // Define los limites de la camara
		this.gameStarted = false; // El juego no comienza hasta pulsar ESP
		this.temporizadorEvento = null; // Guardará el evento del temporizador

		this.add.image(875, 440, 'fondoGranja').setScale(1); // Creacion del fondo
		this.pantallaEsp = this.add.image(875, 440, 'pulsaEsp').setDepth(10); // Mostrar pantalla inicial
		
		iconoWifi = this.add.image(1680, 825, 'Wifi').setScale(0.2);


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

		// Instanciación Humanos
		for (let i = 0; i < 25; i++) {
			// Array de tipos de humanos
			let tiposDeHumanos = ['humano1', 'humano2', 'humano3'];

			// Seleccionar un tipo aleatorio
			let tipoHumano = tiposDeHumanos[Math.floor(Math.random() * tiposDeHumanos.length)];

			let x = Phaser.Math.Between(10, 1750); // Coordenada x aleatoria
			let y = Phaser.Math.Between(20, 880); // Coordenada y aleatoria

			let humano = this.add.sprite(x, y, tipoHumano).setScale(0.2);
			humano.play('caminar_' + tipoHumano); // Inicia la animación de caminar

			// Asignar un id único a cada humano
			humano.id = i;

			// Agregar al mapa
			humanosMap.set(humano.id, humano); // El id es la clave y el objeto es el valor
		}

		// Instanciación Vacas
		for (let i = 0; i < 8; i++) {
			let x = Phaser.Math.Between(10, 1750); // Coordenada x aleatoria
			let y = Phaser.Math.Between(20, 880); // Coordenada y aleatoria
			let vaca = this.add.image(x, y, 'Vaca').setScale(0.3);

			// Asignar un id único a cada vaca
			vaca.id = i;

			// Agregar al mapa
			vacasMap.set(vaca.id, vaca); // El id es la clave y el objeto es el valor
		}

		// Instanciación Escombros
		for (let i = 0; i < 15; i++) {
			let x = Phaser.Math.Between(10, 1700); // Coordenada x aleatoria
			let y = Phaser.Math.Between(20, 800); // Coordenada y aleatoria
			let escombro = this.add.image(x, y, 'Escombro').setScale(0.15);

			// Asignar un id único a cada escombro
			escombro.id = i;

			// Agregar al mapa
			escombrosMap.set(escombro.id, escombro); // El id es la clave y el objeto es el valor
		}

		// Instanciación Militar
		for (let i = 0; i < 2; i++) {
			let x = Phaser.Math.Between(10, 1700); // Coordenada x aleatoria
			let y = Phaser.Math.Between(20, 800); // Coordenada y aleatoria
			let militar = this.add.sprite(x, y, 'militar').setScale(0.2);
			militar.play('caminar_militar');

			// Asignar un id único a cada militar
			militar.id = i;

			// Agregar al mapa
			militaresMap.set(militar.id, militar); // El id es la clave y el objeto es el valor
		}

		// Instanciación Humano PowerUp
		for (let i = 0; i < 2; i++) {
			let x = Phaser.Math.Between(10, 1700); // Coordenada x aleatoria
			let y = Phaser.Math.Between(20, 800); // Coordenada y aleatoria
			let PUHuman = this.add.image(x, y, 'PU_Human').setScale(0.2);

			// Asignar un id único a cada PUHuman
			PUHuman.id = i;

			// Agregar al mapa
			puHumanosMap.set(PUHuman.id, PUHuman); // El id es la clave y el objeto es el valor
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

		const player1Name = this.registry.get('player1Name') || 'Jugador1';
		const player2Name = this.registry.get('player2Name') || 'Jugador2';
		// Instanciacion vidas
		namePlayer1 = this.registry.get();
		this.add.image(150, 90, 'hud1').setScale(0.5).setDepth(10);
		this.add.text(140, 85, player1Name, { fontSize: '50px', color: '#ffffff', fontFamily: 'Impact, fantasy' }).setDepth(11);
		for (let i = 0; i < player1.vidas; i++) {
			let corazon = this.add.image(120 + i * 40, 60 + i * -3, 'Vida1').setScale(0.5).setDepth(10);
			corazones1.push(corazon);
		}

		this.add.image(1600, 90, 'hud2').setScale(0.5).setDepth(10);
		this.add.text(1580, 85, player2Name, { fontSize: '50px', color: '#ffffff', fontFamily: 'Impact, fantasy' }).setDepth(11);
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
		this.tiempoRestante = 120;
		this.textoTemporizador = this.add.text(720, 30, 'Tiempo: 2:00', { fontSize: '70px', color: '#ffffff', fontFamily: 'Impact, fantasy' });

		// Instanciacion Puntos
		Score1 = this.add.text(50, 140, '0', { fontSize: '70px', color: '#ffffff', fontFamily: 'Impact, fantasy' });
		Score2 = this.add.text(1560, 140, '0', { fontSize: '70px', color: '#ffffff', fontFamily: 'Impact, fantasy' });
		//////////////////////////////////////////////////////////////////MOVIMIENTO///////////////////////////////////////////////////////////////////////////
		this.time.addEvent({
			delay: 1000, // Cambiar la dirección cada 1 segundo
			callback: moverObjetos,
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
		self = this
		///////////////////////////////////////////////////////////////////////FUNCIONES////////////////////////////////////////////////////////////////////////////
		function moverHumano(nuevaX, nuevaY, humano) {
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
			self.tweens.add({
				targets: humano,
				x: nuevaX,
				y: nuevaY,
				duration: 500,
				ease: 'Power1'
			});
		}

		function moverObjetos() {
			let lobbyId = this.registry.get('lobbyId') || 0;

			// Crear un objeto con el lobbyId
			let payload = { lobbyId: lobbyId };

			// Enviar el objeto como un JSON
			stompClient.send('/app/actuObjetos', {}, JSON.stringify(payload));
		}


		function moverVaca(nuevaX, nuevaY, vaca) {

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
			self.tweens.add({
				targets: vaca,
				x: nuevaX,
				y: nuevaY,
				duration: 500,
				ease: 'Power1'
			});
		}

		function moverMilitar(nuevaX, nuevaY, militar) {
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
			self.tweens.add({
				targets: militar,
				x: nuevaX,
				y: nuevaY,
				duration: 500,
				ease: 'Power1'
			});
		}

		function moverPUHuman(nuevaX, nuevaY, PUHuman) {

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
			self.tweens.add({
				targets: PUHuman,
				x: nuevaX,
				y: nuevaY,
				duration: 500,
				ease: 'Power1'
			});
		}
	},

	update: function() {
		// Iniciar juego si no ha comenzado
		if (!this.gameStarted) {
			this.iniciarJuego();
		}

		if (this.gameStarted) {
			// Verificar si la conexión WebSocket está activa antes de enviar
			if (this.stompClient && this.stompClient.connected) {
				this.actualizarControles();  // Actualiza los controles del juego
				this.detectarAcciones();
			} else {
			}
		}

		this.endGame();


	},


	// Inicia el juego
	iniciarJuego: function() {
		this.gameStarted = true;
		this.pantallaEsp.destroy();
		this.iniciarTemporizador();
	},



	// Pausa el juego
	pausarJuego: function() {
		if (!this.paused) {
			console.log("Pausando MainGame y lanzando MenuPausa...");
			this.scene.launch('MenuPausa');
			this.scene.pause();
			this.paused = true;
		}
	},

	// Actualiza controles de los jugadores
	actualizarControles: function() {
		let movimientoRealizado = false;
		let userName = this.registry.get('userName') || 'Jugador';
		let lobbyId = this.registry.get('lobbyId') || 0;
		let tecla;

		// Controles de player 1
		if (this.keyD.isDown) {
			tecla = 'D'
			movimientoRealizado = true;
		}
		if (this.keyA.isDown) {
			tecla = 'A'
			movimientoRealizado = true;
		}
		if (this.keyS.isDown) {
			tecla = 'S'
			movimientoRealizado = true;
		}
		if (this.keyW.isDown) {
			tecla = 'W'
			movimientoRealizado = true;
		}

		// Enviar datos solo si hubo movimiento
		if (movimientoRealizado) {
			// Crear un objeto con la información a enviar
			const dataPosi = {
				lobbyId: lobbyId,
				tecla: tecla,
				playerName: userName, // Enviar el nombre del jugador correctamente
				playerScore: player1.score
			};
			// Enviar el objeto como un JSON (en lugar de una cadena con comas)
			stompClient.send('/app/movJugador', {}, JSON.stringify(dataPosi));
			movimientoRealizado = false;
		}
	},


	// Detecta acciones de los jugadores
	detectarAcciones: function() {
		let player1Name = this.registry.get('player1Name') || 'Jugador1';
		let player2Name = this.registry.get('player2Name') || 'Jugador2';
		let userName = this.registry.get('userName') || 'Jugador';
		if (userName == player1Name) {
			if (Phaser.Input.Keyboard.JustDown(this.keySPC)) this.absorberObjeto(player1);
			if (Phaser.Input.Keyboard.JustDown(this.keyE)) this.usarPU(player1);
		} else if (userName == player2Name) {
			if (Phaser.Input.Keyboard.JustDown(this.keySPC)) this.absorberObjeto(player1);
			if (Phaser.Input.Keyboard.JustDown(this.keyE)) this.usarPU(player1);
		}
	},

	// Absorbe objetos cercanos a un jugador
	absorberObjeto: function(player) {
		let userName = this.registry.get('userName') || 'Jugador';
		let lobbyId = this.registry.get('lobbyId') || 0;
		const player1Name = this.registry.get('player1Name') || 'Jugador1';
		const player2Name = this.registry.get('player2Name') || 'Jugador2';
		// Detectar y absorber objetos de Humanos
		this.detectarColision(player, humanosMap, 95, (humano, id) => {
			player.score += 10 * player.multiplicador;
			if (player.multiplicador == 1.5) {
				this.mostrarFeedback(humano.x, humano.y, 'mas20');
			} else {
				this.mostrarFeedback(humano.x, humano.y, 'mas10');
			}
			absorber.play();
			let payload = { lobbyId: lobbyId, objetoId: id, tipoId: 0, playerName: userName };
			stompClient.send('/app/actuDelete', {}, JSON.stringify(payload));
		});

		// Detectar y absorber objetos de Vacas
		this.detectarColision(player, vacasMap, 110, (vaca, id) => {
			player.score += 30 * player.multiplicador;
			if (player.multiplicador == 1.5) {
				this.mostrarFeedback(vaca.x, vaca.y, 'mas60');
			} else {
				this.mostrarFeedback(vaca.x, vaca.y, 'mas30');
			}
			absorber.play();
			// Crear un objeto con el lobbyId
			let payload = { lobbyId: lobbyId, objetoId: id, tipoId: 1, playerName: userName };
			stompClient.send('/app/actuDelete', {}, JSON.stringify(payload));
		});

		// Detectar colisión con Escombros
		this.detectarColision(player, escombrosMap, 95, (escombro, id) => {
			this.mostrarFeedback(escombro.x, escombro.y, 'menos1');
			daño.play();
			let payload = { lobbyId: lobbyId, objetoId: id, tipoId: 3, playerName: userName };
			stompClient.send('/app/actuDelete', {}, JSON.stringify(payload));
		});

		// Detectar colisión con PowerUp Humanos si el jugador puede recibirlos
		if (player.canPU) {
			this.detectarColision(player, puHumanosMap, 95, (PUHuman, id) => {
				this.mostrarFeedback(PUHuman.x, PUHuman.y, 'masPU');
				if (userName == player1Name) {
					this.darPowerUp(player1);
				} else if (userName == player2Name) {
					this.darPowerUp(player2);
				}
				cogerPowerUp.play();
				let payload = { lobbyId: lobbyId, objetoId: id, tipoId: 4, playerName: userName };
				stompClient.send('/app/actuDelete', {}, JSON.stringify(payload));
			});
		}

		// Detectar colisión con Militares
		this.detectarColision(player, militaresMap, 60, () => {
			let payload = { lobbyId: lobbyId, objetoId: 0, tipoId: 2, playerName: userName };
			stompClient.send('/app/actuDelete', {}, JSON.stringify(payload));
		});
	},


	// Detecta colisión entre un jugador y objetos en un Map
	detectarColision: function(player, mapObj, distancia, callback) {
		mapObj.forEach((objeto, id) => {
			if (
				Phaser.Math.Distance.Between(player.x, player.y, objeto.x, objeto.y) < distancia &&
				!objeto.isBeingProcessed
			) {
				objeto.isBeingProcessed = true; // Marca el objeto como procesado
				callback(objeto, id); // Pasamos el objeto y su id al callback
				this.time.delayedCall(500, () => {
					objeto.isBeingProcessed = false; // Desmarca después de 500ms
				});
			}
		});
	},

	endGame: function() {
		if (player1.vidas == 0) {
			this.terminarPartida(player1);
		} else if (player2.vidas == 0) {
			this.terminarPartida(player2);
		}
	},

	// Termina la partida dependiendo del jugador
	terminarPartida: function(jugador) {
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
	actualizarTam: function() {
		player1.setScale(player1.size);
		player2.setScale(player2.size);
	},

	mostrarFeedback: function(x, y, tipo) {
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

	iniciarTemporizador: function() {
		// Configuración del temporizador
		this.temporizadorEvento = this.time.addEvent({
			delay: 1000, // 1 segundo
			callback: this.actuTime,
			callbackScope: this,
			loop: true
		});
	},

	// Actualiza la puntuación en pantalla
	actuTime: function() {
		let lobbyId = this.registry.get('lobbyId') || 0;

		// Crear un objeto con el lobbyId
		let payload = { lobbyId: lobbyId };

		// Enviar el objeto como un JSON
		stompClient.send('/app/actuTime', {}, JSON.stringify(payload));
	},

	// Actualiza la puntuación en pantalla
	actuScore: function(numJug) {
		if (numJug == 1) {
			Score1.setText(` ${player1.score}`);
			Score2.setText(` ${player2.score}`);
		} else if (numJug == 2) {
			Score1.setText(` ${player2.score}`);
			Score2.setText(` ${player1.score}`);
		}
	},

	darPowerUp: function(player) {
		let userName = this.registry.get('userName') || 'Jugador';
		let lobbyId = this.registry.get('lobbyId') || 0;
		let payload;
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
				// Crear un objeto con el lobbyId
				payload = { lobbyId: lobbyId, playerName: userName, tipoPU: 1 };
				stompClient.send('/app/recibirPU', {}, JSON.stringify(payload));
				break;
			case 'BloqueadorPU':
				// Crear un objeto con el lobbyId
				payload = { lobbyId: lobbyId, playerName: userName, tipoPU: 2 };
				stompClient.send('/app/recibirPU', {}, JSON.stringify(payload));
				break;
			case 'MovimientoRapido':
				// Crear un objeto con el lobbyId
				payload = { lobbyId: lobbyId, playerName: userName, tipoPU: 3 };
				stompClient.send('/app/recibirPU', {}, JSON.stringify(payload));
				break;
			case 'MultiplicadorPuntos':
				// Crear un objeto con el lobbyId
				payload = { lobbyId: lobbyId, playerName: userName, tipoPU: 4 };
				stompClient.send('/app/recibirPU', {}, JSON.stringify(payload));
				break;
			case 'Ralentizador':
				// Crear un objeto con el lobbyId
				payload = { lobbyId: lobbyId, playerName: userName, tipoPU: 5 };
				stompClient.send('/app/recibirPU', {}, JSON.stringify(payload));
				break;
		}
	},

	usarPU: function(player) {
		let userName = this.registry.get('userName') || 'Jugador';
		let lobbyId = this.registry.get('lobbyId') || 0;
		payload = { lobbyId: lobbyId, playerName: userName };
		stompClient.send('/app/usarPU', {}, JSON.stringify(payload));
	},

	shutdown: function() {
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

	onResume: function() {
		console.log("Reanudando MainGame...");
		this.paused = false;
	}
});