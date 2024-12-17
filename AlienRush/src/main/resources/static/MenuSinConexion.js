var MenuSinConexion = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { "key": "MenuSinConexion" });
    },
    
    init: function (data) {
        sceneName = data.sceneName;
    },
    
    preload: function () {
        this.load.image('botonReconexion', 'assets/MenuPausa/BotonReanudar.png');
        this.load.image('fondoPausa', 'assets/MenuPausa/fondoPausa.png');
    },

    create: function () {
        /************************* FONDO *************************/
        this.add.image(875, 440, 'fondoPausa');
        /************************* VARIABLES *************************/
        let botonReconexion = this.add.image(853, 690, 'botonReconexion').setInteractive();
		usuariosConectadosText = this.add.text(800, 540, 'Has perdido la conexión.', {
        	fontFamily: 'Impact, fantasy',
        	fill: '#ffffff',
        	fontSize: '50px'
    	});
    	usuariosConectadosText = this.add.text(600, 590, 'Intenta conectarte de nuevo en unos instantes.', {
        	fontFamily: 'Impact, fantasy',
        	fill: '#ffffff',
        	fontSize: '50px'
    	});
        /************************* BOTONES *************************/
        //Reconexion
        botonReconexion.on('pointerdown', () => {
			let local = this;
			$.ajax({
        	method: "GET",
        	url: "/conexion",
        	success: function () {
            	local.scene.resume(sceneName);
            	local.scene.get(sceneName).onResume();
            	local.scene.stop('MenuSinConexion');
        	},
    		});
        });
        botonReconexion.on("pointerover", () => { botonReconexion.setScale(1.2); });
        botonReconexion.on("pointerout", () => { botonReconexion.setScale(1); });

    }
});