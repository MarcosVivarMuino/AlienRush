var BorrarCuenta = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "BorrarCuenta" });
    },

    preload: function () {
		//Imagenes
        this.load.image('fondoMenu', 'assets/Menu/fondoMenu.png');
        this.load.image('BotonAceptar', 'assets/BorrarCuenta/BotonAceptar.png');
        this.load.image('BotonAtrasFlecha', 'assets/BorrarCuenta/BotonAtrasFlecha.png');
		
		//Audio
        this.load.audio('musicaMenu', 'audio/musicaMenu.mp3');
		
		//Html
		this.load.html('nameform', 'assets/nombre.html');
		this.load.html('passform', 'assets/contra.html');
    },

    create: function () {
		fetch('/api/getIp')
    			.then(response => response.text())
    			.then(data => {
				ipLocal = "http://"+data+":8080/"
        		console.log(data); 
    	});
		
				
        /************************* FONDO *************************/
        //IMAGEN
        this.add.image(875, 440, 'fondoMenu');
        //AUDIO
       /* // Inicializar música del menú si no existe
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
        } */


        /************************* VARIABLES *************************/
		const elementId1 = this.add.dom(875, 300).createFromCache('nameform');
		const elementPw1 = this.add.dom(875, 550).createFromCache('passform');
		
		let BotonAceptar = this.add.image(1000, 760, 'BotonAceptar');
		let BotonAtrasFlecha = this.add.image(800, 760, 'BotonAtrasFlecha');

        /************************* BOTONES *************************/
        //BotonAceptar
        BotonAceptar.setInteractive();
        BotonAceptar.on("pointerdown", () => {
			

        })
        BotonAceptar.on("pointerover", () => { BotonAceptar.setScale(1.2); })
        BotonAceptar.on("pointerout", () => { BotonAceptar.setScale(1); })

        //BotonAtrasFlecha
        BotonAtrasFlecha.setInteractive();
        BotonAtrasFlecha.on("pointerdown", () => {
            this.scene.start("Perfil");
        })
        BotonAtrasFlecha.on("pointerover", () => { BotonAtrasFlecha.setScale(1.2); })
        BotonAtrasFlecha.on("pointerout", () => { BotonAtrasFlecha.setScale(1); })

    },

});