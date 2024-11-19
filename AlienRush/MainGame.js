var MainGame = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "MainGame" });
    },

    init: function (data) {
        this.musicaMenu = data.musicaMenu; // Recibimos la música del menú
    },

    preload: function () {
        // Pantalla de carga
        this.add.image(900, 500, 'fondoCarga');

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
        this.load.image('fondo', 'assets/AssetsMainGame/Fondo_PlaceHolder.png');
        // Terreno
        // Partida
        this.load.image('Player1', 'assets/AssetsMainGame/Personajes/Player1.png');
        this.load.image('Player2', 'assets/AssetsMainGame/Personajes/Player2.png');
        this.load.image('Humano', 'assets/AssetsMainGame/Personajes/humanos.png');
        this.load.image('Vaca', 'assets/AssetsMainGame/Personajes/vacas.png');
        this.load.image('Vida', 'assets/AssetsMainGame/Personajes/Corazon_PH.png');
        this.load.image('Escombro', 'assets/AssetsMainGame/Personajes/chatarra.png');
        //Sonidos 
        this.load.audio('musicaJuego', 'audio/musicaJuego.mp3');

    },

    create: function () {
        //AUDIO
        // Inicializar música del juego si no existe
        if (!GlobalMusic.musicaJuego) {
            GlobalMusic.musicaJuego = this.sound.add('musicaJuego', { loop: true });
        }

        // Reproducir música solo si está activada
        if (GlobalMusic.musicaActiva && !GlobalMusic.musicaJuego.isPlaying) {
            GlobalMusic.musicaJuego.play();
        }

        // Detener la música del menú
        if (GlobalMusic.musicaMenu && GlobalMusic.musicaMenu.isPlaying) {
            GlobalMusic.musicaMenu.stop();
        }

        ///////////////////////////////////////////////////////////////INSTANCIACION////////////////////////////////////////////////////////////////////
        Vacas = [];
        PowerUps = [];
        Humanos = [];
        Vacas = [];
        paused = false;

        this.physics.world.bounds.width = 1750; // Limite al tamaño del mundo
        this.physics.world.bounds.height = 880;
        this.cameras.main.setBounds(0, 0, 1750, 880); // Define los limites de la camara

        this.add.image(875, 440, 'fondo').setScale(1); // Creacion del fondo

        // Instanciacion Humanos
        for (let i = 0; i < 3; i++) {
            let x = Phaser.Math.Between(0, 1750); // Coordenada x aleatoria
            let y = Phaser.Math.Between(0, 880); // Coordenada y aleatoria
            let humano = this.add.image(x, y, 'Humano');
            Humanos.push(humano);
        }

        // Instanciacion Vacas
        for (let i = 0; i < 2; i++) {
            let x = Phaser.Math.Between(0, 1750); // Coordenada x aleatoria
            let y = Phaser.Math.Between(0, 880); // Coordenada y aleatoria
            let vaca = this.add.image(x, y, 'Vaca');
            Vacas.push(vaca);
        }
        //Instanciacion decoracion

        // Instanciacion de los jugadores
        player1 = this.physics.add.sprite(800, 130, 'Player1').setScale(1.2);
        player1.tipoPU = -1;
        player1.score = 0;
        player1.alpha = 0.8

        player1.setBounce(1); // Limites del jugador
        player1.setCollideWorldBounds(true);

        player2 = this.physics.add.sprite(400, 720, 'Player2').setScale(1.2);
        player2.tipoPU = -1;
        player2.score = 0;
        player2.alpha = 0.8

        player2.setBounce(1); // Limites del jugador
        player2.setCollideWorldBounds(true);

        // Instanciacion temporizador
        //this.tiempoRestante = 300; // 5 minutos en segundos
        this.tiempoRestante = 10; // 5 minutos en segundos
        this.textoTemporizador = this.add.text(720, 30, 'Tiempo: 5:00', { fontSize: '70px', color: '#ffffff', fontFamily: 'Impact, fantasy' });

        // Instanciacion temporizador
        Score1 = this.add.text(10, 30, 'Puntos: 0', { fontSize: '70px', color: '#ffffff', fontFamily: 'Impact, fantasy' });
        Score2 = this.add.text(1400, 30, 'Puntos: 0', { fontSize: '70px', color: '#ffffff', fontFamily: 'Impact, fantasy' });

        //////////////////////////////////////////////////////////////////ANIMACIONES///////////////////////////////////////////////////////////////////////////
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

        // Evento de tiempo que se ejecuta cada segundo
        this.temporizadorEvento = this.time.addEvent({
            delay: 1000, // 1 segundo
            callback: actualizarTemporizador,
            callbackScope: this,
            loop: true
        });
        //////////////////////////////////////////////////////////////////////COLISIONES////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////INTERACCIONES///////////////////////////////////////////////////////////////////////////
        // Controles Jugador 1
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // Arriba
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); // Izquierda
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); // Derecha
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S); // Abajo
        this.keySPC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Power Up
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q); // Interactuar

        // Controles Jugador 2
        this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);  // Arriba
        this.keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);  // Izquierda
        this.keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);  // Derecha
        this.keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);  // Derecha
        this.keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);  // Interactuar
        this.keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);  // Power Up

        // Menu de Pause
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.paused = false;

        ///////////////////////////////////////////////////////////////////////FUNCIONES////////////////////////////////////////////////////////////////////////////
        function moverHumanosAleatoriamente() {
            // Mover cada humano en una dirección aleatoria
            Humanos.forEach((humano) => {
                let nuevaX = humano.x + Phaser.Math.Between(-100, 100); // Cambiar aleatoriamente entre -50 y 50 píxeles
                let nuevaY = humano.y + Phaser.Math.Between(-100, 100);

                // Asegúrate de que los humanos no salgan de los límites de la pantalla
                nuevaX = Phaser.Math.Clamp(nuevaX, 80, 1680);
                nuevaY = Phaser.Math.Clamp(nuevaY, 80, 800);

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
                let nuevaX = vaca.x + Phaser.Math.Between(-150, 150); // Cambiar aleatoriamente entre -50 y 50 píxeles
                let nuevaY = vaca.y + Phaser.Math.Between(-150, 150);

                // Asegúrate de que los humanos no salgan de los límites de la pantalla
                nuevaX = Phaser.Math.Clamp(nuevaX, 80, 1680);
                nuevaY = Phaser.Math.Clamp(nuevaY, 80, 800);

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

        function actualizarTemporizador() {
            // Reducir el tiempo restante
            this.tiempoRestante--;

            // Actualizar el texto del temporizador
            let minutos = Math.floor(this.tiempoRestante / 60);
            let segundos = this.tiempoRestante % 60;
            let textoSegundos = segundos < 10 ? '0' + segundos : segundos;
            this.textoTemporizador.setText(`Tiempo: ${minutos}:${textoSegundos}`);

            // Si el tiempo se agota, termina la partida
            if (this.tiempoRestante <= 0) {
                if (player1.score > player2.score) {
                    this.scene.start("Victoria1", {
                        player1Score: player1.score, 
                        player2Score: player2.score});
                } else if (player2.score > player1.score) {
                    this.scene.start("Victoria2", {
                        player1Score: player1.score, 
                        player2Score: player2.score});
                } else {
                    this.scene.start("Empate", {
                        player1Score: player1.score, 
                        player2Score: player2.score});
                }
            }
        }

    },

    // Update
    update: function () {
        ////////////////////////////////////////////////////////////CONTROLES////////////////////////////////////////////////////////////////////////////////////
        // Controles player 2
        if (this.keyJ.isDown) {  // Interacciones J-K-L-I (player2)
            player2.body.position.x -= 10;
        }
        else if (this.keyL.isDown) {
            player2.body.position.x += 10;
        }
        else if (this.keyI.isDown) {
            player2.body.position.y -= 10;
        } else if (this.keyK.isDown) {
            player2.body.position.y += 10;
        }

        // Controles player 1
        if (this.keyA.isDown) {  // Interacciones W-A-S-D (player2)
            player1.body.position.x -= 10;
        }
        else if (this.keyD.isDown) {
            player1.body.position.x += 10;
        }
        else if (this.keyW.isDown) {
            player1.body.position.y -= 10;
        } else if (this.keyS.isDown) {
            player1.body.position.y += 10;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyESC)) {
            if (!this.paused) {
                console.log("Pausando MainGame y lanzando MenuPausa...");
                this.scene.launch('MenuPausa');
                this.scene.pause();
                this.paused = true;
            }
        }

        ///////////////////////////////////////////////////////////////COMPROBACIONES///////////////////////////////////////////////////////////////////////////
        // Detectar si se presiona el espacio y está sobre un humano // Player 1
        if (Phaser.Input.Keyboard.JustDown(this.keySPC)) {
            absorberObjeto(player1);
        }

        // Detectar si se presiona el espacio y está sobre un humano // Player 2
        if (Phaser.Input.Keyboard.JustDown(this.keyENTER)) {
            absorberObjeto(player2);
        }

        // Comprueba si el jugador rompe el muro y lo actualiza en consecuencia
        /////////////////////////////////////////////////////////////////ANIMACIONES////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////FUNCIONES//////////////////////////////////////////////////////////////////////////
        function congelado() {
            tirarPU.play();
            if (this.keyE.isDown) {
                player1.setTint(0x0000ff); // pinta al jugador de azul
                player1.vel = 150;
            } else if (this.keyO.isDown) {
                player2.setTint(0x0000ff); // pinta al jugador de azul
                player2.vel = 150;
            }
        }
        function descongelado() {
            if (player1.vel == 150) {
                player1.clearTint(); // pinta al jugador de rojo
                player1.vel = 250;
            } else if (player2.vel == 150) {
                player2.clearTint(); // pinta al jugador de rojo
                player2.vel = 300;
            }
        }
        function paralizado() {
            tirarPU.play();
            if (this.keyE.isDown) {
                player1.setTint(0xffff00); // pinta al jugador de rojo
                player1.vel = 0;
            } else if (this.keyO.isDown) {
                player2.setTint(0xffff00); // pinta al jugador de rojo
                player2.vel = 0;
            }
        }
        function desparalizado() {
            if (player1.vel == 0) {
                player1.clearTint(); // pinta al jugador de rojo
                player1.vel = 250;
            } else if (player2.vel == 0) {
                player2.clearTint(); // pinta al jugador de rojo
                player2.vel = 300;
            }
        }
        function correr() {
            tirarPU.play();
            player1.setTint(0x00FFFF);
            player1.vel = 400;
        }
        function parar() {
            player1.clearTint();
            player1.vel = 300;
        }
        function esteroides() {
            tirarPU.play();
            player2.setTint(0x00FFFF);
            player2.fuerza = 10;
        }
        function desinflado() {
            player2.clearTint();
            player2.fuerza = 5;
        }

        function generarHumano(humano) {
            let x = Phaser.Math.Between(0, 1750);
            let y = Phaser.Math.Between(0, 880);

            humano.x = x
            humano.y = y
        }

        function generarVaca(vaca) {
            let x = Phaser.Math.Between(0, 1750);
            let y = Phaser.Math.Between(0, 880);

            vaca.x = x
            vaca.y = y
        }

        function absorberObjeto(player) {
            // Verificar si el jugador está sobre un humano    
            Humanos.forEach((humano) => {
                let distancia = Phaser.Math.Distance.Between(player.x, player.y, humano.x, humano.y);

                if (distancia < 75) { // Distancia de absorción
                    player.score += 10; // Puntos por absorber un humano
                    actuScore()
                    generarHumano(humano)
                }
            });

            // Verificar si el jugador está sobre una vaca
            Vacas.forEach((vaca) => {
                let distancia = Phaser.Math.Distance.Between(player.x, player.y, vaca.x, vaca.y);

                if (distancia < 100) { // Distancia de absorción
                    player.score += 30; // Puntos por absorber una vaca
                    actuScore()
                    generarVaca(vaca)
                }
            });

            //Verificar si el jugador esta sobre un escombro
            Escombros.forEach((escombro) => {
                let distancia = Phaser.Math.Distance.Between(player.x, player.y, escombro.x, escombro.y);
    
                if (distancia < 75) { // Distancia de colisión
                    perderVida(player); // Restar una vida al jugador
                    generarEscombro(escombro);
                }
            }); 
        }

        function perderVida(player) {
            if (player.vidas > 0) {
                player.vidas--;
                if(player == player1){
                    corazones1[player.vidas].destroy(); // Eliminar un corazón de la pantalla
                }else{
                    corazones2[player.vidas].destroy(); // Eliminar un corazón de la pantalla
                }
            }
    
            if (player.vidas <= 0) {
                if (player == player1){
                    scene.start("Victoria2", {
                        player1Score: player1.score, 
                        player2Score: player2.score});
                }else{
                    scene.start("Victoria1", {
                        player1Score: player1.score, 
                        player2Score: player2.score});
                }
            }
        }

        function actuScore() {
            Score1.setText(`Puntos: ${player1.score}`);
            Score2.setText(`Puntos: ${player2.score}`);
        }
    },

    onResume: function () {
        console.log("Reanudando MainGame...");
        this.paused = false;
    }
});