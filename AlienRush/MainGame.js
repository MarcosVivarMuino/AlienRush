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
        this.load.image('fondo', 'assets/AssetsMainGame/Escenarios/Granja.png');
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
        // Partida
        this.load.image('Player1', 'assets/AssetsMainGame/Personajes/Player1.png');
        this.load.image('Player2', 'assets/AssetsMainGame/Personajes/Player2.png');
        this.load.image('Humano', 'assets/AssetsMainGame/Personajes/humanos.png');
        this.load.image('Vaca', 'assets/AssetsMainGame/Personajes/vacas.png');
        this.load.image('Escombro', 'assets/AssetsMainGame/Personajes/chatarra.png');
        this.load.image('Militar', 'assets/AssetsMainGame/Personajes/militares.png');
        this.load.image('PU_Human', 'assets/AssetsMainGame/Personajes/superHumanos.png');
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

        this.add.image(875, 440, 'fondo').setScale(1); // Creacion del fondo

        // Instanciacion Humanos
        for (let i = 0; i < 25; i++) {
            let x = Phaser.Math.Between(10, 1750); // Coordenada x aleatoria
            let y = Phaser.Math.Between(20, 880); // Coordenada y aleatoria
            let humano = this.add.image(x, y, 'Humano').setScale(0.2);
            Humanos.push(humano);
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
            let escombro = this.add.image(x, y, 'Escombro').setScale(0.3);
            Escombros.push(escombro);
        }

        //Instanciacion Militar
        for (let i = 0; i < 2; i++) {
            let x = Phaser.Math.Between(10, 1700); // Coordenada x aleatoria
            let y = Phaser.Math.Between(20, 800); // Coordenada y aleatoria
            let militar = this.add.image(x, y, 'Militar').setScale(0.1);
            Militares.push(militar);
        }

        //Instanciacion Humano Militar
        for (let i = 0; i < 2; i++) {
            let x = Phaser.Math.Between(10, 1700); // Coordenada x aleatoria
            let y = Phaser.Math.Between(20, 800); // Coordenada y aleatoria
            let PUHuman = this.add.image(x, y, 'PU_Human').setScale(0.3);
            PUHumanos.push(PUHuman);
        }

        // Instanciacion de los jugadores
        player1 = this.physics.add.sprite(800, 130, 'Player1').setScale(0.9);
        player1.tipoPU = '';
        player1.score = 0;
        player1.alpha = 1;
        player1.vidas = 5;
        player1.speed = 10;
        player1.size = 0.9
        player1.multiplicador = 1

        player1.setBounce(1); // Limites del jugador
        player1.setCollideWorldBounds(true);

        player2 = this.physics.add.sprite(400, 720, 'Player2').setScale(0.9);
        player2.tipoPU = '';
        player2.score = 0;
        player2.alpha = 0.8;
        player2.vidas = 5;
        player2.speed = 10;
        player2.size = 0.9
        player2.multiplicador = 1

        player2.setBounce(1); // Limites del jugador
        player2.setCollideWorldBounds(true);

        // Instanciacion vidas
        this.add.image(150, 90, 'hud1').setScale(0.5);
        this.add.text(80, 90, 'Jugador 1', { fontSize: '25px', color: '#ffffff' });
        for (let i = 0; i < player1.vidas; i++) {
            let corazon = this.add.image(120 + i * 40, 60 + i * -3, 'Vida1').setScale(0.5);
            corazones1.push(corazon);
        }

        this.add.image(1600, 90, 'hud2').setScale(0.5);
        this.add.text(1530, 90, 'Jugador 2', { fontSize: '25px', color: '#ffffff' });
        for (let i = 0; i < player2.vidas; i++) {
            let corazon = this.add.image(1630 - i * 40, 60 + i * -3, 'Vida2').setScale(0.5);
            corazones2.push(corazon);
        }

        //Instanciacion Power Up
        PowerUp1 = this.add.image(350, 90, 'ACPU').setScale(0.06);
        PowerUp2 = this.add.image(1400, 90, 'ACPU').setScale(0.06);

        PowerUp1.alpha = 0
        PowerUp2.alpha = 0

        // Instanciacion temporizador
        this.tiempoRestante = 300; // 5 minutos en segundos
        this.textoTemporizador = this.add.text(720, 30, 'Tiempo: 5:00', { fontSize: '70px', color: '#ffffff', fontFamily: 'Impact, fantasy' });

        // Instanciacion Puntos
        Score1 = this.add.text(50, 140, '0', { fontSize: '70px', color: '#ffffff', fontFamily: 'Impact, fantasy' });
        Score2 = this.add.text(1560, 140, '0', { fontSize: '70px', color: '#ffffff', fontFamily: 'Impact, fantasy' });

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
        this.keySPC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Interactuar
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); // Power Up

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
                let nuevaX = humano.x + Phaser.Math.Between(-100, 100);
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
                let nuevaX = vaca.x + Phaser.Math.Between(-150, 150);
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

        function moverMilitarAleatoriamente() {
            Militares.forEach((militar) => {
                let nuevaX = militar.x + Phaser.Math.Between(-80, 80);
                let nuevaY = militar.y + Phaser.Math.Between(-80, 80);

                // Asegúrate de que los humanos no salgan de los límites de la pantalla
                nuevaX = Phaser.Math.Clamp(nuevaX, 80, 1680);
                nuevaY = Phaser.Math.Clamp(nuevaY, 80, 800);

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
                        player2Score: player2.score
                    });
                } else if (player2.score > player1.score) {
                    this.scene.start("Victoria2", {
                        player1Score: player1.score,
                        player2Score: player2.score
                    });
                } else {
                    this.scene.start("Empate", {
                        player1Score: player1.score,
                        player2Score: player2.score
                    });
                }
            }
        }
    },

    // Update
    update: function () {
        var scene = this.scene
        ////////////////////////////////////////////////////////////CONTROLES////////////////////////////////////////////////////////////////////////////////////
        // Controles player 2
        if (this.keyJ.isDown) {  // Interacciones J-K-L-I (player2)
            player2.body.position.x -= player2.speed;
        }
        else if (this.keyL.isDown) {
            player2.body.position.x += player2.speed;
        }
        else if (this.keyI.isDown) {
            player2.body.position.y -= player2.speed;
        } else if (this.keyK.isDown) {
            player2.body.position.y += player2.speed;
        }

        // Controles player 1
        if (this.keyA.isDown) {  // Interacciones W-A-S-D (player2)
            player1.body.position.x -= player1.speed;
        }
        else if (this.keyD.isDown) {
            player1.body.position.x += player1.speed;
        }
        else if (this.keyW.isDown) {
            player1.body.position.y -= player1.speed;
        } else if (this.keyS.isDown) {
            player1.body.position.y += player1.speed;
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
        // Detectar si se presiona el espacio // Player 1
        if (Phaser.Input.Keyboard.JustDown(this.keySPC)) {
            absorberObjeto(player1);
        }

        // Detectar si se presiona el ENTER // Player 2
        if (Phaser.Input.Keyboard.JustDown(this.keyENTER)) {
            absorberObjeto(player2);
        }

        // Detectar si se presiona la E // Player 1
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
            usarPU(player1, this)
        }

        // Detectar si se presiona la O // Player 2
        if (Phaser.Input.Keyboard.JustDown(this.keyO)) {
            usarPU(player2, this)
        }

        /////////////////////////////////////////////////////////////////ANIMACIONES////////////////////////////////////////////////////////////////////////////
        setSize()
        ////////////////////////////////////////////////////////////////////FUNCIONES//////////////////////////////////////////////////////////////////////////

        function generarHumano(humano) {
            let x = Phaser.Math.Between(20, 1700);
            let y = Phaser.Math.Between(30, 800);

            humano.x = x
            humano.y = y
        }

        function generarVaca(vaca) {
            let x = Phaser.Math.Between(20, 1700);
            let y = Phaser.Math.Between(30, 800);

            vaca.x = x
            vaca.y = y
        }

        function generarEscombro(escombro) {
            let x = Phaser.Math.Between(20, 1700);
            let y = Phaser.Math.Between(30, 800);

            escombro.x = x
            escombro.y = y
        }

        function generarHumanoEspecial(PUHuman) {
            let x = Phaser.Math.Between(20, 1700);
            let y = Phaser.Math.Between(30, 800);

            PUHuman.x = x
            PUHuman.y = y
        }

        function absorberObjeto(player) {
            // Verificar si el jugador está sobre un humano    
            Humanos.forEach((humano) => {
                let distancia = Phaser.Math.Distance.Between(player.x, player.y, humano.x, humano.y);

                if (distancia < 75) { // Distancia de absorción
                    player.score += 10 * player.multiplicador; // Puntos por absorber un humano
                    actuScore()
                    absorber.play()
                    generarHumano(humano)
                }
            });

            // Verificar si el jugador está sobre una vaca
            Vacas.forEach((vaca) => {
                let distancia = Phaser.Math.Distance.Between(player.x, player.y, vaca.x, vaca.y);

                if (distancia < 100) { // Distancia de absorción
                    player.score += 30 * player.multiplicador; // Puntos por absorber una vaca
                    actuScore()
                    absorber.play()
                    generarVaca(vaca)
                }
            });

            //Verificar si el jugador esta sobre un escombro
            Escombros.forEach((escombro) => {
                let distancia = Phaser.Math.Distance.Between(player.x, player.y, escombro.x, escombro.y);

                if (distancia < 75) { // Distancia de colisión
                    perderVida(player); // Restar una vida al jugador
                    daño.play()
                    generarEscombro(escombro);
                }
            });

            //Verificar si el jugador esta sobre un militar
            Militares.forEach((militar) => {
                let distancia = Phaser.Math.Distance.Between(player.x, player.y, militar.x, militar.y);

                if (distancia < 50) { // Distancia de colisión
                    if (player == player1) {
                        scene.start("Victoria2", {
                            player1Score: player1.score,
                            player2Score: player2.score
                        });
                    } else {
                        scene.start("Victoria1", {
                            player1Score: player1.score,
                            player2Score: player2.score
                        });
                    }
                }
            });

            //Verificar si el jugador esta sobre un PUHuman
            PUHumanos.forEach((PUHuman) => {
                let distancia = Phaser.Math.Distance.Between(player.x, player.y, PUHuman.x, PUHuman.y);

                if (distancia < 75) { // Distancia de colisión
                    darPowerUp(player)
                    cogerPowerUp.play()
                    generarHumanoEspecial(PUHuman)
                }
            });
        }

        function perderVida(player) {
            if (player.vidas > 0) {
                player.vidas--;
                if (player == player1) {
                    corazones1[player.vidas].destroy(); // Eliminar un corazón de la pantalla
                } else {
                    corazones2[player.vidas].destroy(); // Eliminar un corazón de la pantalla
                }
            }

            if (player.vidas <= 0) {
                if (player == player1) {
                    scene.start("Victoria2", {
                        player1Score: player1.score,
                        player2Score: player2.score
                    });
                } else {
                    scene.start("Victoria1", {
                        player1Score: player1.score,
                        player2Score: player2.score
                    });
                }
            }
        }

        function darPowerUp(player) {
            const powerUps = [
                'AumentoCapacidadPU',
                'BloqueadorPU',
                'MovimientoRapido',
                'MultiplicadorPuntos',
                'Ralentizador'
            ];

            player.tipoPU = Phaser.Math.RND.pick(powerUps);

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
        }

        function usarPU(player, escena) {
            switch (player.tipoPU) {
                case 'AumentoCapacidadPU':
                    lanzarAumentoCapacidad.play();
                    player.tipoPU = ' '
                    if (player == player1) {
                        PowerUp1.alpha = 0
                    } else {
                        PowerUp2.alpha = 0
                    }
                    player.size = 1.1;
                    escena.time.delayedCall(5000, () => {
                        player.size = 0.9;
                    });
                    break;
                case 'BloqueadorPU':
                    lanzarBloqueo.play();
                    player.tipoPU = ''
                    if (player == player1) {
                        PowerUp1.alpha = 0
                        player2.speed = 0
                        escena.time.delayedCall(5000, () => {
                            player2.speed = 10;
                        });
                    } else {
                        PowerUp2.alpha = 0
                        player1.speed = 0
                        escena.time.delayedCall(5000, () => {
                            player1.speed = 10;
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
                    escena.time.delayedCall(5000, () => {
                        player.speed = 10;
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
                    escena.time.delayedCall(5000, () => {
                        player.multiplicador = 1;
                    });
                    break;
                case 'Ralentizador':
                    lanzarHielo.play();
                    player.tipoPU = ''
                    if (player == player1) {
                        PowerUp1.alpha = 0
                        player2.speed = 5
                        escena.time.delayedCall(5000, () => {
                            player2.speed = 10;
                        });
                    } else {
                        PowerUp2.alpha = 0
                        player1.speed = 5
                        escena.time.delayedCall(5000, () => {
                            player1.speed = 10;
                        });
                    }
                    break;
            }
        }

        function setSize() {
            player1.setScale(player1.size)
            player2.setScale(player2.size)
        }

        function actuScore() {
            Score1.setText(` ${player1.score}`);
            Score2.setText(` ${player2.score}`);
        }
    },

    onResume: function () {
        console.log("Reanudando MainGame...");
        this.paused = false;
    }
});