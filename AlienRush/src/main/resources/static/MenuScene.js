var MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "MenuScene" });
    },

    preload: function () {
        this.load.image('fondoMenu', 'assets/Menu/fondoMenu.png');
        this.load.image('play', 'assets/Menu/BotonJugar.png');
        this.load.image('ajustes', 'assets/Menu/BotonAjustes.png');
        this.load.image('creditos', 'assets/Menu/BotonCreditos.png');
        this.load.image('iconoPerfil', 'assets/Menu/iconoPerfil.png');

        this.load.audio('musicaMenu', 'audio/musicaMenu.mp3');
        this.load.image('fondoCarga','assets/Background/pantallaCarga.png');
    },

    create: function () {
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
            this.scene.start("Perfil");
        })
        iconoPerfil.on("pointerover", () => { iconoPerfil.setScale(0.9); })
        iconoPerfil.on("pointerout", () => { iconoPerfil.setScale(0.7); })
    },

});